#!/usr/bin/env python3
import sys
import os
import logging

# Add current directory to path
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))

def setup_logging():
    logging.basicConfig(
        level=logging.INFO,
        format='%(asctime)s - %(name)s - %(levelname)s - %(message)s',
        handlers=[
            logging.FileHandler('can_analyzer.log'),
            logging.StreamHandler(sys.stdout)
        ]
    )

def main():
    setup_logging()
    
    # Import directly without going through gui/__init__.py
    try:
        from gui.main_window import MainWindow
    except ImportError as e:
        print(f"Error importing MainWindow: {e}")
        return
    
    from PyQt5.QtWidgets import QApplication
    
    app = QApplication(sys.argv)
    
    window = MainWindow()
    window.show()
    
    sys.exit(app.exec_())

if __name__ == '__main__':
    main()