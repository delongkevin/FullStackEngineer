"""
GUI modules for CAN Analyzer application
"""

# Use try-except to handle import errors gracefully
try:
    from .dialogs import SettingsDialog, AboutDialog, ConnectionDialog
    from .main_window import MainWindow
except ImportError as e:
    print(f"Import error in gui/__init__.py: {e}")
    # Fallback to absolute imports if relative imports fail
    from gui.dialogs import SettingsDialog, AboutDialog, ConnectionDialog
    from gui.main_window import MainWindow

__all__ = ['MainWindow', 'SettingsDialog', 'AboutDialog', 'ConnectionDialog']