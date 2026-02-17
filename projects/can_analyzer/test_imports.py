import os
import sys

print("Current working directory:", os.getcwd())
print("Python path:")
for path in sys.path:
    print("  ", path)

print("\nFiles in gui directory:")
gui_path = os.path.join(os.getcwd(), 'gui')
if os.path.exists(gui_path):
    for file in os.listdir(gui_path):
        print("  ", file)
else:
    print("GUI directory not found!")

# Try to import
try:
    from gui.dialogs import SettingsDialog
    print("SUCCESS: dialogs.py imported successfully!")
except ImportError as e:
    print("ERROR importing dialogs:", e)