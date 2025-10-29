import can
import threading
import time
import queue
from collections import deque
from datetime import datetime
from typing import Dict, List, Optional, Callable
import logging

class VectorCANInterface:
    def __init__(self):
        self.logger = logging.getLogger(__name__)
        self.bus = None
        self.is_running = False
        self.message_callbacks = []
        self.error_callbacks = []
        self.channel_info = {}
        self.message_count = 0
        self.error_count = 0
        
        # Add message buffer and rate limiting
        self.message_buffer = queue.Queue(maxsize=10000)  # Buffer up to 10,000 messages
        self.buffer_thread = None
        self.max_messages_per_second = 1000  # Rate limit
        self.last_message_time = time.time()
        
    def detect_available_interfaces(self) -> List[Dict]:
        """Detect available Vector CAN interfaces with better diagnostics"""
        interfaces = []
        try:
            self.logger.info("Scanning for Vector CAN interfaces...")
            
            for channel in range(8):  # Check first 8 channels
                for bitrate in [125000, 250000, 500000, 1000000]:
                    try:
                        self.logger.info(f"Testing channel {channel} at {bitrate} bps...")
                        
                        with can.Bus(interface='vector', 
                                   channel=channel, 
                                   bitrate=bitrate,
                                   receive_own_messages=True) as test_bus:
                            
                            # Try to send a test message
                            test_msg = can.Message(
                                arbitration_id=0x100,
                                data=[0x01, 0x02, 0x03, 0x04],
                                is_extended_id=False
                            )
                            test_bus.send(test_msg)
                            
                            # Try to receive (with timeout)
                            received_msg = test_bus.recv(timeout=0.1)
                            
                            info = {
                                'channel': channel,
                                'interface': 'vector',
                                'bitrate': bitrate,
                                'status': 'Active' if received_msg else 'Available (no loopback)',
                                'test_passed': received_msg is not None
                            }
                            interfaces.append(info)
                            
                            self.logger.info(f"✓ Channel {channel} at {bitrate} bps: {info['status']}")
                            break  # Found working config for this channel
                            
                    except Exception as e:
                        self.logger.debug(f"Channel {channel} at {bitrate} bps failed: {e}")
                        continue
                        
        except Exception as e:
            self.logger.error(f"Error detecting interfaces: {e}")
            
        if not interfaces:
            self.logger.warning("No Vector interfaces detected")
        else:
            self.logger.info(f"Found {len(interfaces)} interface configurations")
            
        return interfaces

    def initialize_interface(self, channel: int, bitrate: int = 500000) -> bool:
        """Initialize the CAN interface"""
        try:
            self.bus = can.Bus(
                interface='vector',
                channel=channel,
                bitrate=bitrate,
                receive_own_messages=True
            )
            self.channel_info = {
                'channel': channel,
                'bitrate': bitrate,
                'interface': 'vector'
            }
            self.logger.info(f"CAN interface initialized on channel {channel}, bitrate {bitrate}")
            return True
            
        except Exception as e:
            self.logger.error(f"Failed to initialize CAN interface: {e}")
            return False
    
    def start_capture(self):
        """Start capturing CAN messages"""
        try:
            if not self.bus:
                return False
                
            self.is_running = True
            self.is_capturing = True
            logging.info("CAN capture started with buffering")
            
            # Start the capture thread
            self.capture_thread = threading.Thread(target=self._capture_loop, daemon=True)
            self.capture_thread.start()
            
            # Start the buffer processor thread
            self.buffer_thread = threading.Thread(target=self._buffer_processor_loop, daemon=True)
            self.buffer_thread.start()
            
            return True
            
        except Exception as e:
            logging.error(f"Failed to start capture: {e}")
            return False
    
    def stop_capture(self):
        """Stop capturing CAN messages"""
        self.is_running = False
        self.is_capturing = False
        
        # Wait for threads to finish
        if hasattr(self, 'capture_thread') and self.capture_thread:
            self.capture_thread.join(timeout=2.0)
        if hasattr(self, 'buffer_thread') and self.buffer_thread:
            self.buffer_thread.join(timeout=2.0)
            
        self.logger.info("CAN capture stopped")
    
    def _capture_loop(self):
        """Main capture loop with buffering"""
        while self.is_running:
            try:
                message = self.bus.recv(timeout=0.01)  # Shorter timeout for responsiveness
                if message:
                    # Apply rate limiting
                    current_time = time.time()
                    if current_time - self.last_message_time < (1.0 / self.max_messages_per_second):
                        continue  # Skip message if we're over rate limit
                    
                    self.last_message_time = current_time
                    
                    # Non-blocking put with timeout
                    try:
                        self.message_buffer.put(message, timeout=0.001)
                    except queue.Full:
                        self.error_count += 1
                        self.logger.warning("Message buffer full, dropping message")
                        
            except Exception as e:
                self.logger.error(f"Error in capture loop: {e}")
                for callback in self.error_callbacks:
                    callback(f"Capture error: {e}")
    def _buffer_processor_loop(self):
        """Process messages from buffer at controlled rate"""
        while self.is_running:
            try:
                # Get message from buffer with timeout
                message = self.message_buffer.get(timeout=0.1)
                if message:
                    self._process_message(message)
                    self.message_buffer.task_done()
                    
            except queue.Empty:
                continue  # No messages, continue
            except Exception as e:
                self.logger.error(f"Error in buffer processor: {e}")
    def _process_message(self, message):
        """Process incoming CAN message"""
        try:
            message_data = {
                'timestamp': datetime.now(),
                'can_id': message.arbitration_id,
                'data': message.data,
                'dlc': message.dlc,
                'channel': self.channel_info.get('channel', 0)
            }
            
            # Better TX/RX detection
            if hasattr(message, 'is_tx'):
                message_data['is_rx'] = not message.is_tx
            elif hasattr(message, 'is_rx'):
                message_data['is_rx'] = message.is_rx
            else:
                message_data['is_rx'] = True  # Default to RX
                
            self.message_count += 1
            
            # Call all registered callbacks
            for callback in self.message_callbacks:
                try:
                    callback(message_data)
                except Exception as e:
                    self.logger.error(f"Error in message callback: {e}")
                    
        except Exception as e:
            self.logger.error(f"Error processing message: {e}")
            
    def read_message(self):
        """Read a single CAN message (polling approach)"""
        try:
            if not self.bus or not self.is_running:
                return None
                
            message = self.bus.recv(timeout=0.1)
            if message:
                return {
                    'timestamp': datetime.now(),
                    'can_id': message.arbitration_id,
                    'data': message.data,
                    'dlc': message.dlc,
                    'is_rx': not getattr(message, 'is_tx', False)  # Better TX/RX detection
                }
            return None
            
        except Exception as e:
            logging.error(f"Error reading message: {e}")
            return None
    def send_message(self, can_id: int, data: bytes, is_extended: bool = False):
        """Send a CAN message"""
        if not self.bus:
            raise RuntimeError("CAN interface not initialized")
        
        try:
            # Version-compatible message creation
            message = can.Message(
                arbitration_id=can_id,
                data=data,
                is_extended_id=is_extended
            )
            
            # For newer versions, you can mark it as TX
            if hasattr(message, 'is_tx'):
                message.is_tx = True
                
            self.bus.send(message)
            self.logger.debug(f"Sent message: ID={hex(can_id)}, Data={data.hex()}")
        except Exception as e:
            self.logger.error(f"Failed to send message: {e}")
    
    def add_message_callback(self, callback: Callable):
        """Add callback for received messages"""
        self.message_callbacks.append(callback)
    
    def add_error_callback(self, callback: Callable):
        """Add callback for errors"""
        self.error_callbacks.append(callback)
    
    def close(self):
        """Close the CAN interface"""
        self.stop_capture()
        if self.bus:
            self.bus.shutdown()
            self.bus = None

    def get_interface_status(self) -> Dict:
        """Get current interface status"""
        return {
            'is_connected': self.bus is not None,
            'is_capturing': self.is_running,
            'message_count': self.message_count,
            'error_count': self.error_count,
            'channel_info': self.channel_info,
            'timestamp': datetime.now()
        }
        
    def test_interface(self):
        """Test the interface functionality"""
        try:
            # Test connection
            if not self.bus:
                return "Not connected"
                
            # Test send/receive
            test_data = bytes([0x01, 0x02, 0x03, 0x04])
            self.send_message(0x100, test_data)
            
            return f"Interface OK - Channel: {self.channel_info.get('channel')}, Bitrate: {self.channel_info.get('bitrate')}"
            
        except Exception as e:
            return f"Interface test failed: {e}"
            
    def add_message_callback(self, callback: Callable):
        """Add callback for received messages with thread safety"""
        if callback not in self.message_callbacks:
            self.message_callbacks.append(callback)

    def add_error_callback(self, callback: Callable):
        """Add callback for errors with thread safety"""
        if callback not in self.error_callbacks:
            self.error_callbacks.append(callback)