import React, { useState, useRef } from 'react';
import { Upload, Image as ImageIcon, X, AlertCircle } from 'lucide-react';

const ImageUpload = ({ onUpload }) => {
  const [dragActive, setDragActive] = useState(false);
  const [selectedImage, setSelectedImage] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [uploadError, setUploadError] = useState(null);
  const fileInputRef = useRef(null);

  // Example photos data using your actual photos
  const examplePhotos = [
    {
      id: 1,
      title: "Young Horse (3-5 years)",
      description: "Clear view of front teeth with minimal wear",
      imageUrl: "/horse1.jpeg"
    },
    {
      id: 2,
      title: "Adult Horse (8-12 years)",
      description: "Moderate wear with visible dental patterns",
      imageUrl: "/horse2.jpeg"
    },
    {
      id: 3,
      title: "Senior Horse (15+ years)",
      description: "Advanced wear with clear age indicators",
      imageUrl: "/horse3.jpeg"
    }
  ];

  // Accepted file types
  const acceptedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];
  const maxFileSize = 10 * 1024 * 1024; // 10MB

  const validateFile = (file) => {
    if (!acceptedTypes.includes(file.type)) {
      return 'Please upload a valid image file (JPEG, PNG, or WebP)';
    }
    if (file.size > maxFileSize) {
      return 'File size must be less than 10MB';
    }
    return null;
  };

  const handleFileSelect = (file) => {
    const error = validateFile(file);
    if (error) {
      setUploadError(error);
      return;
    }

    setUploadError(null);
    setSelectedImage(file);

    // Create preview
    const reader = new FileReader();
    reader.onload = (e) => {
      setImagePreview(e.target.result);
    };
    reader.readAsDataURL(file);
  };

  const handleDrag = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);

    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFileSelect(e.dataTransfer.files[0]);
    }
  };

  const handleFileInputChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      handleFileSelect(e.target.files[0]);
    }
  };

  const clearSelection = () => {
    setSelectedImage(null);
    setImagePreview(null);
    setUploadError(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleUpload = async () => {
    if (!selectedImage) return;

    try {
      await onUpload(selectedImage, imagePreview);
    } catch (error) {
      setUploadError(error.message || 'Upload failed');
    }
  };

  return (
    <div className="max-w-2xl mx-auto">
      <div className="card">
        <h2 className="text-2xl font-bold text-gray-900 mb-6 text-center">
          Upload Horse Teeth Photo
        </h2>

        {/* Upload Instructions */}
        <div className="mb-6 p-4 bg-teal-50 border border-teal-200 rounded-lg">
          <h3 className="text-sm font-medium text-teal-900 mb-2">For Best Results:</h3>
          <ul className="text-sm text-teal-800 space-y-1">
            <li>• Take a clear, well-lit photo of the horse's front teeth (incisors)</li>
            <li>• Ensure the teeth are visible and in focus</li>
            <li>• Avoid shadows or overexposed areas</li>
            <li>• Photo should be taken from directly in front of the teeth</li>
          </ul>
        </div>

        {/* Error Message */}
        {uploadError && (
          <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg flex items-center">
            <AlertCircle className="w-5 h-5 text-red-600 mr-2" />
            <span className="text-red-700 text-sm">{uploadError}</span>
          </div>
        )}

        {/* Image Preview */}
        {imagePreview ? (
          <div className="mb-6">
            <div className="relative bg-gray-100 rounded-lg p-4">
              <button
                onClick={clearSelection}
                className="absolute top-2 right-2 bg-red-500 hover:bg-red-600 text-white rounded-full p-1 transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
              <img
                src={imagePreview}
                alt="Selected horse teeth"
                className="w-full max-h-96 object-contain rounded-md"
              />
              <div className="mt-3 text-sm text-gray-600">
                <p className="font-medium">{selectedImage.name}</p>
                <p>Size: {(selectedImage.size / 1024 / 1024).toFixed(2)} MB</p>
              </div>
            </div>

            {/* Upload Button */}
            <div className="mt-4 flex justify-center">
              <button
                onClick={handleUpload}
                className="bg-teal-600 hover:bg-teal-700 text-white font-semibold px-8 py-3 rounded-lg transition-colors duration-200 flex items-center"
              >
                <Upload className="w-5 h-5 mr-2" />
                Analyze This Image
              </button>
            </div>
          </div>
        ) : (
          /* Upload Area */
          <div
            className={`relative border-2 border-dashed rounded-lg p-8 text-center transition-colors ${
              dragActive
                ? 'border-teal-500 bg-teal-50'
                : 'border-gray-300 hover:border-gray-400'
            }`}
            onDragEnter={handleDrag}
            onDragLeave={handleDrag}
            onDragOver={handleDrag}
            onDrop={handleDrop}
          >
            <input
              ref={fileInputRef}
              type="file"
              className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
              accept="image/*"
              onChange={handleFileInputChange}
            />

            <div className="flex flex-col items-center space-y-4">
              <div className={`w-16 h-16 rounded-full flex items-center justify-center ${
                dragActive ? 'bg-teal-100' : 'bg-gray-100'
              }`}>
                <ImageIcon className={`w-8 h-8 ${
                  dragActive ? 'text-teal-600' : 'text-gray-400'
                }`} />
              </div>

              <div>
                <p className={`text-lg font-medium ${
                  dragActive ? 'text-teal-700' : 'text-gray-900'
                }`}>
                  {dragActive ? 'Drop your image here' : 'Choose a photo or drag it here'}
                </p>
                <p className="text-sm text-gray-500 mt-1">
                  Supports JPEG, PNG, WebP up to 10MB
                </p>
              </div>

              <button
                type="button"
                className="bg-teal-600 hover:bg-teal-700 text-white font-medium py-2 px-4 rounded-lg transition-colors duration-200"
                onClick={() => fileInputRef.current?.click()}
              >
                <Upload className="w-4 h-4 mr-2 inline" />
                Select Photo
              </button>
            </div>
          </div>
        )}

        {/* Sample Images */}
        <div className="mt-6 border-t pt-6">
          <h3 className="text-sm font-medium text-gray-900 mb-3">Example Photos:</h3>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {examplePhotos.map((photo) => (
              <div key={photo.id} className="bg-gray-50 rounded-lg p-3 text-center hover:bg-gray-100 transition-colors">
                <img
                  src={photo.imageUrl}
                  alt={photo.title}
                  className="w-full h-20 object-cover rounded mb-2"
                  onError={(e) => {
                    // Fallback if image doesn't load
                    e.target.style.display = 'none';
                    e.target.nextSibling.style.display = 'flex';
                  }}
                />
                <div className="w-full h-20 bg-gray-200 rounded mb-2 items-center justify-center hidden">
                  <ImageIcon className="w-8 h-8 text-gray-400" />
                </div>
                <p className="text-xs font-medium text-gray-700">{photo.title}</p>
                <p className="text-xs text-gray-500 mt-1">{photo.description}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ImageUpload;