import cv2

# Load classifier and image
teeth_cascade = cv2.CascadeClassifier('C:/Users/79163/Model/data/result/cascade.xml')
img = cv2.imread('C:/Users/79163/Model/foto/veterinarian-examining-horse-teeth-on-farm-closeup.jpg')

if img is None:
    print("Error: Image not loaded. Check the file path.")
    exit()

# Convert to grayscale and enhance contrast
gray = cv2.cvtColor(img, cv2.COLOR_BGR2GRAY)
gray = cv2.equalizeHist(gray)  # Improves detection

# Detect teeth (try different parameters)
teeth = teeth_cascade.detectMultiScale(
    gray,
    scaleFactor=1.01,  # Try 1.01–1.3
    minNeighbors=5,    # Try 1–5
    minSize=(10, 10),  # Minimum tooth size
    maxSize=(450, 450) # Maximum tooth size
)

print(f"Detected {len(teeth)} teeth")

# Draw rectangles if teeth are found
if len(teeth) > 0:
    for (x, y, w, h) in teeth:
        cv2.rectangle(img, (x, y), (x + w, y + h), (0, 255, 0), 2)  # Green rectangles
else:
    print("No teeth detected. Adjust parameters or check the classifier.")

# Save and display
cv2.imwrite("teeth_detection_result.jpg", img)
cv2.imshow('Teeth Detection', img)
cv2.waitKey(0)
cv2.destroyAllWindows()