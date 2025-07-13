import cv2

# Initialize video capture
cap = cv2.VideoCapture('D:/video_2025-07-08_22-39-55.mp4')
if not cap.isOpened():
    print("Error: Could not open video file.")
    exit()

iter = 1

while True:
    success, img = cap.read()
    
    # Exit loop if video ends
    if not success:
        print("Video ended or frame could not be read.")
        break
    
    # Convert to grayscale
    gray = cv2.cvtColor(img, cv2.COLOR_BGR2GRAY)
    
    # Crop and resize
    gray = gray[150:650, 100:600]
    gray = cv2.resize(gray, (364, 500))
    
    # Save original and flipped versions
    cv2.imwrite('data/Good/' + str(iter) + '.jpg', gray)
    iter += 1
    
    fl = cv2.flip(gray, 1)
    cv2.imwrite('data/Good/' + str(iter) + '.jpg', fl)
    iter += 1
    
    # Display frame (optional)
    cv2.imshow('Frame', gray)
    if cv2.waitKey(1) & 0xFF == ord('q'):
        break

# Release resources
cap.release()
cv2.destroyAllWindows()