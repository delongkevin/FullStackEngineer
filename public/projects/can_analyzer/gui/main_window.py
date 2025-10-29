from PyQt5.QtWidgets import (QMainWindow, QWidget, QVBoxLayout, QHBoxLayout, 
                             QPushButton, QTextEdit, QListWidget, QTabWidget,
                             QLabel, QComboBox, QSpinBox, QCheckBox, QGroupBox,
                             QProgressBar, QFileDialog, QMessageBox, QSplitter)
from PyQt5.QtCore import pyqtSignal, QThread, QTimer
from PyQt5.QtGui import QFont
import logging
import time
import queue
from datetime import datetime

from hardware.vector_interface import VectorCANInterface
from parsers.dbc_parser import DBCParser
from parsers.cdd_parser import CDDParser
from loggers.data_logger import DataLogger

class CircuitBreaker:
    def __init__(self, max_errors=10, timeout=30):
        self.max_errors = max_errors
        self.timeout = timeout
        self.error_count = 0
        self.last_error_time = 0
        self.is_open = False
        
    def check(self):
        """Check if circuit breaker allows operation"""
        if self.is_open:
            # Check if timeout has passed
            if time.time() - self.last_error_time > self.timeout:
                self.is_open = False
                self.error_count = 0
                logging.info("Circuit breaker closed - timeout passed")
                return True
            logging.debug("Circuit breaker is open - blocking operations")
            return False
        return True
    
    def record_error(self):
        """Record an error and potentially open the circuit breaker"""
        self.error_count += 1
        self.last_error_time = time.time()
        logging.warning(f"Circuit breaker error recorded: {self.error_count}/{self.max_errors}")
        
        if self.error_count >= self.max_errors:
            self.is_open = True
            logging.error("Circuit breaker OPENED - too many consecutive errors")
    
    def record_success(self):
        """Record a successful operation"""
        self.error_count = 0
        if self.is_open:
            self.is_open = False
            logging.info("Circuit breaker closed - successful operation")

# In gui/main_window.py, replace the CANWorker class:
class CANWorker(QThread):
    message_received = pyqtSignal(dict)
    error_occurred = pyqtSignal(str)
    status_update = pyqtSignal(str)
    
    def __init__(self, can_interface):
        super().__init__()
        self.can_interface = can_interface
        self.is_running = False
        self.message_count = 0
        
    def run(self):
        self.is_running = True
        self.status_update.emit("CAN capture started")
        logging.info("CAN worker thread started")
        
        try:
            # Start capture first
            if not self.can_interface.start_capture():
                self.error_occurred.emit("Failed to start CAN capture")
                return
                
            # Main capture loop
            while self.is_running:
                try:
                    # Check for new messages
                    message = self.can_interface.read_message()
                    if message:
                        self.message_received.emit(message)
                        self.message_count += 1
                    
                    # Small sleep to prevent CPU overload
                    time.sleep(0.001)
                    
                except Exception as e:
                    self.error_occurred.emit(f"Error reading message: {e}")
                    time.sleep(0.1)  # Longer sleep on error
                    
        except Exception as e:
            self.error_occurred.emit(f"CAN worker error: {e}")
            logging.error(f"CAN worker fatal error: {e}")
        finally:
            self.is_running = False
            self.status_update.emit("CAN capture stopped")
            logging.info("CAN worker thread stopped")
    
    def stop(self):
        """Stop the CAN worker safely"""
        self.is_running = False
        if self.can_interface:
            self.can_interface.stop_capture()
        # Use shorter timeout and better cleanup
        if self.wait(1000):  # 1 second timeout
            logging.info("CAN worker stopped gracefully")
        else:
            logging.warning("CAN worker did not stop gracefully - terminating")
            self.terminate()

