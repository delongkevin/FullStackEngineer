from PyQt5.QtWidgets import (QDialog, QVBoxLayout, QHBoxLayout, QTabWidget, 
                             QWidget, QLabel, QComboBox, QSpinBox, QCheckBox,
                             QLineEdit, QPushButton, QGroupBox, QFormLayout,
                             QTextEdit, QFileDialog, QDialogButtonBox,
                             QListWidget, QMessageBox, QProgressBar)
from PyQt5.QtCore import Qt, pyqtSignal
from PyQt5.QtGui import QFont, QPalette, QColor
import logging

from config.settings import Settings

class SettingsDialog(QDialog):
    settings_updated = pyqtSignal()
    
    def __init__(self, parent=None, settings: Settings = None):
        super().__init__(parent)
        self.settings = settings
        self.setup_ui()
        self.load_current_settings()
        
    def setup_ui(self):
        self.setWindowTitle("Application Settings")
        self.setGeometry(200, 200, 700, 600)
        
        layout = QVBoxLayout(self)
        
        # Tab widget for different setting categories
        self.tab_widget = QTabWidget()
        
        # CAN Interface Tab
        self.can_tab = QWidget()
        self.setup_can_tab()
        self.tab_widget.addTab(self.can_tab, "CAN Interface")
        
        # Display Tab
        self.display_tab = QWidget()
        self.setup_display_tab()
        self.tab_widget.addTab(self.display_tab, "Display")
        
        # Logging Tab
        self.logging_tab = QWidget()
        self.setup_logging_tab()
        self.tab_widget.addTab(self.logging_tab, "Logging")
        
        # Reporting Tab
        self.reporting_tab = QWidget()
        self.setup_reporting_tab()
        self.tab_widget.addTab(self.reporting_tab, "Reporting")
        
        layout.addWidget(self.tab_widget)
        
        # Buttons
        button_box = QDialogButtonBox(QDialogButtonBox.Ok | QDialogButtonBox.Cancel | QDialogButtonBox.Apply)
        button_box.accepted.connect(self.accept)
        button_box.rejected.connect(self.reject)
        button_box.button(QDialogButtonBox.Apply).clicked.connect(self.apply_settings)
        
        layout.addWidget(button_box)
    
    def setup_can_tab(self):
        layout = QFormLayout(self.can_tab)
        
        self.interface_combo = QComboBox()
        self.interface_combo.addItems(["vector", "socketcan", "pcan", "ixxat"])
        layout.addRow("Default Interface:", self.interface_combo)
        
        self.channel_spin = QSpinBox()
        self.channel_spin.setRange(0, 16)
        layout.addRow("Default Channel:", self.channel_spin)
        
        self.bitrate_combo = QComboBox()
        self.bitrate_combo.addItems(["125000", "250000", "500000", "1000000"])
        layout.addRow("Default Bitrate:", self.bitrate_combo)
        
        self.auto_detect_check = QCheckBox("Auto-detect hardware on startup")
        layout.addRow(self.auto_detect_check)
        
    def setup_display_tab(self):
        layout = QFormLayout(self.display_tab)
        
        self.auto_scroll_check = QCheckBox("Auto-scroll to newest messages")
        layout.addRow(self.auto_scroll_check)
        
        self.max_messages_spin = QSpinBox()
        self.max_messages_spin.setRange(100, 10000)
        self.max_messages_spin.setSuffix(" messages")
        layout.addRow("Max display messages:", self.max_messages_spin)
        
        self.refresh_rate_spin = QSpinBox()
        self.refresh_rate_spin.setRange(10, 1000)
        self.refresh_rate_spin.setSuffix(" ms")
        layout.addRow("Refresh rate:", self.refresh_rate_spin)
        
        self.theme_combo = QComboBox()
        self.theme_combo.addItems(["default", "dark", "light"])
        layout.addRow("Theme:", self.theme_combo)
        
    def setup_logging_tab(self):
        layout = QFormLayout(self.logging_tab)
        
        self.auto_log_check = QCheckBox("Automatically start logging on capture")
        layout.addRow(self.auto_log_check)
        
        self.log_format_combo = QComboBox()
        self.log_format_combo.addItems(["CSV only", "Database only", "Both"])
        layout.addRow("Log format:", self.log_format_combo)
        
        self.max_log_size_spin = QSpinBox()
        self.max_log_size_spin.setRange(10, 1000)
        self.max_log_size_spin.setSuffix(" MB")
        layout.addRow("Max log size:", self.max_log_size_spin)
        
        self.compress_logs_check = QCheckBox("Compress old log files")
        layout.addRow(self.compress_logs_check)
        
    def setup_reporting_tab(self):
        layout = QFormLayout(self.reporting_tab)
        
        self.report_format_combo = QComboBox()
        self.report_format_combo.addItems(["HTML", "CSV", "PDF", "JSON"])
        layout.addRow("Default report format:", self.report_format_combo)
        
        self.include_raw_check = QCheckBox("Include raw CAN data")
        layout.addRow(self.include_raw_check)
        
        self.include_decoded_check = QCheckBox("Include decoded signals")
        layout.addRow(self.include_decoded_check)
        
        self.include_stats_check = QCheckBox("Include statistics")
        layout.addRow(self.include_stats_check)
        
        self.include_dtcs_check = QCheckBox("Include DTC information")
        layout.addRow(self.include_dtcs_check)
        
    def load_current_settings(self):
        """Load current settings into dialog"""
        if not self.settings:
            return
            
        # CAN Settings
        self.interface_combo.setCurrentText(self.settings.get_setting('default_interface'))
        self.channel_spin.setValue(self.settings.get_setting('default_channel'))
        self.bitrate_combo.setCurrentText(str(self.settings.get_setting('default_bitrate')))
        self.auto_detect_check.setChecked(self.settings.get_setting('auto_detect'))
        
        # Display Settings
        self.auto_scroll_check.setChecked(self.settings.get_setting('auto_scroll'))
        self.max_messages_spin.setValue(self.settings.get_setting('max_display_messages'))
        self.refresh_rate_spin.setValue(self.settings.get_setting('refresh_rate_ms'))
        self.theme_combo.setCurrentText(self.settings.get_setting('theme'))
        
        # Logging Settings
        self.auto_log_check.setChecked(self.settings.get_setting('auto_log'))
        self.log_format_combo.setCurrentText(
            "CSV only" if self.settings.get_setting('log_format') == "csv" else
            "Database only" if self.settings.get_setting('log_format') == "db" else "Both"
        )
        self.max_log_size_spin.setValue(self.settings.get_setting('max_log_size_mb'))
        self.compress_logs_check.setChecked(self.settings.get_setting('compress_old_logs'))
        
        # Reporting Settings
        self.report_format_combo.setCurrentText(self.settings.get_setting('default_report_format').upper())
        self.include_raw_check.setChecked(self.settings.get_setting('include_raw_data'))
        self.include_decoded_check.setChecked(self.settings.get_setting('include_decoded'))
        self.include_stats_check.setChecked(self.settings.get_setting('include_statistics'))
        self.include_dtcs_check.setChecked(self.settings.get_setting('include_dtcs'))
    
    def apply_settings(self):
        """Apply settings without closing dialog"""
        if not self.settings:
            return
            
        try:
            # CAN Settings
            self.settings.set_setting('default_interface', self.interface_combo.currentText())
            self.settings.set_setting('default_channel', self.channel_spin.value())
            self.settings.set_setting('default_bitrate', int(self.bitrate_combo.currentText()))
            self.settings.set_setting('auto_detect', self.auto_detect_check.isChecked())
            
            # Display Settings
            self.settings.set_setting('auto_scroll', self.auto_scroll_check.isChecked())
            self.settings.set_setting('max_display_messages', self.max_messages_spin.value())
            self.settings.set_setting('refresh_rate_ms', self.refresh_rate_spin.value())
            self.settings.set_setting('theme', self.theme_combo.currentText())
            
            # Logging Settings
            self.settings.set_setting('auto_log', self.auto_log_check.isChecked())
            log_format_map = {"CSV only": "csv", "Database only": "db", "Both": "both"}
            self.settings.set_setting('log_format', log_format_map[self.log_format_combo.currentText()])
            self.settings.set_setting('max_log_size_mb', self.max_log_size_spin.value())
            self.settings.set_setting('compress_old_logs', self.compress_logs_check.isChecked())
            
            # Reporting Settings
            self.settings.set_setting('default_report_format', self.report_format_combo.currentText().lower())
            self.settings.set_setting('include_raw_data', self.include_raw_check.isChecked())
            self.settings.set_setting('include_decoded', self.include_decoded_check.isChecked())
            self.settings.set_setting('include_statistics', self.include_stats_check.isChecked())
            self.settings.set_setting('include_dtcs', self.include_dtcs_check.isChecked())
            
            self.settings.save_settings()
            self.settings_updated.emit()
            QMessageBox.information(self, "Success", "Settings applied successfully!")
            
        except Exception as e:
            QMessageBox.critical(self, "Error", f"Failed to apply settings: {e}")
    
    def accept(self):
        """OK button clicked"""
        self.apply_settings()
        super().accept()

