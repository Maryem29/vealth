import os
import re  # Required for extracting numbers from filenames

folder = r'C:/Users/79163/Model/data/Good'
output_file = r'C:/Users/79163/Model/Good.dat'

# Get all image files
image_files = [f for f in os.listdir(folder) if f.lower().endswith(('.jpg', '.jpeg', '.png', '.bmp'))]

# Sort files numerically (1.jpg before 10.jpg)
image_files.sort(key=lambda x: int(re.search(r'\d+', x).group()) if re.search(r'\d+', x) else 0)

# Write annotations to file
with open(output_file, 'w') as f:
    for file_name in image_files:
        f.write(f"Good/{file_name} 1 0 0 364 500\n")

print(f"✅ Annotations saved to {output_file}")
print(f"ℹ Total {len(image_files)} images processed")