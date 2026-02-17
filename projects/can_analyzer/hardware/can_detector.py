import can
import subprocess
import platform
from typing import List, Dict, Optional
import logging
from dataclasses import dataclass

@dataclass
class HardwareInfo:
    interface_type: str
    channel: int
    name: str
    status: str
    details: str
    bitrate_supported: List[int]

class CANDetector:
    def __init__(self):
        self.logger = logging.getLogger(__name__)
        
    def detect_all_interfaces(self) -> List[HardwareInfo]:
        """Detect all available CAN interfaces"""
        interfaces = []
        
        # Detect Vector interfaces
        interfaces.extend(self._detect_vector_interfaces())
        
        # Detect PCAN interfaces
        interfaces.extend(self._detect_pcan_interfaces())
        
        # Detect SocketCAN interfaces
        interfaces.extend(self._detect_socketcan_interfaces())
        
        # Detect IXXAT interfaces
        interfaces.extend(self._detect_ixxat_interfaces())
        
        self.logger.info(f"Detected {len(interfaces)} CAN interfaces")
        return interfaces
    
    def _detect_vector_interfaces(self) -> List[HardwareInfo]:
        """Detect Vector hardware interfaces"""
        interfaces = []
        
        try:
            # Try to detect Vector hardware through python-can
            for channel in range(8):  # Check first 8 channels
                try:
                    with can.Bus(interface='vector', 
                               channel=channel, 
                               bitrate=500000,
                               receive_own_messages=False) as test_bus:
                        info = HardwareInfo(
                            interface_type="vector",
                            channel=channel,
                            name=f"Vector Channel {channel}",
                            status="Available",
                            details="Vector CAN interface",
                            bitrate_supported=[125000, 250000, 500000, 1000000]
                        )
                        interfaces.append(info)
                        self.logger.info(f"Found Vector interface on channel {channel}")
                except Exception as e:
                    # Try with different bitrates
                    for bitrate in [125000, 250000, 500000, 1000000]:
                        try:
                            with can.Bus(interface='vector', 
                                       channel=channel, 
                                       bitrate=bitrate,
                                       receive_own_messages=False):
                                info = HardwareInfo(
                                    interface_type="vector",
                                    channel=channel,
                                    name=f"Vector Channel {channel}",
                                    status=f"Available ({bitrate} bps)",
                                    details="Vector CAN interface",
                                    bitrate_supported=[bitrate]
                                )
                                interfaces.append(info)
                                self.logger.info(f"Found Vector interface on channel {channel} at {bitrate} bps")
                                break
                        except:
                            continue
                            
        except Exception as e:
            self.logger.error(f"Error detecting Vector interfaces: {e}")
            
        return interfaces
    
    def _detect_pcan_interfaces(self) -> List[HardwareInfo]:
        """Detect PCAN hardware interfaces"""
        interfaces = []
        
        try:
            # Try PCAN basic detection
            for channel in range(16):  # Check multiple channels
                try:
                    with can.Bus(interface='pcan', 
                               channel=f"PCAN_USBBUS{channel}",
                               bitrate=500000) as test_bus:
                        info = HardwareInfo(
                            interface_type="pcan",
                            channel=channel,
                            name=f"PCAN USB {channel}",
                            status="Available",
                            details="PCAN USB interface",
                            bitrate_supported=[125000, 250000, 500000, 1000000]
                        )
                        interfaces.append(info)
                except:
                    continue
                    
        except Exception as e:
            self.logger.debug(f"PCAN interfaces not available: {e}")
            
        return interfaces
    
    def _detect_socketcan_interfaces(self) -> List[HardwareInfo]:
        """Detect SocketCAN interfaces (Linux only)"""
        interfaces = []
        
        if platform.system() != "Linux":
            return interfaces
            
        try:
            # Use ip command to list CAN interfaces
            result = subprocess.run(['ip', 'link', 'show', 'type', 'can'], 
                                  capture_output=True, text=True)
            
            if result.returncode == 0:
                lines = result.stdout.split('\n')
                current_interface = None
                
                for line in lines:
                    if 'can' in line and 'state' in line:
                        # Extract interface name
                        parts = line.split(':')
                        if len(parts) >= 2:
                            interface_name = parts[1].strip().split(' ')[0]
                            if interface_name.startswith('can'):
                                current_interface = interface_name
                                
                                info = HardwareInfo(
                                    interface_type="socketcan",
                                    channel=len(interfaces),
                                    name=interface_name,
                                    status="Available",
                                    details="SocketCAN interface",
                                    bitrate_supported=[125000, 250000, 500000, 1000000]
                                )
                                interfaces.append(info)
                                self.logger.info(f"Found SocketCAN interface: {interface_name}")
                                
        except Exception as e:
            self.logger.debug(f"SocketCAN detection failed: {e}")
            
        return interfaces
    
    def _detect_ixxat_interfaces(self) -> List[HardwareInfo]:
        """Detect IXXAT hardware interfaces"""
        interfaces = []
        
        try:
            # Try IXXAT interface detection
            for channel in range(4):
                try:
                    with can.Bus(interface='ixxat',
                               channel=channel,
                               bitrate=500000) as test_bus:
                        info = HardwareInfo(
                            interface_type="ixxat",
                            channel=channel,
                            name=f"IXXAT Channel {channel}",
                            status="Available",
                            details="IXXAT CAN interface",
                            bitrate_supported=[125000, 250000, 500000, 1000000]
                        )
                        interfaces.append(info)
                except:
                    continue
                    
        except Exception as e:
            self.logger.debug(f"IXXAT interfaces not available: {e}")
            
        return interfaces
    
    def get_interface_status(self, interface_type: str, channel: int) -> Dict[str, str]:
        """Get detailed status for a specific interface"""
        try:
            if interface_type == "vector":
                return self._get_vector_status(channel)
            elif interface_type == "socketcan":
                return self._get_socketcan_status(channel)
            else:
                return {"status": "Unknown", "details": "Status check not implemented"}
                
        except Exception as e:
            return {"status": "Error", "details": str(e)}
    
    def _get_vector_status(self, channel: int) -> Dict[str, str]:
        """Get status for Vector interface"""
        try:
            with can.Bus(interface='vector', channel=channel, bitrate=500000) as bus:
                # Try to send a test message
                test_msg = can.Message(arbitration_id=0x100, data=[0x01, 0x02, 0x03], is_extended_id=False)
                bus.send(test_msg)
                
                return {
                    "status": "Operational",
                    "details": "Interface responding correctly",
                    "can_send": "Yes",
                    "can_receive": "Yes"
                }
        except Exception as e:
            return {
                "status": "Error",
                "details": f"Interface test failed: {e}",
                "can_send": "No",
                "can_receive": "Unknown"
            }
    
    def _get_socketcan_status(self, channel: int) -> Dict[str, str]:
        """Get status for SocketCAN interface"""
        if platform.system() != "Linux":
            return {"status": "Unavailable", "details": "SocketCAN only available on Linux"}
            
        try:
            # Check interface statistics
            interface_name = f"can{channel}"
            result = subprocess.run(['ip', '-s', 'link', 'show', interface_name],
                                  capture_output=True, text=True)
            
            if result.returncode == 0:
                return {
                    "status": "Operational",
                    "details": "Interface exists and is configured",
                    "statistics": "Available"
                }
            else:
                return {
                    "status": "Not Found",
                    "details": f"Interface {interface_name} not found"
                }
                
        except Exception as e:
            return {"status": "Error", "details": str(e)}
    
    def validate_interface_configuration(self, interface_type: str, channel: int, 
                                       bitrate: int) -> Dict[str, bool]:
        """Validate if interface can be configured with given parameters"""
        validation_result = {
            "interface_exists": False,
            "bitrate_supported": False,
            "channel_available": False,
            "overall_valid": False
        }
        
        try:
            interfaces = self.detect_all_interfaces()
            target_interface = None
            
            # Find the specific interface
            for interface in interfaces:
                if (interface.interface_type == interface_type and 
                    interface.channel == channel):
                    target_interface = interface
                    validation_result["interface_exists"] = True
                    validation_result["channel_available"] = True
                    break
            
            if target_interface:
                # Check bitrate support
                if bitrate in target_interface.bitrate_supported:
                    validation_result["bitrate_supported"] = True
                
                # Test actual configuration
                try:
                    with can.Bus(interface=interface_type,
                               channel=channel,
                               bitrate=bitrate) as test_bus:
                        validation_result["overall_valid"] = True
                except:
                    validation_result["overall_valid"] = False
                    
            return validation_result
            
        except Exception as e:
            self.logger.error(f"Interface validation failed: {e}")
            return validation_result