class AboutDialog(QDialog):
    def __init__(self, parent=None):
        super().__init__(parent)
        self.setup_ui()
        
    def setup_ui(self):
        self.setWindowTitle("About CAN Analyzer")
        self.setFixedSize(400, 300)
        
        layout = QVBoxLayout(self)
        
        # Application info
        title = QLabel("Vector CAN Bus Analyzer")
        title.setAlignment(Qt.AlignCenter)
        title_font = QFont()
        title_font.setPointSize(16)
        title_font.setBold(True)
        title.setFont(title_font)
        
        version = QLabel("Version 1.0.0")
        version.setAlignment(Qt.AlignCenter)
        
        description = QLabel(
            "A comprehensive CAN bus analysis tool for Vector hardware\n\n"
            "Features:\n"
            "• Real-time CAN message monitoring\n"
            "• DBC and CDD file support\n"
            "• Diagnostic Trouble Code (DTC) detection\n"
            "• Comprehensive logging and reporting\n"
            "• Multi-interface support"
        )
        description.setWordWrap(True)
        
        layout.addWidget(title)
        layout.addWidget(version)
        layout.addWidget(description)
        
        # Close button
        close_btn = QPushButton("Close")
        close_btn.clicked.connect(self.accept)
        layout.addWidget(close_btn)

