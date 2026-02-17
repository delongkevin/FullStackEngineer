# Object Detection with Distance Estimation

A real-time object detection application using OpenCV that can detect objects from a camera feed and estimate their distance from the camera.

## 🎯 Features

- 📹 **Real-time Detection** - Process live camera feed
- 📏 **Distance Estimation** - Calculate approximate distance to detected objects
- 💾 **Image Capture** - Save detected objects with timestamps
- 🎨 **Visual Feedback** - Color-coded bounding boxes
- ⚡ **Haar Cascade Classifier** - Fast object detection

## 🛠 Tech Stack

- **Computer Vision**: OpenCV (cv2)
- **Numerical Computing**: NumPy
- **Object Detection**: Haar Cascade Classifiers
- **Language**: Python 3

## 📦 Installation

### Prerequisites
- Python 3.7 or higher
- Webcam or camera device
- pip package manager

### Setup
```bash
# Install dependencies
pip install opencv-python numpy

# Alternative: Install with contrib modules for additional features
pip install opencv-contrib-python numpy
```

## 🚀 Running the Application

```bash
python object_detection.py
```

### Controls
- Press **'q'** to quit the application
- Detected objects are automatically saved to `detected_objects_with_distance/`

## 🔧 Configuration

Edit the configuration variables at the top of `object_detection.py`:

```python
# Known object width in inches (for distance calculation)
KNOWN_OBJECT_WIDTH_INCHES = 2.0

# Focal length of your camera in pixels
# This should be calibrated for your specific camera
FOCAL_LENGTH_PIXELS = 700

# Directory to save detected images
SAVE_DIR = "detected_objects_with_distance"
```

### Camera Calibration

For accurate distance estimation, you need to calibrate the focal length:

1. Place an object of known width at a known distance
2. Measure the width in pixels from the detection
3. Calculate: `FOCAL_LENGTH = (perceived_width_pixels * known_distance) / known_width`
4. Update `FOCAL_LENGTH_PIXELS` in the configuration

## 📊 How It Works

### Object Detection
The application uses Haar Cascade Classifiers to detect objects (by default, faces):
- Pre-trained classifier: `haarcascade_frontalface_default.xml`
- Can be swapped for other classifiers (full body, cars, etc.)

### Distance Estimation
Distance is calculated using the pinhole camera model:

```
Distance = (Known_Width × Focal_Length) / Perceived_Width_in_Pixels
```

Where:
- **Known_Width**: Actual size of the object (inches/cm)
- **Focal_Length**: Camera's focal length in pixels
- **Perceived_Width**: Width of object in the camera frame (pixels)

## 📁 Project Structure

```
ObjectDetection/
├── object_detection.py                    # Main application
└── detected_objects_with_distance/        # Saved detections (auto-created)
    └── detected_YYYYMMDD_HHMMSS.jpg      # Timestamped captures
```

## 🎨 Features in Detail

### Real-time Detection
- Processes video frames in real-time
- Multiple object tracking with color-coded boxes
- FPS displayed on screen (if implemented)

### Distance Calculation
- Estimates distance for each detected object
- Displays distance overlay on video
- Results saved with each captured image

### Image Saving
- Automatic capture of detected objects
- Timestamp-based file naming
- Organized output directory

## 🔄 Customization

### Using Different Classifiers

Replace the classifier with other Haar cascades:

```python
# Full body detection
object_detector = cv2.CascadeClassifier(
    cv2.data.haarcascades + 'haarcascade_fullbody.xml'
)

# Car detection
object_detector = cv2.CascadeClassifier(
    cv2.data.haarcascades + 'haarcascade_car.xml'
)
```

### Adjusting Detection Parameters

Modify detection sensitivity in the code:

```python
objects = object_detector.detectMultiScale(
    gray,
    scaleFactor=1.1,    # Adjust for detection speed vs accuracy
    minNeighbors=5,     # Higher = fewer false positives
    minSize=(30, 30)    # Minimum object size
)
```

## 📈 Use Cases

- **Automotive**: Distance warning systems
- **Security**: Perimeter monitoring with distance alerts
- **Robotics**: Object avoidance and navigation
- **Manufacturing**: Quality control and measurements
- **Research**: Computer vision experiments

## ⚠️ Limitations

- Accuracy depends on camera calibration
- Works best with objects of known size
- Haar cascades have limitations compared to modern deep learning
- Lighting conditions affect detection quality

## 🚀 Future Enhancements

- [ ] Add deep learning models (YOLO, SSD)
- [ ] Support for multiple object types
- [ ] GUI interface for configuration
- [ ] Real-time statistics and graphs
- [ ] Video recording capability
- [ ] Multi-camera support

## 🐛 Troubleshooting

### Camera Not Opening
- Check camera permissions
- Ensure no other application is using the camera
- Try different camera index: `cv2.VideoCapture(1)`

### Poor Detection
- Adjust lighting conditions
- Calibrate focal length for your camera
- Try different classifier parameters
- Ensure objects are clearly visible

### Distance Inaccuracy
- Recalibrate focal length
- Verify known object width is correct
- Check camera lens distortion

## 📝 Requirements

- opencv-python >= 4.5.0
- numpy >= 1.19.0

## 📄 License

MIT License - Kevin Douglas Delong

## 🤝 Compatible With

- USB webcams
- Laptop built-in cameras
- IP cameras (with appropriate VideoCapture configuration)
- Raspberry Pi camera modules
