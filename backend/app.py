import tensorflow as tf
import numpy as np
from PIL import Image
from fastapi import FastAPI, File, UploadFile
from fastapi.middleware.cors import CORSMiddleware
import io


# Create FastAPI application
app = FastAPI(
    title="AgroDisease AI API",
    description="AI-powered tomato leaf condition detection API",
    version="1.0"
)


# Enable CORS so the Lovable frontend can communicate
# with the FastAPI backend.
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


# Model configuration
MODEL_PATH = "model/tomato_leaf_model.keras"
IMG_SIZE = (224, 224)

CLASS_NAMES = [
    "dried_leaves",
    "healthy_leaves",
    "leaves_with_stains",
    "leaves_yellow_stains"
]


# Load the trained model once when the API starts
model = tf.keras.models.load_model(MODEL_PATH)


# Home endpoint
@app.get("/")
def home():
    return {
        "message": "AgroDisease AI API is running",
        "model": "EfficientNetB0",
        "classes": CLASS_NAMES
    }


# Health-check endpoint
@app.get("/health")
def health():
    return {
        "status": "healthy",
        "model_loaded": True
    }


# Prediction endpoint
@app.post("/predict")
async def predict(file: UploadFile = File(...)):

    # Read uploaded image
    image_data = await file.read()

    # Convert uploaded image to RGB
    image = Image.open(
        io.BytesIO(image_data)
    ).convert("RGB")

    # Resize image to model input size
    image = image.resize(IMG_SIZE)

    # Convert image to NumPy array
    image_array = np.array(image)

    # Add batch dimension
    image_array = np.expand_dims(
        image_array,
        axis=0
    )

    # Run model prediction
    predictions = model.predict(
        image_array,
        verbose=0
    )[0]

    # Find class with highest probability
    predicted_index = int(
        np.argmax(predictions)
    )

    predicted_class = CLASS_NAMES[
        predicted_index
    ]

    confidence = float(
        predictions[predicted_index]
    )

    # Store probabilities for all classes
    probabilities = {
        class_name: float(probability)
        for class_name, probability in zip(
            CLASS_NAMES,
            predictions
        )
    }

    # Return prediction result
    return {
        "condition": predicted_class,
        "confidence": round(
            confidence * 100,
            2
        ),
        "probabilities": probabilities
    }