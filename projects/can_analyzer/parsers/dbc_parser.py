import cantools
from typing import Dict, List, Optional, Any
import logging

class DBCParser:
    def __init__(self):
        self.logger = logging.getLogger(__name__)
        self.db = None
        self.messages = {}
        
    def load_dbc_file(self, dbc_path: str) -> bool:
        """Load and parse DBC file"""
        try:
            self.db = cantools.db.load_file(dbc_path)
            self.messages = {msg.name: msg for msg in self.db.messages}
            self.logger.info(f"Loaded DBC file: {dbc_path}")
            self.logger.info(f"Found {len(self.messages)} messages")
            return True
        except Exception as e:
            self.logger.error(f"Failed to load DBC file: {e}")
            return False
    
    def decode_message(self, can_id: int, data: bytes) -> Optional[Dict[str, Any]]:
        """Decode CAN message using DBC"""
        if not self.db:
            return None
            
        try:
            message = self.db.get_message_by_frame_id(can_id)
            decoded = message.decode(data)
            
            return {
                'message_name': message.name,
                'signals': decoded,
                'comment': message.comment,
                'send_type': message.send_type,
                'cycle_time': message.cycle_time
            }
        except Exception as e:
            # Message not found in DBC or decoding error
            return None
    
    def get_message_by_name(self, message_name: str):
        """Get message definition by name"""
        return self.messages.get(message_name)
    
    def get_all_messages(self) -> List[str]:
        """Get list of all message names"""
        return list(self.messages.keys())
    
    def encode_message(self, message_name: str, **signal_values) -> Optional[bytes]:
        """Encode message using DBC"""
        if not self.db:
            return None
            
        try:
            message = self.messages[message_name]
            encoded_data = message.encode(signal_values)
            return encoded_data
        except Exception as e:
            self.logger.error(f"Failed to encode message {message_name}: {e}")
            return None