class MainWindow(QMainWindow):
        # Add this signal for thread-safe GUI updates
    _safe_update_display = pyqtSignal(str, str)
    def __init__(self):
        super().__init__()
        self.can_interface = VectorCANInterface()
        self.dbc_parser = DBCParser()
        self.cdd_parser = CDDParser()
        self.data_logger = DataLogger()
        self.can_worker = None
        
        # Connect the thread-safe signal
        self._safe_update_display.connect(self._update_display_safe)
        
        # Add circuit breaker for error protection
        self.circuit_breaker = CircuitBreaker(max_errors=5, timeout=60)  # 5 errors in 60 seconds
        
        # Add throttling variables
        self.max_display_messages = 1000  # Max messages to keep in display
        self.message_display_interval = 10  # Display every Nth message
        self.message_counter = 0
        self.last_display_update = 0
        self.display_update_interval = 0.1  # Update GUI every 100ms
        
        # Add message queues for thread-safe GUI updates
        self.message_queue = queue.Queue()
        self.gui_update_timer = QTimer()
        
        self.setup_ui()
        self.setup_connections()
        self.detect_interfaces()
        
        # Add bulk processing variables
        self.pending_messages = []
        self.max_pending_messages = 100
        self.last_bulk_update = time.time()
        self.bulk_update_interval = 0.2  # Update GUI every 200ms
    
    def _update_display_safe(self, raw_line, display_text):
        """Update display safely from main thread"""
        try:
            # Add to raw text (with line limit)
            if self.raw_text.document().lineCount() > 1000:
                self.raw_text.clear()
                self.raw_text.append("... older messages cleared ...")
            
            self.raw_text.append(raw_line)
            
            # Add to message list (with limit)
            if self.message_list.count() > 500:
                self.message_list.takeItem(0)
                
            self.message_list.addItem(display_text)
            
            # Auto-scroll if at bottom
            scrollbar = self.raw_text.verticalScrollBar()
            if scrollbar.value() == scrollbar.maximum():
                scrollbar.setValue(scrollbar.maximum())
                
        except Exception as e:
            logging.error(f"Error updating display: {e}")   
            
    def setup_ui(self):
        self.setWindowTitle("Vector CAN Bus Analyzer")
        self.setGeometry(100, 100, 1200, 800)
        
        central_widget = QWidget()
        self.setCentralWidget(central_widget)
        layout = QVBoxLayout(central_widget)
        
        # Add memory protection timer
        self.memory_timer = QTimer()
        self.memory_timer.timeout.connect(self.check_memory_usage)
        self.memory_timer.start(5000)  #Check every 5 seconds
        
        # Connection panel
        connection_group = QGroupBox("CAN Interface Configuration")
        connection_layout = QHBoxLayout(connection_group)
        
        connection_layout.addWidget(QLabel("Interface:"))
        self.interface_combo = QComboBox()
        connection_layout.addWidget(self.interface_combo)
        
        connection_layout.addWidget(QLabel("Bitrate:"))
        self.bitrate_combo = QComboBox()
        self.bitrate_combo.addItems(["125000", "250000", "500000", "1000000"])
        self.bitrate_combo.setCurrentText("500000")
        connection_layout.addWidget(self.bitrate_combo)
        
        self.connect_btn = QPushButton("Connect")
        connection_layout.addWidget(self.connect_btn)
        
        self.disconnect_btn = QPushButton("Disconnect")
        self.disconnect_btn.setEnabled(False)
        connection_layout.addWidget(self.disconnect_btn)
        
        self.scan_btn = QPushButton("Scan Channels")
        connection_layout.addWidget(self.scan_btn)
        
        connection_layout.addStretch()
        
        # File loading panel
        file_group = QGroupBox("Configuration Files")
        file_layout = QHBoxLayout(file_group)
        
        self.load_dbc_btn = QPushButton("Load DBC File")
        file_layout.addWidget(self.load_dbc_btn)
        
        self.load_cdd_btn = QPushButton("Load CDD File")
        file_layout.addWidget(self.load_cdd_btn)
        
        file_layout.addStretch()
        
        # Control panel
        control_group = QGroupBox("Capture Control")
        control_layout = QHBoxLayout(control_group)
        
        self.emergency_stop_btn = QPushButton("🛑 Emergency Stop")
        self.emergency_stop_btn.setStyleSheet("background-color: red; color: white; font-weight: bold;")
        control_layout.addWidget(self.emergency_stop_btn)
        
        self.start_btn = QPushButton("Start Capture")
        self.start_btn.setEnabled(False)
        control_layout.addWidget(self.start_btn)
        
        self.stop_btn = QPushButton("Stop Capture")
        self.stop_btn.setEnabled(False)
        control_layout.addWidget(self.stop_btn)
        
        self.test_btn = QPushButton("Send Test Message")
        control_layout.addWidget(self.test_btn)
        
        self.simulate_btn = QPushButton("Start Simulation")
        control_layout.addWidget(self.simulate_btn)
        
        self.clear_btn = QPushButton("Clear Log")
        control_layout.addWidget(self.clear_btn)
        
        self.export_btn = QPushButton("Export Report")
        control_layout.addWidget(self.export_btn)
        
        control_layout.addStretch()
        
        # Status panel
        status_layout = QHBoxLayout()
        self.status_label = QLabel("Ready to connect")
        self.message_count_label = QLabel("Messages: 0")
        self.dtc_count_label = QLabel("DTCs: 0")
        
        status_layout.addWidget(self.status_label)
        status_layout.addStretch()
        status_layout.addWidget(self.message_count_label)
        status_layout.addWidget(self.dtc_count_label)
        
        # Status indicators
        status_indicator_layout = QHBoxLayout()
        
        # Traffic light indicator
        self.traffic_light = QLabel("🔴")
        self.traffic_light.setFont(QFont("Arial", 20))
        status_indicator_layout.addWidget(self.traffic_light)
        
        # Message rate indicator
        self.message_rate_label = QLabel("0 msg/s")
        status_indicator_layout.addWidget(self.message_rate_label)
        
        # Channel activity indicator
        self.channel_activity_label = QLabel("Channel: Unknown")
        status_indicator_layout.addWidget(self.channel_activity_label)
        
        status_layout.addLayout(status_indicator_layout)
        
        # Add performance status
        performance_layout = QHBoxLayout()
        self.performance_label = QLabel("Performance: OK")
        self.memory_label = QLabel("Memory: --")
        performance_layout.addWidget(self.performance_label)
        performance_layout.addWidget(self.memory_label)
        
        # Add to status area
        status_layout.addLayout(performance_layout)
        
        # Add performance monitor timer
        self.performance_timer = QTimer()
        self.performance_timer.timeout.connect(self.monitor_performance)
        self.performance_timer.start(2000)  # Check every 2 seconds
    
        # Statistics panel
        stats_group = QGroupBox("Statistics")
        stats_layout = QHBoxLayout(stats_group)
        
        self.stats_text = QTextEdit()
        self.stats_text.setMaximumHeight(100)
        self.stats_text.setReadOnly(True)
        stats_layout.addWidget(self.stats_text)
        
        # Main content area
        splitter = QSplitter()
        
        # Left panel - Message list
        left_widget = QWidget()
        left_layout = QVBoxLayout(left_widget)
        left_layout.addWidget(QLabel("CAN Messages"))
        self.message_list = QListWidget()
        left_layout.addWidget(self.message_list)
        
        # Right panel - Tabs
        right_widget = QWidget()
        right_layout = QVBoxLayout(right_widget)
        
        self.tab_widget = QTabWidget()
        
        # Raw data tab
        self.raw_text = QTextEdit()
        self.raw_text.setFont(QFont("Courier", 9))
        self.tab_widget.addTab(self.raw_text, "Raw Data")
        
        # Decoded data tab
        self.decoded_text = QTextEdit()
        self.decoded_text.setFont(QFont("Courier", 9))
        self.tab_widget.addTab(self.decoded_text, "Decoded Data")
        
        ##Bitrate change
        connection_layout.addWidget(QLabel("Bitrate:"))
        self.bitrate_combo = QComboBox()
        self.bitrate_combo.addItems(["125000", "250000", "500000", "1000000"])
        self.bitrate_combo.setCurrentText("500000")
        connection_layout.addWidget(self.bitrate_combo)
        
        # Add change bitrate button
        self.change_bitrate_btn = QPushButton("Change Bitrate")
        self.change_bitrate_btn.setEnabled(False)  # Disabled until connected
        connection_layout.addWidget(self.change_bitrate_btn)
        # DTC tab
        self.dtc_text = QTextEdit()
        self.dtc_text.setFont(QFont("Courier", 9))
        self.tab_widget.addTab(self.dtc_text, "DTCs")
        
        right_layout.addWidget(self.tab_widget)
        
        splitter.addWidget(left_widget)
        splitter.addWidget(right_widget)
        splitter.setSizes([400, 800])
        
        # Assemble main layout
        layout.addWidget(connection_group)
        layout.addWidget(file_group)
        layout.addWidget(control_group)
        layout.addLayout(status_layout)
        layout.addWidget(stats_group)
        layout.addWidget(splitter)
        
        self.message_count = 0
        self.dtc_count = 0
        self.message_timestamps = []
        self.simulate_traffic = False
    
    def check_memory_usage(self):
        """Check and manage memory usage"""
        try:
            import psutil
            process = psutil.Process()
            memory_mb = process.memory_info().rss / 1024 / 1024
            
            # Clear resources if memory gets too high
            if memory_mb > 200:  # 200 MB threshold
                self.cleanup_memory()
                
            # Emergency cleanup if memory is critical
            if memory_mb > 500:  # 500 MB threshold
                self.emergency_memory_cleanup()
                
        except ImportError:
            pass  # psutil not available
    
    def cleanup_memory(self):
        """Clean up memory without stopping capture"""
        try:
            # Clear some display buffers
            if self.raw_text.document().lineCount() > 500:
                cursor = self.raw_text.textCursor()
                cursor.select(cursor.Document)
                cursor.removeSelectedText()
                self.raw_text.append("... cleared for memory management ...")
                
            if self.message_list.count() > 200:
                self.message_list.clear()
                self.message_list.addItem("... cleared for memory management ...")
                
            # Clear pending messages
            if len(self.pending_messages) > 1000:
                self.pending_messages = self.pending_messages[-500:]
                
            # Force garbage collection
            import gc
            gc.collect()
            
        except Exception as e:
            logging.error(f"Error during memory cleanup: {e}")

    def emergency_memory_cleanup(self):
        """Emergency memory cleanup - more aggressive"""
        try:
            logging.warning("Performing emergency memory cleanup")
            
            # Stop capture temporarily
            was_running = False
            if hasattr(self, 'can_worker') and self.can_worker and self.can_worker.is_running:
                was_running = True
                self.stop_capture()
            
            # Clear all displays
            self.raw_text.clear()
            self.decoded_text.clear()
            self.dtc_text.clear()
            self.message_list.clear()
            
            # Clear all buffers
            self.pending_messages = []
            self.message_timestamps.clear()
            
            # Force garbage collection
            import gc
            gc.collect()
            
            # Restart capture if it was running
            if was_running:
                QTimer.singleShot(1000, self.start_capture)  # Restart after 1 second
                
            logging.warning("Emergency memory cleanup completed")
            
        except Exception as e:
            logging.error(f"Error during emergency memory cleanup: {e}")
    
    def monitor_performance(self):
        """Monitor application performance"""
        try:
            import psutil
            process = psutil.Process()
            memory_mb = process.memory_info().rss / 1024 / 1024
            
            self.memory_label.setText(f"Memory: {memory_mb:.1f} MB")
            
            # Warn if memory usage is high
            if memory_mb > 500:  # 500 MB threshold
                self.performance_label.setText("Performance: HIGH MEMORY")
                self.performance_label.setStyleSheet("color: orange;")
            elif memory_mb > 1000:  # 1 GB threshold
                self.performance_label.setText("Performance: CRITICAL MEMORY")
                self.performance_label.setStyleSheet("color: red;")
                # Auto-cleanup
                self.cleanup_resources()
            else:
                self.performance_label.setText("Performance: OK")
                self.performance_label.setStyleSheet("color: green;")
                
        except ImportError:
            self.memory_label.setText("Memory: psutil not available")
    
    def start_can_simulation(self):
        """Start CAN traffic simulation"""
        try:
            if not hasattr(self, 'can_interface') or not self.can_interface.bus:
                QMessageBox.warning(self, "Error", "Not connected to any interface")
                return
            
            self.simulate_traffic = True
            self.status_label.setText("CAN simulation started")
            
            # Start simulation in background thread
            import threading
            sim_thread = threading.Thread(target=self._run_simulation)
            sim_thread.daemon = True
            sim_thread.start()
            
        except Exception as e:
            QMessageBox.critical(self, "Error", f"Failed to start simulation: {e}")

    def _run_simulation(self):
        """Run CAN simulation in background thread"""
        try:
            while self.simulate_traffic:
                # Send test messages periodically
                test_data = bytes([0x01, 0x02, 0x03, 0x04, 0x05, 0x06, 0x07, 0x08])
                self.can_interface.send_message(0x100, test_data)
                time.sleep(0.1)  # Send 10 messages per second
                
        except Exception as e:
            logging.error(f"Simulation error: {e}")

    def disconnect_interface(self):
        """Disconnect from CAN interface"""
        try:
            # Stop capture if running
            if hasattr(self, 'can_worker') and self.can_worker and self.can_worker.is_running:
                self.stop_capture()
            
            # Close interface
            if self.can_interface:
                self.can_interface.close()
            
            # Update UI
            self.connect_btn.setEnabled(True)
            self.disconnect_btn.setEnabled(False)
            self.start_btn.setEnabled(False)
            self.stop_btn.setEnabled(False)
            self.change_bitrate_btn.setEnabled(False)
            
            self.status_label.setText("Disconnected from CAN interface")
            
            # Clear connection info
            if hasattr(self, 'current_channel'):
                del self.current_channel
            if hasattr(self, 'current_bitrate'):
                del self.current_bitrate
                
        except Exception as e:
            QMessageBox.critical(self, "Error", f"Failed to disconnect: {e}")
    
    def setup_connections(self):
        # Connection buttons
        self.connect_btn.clicked.connect(self.connect_interface)
        self.disconnect_btn.clicked.connect(self.disconnect_interface)
        self.scan_btn.clicked.connect(self.scan_channels)
        
        # File loading
        self.load_dbc_btn.clicked.connect(self.load_dbc_file)
        self.load_cdd_btn.clicked.connect(self.load_cdd_file)
        
        # Capture control
        self.start_btn.clicked.connect(self.start_capture)
        self.stop_btn.clicked.connect(self.stop_capture)
        self.emergency_stop_btn.clicked.connect(self.emergency_stop)
        self.test_btn.clicked.connect(self.send_test_message)
        self.simulate_btn.clicked.connect(self.start_can_simulation)
        self.clear_btn.clicked.connect(self.clear_log)
        self.export_btn.clicked.connect(self.export_report)
        
        # Bitrate handling
        self.interface_combo.currentIndexChanged.connect(self._update_bitrate_from_selection)
        self.change_bitrate_btn.clicked.connect(self._on_change_bitrate_clicked)
        
        # Timers
        self.update_timer = QTimer()
        self.update_timer.timeout.connect(self.update_indicators)
        self.update_timer.start(1000)  # Update every second
        
        self.gui_update_timer.timeout.connect(self.process_queued_messages)
        self.gui_update_timer.start(100)  # Update GUI every 100ms
    
    def emergency_stop(self):
        """Emergency stop - immediately halt everything"""
        try:
            # Stop capture
            if self.can_worker:
                self.can_worker.stop()
            
            # Close CAN interface
            if self.can_interface:
                self.can_interface.close()
            
            # Clear all displays
            self.raw_text.clear()
            self.decoded_text.clear()
            self.dtc_text.clear()
            self.message_list.clear()
            
            # Reset counters
            self.message_count = 0
            self.dtc_count = 0
            self.message_timestamps.clear()
            
            # Update UI
            self.connect_btn.setEnabled(True)
            self.disconnect_btn.setEnabled(False)
            self.start_btn.setEnabled(False)
            self.stop_btn.setEnabled(False)
            
            self.status_label.setText("🛑 Emergency Stop - System Halted")
            
            # Force garbage collection
            import gc
            gc.collect()
            
            QMessageBox.information(self, "Emergency Stop", "All operations stopped and memory cleared.")
            
        except Exception as e:
            logging.error(f"Error during emergency stop: {e}")    
    def update_indicators(self):
        """Update the status indicators"""
        current_time = time.time()
        
        # Calculate message rate (messages per second)
        # Keep only timestamps from last 2 seconds
        self.message_timestamps = [ts for ts in self.message_timestamps if current_time - ts < 2]
        message_rate = len(self.message_timestamps) / 2.0
        
        # Update traffic light
        if message_rate > 10:
            self.traffic_light.setText("🟢")  # Green - high activity
        elif message_rate > 0:
            self.traffic_light.setText("🟡")  # Yellow - low activity
        else:
            self.traffic_light.setText("🔴")  # Red - no activity
        
        # Update message rate
        self.message_rate_label.setText(f"{message_rate:.1f} msg/s")
        
        # Update channel status
        if hasattr(self, 'can_interface') and self.can_interface.bus:
            channel = self.can_interface.channel_info.get('channel', 'Unknown')
            bitrate = self.can_interface.channel_info.get('bitrate', 'Unknown')
            self.channel_activity_label.setText(f"Channel: {channel} ({bitrate} bps)")
        
        # Update statistics
        self.update_statistics()
    
    def update_statistics(self):
        """Update statistics display"""
        try:
            stats_text = f"""
            Messages: {self.message_count} | DTCs: {self.dtc_count}
            Status: {'Connected' if hasattr(self, 'can_interface') and self.can_interface.bus else 'Disconnected'}
            Capture: {'Running' if hasattr(self, 'can_worker') and self.can_worker and self.can_worker.is_running else 'Stopped'}
            Channel: {getattr(self, 'current_channel', 'N/A')}
            Bitrate: {getattr(self, 'current_bitrate', 'N/A')} bps
            """
            self.stats_text.setPlainText(stats_text.strip())
        except Exception as e:
            # Fallback simple display if there's an error
            self.stats_text.setPlainText(f"Messages: {self.message_count} | Status: Connected")    
    
    def _on_change_bitrate_clicked(self):
        """Explicit bitrate change via button"""
        if not hasattr(self, 'current_channel') or not self.can_interface.bus:
            return
            
        new_bitrate = int(self.bitrate_combo.currentText())
        if new_bitrate != self.current_bitrate:
            self.change_bitrate(new_bitrate)
        
    def _update_bitrate_from_selection(self):
        """Update bitrate combo box based on selected interface - ONLY when not connected"""
        if hasattr(self, 'current_channel') and self.can_interface.bus:
            return  # Don't change bitrate while connected
            
        current_index = self.interface_combo.currentIndex()
        if current_index == -1:
            return
            
        interface_data = self.interface_combo.itemData(current_index)
        if interface_data and interface_data[0] != -1:
            channel, detected_bitrate = interface_data
            
            # Only update if the user hasn't manually selected a different bitrate
            current_bitrate = int(self.bitrate_combo.currentText())
            if current_bitrate not in [125000, 250000, 500000, 1000000]:  # If it's still default
                # Update bitrate combo to match detected bitrate
                bitrate_str = str(detected_bitrate)
                index = self.bitrate_combo.findText(bitrate_str)
                if index >= 0:
                    self.bitrate_combo.setCurrentIndex(index)

    def _on_bitrate_changed(self):
        """Handle bitrate selection change"""
        if hasattr(self, 'current_channel') and self.can_interface.bus:
            # Connected - ask user if they want to change bitrate
            new_bitrate = int(self.bitrate_combo.currentText())
            if new_bitrate != self.current_bitrate:
                reply = QMessageBox.question(
                    self, 
                    "Change Bitrate?", 
                    f"Change bitrate from {self.current_bitrate} to {new_bitrate} bps?\nThis will temporarily disconnect and reconnect.",
                    QMessageBox.Yes | QMessageBox.No,
                    QMessageBox.No
                )
                
                if reply == QMessageBox.Yes:
                    self.change_bitrate(new_bitrate)
                else:
                    # Revert to current bitrate
                    bitrate_str = str(self.current_bitrate)
                    index = self.bitrate_combo.findText(bitrate_str)
                    if index >= 0:
                        self.bitrate_combo.setCurrentIndex(index)
    
    def scan_channels(self):
        """Scan all channels for CAN activity"""
        self.status_label.setText("Scanning channels for activity...")
        
        # Disable buttons during scan
        self.scan_btn.setEnabled(False)
        self.connect_btn.setEnabled(False)
    
        # Run scan in thread to avoid freezing GUI
        import threading
        scan_thread = threading.Thread(target=self._perform_channel_scan)
        scan_thread.daemon = True
        scan_thread.start()

    def _perform_channel_scan(self):
        """Perform channel scan in background thread"""
        try:
            from hardware.can_detector import CANDetector
            detector = CANDetector()
            interfaces = detector.detect_all_interfaces()
            
            # Update GUI from main thread
            self._update_scan_results(interfaces)
            
        except Exception as e:
            self.status_label.setText(f"Scan failed: {e}")

    def _update_scan_results(self, interfaces):
        """Update interface combo with scan results (called from main thread)"""
        # This method should be called using QTimer or QMetaObject to ensure it runs in main thread
        from PyQt5.QtCore import QTimer
        QTimer.singleShot(0, lambda: self._actual_update_scan_results(interfaces))

    def _actual_update_scan_results(self, interfaces):
        """Actual update running in main thread"""
        self.interface_combo.clear()
        
        active_interfaces = [i for i in interfaces if i.status == "Active"]
        available_interfaces = [i for i in interfaces if i.status != "Active"]
        
        # Add active interfaces first
        for interface in active_interfaces:
            self.interface_combo.addItem(
                f"Channel {interface.channel} - {interface.bitrate} bps - 🟢 ACTIVE",
                interface
            )
        
        # Add available interfaces
        for interface in available_interfaces:
            self.interface_combo.addItem(
                f"Channel {interface.channel} - {interface.bitrate} bps - ⚪ Available",
                interface
            )
        
        self.scan_btn.setEnabled(True)
        self.connect_btn.setEnabled(True)
        
        if active_interfaces:
            self.status_label.setText(f"Scan complete: Found {len(active_interfaces)} active channels")
        else:
            self.status_label.setText("Scan complete: No active channels found")
        
    def send_test_message(self):
        """Send a test message to verify the interface is working"""
        try:
            # Send a test message with ID 0x100
            test_data = bytes([0x01, 0x02, 0x03, 0x04, 0x05, 0x06, 0x07, 0x08])
            self.can_interface.send_message(0x100, test_data)
            
            # Also try to receive our own message (if receive_own_messages is True)
            QMessageBox.information(self, "Test", "Test message sent. Check if it appears in the log.")
            
        except Exception as e:
            QMessageBox.critical(self, "Test Failed", f"Could not send test message: {e}")
            
    def detect_interfaces(self):
        """Detect available CAN interfaces"""
        interfaces = self.can_interface.detect_available_interfaces()
        self.interface_combo.clear()
        
        for interface in interfaces:
            status_icon = "🟢" if interface.get('test_passed', False) else "⚪"
            display_text = f"Channel {interface['channel']} - {interface['bitrate']} bps - {status_icon} {interface['status']}"
            
            # Store both channel and detected bitrate as a tuple
            self.interface_combo.addItem(display_text, (interface['channel'], interface['bitrate']))
            
        if not interfaces:
            self.interface_combo.addItem("No interfaces detected", (-1, 500000))
            self.status_label.setText("No CAN interfaces found")
        else:
            self.status_label.setText(f"Found {len(interfaces)} interface configurations")
            
            # Auto-select the first interface and update bitrate combo
            if interfaces:
                self.interface_combo.setCurrentIndex(0)
                self._update_bitrate_from_selection()
    def change_bitrate(self, new_bitrate):
        """Change bitrate while maintaining connection"""
        if not hasattr(self, 'current_channel') or not self.can_interface.bus:
            QMessageBox.warning(self, "Error", "Not connected to any interface")
            return False
        
        try:
            # Stop capture if running
            was_capturing = False
            if hasattr(self, 'can_worker') and self.can_worker and self.can_worker.is_running:
                self.stop_capture()
                was_capturing = True
            
            # Close current connection
            self.can_interface.close()
            
            # Reconnect with new bitrate
            if self.can_interface.initialize_interface(self.current_channel, new_bitrate):
                self.current_bitrate = new_bitrate
                self.status_label.setText(f"Connected to channel {self.current_channel} at {new_bitrate} bps")
                
                # Restart capture if it was running
                if was_capturing:
                    self.start_capture()
                
                # Update bitrate combo to reflect change
                bitrate_str = str(new_bitrate)
                index = self.bitrate_combo.findText(bitrate_str)
                if index >= 0:
                    self.bitrate_combo.setCurrentIndex(index)
                
                QMessageBox.information(self, "Success", f"Bitrate changed to {new_bitrate} bps")
                return True
            else:
                QMessageBox.critical(self, "Error", "Failed to change bitrate")
                return False
                
        except Exception as e:
            QMessageBox.critical(self, "Error", f"Failed to change bitrate: {e}")
            return False
        
    def connect_interface(self):
        # Get the selected interface
        current_index = self.interface_combo.currentIndex()
        if current_index == -1:
            QMessageBox.warning(self, "Error", "No interface selected")
            return
        
        # Get the channel from combo box data (ignore the detected bitrate)
        interface_data = self.interface_combo.itemData(current_index)
        if not interface_data or interface_data[0] == -1:
            QMessageBox.warning(self, "Error", "No CAN interface detected")
            return
            
        # Extract just the channel number, ignore the detected bitrate
        channel = interface_data[0] if isinstance(interface_data, (list, tuple)) else interface_data
        
        # ALWAYS use the selected bitrate from the combo box
        bitrate = int(self.bitrate_combo.currentText())
        
        # Try to initialize the interface
        try:
            print(f"Attempting to connect to channel {channel} at {bitrate} bps")
            
            if self.can_interface.initialize_interface(channel, bitrate):
                self.connect_btn.setEnabled(False)
                self.disconnect_btn.setEnabled(True)
                self.start_btn.setEnabled(True)
                self.status_label.setText(f"Connected to channel {channel} at {bitrate} bps")
                
                # Setup message callbacks
                self.can_interface.add_message_callback(self.on_message_received)
                self.can_interface.add_error_callback(self.on_error_occurred)
                
                # Store current connection info
                self.current_channel = channel
                self.current_bitrate = bitrate
                
                print(f"Successfully connected to channel {channel} at {bitrate} bps")
                
            else:
                QMessageBox.critical(self, "Error", "Failed to initialize CAN interface")
                
        except Exception as e:
            QMessageBox.critical(self, "Error", f"Failed to connect: {e}")
            print(f"Connection error: {e}")     
        
    def load_dbc_file(self):
        filename, _ = QFileDialog.getOpenFileName(self, "Load DBC File", "", "DBC Files (*.dbc)")
        if filename:
            if self.dbc_parser.load_dbc_file(filename):
                QMessageBox.information(self, "Success", "DBC file loaded successfully")
            else:
                QMessageBox.critical(self, "Error", "Failed to load DBC file")
                
    def load_cdd_file(self):
        filename, _ = QFileDialog.getOpenFileName(self, "Load CDD File", "", "CDD Files (*.cdd)")
        if filename:
            if self.cdd_parser.load_cdd_file(filename):
                QMessageBox.information(self, "Success", "CDD file loaded successfully")
            else:
                QMessageBox.critical(self, "Error", "Failed to load CDD file")
                
    def start_capture(self):
        if not hasattr(self, 'can_interface') or not self.can_interface.bus:
            QMessageBox.warning(self, "Error", "Not connected to any interface")
            return
        
        try:
            print("Starting CAN capture...")
            logging.info("Attempting to start CAN capture")
            
            # Test if interface is ready
            if not hasattr(self.can_interface, 'bus'):
                QMessageBox.warning(self, "Error", "CAN interface not properly initialized")
                return
                
            # Create new CAN worker
            self.can_worker = CANWorker(self.can_interface)
            self.can_worker.message_received.connect(self.on_message_received)
            self.can_worker.error_occurred.connect(self.on_error_occurred)
            self.can_worker.status_update.connect(self.status_label.setText)
            
            # Add debugging for message reception
            def debug_message(msg):
                print(f"Message received: ID {hex(msg['can_id'])}, Data: {msg['data'].hex()}")
                self.on_message_received(msg)
            
            self.can_worker.message_received.connect(debug_message)
            
            self.can_worker.start()
            
            self.start_btn.setEnabled(False)
            self.stop_btn.setEnabled(True)
            self.status_label.setText("Capturing CAN messages...")
            print("CAN worker started successfully")
            logging.info("CAN worker started successfully")
            
            # Test message to verify everything is working
            QTimer.singleShot(1000, self.send_test_message)  # Send test after 1 second
            
        except Exception as e:
            error_msg = f"Failed to start capture: {e}"
            print(error_msg)
            logging.error(error_msg)
            QMessageBox.critical(self, "Error", error_msg)
            self.can_worker = None
        
    def stop_capture(self):
        if self.can_worker:
            self.can_worker.stop()
            # Don't set to None immediately, wait for thread to finish
            # The worker will be set to None when fully stopped
            
        self.start_btn.setEnabled(True)
        self.stop_btn.setEnabled(False)
        self.status_label.setText("Capture stopped")
        
        # Cleanup resources
        self.cleanup_resources()
    
    def process_queued_messages(self):
        """Process messages from queue at controlled rate"""
        messages_processed = 0
        max_messages_per_update = 50  # Process max 50 messages per GUI update
        
        while not self.message_queue.empty() and messages_processed < max_messages_per_update:
            try:
                message_data = self.message_queue.get_nowait()
                self._process_single_message(message_data)
                messages_processed += 1
                
            except queue.Empty:
                break
            except Exception as e:
                logging.error(f"Error processing queued message: {e}")
            
    def _process_single_message(self, message_data):
        """Process a single message with display throttling"""
        try:
            self.message_count += 1
            self.message_timestamps.append(time.time())
            
            # Update message count label
            self.message_count_label.setText(f"Messages: {self.message_count}")
            
            # Sample messages for display (every Nth message)
            self.message_counter += 1
            if self.message_counter % self.message_display_interval != 0:
                return  # Skip display for sampled messages
            
            # Limit the number of displayed messages
            if self.message_list.count() > self.max_display_messages:
                self.message_list.takeItem(0)  # Remove oldest message
            
            # Log raw message (with throttling)
            current_time = time.time()
            if current_time - self.last_display_update >= self.display_update_interval:
                timestamp = message_data['timestamp'].strftime("%H:%M:%S.%f")[:-3]
                direction = "RX" if message_data.get('is_rx', True) else "TX"
                raw_line = f"{timestamp} {direction} ID: {hex(message_data['can_id'])} Data: {message_data['data'].hex()}"
                
                # Only update display periodically to reduce CPU load
                self.raw_text.append(raw_line)
                
                # Auto-scroll only if at bottom
                scrollbar = self.raw_text.verticalScrollBar()
                auto_scroll = scrollbar.value() == scrollbar.maximum()
                if auto_scroll:
                    scrollbar.setValue(scrollbar.maximum())
                
                self.last_display_update = current_time
            
            # Try to decode with DBC
            decoded_info = None
            if self.dbc_parser.db:
                decoded_info = self.dbc_parser.decode_message(
                    message_data['can_id'], 
                    message_data['data']
                )
                
                if decoded_info:
                    message_data['message_name'] = decoded_info['message_name']
                    message_data['decoded_data'] = decoded_info['signals']
                    
                    # Display decoded message
                    decoded_line = f"{timestamp} {decoded_info['message_name']}:"
                    for signal, value in decoded_info['signals'].items():
                        decoded_line += f" {signal}={value}"
                    self.decoded_text.append(decoded_line)
            
            # Check for DTCs
            self.check_for_dtcs(message_data)
            
            # Log to database (in background thread) - with error handling
            self._log_message_async(message_data)
            
            # Add to message list
            timestamp = message_data['timestamp'].strftime("%H:%M:%S")
            direction = "RX" if message_data.get('is_rx', True) else "TX"
            display_text = f"{timestamp} {direction} {hex(message_data['can_id'])}"
            
            if decoded_info:
                display_text += f" - {decoded_info['message_name']}"
                
            self.message_list.addItem(display_text)
            
            # Limit message list size
            if self.message_list.count() > 1000:
                self.message_list.takeItem(0)
                
            # Auto-scroll message list
            self.message_list.scrollToBottom()
                
        except Exception as e:
            logging.error(f"Error processing single message: {e}")
            
    def _log_message_async(self, message_data):
        """Log message to database in background thread with error handling"""
        import threading
        
        def log_message():
            try:
                # Skip if database logging is disabled due to errors
                if hasattr(self, '_database_logging_disabled'):
                    return
                    
                # Double-check required fields
                if not all(k in message_data for k in ['timestamp', 'can_id', 'data', 'dlc']):
                    logging.error("Message missing required fields for database logging")
                    return
                    
                # Validate data types
                if not isinstance(message_data['data'], (bytes, bytearray)):
                    logging.error(f"Invalid data type: {type(message_data['data'])}")
                    return
                    
                # Try to log with timeout protection
                self.data_logger.log_message(message_data)
                
                # Reset error count on success
                if hasattr(self, '_database_error_count'):
                    self._database_error_count = 0
                    
            except Exception as e:
                # Handle database errors gracefully
                self._handle_database_error(str(e))
        
        # Start thread with daemon=True so it doesn't block application exit
        thread = threading.Thread(target=log_message, daemon=True)
        thread.start()
    
    def _handle_database_error(self, error_message):
        """Handle database errors gracefully"""
        if not hasattr(self, '_database_error_count'):
            self._database_error_count = 0
            
        self._database_error_count += 1
        
        # Log the error (but not too frequently to avoid spam)
        if self._database_error_count <= 3 or self._database_error_count % 10 == 0:
            logging.error(f"Database error ({self._database_error_count}): {error_message}")
        
        # Disable database logging after 5 consecutive errors
        if self._database_error_count >= 5 and not hasattr(self, '_database_logging_disabled'):
            logging.error("Too many database errors - disabling database logging temporarily")
            self._database_logging_disabled = True
            self.status_label.setText("Database logging disabled due to errors")
        
        # Reset error count after 30 seconds of no errors
        if hasattr(self, '_last_database_error_time'):
            if time.time() - self._last_database_error_time > 30:
                self._database_error_count = 0
                if hasattr(self, '_database_logging_disabled'):
                    del self._database_logging_disabled
                    logging.info("Database logging re-enabled")
        else:
            self._last_database_error_time = time.time()
    
    def clear_old_messages(self):
        """Clear old messages to free memory"""
        # Clear message list if it gets too large
        if self.message_list.count() > 2000:
            self.message_list.clear()
            self.message_list.addItem("... older messages cleared ...")
        
        # Clear text displays periodically
        if self.message_count % 5000 == 0:  # Every 5000 messages
            current_raw = self.raw_text.toPlainText()
            lines = current_raw.split('\n')
            if len(lines) > 1000:
                # Keep only last 500 lines
                self.raw_text.setPlainText('\n'.join(lines[-500:]))
            
            current_decoded = self.decoded_text.toPlainText()
            lines = current_decoded.split('\n')
            if len(lines) > 1000:
                self.decoded_text.setPlainText('\n'.join(lines[-500:]))

    def cleanup_resources(self):
        """Clean up resources to prevent memory leaks"""
        try:
            # Stop capture
            if self.can_worker:
                self.can_worker.stop()
            
            # Close CAN interface
            if self.can_interface:
                self.can_interface.close()
            
            # Clear large data structures
            self.message_timestamps.clear()
            self.message_queue = queue.Queue()
            
            # Force garbage collection
            import gc
            gc.collect()
            
        except Exception as e:
            logging.error(f"Error during cleanup: {e}")


    def _create_message_display(self, message_data, decoded_info):
        """Create display text for message list"""
        timestamp = message_data['timestamp'].strftime("%H:%M:%S")
        direction = "RX" if message_data.get('is_rx', True) else "TX"
        display_text = f"{timestamp} {direction} {hex(message_data['can_id'])}"
        
        if decoded_info:
            display_text += f" - {decoded_info['message_name']}"
        
        return display_text
    
    def process_message_batch(self):
        """Process a batch of messages at once with circuit breaker protection"""
        if not self.circuit_breaker.check():
            return  # Circuit breaker is open
            
        if not self.pending_messages:
            return
            
        try:
            # Process up to max_pending_messages at once
            batch = self.pending_messages[:self.max_pending_messages]
            self.pending_messages = self.pending_messages[self.max_pending_messages:]
            
            self.message_count += len(batch)
            
            # Update timestamps for rate calculation
            current_time = time.time()
            self.message_timestamps.append(current_time)
            
            # Keep only recent timestamps (last 5 seconds)
            self.message_timestamps = [ts for ts in self.message_timestamps if current_time - ts < 5]
            
            # Sample messages for display (only show 1 in 10 to reduce load)
            display_messages = batch[::10]
            
            for message_data in display_messages:
                self._process_single_message_for_display(message_data)
                
            # Log all messages to database in background
            self._log_messages_async(batch)  # This will now work
            
            self.last_bulk_update = current_time
            self.circuit_breaker.record_success()  # Successfully processed batch
            
        except Exception as e:
            self.circuit_breaker.record_error()
            logging.error(f"Error processing message batch: {e}")
            self.pending_messages = []  # Clear on error
    
    def _log_messages_async(self, messages):
        """Log multiple messages to database in background thread with error handling"""
        import threading
        
        def log_messages():
            # Skip if database logging is disabled
            if hasattr(self, '_database_logging_disabled'):
                return
                
            successful_logs = 0
            for i, message_data in enumerate(messages):
                try:
                    # Add missing fields if necessary
                    if 'dlc' not in message_data:
                        message_data['dlc'] = len(message_data.get('data', b''))
                    if 'is_rx' not in message_data:
                        message_data['is_rx'] = True
                        
                    self.data_logger.log_message(message_data)
                    successful_logs += 1
                    
                except Exception as e:
                    # Log first error only to avoid spam
                    if i == 0:
                        logging.error(f"Batch logging error: {e}")
                    break  # Stop batch on first error to avoid spam
            
            if successful_logs > 0:
                # Reset error count on partial success
                if hasattr(self, '_database_error_count'):
                    self._database_error_count = 0
        
        thread = threading.Thread(target=log_messages, daemon=True)
        thread.start()
    
    def _process_single_message_for_display(self, message_data):
        """Process single message for display only - thread-safe"""
        try:
            timestamp = message_data['timestamp'].strftime("%H:%M:%S.%f")[:-3]
            direction = "RX" if message_data.get('is_rx', True) else "TX"
            
            # Create the display text first
            raw_line = f"{timestamp} {direction} ID: {hex(message_data['can_id'])} Data: {message_data['data'].hex()}"
            display_text = f"{timestamp} {direction} {hex(message_data['can_id'])}"
            
            # Use Qt's signal mechanism to update GUI from main thread
            self._safe_update_display.emit(raw_line, display_text)
            
        except Exception as e:
            logging.error(f"Error preparing message for display: {e}")
    
    def on_message_received(self, message_data):
        """Handle incoming CAN messages with circuit breaker protection"""
        # Check circuit breaker first
        if not self.circuit_breaker.check():
            return  # Circuit breaker is open - drop messages temporarily
        
        try:
            # Validate and complete message data
            if not isinstance(message_data, dict):
                logging.warning(f"Invalid message format: {type(message_data)}")
                return
                
            # Ensure all required fields are present
            required_fields = ['timestamp', 'can_id', 'data']
            for field in required_fields:
                if field not in message_data:
                    logging.error(f"Missing required field '{field}' in message data")
                    return
            
            # Add missing dlc field if not present
            if 'dlc' not in message_data:
                message_data['dlc'] = len(message_data['data'])  # DLC is usually the data length
            
            # Add is_rx field if not present
            if 'is_rx' not in message_data:
                message_data['is_rx'] = True  # Assume received messages
                
            # Add timestamp if missing or invalid
            if not isinstance(message_data['timestamp'], datetime):
                message_data['timestamp'] = datetime.now()
                
            # Validate data type
            if not isinstance(message_data['data'], (bytes, bytearray)):
                if isinstance(message_data['data'], list):
                    message_data['data'] = bytes(message_data['data'])
                else:
                    logging.error(f"Invalid data type: {type(message_data['data'])}")
                    return
            
            # Add to queue for thread-safe processing
            try:
                self.message_queue.put(message_data, timeout=0.001)
                self.circuit_breaker.record_success()  # Successfully queued
                
            except queue.Full:
                # Queue is full - this is expected under high load
                self.circuit_breaker.record_error()
                logging.warning("Message queue full - dropping message")
                
        except Exception as e:
            self.circuit_breaker.record_error()
            logging.error(f"Critical error in message reception: {e}")
        
    def check_for_dtcs(self, message_data):
        """Check if message contains DTC information"""
        # Simple DTC detection - this would be enhanced based on specific protocol
        data_hex = message_data['data'].hex().upper()
        
        # Look for common DTC patterns in data
        for i in range(0, len(data_hex)-5, 2):
            possible_dtc = data_hex[i:i+6]  # Typical 3-byte DTC format
            
            dtc_info = self.cdd_parser.get_dtc_info(possible_dtc)
            if dtc_info:
                self.dtc_count += 1
                self.dtc_count_label.setText(f"DTCs: {self.dtc_count}")
                
                dtc_line = f"{message_data['timestamp']} DTC: {dtc_info['code']} - {dtc_info['name']}"
                self.dtc_text.append(dtc_line)
                
                # Log DTC
                dtc_data = {
                    'timestamp': message_data['timestamp'],
                    'dtc_code': dtc_info['code'],
                    'dtc_name': dtc_info['name'],
                    'description': dtc_info.get('description', ''),
                    'severity': dtc_info.get('severity', '')
                }
                self.data_logger.log_dtc(dtc_data)
                
    def on_error_occurred(self, error_message):
        self.status_label.setText(f"Error: {error_message}")
        QMessageBox.warning(self, "CAN Error", error_message)
        
    def update_indicators(self):
        """Update the status indicators with circuit breaker info"""
        current_time = time.time()
        
        # Calculate message rate
        self.message_timestamps = [ts for ts in self.message_timestamps if current_time - ts < 2]
        message_rate = len(self.message_timestamps) / 2.0
        
        # Update traffic light with circuit breaker status
        if self.circuit_breaker.is_open:
            self.traffic_light.setText("🔴")  # Red - circuit breaker open
            self.traffic_light.setToolTip(f"Circuit breaker open - {int(self.circuit_breaker.timeout - (current_time - self.circuit_breaker.last_error_time))}s remaining")
        elif message_rate > 10:
            self.traffic_light.setText("🟢")  # Green - high activity
        elif message_rate > 0:
            self.traffic_light.setText("🟡")  # Yellow - low activity
        else:
            self.traffic_light.setText("⚪")  # White - no activity
        
        # Update message rate
        self.message_rate_label.setText(f"{message_rate:.1f} msg/s")
        
        # Update channel status
        if hasattr(self, 'current_channel') and hasattr(self, 'current_bitrate'):
            status = f"Channel: {self.current_channel} ({self.current_bitrate} bps)"
            if self.circuit_breaker.is_open:
                status += " - ⚠️ CIRCUIT BREAKER OPEN"
            self.channel_activity_label.setText(status)
        
        # Update statistics
        self.update_statistics()
    
    def clear_log(self):
        self.raw_text.clear()
        self.decoded_text.clear()
        self.dtc_text.clear()
        self.message_list.clear()
        self.message_count = 0
        self.dtc_count = 0
        self.message_count_label.setText("Messages: 0")
        self.dtc_count_label.setText("DTCs: 0")
        
    def export_report(self):
        filename, _ = QFileDialog.getSaveFileName(
            self, "Export Report", 
            f"can_report_{datetime.now().strftime('%Y%m%d_%H%M%S')}.csv",
            "CSV Files (*.csv);;HTML Files (*.html)"
        )
        
        if filename:
            # Simple implementation - would generate comprehensive report
            with open(filename, 'w') as f:
                f.write("CAN Bus Analysis Report\n")
                f.write(f"Generated: {datetime.now()}\n")
                f.write(f"Total Messages: {self.message_count}\n")
                f.write(f"Total DTCs: {self.dtc_count}\n")
                
            QMessageBox.information(self, "Success", f"Report exported to {filename}")