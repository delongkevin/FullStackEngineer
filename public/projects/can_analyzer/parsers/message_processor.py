import threading
import time
from datetime import datetime
from typing import Dict, List, Optional, Any, Callable
from queue import Queue, Empty
from loggers.data_logger import DataLogger
import re

class MessageProcessor:
    def __init__(self, dbc_parser=None, cdd_parser=None):
        self.logger = logging.getLogger(__name__)
        self.dbc_parser = dbc_parser
        self.cdd_parser = cdd_parser
        self.message_queue = Queue()
        self.processed_messages = []
        self.filters = []
        self.handlers = []
        self.is_processing = False
        self.processing_thread = None
        
        # Statistics
        self.stats = {
            'total_processed': 0,
            'rx_count': 0,
            'tx_count': 0,
            'decoded_count': 0,
            'error_count': 0
        }
        
    def add_message(self, message_data: Dict[str, Any]):
        """Add a raw message to the processing queue"""
        self.message_queue.put(message_data)
        
    def start_processing(self):
        """Start the message processing thread"""
        if self.is_processing:
            return
            
        self.is_processing = True
        self.processing_thread = threading.Thread(target=self._processing_loop)
        self.processing_thread.daemon = True
        self.processing_thread.start()
        self.logger.info("Message processor started")
        
    def stop_processing(self):
        """Stop the message processing thread"""
        self.is_processing = False
        if self.processing_thread:
            self.processing_thread.join(timeout=5.0)
        self.logger.info("Message processor stopped")
        
    def _processing_loop(self):
        """Main processing loop"""
        while self.is_processing:
            try:
                # Get message with timeout to allow checking is_processing
                message_data = self.message_queue.get(timeout=0.1)
                self._process_single_message(message_data)
                self.message_queue.task_done()
                
            except Empty:
                continue
            except Exception as e:
                self.logger.error(f"Error in processing loop: {e}")
                self.stats['error_count'] += 1
                
    def _process_single_message(self, message_data: Dict[str, Any]):
        """Process a single CAN message"""
        try:
            # Apply filters
            if not self._apply_filters(message_data):
                return
                
            # Decode with DBC if available
            decoded_data = None
            if self.dbc_parser:
                decoded_data = self.dbc_parser.decode_message(
                    message_data['can_id'], message_data['data']
                )
                
                if decoded_data:
                    message_data['message_name'] = decoded_data['message_name']
                    message_data['decoded_signals'] = decoded_data['signals']
                    message_data['decoded'] = True
                    self.stats['decoded_count'] += 1
                else:
                    message_data['decoded'] = False
            
            # Check for DTCs if CDD parser available
            if self.cdd_parser:
                self._check_for_dtcs(message_data)
            
            # Update statistics
            self.stats['total_processed'] += 1
            if message_data.get('is_rx', True):
                self.stats['rx_count'] += 1
            else:
                self.stats['tx_count'] += 1
            
            # Store processed message
            message_data['processed_timestamp'] = datetime.now()
            self.processed_messages.append(message_data)
            
            # Limit stored messages to prevent memory issues
            if len(self.processed_messages) > 10000:
                self.processed_messages = self.processed_messages[-5000:]
            
            # Call handlers
            for handler in self.handlers:
                try:
                    handler(message_data)
                except Exception as e:
                    self.logger.error(f"Error in message handler: {e}")
                    
        except Exception as e:
            self.logger.error(f"Error processing message: {e}")
            self.stats['error_count'] += 1
            
    def _apply_filters(self, message_data: Dict[str, Any]) -> bool:
        """Apply registered filters to the message"""
        if not self.filters:
            return True
            
        for filter_func in self.filters:
            try:
                if not filter_func(message_data):
                    return False
            except Exception as e:
                self.logger.error(f"Error in filter: {e}")
                
        return True
        
    def _check_for_dtcs(self, message_data: Dict[str, Any]):
        """Check if message contains DTC information"""
        if not self.cdd_parser or not message_data.get('decoded_signals'):
            return
            
        # Look for DTCs in decoded signals
        for signal_name, signal_value in message_data['decoded_signals'].items():
            # Convert signal value to string and check for DTC patterns
            signal_str = str(signal_value).upper()
            
            # Common DTC patterns (P0, P1, P2, P3 codes)
            dtc_patterns = [
                r'P[0-3][0-9A-F]{3}',
                r'C[0-3][0-9A-F]{3}',
                r'B[0-3][0-9A-F]{3}',
                r'U[0-3][0-9A-F]{3}'
            ]
            
            for pattern in dtc_patterns:
                matches = re.findall(pattern, signal_str)
                for match in matches:
                    dtc_info = self.cdd_parser.get_dtc_info(match)
                    if dtc_info:
                        message_data['detected_dtcs'] = message_data.get('detected_dtcs', [])
                        message_data['detected_dtcs'].append({
                            'code': match,
                            'info': dtc_info,
                            'source_signal': signal_name,
                            'timestamp': message_data['timestamp']
                        })
    
    def add_filter(self, filter_func: Callable[[Dict], bool]):
        """Add a message filter function"""
        self.filters.append(filter_func)
        
    def add_handler(self, handler_func: Callable[[Dict], None]):
        """Add a message handler function"""
        self.handlers.append(handler_func)
        
    def clear_filters(self):
        """Clear all filters"""
        self.filters.clear()
        
    def clear_handlers(self):
        """Clear all handlers"""
        self.handlers.clear()
        
    def get_statistics(self) -> Dict[str, int]:
        """Get current processing statistics"""
        return self.stats.copy()
        
    def reset_statistics(self):
        """Reset processing statistics"""
        self.stats = {
            'total_processed': 0,
            'rx_count': 0,
            'tx_count': 0,
            'decoded_count': 0,
            'error_count': 0
        }
        
    def search_messages(self, criteria: Dict[str, Any], limit: int = 100) -> List[Dict]:
        """Search processed messages based on criteria"""
        results = []
        for message in reversed(self.processed_messages):
            if self._matches_criteria(message, criteria):
                results.append(message)
                if len(results) >= limit:
                    break
        return results
        
    def _matches_criteria(self, message: Dict, criteria: Dict) -> bool:
        """Check if message matches search criteria"""
        for key, value in criteria.items():
            if key not in message:
                return False
                
            if isinstance(value, (list, tuple)):
                if message[key] not in value:
                    return False
            else:
                if message[key] != value:
                    return False
                    
        return True
        
    def get_message_frequency(self, can_id: int, time_window: int = 60) -> float:
        """Calculate message frequency for a specific CAN ID"""
        now = datetime.now()
        window_start = now.timestamp() - time_window
        
        relevant_messages = [
            msg for msg in self.processed_messages
            if msg['can_id'] == can_id and 
            msg['timestamp'].timestamp() >= window_start
        ]
        
        if not relevant_messages:
            return 0.0
            
        time_span = now.timestamp() - min(
            msg['timestamp'].timestamp() for msg in relevant_messages
        )
        
        if time_span == 0:
            return 0.0
            
        return len(relevant_messages) / time_span