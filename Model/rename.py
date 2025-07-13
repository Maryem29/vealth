import cv2
import os

folder = r'C:/Users/79163/Model/data/Bad'
count = 1

# Ensure the folder exists
if not os.path.exists(folder):
    print(f"Error: Folder '{folder}' does not exist!")
    exit()

# List only image files (optional, improves safety)
image_extensions = ('.jpg', '.jpeg', '.png', '.bmp')

for file_name in os.listdir(folder):
    # Skip non-image files (optional)
    if not file_name.lower().endswith(image_extensions):
        continue

    source = os.path.join(folder, file_name)
    destination = os.path.join(folder, f"{count}.jpg")

    # Print in the required format
    print(f'Bad/{count}.jpg')  # For OpenCV annotations?
    
    # Rename the file
    try:
        os.rename(source, destination)
        count += 1
    except Exception as e:
        print(f"Error renaming {file_name}: {e}")

# Verify the result
res = os.listdir(folder)
print("Files after renaming:", res)