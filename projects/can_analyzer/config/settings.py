import json
import os
from typing import Dict, Any, Optional
from dataclasses import dataclass, asdict
import logging

@dataclass
class AppConfig:
    # CAN Interface Settings
    default_interface: str = "vector"
    default_channel: int = 0
    default_bitrate: int = 500000
    auto_detect: bool = True
    
    # Logging Settings
    auto_log: bool = True
    log_format: str = "both"  # csv, db, both
    max_log_size_mb: int = 100
    compress_old_logs: bool = True
    
    # Display Settings
    auto_scroll: bool = True
    max_display_messages: int = 1000
    refresh_rate_ms: int = 100
    theme: str = "default"  # default, dark, light
    
    # Parsing Settings
    auto_decode: bool = True
    strict_parsing: bool = False
    ignore_checksum: bool = False
    
    # Report Settings
    default_report_format: str = "html"  # html, csv, pdf, json
    include_raw_data: bool = True
    include_decoded: bool = True
    include_statistics: bool = True
    include_dtcs: bool = True
    
    # Recent Files
    recent_dbc_files: list = None
    recent_cdd_files: list = None
    recent_projects: list = None
    
    def __post_init__(self):
        if self.recent_dbc_files is None:
            self.recent_dbc_files = []
        if self.recent_cdd_files is None:
            self.recent_cdd_files = []
        if self.recent_projects is None:
            self.recent_projects = []

class Settings:
    def __init__(self, config_file: str = "can_analyzer_config.json"):
        self.logger = logging.getLogger(__name__)
        self.config_file = config_file
        self.config = AppConfig()
        self.load_settings()
    
    def load_settings(self) -> bool:
        """Load settings from JSON file"""
        try:
            if os.path.exists(self.config_file):
                with open(self.config_file, 'r') as f:
                    data = json.load(f)
                    self.config = AppConfig(**data)
                self.logger.info(f"Settings loaded from {self.config_file}")
                return True
            else:
                self.logger.info("No existing settings file, using defaults")
                return False
        except Exception as e:
            self.logger.error(f"Error loading settings: {e}")
            return False
    
    def save_settings(self) -> bool:
        """Save settings to JSON file"""
        try:
            with open(self.config_file, 'w') as f:
                json.dump(asdict(self.config), f, indent=4)
            self.logger.info(f"Settings saved to {self.config_file}")
            return True
        except Exception as e:
            self.logger.error(f"Error saving settings: {e}")
            return False
    
    def get_setting(self, key: str) -> Any:
        """Get a specific setting value"""
        return getattr(self.config, key, None)
    
    def set_setting(self, key: str, value: Any) -> bool:
        """Set a specific setting value"""
        try:
            setattr(self.config, key, value)
            return True
        except AttributeError:
            self.logger.error(f"Invalid setting key: {key}")
            return False
    
    def add_recent_file(self, file_type: str, file_path: str) -> bool:
        """Add a file to recent files list"""
        try:
            if file_type == "dbc":
                if file_path in self.config.recent_dbc_files:
                    self.config.recent_dbc_files.remove(file_path)
                self.config.recent_dbc_files.insert(0, file_path)
                self.config.recent_dbc_files = self.config.recent_dbc_files[:10]  # Keep last 10
            elif file_type == "cdd":
                if file_path in self.config.recent_cdd_files:
                    self.config.recent_cdd_files.remove(file_path)
                self.config.recent_cdd_files.insert(0, file_path)
                self.config.recent_cdd_files = self.config.recent_cdd_files[:10]
            elif file_type == "project":
                if file_path in self.config.recent_projects:
                    self.config.recent_projects.remove(file_path)
                self.config.recent_projects.insert(0, file_path)
                self.config.recent_projects = self.config.recent_projects[:5]
            else:
                return False
            return True
        except Exception as e:
            self.logger.error(f"Error adding recent file: {e}")
            return False
    
    def get_recent_files(self, file_type: str) -> list:
        """Get recent files list"""
        if file_type == "dbc":
            return self.config.recent_dbc_files
        elif file_type == "cdd":
            return self.config.recent_cdd_files
        elif file_type == "project":
            return self.config.recent_projects
        else:
            return []