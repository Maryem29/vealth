import cv2
import os

# Configuration
VIDEO_PATH = 'D:/video_2025-07-10_09-56-42.mp4'
OUTPUT_DIR = 'C:/Users/79163/Model/data/Good/'

def get_last_file_number(directory):
    """Get the highest numbered file in the directory"""
    max_num = 0
    for filename in os.listdir(directory):
        if filename.endswith('.jpg'):
            try:
                num = int(os.path.splitext(filename)[0])
                max_num = max(max_num, num)
            except ValueError:
                continue
    return max_num

def process_video():
    # Check if output directory exists
    if not os.path.exists(OUTPUT_DIR):
        os.makedirs(OUTPUT_DIR)
        print(f"Created output directory: {OUTPUT_DIR}")
    
    # Get starting iteration number
    start_iter = get_last_file_number(OUTPUT_DIR) + 1
    print(f"Starting numbering from: {start_iter}")
    
    cap = cv2.VideoCapture(VIDEO_PATH)
    if not cap.isOpened():
        print(f"Error: Could not open video: {VIDEO_PATH}")
        return

    iter = start_iter
    
    while True:
        success, img = cap.read()
        if not success:
            print(f"Video processing complete. Saved up to number {iter-1}")
            break
        
        try:
            # Process frame
            gray = cv2.cvtColor(img, cv2.COLOR_BGR2GRAY)
            gray = gray[150:650, 100:600]  # Crop
            gray = cv2.resize(gray, (364, 500))
            
            # Save original
            cv2.imwrite(f'{OUTPUT_DIR}{iter}.jpg', gray)
            
            # Save flipped version
            flipped = cv2.flip(gray, 1)
            cv2.imwrite(f'{OUTPUT_DIR}{iter+1}.jpg', flipped)
            
            iter += 2
            
            # Display progress every 10 frames
            if iter % 10 == 0:
                print(f"Processed up to frame {iter}...")
                
            # Display frame (optional)
            cv2.imshow('Processing... Press Q to quit', gray)
            if cv2.waitKey(1) & 0xFF == ord('q'):
                break
                
        except Exception as e:
            print(f"Error processing frame: {e}")
            continue

    cap.release()
    cv2.destroyAllWindows()
    print(f"Finished processing. Total new frames added: {(iter-start_iter)//2} pairs")

if __name__ == "__main__":
    process_video()