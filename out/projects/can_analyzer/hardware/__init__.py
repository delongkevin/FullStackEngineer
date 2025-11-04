"""
Hardware interface modules for CAN Analyzer
"""

from .vector_interface import VectorCANInterface
from .can_detector import CANDetector, HardwareInfo

__all__ = ['VectorCANInterface', 'CANDetector', 'HardwareInfo']