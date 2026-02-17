import csv
import json
import sqlite3
from datetime import datetime
from typing import Dict, List, Any
import logging
import sqlite3

class DataLogger:
    def __init__(self):
        self.logger = logging.getLogger(__name__)
        self.connection = None
        self.setup_database()
        
    def setup_database(self):
        """Setup SQLite database for logging"""
        try:
            self.connection = sqlite3.connect('can_data.db', check_same_thread=False)
            cursor = self.connection.cursor()
            
            # Create messages table
            cursor.execute('''
                CREATE TABLE IF NOT EXISTS can_messages (
                    id INTEGER PRIMARY KEY AUTOINCREMENT,
                    timestamp DATETIME,
                    can_id INTEGER,
                    data BLOB,
                    dlc INTEGER,
                    is_rx BOOLEAN,
                    channel INTEGER,
                    message_name TEXT,
                    decoded_data TEXT
                )
            ''')
            
            # Create DTCs table
            cursor.execute('''
                CREATE TABLE IF NOT EXISTS dtcs (
                    id INTEGER PRIMARY KEY AUTOINCREMENT,
                    timestamp DATETIME,
                    dtc_code TEXT,
                    dtc_name TEXT,
                    description TEXT,
                    severity TEXT
                )
            ''')
            
            self.connection.commit()
            self.logger.info("Database setup completed")
            
        except Exception as e:
            self.logger.error(f"Failed to setup database: {e}")
    
    def log_message(self, message_data: Dict[str, Any]):
        try:
            # Convert datetime to string for SQLite
            timestamp_str = message_data['timestamp'].strftime('%Y-%m-%d %H:%M:%S.%f')
            
            cursor = self.connection.cursor()
            cursor.execute('''
                INSERT INTO can_messages 
                (timestamp, can_id, data, dlc, is_rx, channel, message_name, decoded_data)
                VALUES (?, ?, ?, ?, ?, ?, ?, ?)
            ''', (
                timestamp_str,  # Use string instead of datetime object
                message_data['can_id'],
                sqlite3.Binary(message_data['data']),  # Use Binary for BLOB
                message_data['dlc'],
                message_data['is_rx'],
                message_data.get('channel', 0),
                message_data.get('message_name', ''),
                json.dumps(message_data.get('decoded_data', {}))
            ))
            self.connection.commit()
        except Exception as e:
            self.logger.error(f"Failed to log message: {e}")
            raise  # Re-raise to see the actual error
    
    def log_messages_batch(self, messages_data: List[Dict[str, Any]]):
        if not messages_data:
            return
            
        try:
            cursor = self.connection.cursor()
            cursor.execute('BEGIN TRANSACTION')
            
            for message_data in messages_data:
                timestamp_str = message_data['timestamp'].strftime('%Y-%m-%d %H:%M:%S.%f')  # ADD THIS
                
                cursor.execute('''
                    INSERT INTO can_messages 
                    (timestamp, can_id, data, dlc, is_rx, channel, message_name, decoded_data)
                    VALUES (?, ?, ?, ?, ?, ?, ?, ?)
                ''', (
                    timestamp_str,  # USE THE CONVERTED STRING
                    message_data['can_id'],
                    sqlite3.Binary(message_data['data']),  # Also add Binary here
                    message_data['dlc'],
                    message_data.get('is_rx', True),
                    message_data.get('channel', 0),
                    message_data.get('message_name', ''),
                    json.dumps(message_data.get('decoded_data', {}))
                ))
            
            self.connection.commit()
            
        except Exception as e:
            self.connection.rollback()
            self.logger.error(f"Failed to log message batch: {e}")
    
    def log_dtc(self, dtc_data: Dict[str, Any]):
        """Log DTC to database"""
        try:
            cursor = self.connection.cursor()
            cursor.execute('''
                INSERT INTO dtcs 
                (timestamp, dtc_code, dtc_name, description, severity)
                VALUES (?, ?, ?, ?, ?)
            ''', (
                dtc_data['timestamp'],
                dtc_data['dtc_code'],
                dtc_data['dtc_name'],
                dtc_data.get('description', ''),
                dtc_data.get('severity', '')
            ))
            self.connection.commit()
        except Exception as e:
            self.logger.error(f"Failed to log DTC: {e}")
    
    def generate_report(self, start_time: datetime, end_time: datetime, format: str = 'csv') -> str:
        """Generate comprehensive report"""
        if format == 'csv':
            return self._generate_csv_report(start_time, end_time)
        elif format == 'html':
            return self._generate_html_report(start_time, end_time)
        else:
            return self._generate_text_report(start_time, end_time)
    
    def _generate_csv_report(self, start_time: datetime, end_time: datetime) -> str:
        """Generate CSV report"""
        filename = f"can_report_{datetime.now().strftime('%Y%m%d_%H%M%S')}.csv"
        
        try:
            with open(filename, 'w', newline='') as csvfile:
                writer = csv.writer(csvfile)
                writer.writerow(['Timestamp', 'CAN ID', 'Message Name', 'Direction', 'Data', 'Decoded Signals'])
                
                cursor = self.connection.cursor()
                cursor.execute('''
                    SELECT timestamp, can_id, message_name, is_rx, data, decoded_data
                    FROM can_messages 
                    WHERE timestamp BETWEEN ? AND ?
                    ORDER BY timestamp
                ''', (start_time, end_time))
                
                for row in cursor.fetchall():
                    writer.writerow([
                        row[0], row[1], row[2], 
                        'RX' if row[3] else 'TX',
                        row[4].hex(), row[5]
                    ])
            
            self.logger.info(f"CSV report generated: {filename}")
            return filename
            
        except Exception as e:
            self.logger.error(f"Failed to generate CSV report: {e}")
            return ""