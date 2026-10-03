import tensorflow as tf
import numpy as np
from sklearn.metrics import classification_report, confusion_matrix

MODEL_PATH = "model/tomato_leaf_model.keras"
IMG_SIZE = (224, 224)
BATCH_SIZE = 16

model = tf.keras.models.load_model(MODEL_PATH)

test_dataset = tf.keras.utils.image_dataset_from_directory(
    "dataset/test",
    image_size=IMG_SIZE,
    batch_size=BATCH_SIZE,
    shuffle=False
)

class_names = test_dataset.class_names

print("\nClass names:")
print(class_names)

# Get actual labels
y_true = []
y_pred = []

for images, labels in test_dataset:
    predictions = model.predict(images, verbose=0)

    predicted_classes = np.argmax(predictions, axis=1)

    y_true.extend(labels.numpy())
    y_pred.extend(predicted_classes)

# Overall accuracy
accuracy = np.mean(np.array(y_true) == np.array(y_pred))

print("\n================================")
print("MODEL EVALUATION")
print("================================")

print(f"\nOverall Test Accuracy: {accuracy * 100:.2f}%")

# Classification report
print("\nClassification Report:")
print("--------------------------------")

print(
    classification_report(
        y_true,
        y_pred,
        target_names=class_names,
        digits=4
    )
)

# Confusion matrix
print("\nConfusion Matrix:")
print("--------------------------------")

cm = confusion_matrix(y_true, y_pred)

print(cm)

print("\nClass order:")
for i, class_name in enumerate(class_names):
    print(f"{i}: {class_name}")