class ConnectionDialog(QDialog):
    def __init__(self, parent=None, available_interfaces=None):
        super().__init__(parent)
        self.available_interfaces = available_interfaces or []
        self.setup_ui()
        
    def setup_ui(self):
        self.setWindowTitle("Connection Settings")
        self.setFixedSize(400, 300)
        
        layout = QVBoxLayout(self)
        
        form_layout = QFormLayout()
        
        self.interface_combo = QComboBox()
        for interface in self.available_interfaces:
            self.interface_combo.addItem(
                f"Channel {interface['channel']} - {interface['interface']}",
                interface
            )
        form_layout.addRow("Interface:", self.interface_combo)
        
        self.bitrate_combo = QComboBox()
        self.bitrate_combo.addItems(["125000", "250000", "500000", "1000000"])
        self.bitrate_combo.setCurrentText("500000")
        form_layout.addRow("Bitrate:", self.bitrate_combo)
        
        self.auto_connect_check = QCheckBox("Auto-connect on startup")
        form_layout.addRow(self.auto_connect_check)
        
        layout.addLayout(form_layout)
        
        # Test connection button
        test_btn = QPushButton("Test Connection")
        test_btn.clicked.connect(self.test_connection)
        layout.addWidget(test_btn)
        
        # Dialog buttons
        button_box = QDialogButtonBox(QDialogButtonBox.Ok | QDialogButtonBox.Cancel)
        button_box.accepted.connect(self.accept)
        button_box.rejected.connect(self.reject)
        layout.addWidget(button_box)
    
    def test_connection(self):
        """Test the selected connection"""
        QMessageBox.information(self, "Test", "Connection test functionality would be implemented here")
    
    def get_settings(self):
        """Get the selected connection settings"""
        interface_data = self.interface_combo.currentData()
        return {
            'interface': interface_data['interface'],
            'channel': interface_data['channel'],
            'bitrate': int(self.bitrate_combo.currentText()),
            'auto_connect': self.auto_connect_check.isChecked()
        }