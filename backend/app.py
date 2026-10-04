import tensorflow as tf
import numpy as np
from PIL import Image
from fastapi import FastAPI, File, UploadFile
from fastapi.middleware.cors import CORSMiddleware
import io


# ============================================================
# CREATE FASTAPI APPLICATION
# ============================================================

app = FastAPI(
    title="AgroDisease AI API",
    description="AI-powered tomato leaf condition detection and agrochemical recommendation API",
    version="1.0"
)


# ============================================================
# ENABLE CORS
# ============================================================

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


# ============================================================
# MODEL CONFIGURATION
# ============================================================

MODEL_PATH = "model/tomato_leaf_model.keras"

IMG_SIZE = (224, 224)

CLASS_NAMES = [
    "dried_leaves",
    "healthy_leaves",
    "leaves_with_stains",
    "leaves_yellow_stains"
]


# ============================================================
# LOAD TRAINED MODEL
# ============================================================

model = tf.keras.models.load_model(MODEL_PATH)


# ============================================================
# HOME ENDPOINT
# ============================================================

@app.get("/")
def home():
    return {
        "message": "AgroDisease AI API is running",
        "model": "EfficientNetB0",
        "classes": CLASS_NAMES
    }


# ============================================================
# HEALTH CHECK ENDPOINT
# ============================================================

@app.get("/health")
def health():
    return {
        "status": "healthy",
        "model_loaded": True
    }


# ============================================================
# IMAGE PREDICTION ENDPOINT
# ============================================================

@app.post("/predict")
async def predict(file: UploadFile = File(...)):

    # --------------------------------------------------------
    # Read uploaded image
    # --------------------------------------------------------

    image_data = await file.read()

    # --------------------------------------------------------
    # Convert image to RGB
    # --------------------------------------------------------

    image = Image.open(
        io.BytesIO(image_data)
    ).convert("RGB")

    # --------------------------------------------------------
    # Resize image
    # --------------------------------------------------------

    image = image.resize(IMG_SIZE)

    # --------------------------------------------------------
    # Convert image to NumPy array
    # --------------------------------------------------------

    image_array = np.array(image)

    # --------------------------------------------------------
    # Add batch dimension
    # --------------------------------------------------------

    image_array = np.expand_dims(
        image_array,
        axis=0
    )

    # --------------------------------------------------------
    # Run model prediction
    # --------------------------------------------------------

    predictions = model.predict(
        image_array,
        verbose=0
    )[0]

    # --------------------------------------------------------
    # Find class with highest probability
    # --------------------------------------------------------

    predicted_index = int(
        np.argmax(predictions)
    )

    predicted_class = CLASS_NAMES[
        predicted_index
    ]

    # --------------------------------------------------------
    # Get confidence
    # --------------------------------------------------------

    confidence = float(
        predictions[predicted_index]
    )

    # --------------------------------------------------------
    # Store probabilities for all classes
    # --------------------------------------------------------

    probabilities = {
        class_name: float(probability)
        for class_name, probability in zip(
            CLASS_NAMES,
            predictions
        )
    }

    # --------------------------------------------------------
    # Return prediction result
    # --------------------------------------------------------

    return {
        "condition": predicted_class,
        "confidence": round(
            confidence * 100,
            2
        ),
        "probabilities": probabilities
    }


# ============================================================
# AGROCHEMICAL RECOMMENDATION ENDPOINT
# ============================================================

