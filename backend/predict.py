import tensorflow as tf
from PIL import Image
import numpy as np
import sys

# -----------------------------
# Model and image settings
# -----------------------------
MODEL_PATH = "model/tomato_leaf_model.keras"
IMG_SIZE = (224, 224)

# These must match the training dataset class order
CLASS_NAMES = [
    "dried_leaves",
    "healthy_leaves",
    "leaves_with_stains",
    "leaves_yellow_stains"
]

# -----------------------------
# Load trained model
# -----------------------------
model = tf.keras.models.load_model(MODEL_PATH)


# -----------------------------
# Prediction function
# -----------------------------
def predict_image(image_path):

    image = Image.open(image_path).convert("RGB")
    image = image.resize(IMG_SIZE)

    image_array = np.array(image)
    image_array = np.expand_dims(image_array, axis=0)

    predictions = model.predict(image_array, verbose=0)

    predicted_index = np.argmax(predictions[0])
    confidence = float(predictions[0][predicted_index])

    predicted_class = CLASS_NAMES[predicted_index]

    print("\nPrediction Results")
    print("------------------")
    print("Condition:", predicted_class)
    print("Confidence:", f"{confidence * 100:.2f}%")

    print("\nAll class probabilities:")
    for class_name, probability in zip(CLASS_NAMES, predictions[0]):
        print(f"{class_name}: {probability * 100:.2f}%")


# -----------------------------
# Get image path
# -----------------------------
if len(sys.argv) < 2:
    print("Please provide an image path.")
    print("Example:")
    print("python predict.py path/to/leaf.jpg")
    sys.exit()

image_path = sys.argv[1]

predict_image(image_path)