import csv
import json
import pdfkit
from datetime import datetime
from typing import Dict, List, Any, Optional
from dataclasses import dataclass
import sqlite3
import logging
from pathlib import Path

from config.settings import Settings

@dataclass
class ReportFormat:
    HTML = "html"
    CSV = "csv"
    PDF = "pdf"
    JSON = "json"

class ReportGenerator:
    def __init__(self, db_path: str = "can_data.db", settings: Settings = None):
        self.logger = logging.getLogger(__name__)
        self.db_path = db_path
        self.settings = settings or Settings()
        self.connection = sqlite3.connect(db_path, check_same_thread=False)
        
    def generate_comprehensive_report(self, start_time: datetime, end_time: datetime, 
                                   output_format: str = None, output_path: str = None) -> str:
        """Generate a comprehensive CAN analysis report"""
        if output_format is None:
            output_format = self.settings.get_setting('default_report_format')
            
        if output_path is None:
            timestamp = datetime.now().strftime('%Y%m%d_%H%M%S')
            output_path = f"can_analysis_report_{timestamp}.{output_format}"
        
        try:
            # Collect all data
            report_data = self._collect_report_data(start_time, end_time)
            
            # Generate report based on format
            if output_format == ReportFormat.HTML:
                return self._generate_html_report(report_data, output_path)
            elif output_format == ReportFormat.CSV:
                return self._generate_csv_report(report_data, output_path)
            elif output_format == ReportFormat.PDF:
                return self._generate_pdf_report(report_data, output_path)
            elif output_format == ReportFormat.JSON:
                return self._generate_json_report(report_data, output_path)
            else:
                raise ValueError(f"Unsupported report format: {output_format}")
                
        except Exception as e:
            self.logger.error(f"Report generation failed: {e}")
            raise
    
    def _collect_report_data(self, start_time: datetime, end_time: datetime) -> Dict[str, Any]:
        """Collect all data for the report"""
        data = {
            'metadata': {
                'generated_at': datetime.now(),
                'time_range': {'start': start_time, 'end': end_time},
                'settings': {
                    'include_raw': self.settings.get_setting('include_raw_data'),
                    'include_decoded': self.settings.get_setting('include_decoded'),
                    'include_stats': self.settings.get_setting('include_statistics'),
                    'include_dtcs': self.settings.get_setting('include_dtcs')
                }
            },
            'statistics': self._get_statistics(start_time, end_time),
            'messages': [],
            'dtcs': [],
            'analysis': {}
        }
        
        # Get messages if requested
        if data['metadata']['settings']['include_raw'] or data['metadata']['settings']['include_decoded']:
            data['messages'] = self._get_messages(start_time, end_time)
        
        # Get DTCs if requested
        if data['metadata']['settings']['include_dtcs']:
            data['dtcs'] = self._get_dtcs(start_time, end_time)
        
        # Perform analysis
        data['analysis'] = self._analyze_data(data)
        
        return data
    
    def _get_statistics(self, start_time: datetime, end_time: datetime) -> Dict[str, Any]:
        """Get statistical data for the report"""
        cursor = self.connection.cursor()
        
        # Basic counts
        cursor.execute('''
            SELECT COUNT(*) as total_messages,
                   SUM(CASE WHEN is_rx = 1 THEN 1 ELSE 0 END) as rx_messages,
                   SUM(CASE WHEN is_rx = 0 THEN 1 ELSE 0 END) as tx_messages
            FROM can_messages 
            WHERE timestamp BETWEEN ? AND ?
        ''', (start_time, end_time))
        
        stats = cursor.fetchone()
        
        # Message frequency by ID
        cursor.execute('''
            SELECT can_id, COUNT(*) as frequency
            FROM can_messages 
            WHERE timestamp BETWEEN ? AND ?
            GROUP BY can_id
            ORDER BY frequency DESC
            LIMIT 20
        ''', (start_time, end_time))
        
        frequent_messages = cursor.fetchall()
        
        # DTC statistics
        cursor.execute('''
            SELECT COUNT(*) as total_dtcs,
                   COUNT(DISTINCT dtc_code) as unique_dtcs
            FROM dtcs 
            WHERE timestamp BETWEEN ? AND ?
        ''', (start_time, end_time))
        
        dtc_stats = cursor.fetchone()
        
        return {
            'total_messages': stats[0],
            'rx_messages': stats[1],
            'tx_messages': stats[2],
            'frequent_messages': frequent_messages,
            'total_dtcs': dtc_stats[0] if dtc_stats else 0,
            'unique_dtcs': dtc_stats[1] if dtc_stats else 0
        }
    
    def _get_messages(self, start_time: datetime, end_time: datetime) -> List[Dict]:
        """Get CAN messages for the report"""
        cursor = self.connection.cursor()
        cursor.execute('''
            SELECT timestamp, can_id, data, dlc, is_rx, channel, message_name, decoded_data
            FROM can_messages 
            WHERE timestamp BETWEEN ? AND ?
            ORDER BY timestamp
            LIMIT 10000  # Limit for performance
        ''', (start_time, end_time))
        
        messages = []
        for row in cursor.fetchall():
            message = {
                'timestamp': row[0],
                'can_id': row[1],
                'data': row[2].hex() if row[2] else '',
                'dlc': row[3],
                'direction': 'RX' if row[4] else 'TX',
                'channel': row[5],
                'message_name': row[6],
                'decoded_data': json.loads(row[7]) if row[7] else {}
            }
            messages.append(message)
        
        return messages
    
    def _get_dtcs(self, start_time: datetime, end_time: datetime) -> List[Dict]:
        """Get DTCs for the report"""
        cursor = self.connection.cursor()
        cursor.execute('''
            SELECT timestamp, dtc_code, dtc_name, description, severity
            FROM dtcs 
            WHERE timestamp BETWEEN ? AND ?
            ORDER BY timestamp
        ''', (start_time, end_time))
        
        dtcs = []
        for row in cursor.fetchall():
            dtc = {
                'timestamp': row[0],
                'code': row[1],
                'name': row[2],
                'description': row[3],
                'severity': row[4]
            }
            dtcs.append(dtc)
        
        return dtcs
    
    def _analyze_data(self, data: Dict) -> Dict[str, Any]:
        """Perform analysis on the collected data"""
        analysis = {
            'message_rates': self._calculate_message_rates(data),
            'error_analysis': self._analyze_errors(data),
            'performance_metrics': self._calculate_performance_metrics(data),
            'recommendations': []
        }
        
        # Add recommendations based on analysis
        if data['statistics']['total_dtcs'] > 0:
            analysis['recommendations'].append(
                "DTCs detected during capture. Review DTC section for details."
            )
        
        if data['statistics']['tx_messages'] == 0:
            analysis['recommendations'].append(
                "No TX messages detected. Verify if the interface is properly configured for transmission."
            )
        
        return analysis
    
    def _calculate_message_rates(self, data: Dict) -> Dict[str, float]:
        """Calculate message rates"""
        if not data['messages']:
            return {}
        
        # Calculate time span in seconds
        time_span = (data['metadata']['time_range']['end'] - 
                    data['metadata']['time_range']['start']).total_seconds()
        
        if time_span == 0:
            return {}
        
        total_messages = data['statistics']['total_messages']
        return {
            'messages_per_second': total_messages / time_span,
            'rx_rate': data['statistics']['rx_messages'] / time_span,
            'tx_rate': data['statistics']['tx_messages'] / time_span
        }
    
    def _analyze_errors(self, data: Dict) -> Dict[str, Any]:
        """Analyze errors in the data"""
        # This would include checks for CAN errors, protocol violations, etc.
        return {
            'can_errors': 0,  # Would be implemented based on specific error detection
            'protocol_errors': 0,
            'checksum_errors': 0
        }
    
    def _calculate_performance_metrics(self, data: Dict) -> Dict[str, Any]:
        """Calculate performance metrics"""
        return {
            'bus_utilization': self._calculate_bus_utilization(data),
            'peak_load': 0,  # Would be calculated
            'average_load': 0  # Would be calculated
        }
    
    def _calculate_bus_utilization(self, data: Dict) -> float:
        """Calculate CAN bus utilization"""
        # Simplified calculation - would need bitrate and message sizes
        return 0.0
    
    def _generate_html_report(self, data: Dict, output_path: str) -> str:
        """Generate HTML report"""
        html_content = self._create_html_template(data)
        
        with open(output_path, 'w', encoding='utf-8') as f:
            f.write(html_content)
        
        self.logger.info(f"HTML report generated: {output_path}")
        return output_path
    
    def _generate_csv_report(self, data: Dict, output_path: str) -> str:
        """Generate CSV report"""
        with open(output_path, 'w', newline='', encoding='utf-8') as csvfile:
            writer = csv.writer(csvfile)
            
            # Write header
            writer.writerow(['CAN Analysis Report', f"Generated: {data['metadata']['generated_at']}"])
            writer.writerow([])
            
            # Write statistics
            writer.writerow(['Statistics'])
            writer.writerow(['Total Messages', data['statistics']['total_messages']])
            writer.writerow(['RX Messages', data['statistics']['rx_messages']])
            writer.writerow(['TX Messages', data['statistics']['tx_messages']])
            writer.writerow([])
            
            # Write messages if included
            if data['messages']:
                writer.writerow(['CAN Messages'])
                writer.writerow(['Timestamp', 'CAN ID', 'Direction', 'Data', 'Message Name'])
                for msg in data['messages']:
                    writer.writerow([
                        msg['timestamp'], hex(msg['can_id']), msg['direction'],
                        msg['data'], msg['message_name']
                    ])
                writer.writerow([])
        
        self.logger.info(f"CSV report generated: {output_path}")
        return output_path
    
    def _generate_pdf_report(self, data: Dict, output_path: str) -> str:
        """Generate PDF report"""
        try:
            # First create HTML content
            html_content = self._create_html_template(data)
            
            # Convert to PDF
            pdfkit.from_string(html_content, output_path)
            
            self.logger.info(f"PDF report generated: {output_path}")
            return output_path
            
        except Exception as e:
            self.logger.error(f"PDF generation failed: {e}")
            # Fallback to HTML
            html_path = output_path.replace('.pdf', '.html')
            return self._generate_html_report(data, html_path)
    
    def _generate_json_report(self, data: Dict, output_path: str) -> str:
        """Generate JSON report"""
        # Convert datetime objects to strings for JSON serialization
        def json_serializer(obj):
            if isinstance(obj, datetime):
                return obj.isoformat()
            raise TypeError(f"Type {type(obj)} not serializable")
        
        with open(output_path, 'w', encoding='utf-8') as f:
            json.dump(data, f, indent=2, default=json_serializer)
        
        self.logger.info(f"JSON report generated: {output_path}")
        return output_path
    
    def _create_html_template(self, data: Dict) -> str:
        """Create HTML template for the report"""
        return f"""
        <!DOCTYPE html>
        <html>
        <head>
            <title>CAN Bus Analysis Report</title>
            <style>
                body {{ font-family: Arial, sans-serif; margin: 40px; }}
                h1 {{ color: #2c3e50; }}
                .section {{ margin-bottom: 30px; }}
                .stat-grid {{ display: grid; grid-template-columns: repeat(3, 1fr); gap: 10px; }}
                .stat-card {{ background: #f8f9fa; padding: 15px; border-radius: 5px; }}
                table {{ width: 100%; border-collapse: collapse; }}
                th, td {{ padding: 8px; text-align: left; border-bottom: 1px solid #ddd; }}
                th {{ background-color: #f2f2f2; }}
            </style>
        </head>
        <body>
            <h1>CAN Bus Analysis Report</h1>
            <div class="section">
                <h2>Report Information</h2>
                <p><strong>Generated:</strong> {data['metadata']['generated_at']}</p>
                <p><strong>Time Range:</strong> {data['metadata']['time_range']['start']} to {data['metadata']['time_range']['end']}</p>
            </div>
            
            <div class="section">
                <h2>Statistics</h2>
                <div class="stat-grid">
                    <div class="stat-card">
                        <h3>Total Messages</h3>
                        <p>{data['statistics']['total_messages']}</p>
                    </div>
                    <div class="stat-card">
                        <h3>RX Messages</h3>
                        <p>{data['statistics']['rx_messages']}</p>
                    </div>
                    <div class="stat-card">
                        <h3>TX Messages</h3>
                        <p>{data['statistics']['tx_messages']}</p>
                    </div>
                </div>
            </div>
            
            <!-- Additional sections would be added here -->
            
        </body>
        </html>
        """