@app.post("/recommend")
async def recommend(data: dict):

    # --------------------------------------------------------
    # Get crop and detected condition
    # --------------------------------------------------------

    crop = data.get("crop", "")
    condition = data.get("disease", "")

    # --------------------------------------------------------
    # Remove unnecessary spaces
    # --------------------------------------------------------

    crop = crop.strip()
    condition = condition.strip().lower()

    # --------------------------------------------------------
    # Current model is trained for tomato leaves
    # --------------------------------------------------------

    if crop.lower() != "tomato":

        return {
            "crop": crop,
            "disease": condition,
            "treatment": "No recommendation available",
            "agrochemical": "—",
            "active_ingredient": "—",
            "reason": (
                "The current AI model is trained for "
                "tomato leaf conditions."
            ),
            "precautions": (
                "Do not apply agrochemicals without "
                "verifying the condition and product label."
            ),
            "crop_care": (
                "Consult local agricultural guidance "
                "for further diagnosis."
            )
        }


    # ========================================================
    # RECOMMENDATION KNOWLEDGE BASE
    # ========================================================

    recommendations = {

        # ----------------------------------------------------
        # HEALTHY LEAVES
        # ----------------------------------------------------

        "healthy_leaves": {

            "treatment":
                "No agrochemical treatment required",

            "agrochemical":
                "None",

            "active_ingredient":
                "None",

            "reason":
                "The AI model classified the uploaded "
                "tomato leaf as healthy.",

            "precautions":
                "Do not apply agrochemicals unnecessarily. "
                "Continue regular crop monitoring.",

            "crop_care":
                "Maintain proper irrigation, balanced "
                "nutrition, field sanitation, and regular "
                "monitoring."
        },


        # ----------------------------------------------------
        # DRIED LEAVES
        # ----------------------------------------------------

        "dried_leaves": {

            "treatment":
                "Plant-stress management and cause assessment",

            "agrochemical":
                "No specific agrochemical recommended",

            "active_ingredient":
                "Not applicable",

            "reason":
                "The AI detected visual characteristics "
                "associated with dried tomato leaves. "
                "Leaf drying can result from water stress, "
                "environmental stress, nutrient imbalance, "
                "pests, or disease. Therefore, a specific "
                "agrochemical cannot be selected from the "
                "image classification alone.",

            "precautions":
                "Do not apply pesticides solely because "
                "the leaves appear dried. First identify "
                "the underlying cause and follow the product "
                "label and local agricultural guidance if "
                "chemical treatment is required.",

            "crop_care":
                "Check soil moisture, irrigation, drainage, "
                "plant nutrition, environmental conditions, "
                "pest activity, and progression of symptoms. "
                "Remove severely damaged leaves where "
                "appropriate."
        },


        # ----------------------------------------------------
        # LEAVES WITH STAINS
        # ----------------------------------------------------

        "leaves_with_stains": {

            "treatment":
                "Fungicide treatment after disease confirmation",

            "agrochemical":
                "Mancozeb",

            "active_ingredient":
                "Mancozeb",

            "reason":
                "The AI detected visible staining on the "
                "tomato leaf. If the confirmed diagnosis is "
                "a fungal leaf-spot disease such as early "
                "blight, mancozeb is an established tomato "
                "disease-management option referenced in "
                "agricultural guidance.",

            "precautions":
                "The current AI model detects leaf staining "
                "but does not confirm the exact disease. "
                "Use mancozeb only when the underlying "
                "disease is confirmed and the product is "
                "registered and labelled for the intended "
                "tomato use. Follow the product label and "
                "local agricultural guidance.",

            "crop_care":
                "Remove severely affected plant material "
                "where appropriate, maintain good field "
                "sanitation, avoid prolonged leaf wetness, "
                "and monitor newly developing leaves."
        },


        # ----------------------------------------------------
        # YELLOW LEAF STAINS
        # ----------------------------------------------------

        "leaves_yellow_stains": {

            "treatment":
                "Nutrient, environmental, and disease "
                "assessment required",

            "agrochemical":
                "No specific agrochemical recommended",

            "active_ingredient":
                "Not applicable",

            "reason":
                "The AI detected yellow staining on the "
                "tomato leaf. Yellowing can be associated "
                "with nutritional problems, water or "
                "environmental stress, pests, or disease. "
                "Therefore, the underlying cause should "
                "be identified before selecting an "
                "agrochemical.",

            "precautions":
                "Do not apply pesticides solely because "
                "yellowing was detected. Identify the "
                "underlying cause before chemical treatment "
                "and follow the product label and local "
                "agricultural guidance.",

            "crop_care":
                "Check soil moisture, drainage, plant "
                "nutrition, irrigation, environmental "
                "conditions, pest activity, and progression "
                "of symptoms."
        }
    }


    # ========================================================
    # FIND RECOMMENDATION
    # ========================================================

    recommendation = recommendations.get(
        condition
    )


    # ========================================================
    # IF CONDITION IS NOT SUPPORTED
    # ========================================================

    if recommendation is None:

        return {
            "crop": crop,
            "disease": condition,
            "treatment": "No recommendation available",
            "agrochemical": "—",
            "active_ingredient": "—",
            "reason": (
                "The detected condition is not currently "
                "supported by the recommendation "
                "knowledge base."
            ),
            "precautions": (
                "Verify the condition before applying "
                "any agrochemical."
            ),
            "crop_care": (
                "Consult appropriate agricultural "
                "guidance."
            )
        }


    # ========================================================
    # RETURN RECOMMENDATION
    # ========================================================

    return {
        "crop": crop,
        "disease": condition,
        **recommendation
    }