import React, { useState, useRef, useEffect } from 'react';
import { Camera, RotateCcw, Check, X, AlertCircle } from 'lucide-react';

const CameraCapture = ({ onCapture }) => {
  const [isStreaming, setIsStreaming] = useState(false);
  const [capturedImage, setCapturedImage] = useState(null);
  const [error, setError] = useState(null);
  const [facingMode, setFacingMode] = useState('environment'); // 'user' for front, 'environment' for back
  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const streamRef = useRef(null);

  useEffect(() => {
    return () => {
      // Cleanup: stop stream when component unmounts
      stopStream();
    };
  }, []);

  const startCamera = async () => {
    try {
      setError(null);
      
      const constraints = {
        video: {
          facingMode: facingMode,
          width: { ideal: 1280 },
          height: { ideal: 720 }
        }
      };

      const stream = await navigator.mediaDevices.getUserMedia(constraints);
      streamRef.current = stream;
      
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        videoRef.current.play();
        setIsStreaming(true);
      }
    } catch (err) {
      console.error('Camera access error:', err);
      setError('Unable to access camera. Please ensure you have granted camera permissions.');
    }
  };

  const stopStream = () => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(track => track.stop());
      streamRef.current = null;
    }
    setIsStreaming(false);
  };

  const switchCamera = async () => {
    stopStream();
    setFacingMode(facingMode === 'user' ? 'environment' : 'user');
    // Start camera with new facing mode
    setTimeout(startCamera, 100);
  };

  const capturePhoto = () => {
    if (!videoRef.current || !canvasRef.current) return;

    const video = videoRef.current;
    const canvas = canvasRef.current;
    const context = canvas.getContext('2d');

    // Set canvas dimensions to match video
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;

    // Draw video frame to canvas
    context.drawImage(video, 0, 0, canvas.width, canvas.height);

    // Convert canvas to blob and data URL
    canvas.toBlob((blob) => {
      if (blob) {
        // Create a File object from blob
        const file = new File([blob], `horse-teeth-${Date.now()}.jpg`, {
          type: 'image/jpeg'
        });

        // Get data URL for preview
        const dataURL = canvas.toDataURL('image/jpeg', 0.8);
        setCapturedImage({ file, dataURL });
        
        // Stop camera stream
        stopStream();
      }
    }, 'image/jpeg', 0.8);
  };

  const retakePhoto = () => {
    setCapturedImage(null);
    startCamera();
  };

  const confirmCapture = async () => {
    if (!capturedImage) return;

    try {
      await onCapture(capturedImage.file, capturedImage.dataURL);
    } catch (error) {
      setError(error.message || 'Failed to process captured image');
    }
  };

  const discardCapture = () => {
    setCapturedImage(null);
    startCamera();
  };

  return (
    <div className="max-w-2xl mx-auto">
      <div className="card">
        <h2 className="text-2xl font-bold text-gray-900 mb-6 text-center">
          Capture Horse Teeth Photo
        </h2>

        {/* Instructions */}
        <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-lg">
          <h3 className="text-sm font-medium text-green-900 mb-2">Camera Tips:</h3>
          <ul className="text-sm text-green-800 space-y-1">
            <li>• Hold your device steady</li>
            <li>• Position camera directly in front of horse's teeth</li>
            <li>• Ensure good lighting</li>
            <li>• Get close enough to see teeth details clearly</li>
          </ul>
        </div>

        {/* Error Message */}
        {error && (
          <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg flex items-center">
            <AlertCircle className="w-5 h-5 text-red-600 mr-2" />
            <span className="text-red-700 text-sm">{error}</span>
          </div>
        )}

        {/* Camera Area */}
        <div className="relative bg-black rounded-lg overflow-hidden" style={{ aspectRatio: '16/9' }}>
          {/* Video Stream */}
          {isStreaming && (
            <video
              ref={videoRef}
              className="w-full h-full object-cover"
              autoPlay
              playsInline
              muted
            />
          )}

          {/* Captured Image Preview */}
          {capturedImage && (
            <img
              src={capturedImage.dataURL}
              alt="Captured horse teeth"
              className="w-full h-full object-cover"
            />
          )}

          {/* No Stream State */}
          {!isStreaming && !capturedImage && (
            <div className="w-full h-full flex items-center justify-center">
              <div className="text-center text-white">
                <Camera className="w-16 h-16 mx-auto mb-4 opacity-50" />
                <p className="text-lg mb-4">Camera Ready</p>
                <button
                  onClick={startCamera}
                  className="btn-primary"
                >
                  <Camera className="w-4 h-4 mr-2" />
                  Start Camera
                </button>
              </div>
            </div>
          )}

          {/* Camera Controls Overlay */}
          {isStreaming && (
            <div className="absolute bottom-4 left-0 right-0">
              <div className="flex justify-center items-center space-x-4">
                {/* Switch Camera Button */}
                <button
                  onClick={switchCamera}
                  className="bg-black bg-opacity-50 hover:bg-opacity-70 text-white p-3 rounded-full transition-all"
                >
                  <RotateCcw className="w-5 h-5" />
                </button>

                {/* Capture Button */}
                <button
                  onClick={capturePhoto}
                  className="bg-white hover:bg-gray-100 text-gray-900 w-16 h-16 rounded-full flex items-center justify-center border-4 border-gray-300 transition-all shadow-lg"
                >
                  <div className="w-8 h-8 bg-gray-900 rounded-full"></div>
                </button>

                {/* Placeholder for symmetry */}
                <div className="w-12 h-12"></div>
              </div>
            </div>
          )}

          {/* Captured Image Controls */}
          {capturedImage && (
            <div className="absolute bottom-4 left-0 right-0">
              <div className="flex justify-center items-center space-x-4">
                {/* Discard Button */}
                <button
                  onClick={discardCapture}
                  className="bg-red-500 hover:bg-red-600 text-white p-3 rounded-full transition-all"
                >
                  <X className="w-5 h-5" />
                </button>

                {/* Retake Button */}
                <button
                  onClick={retakePhoto}
                  className="bg-gray-500 hover:bg-gray-600 text-white px-4 py-2 rounded-full transition-all"
                >
                  <RotateCcw className="w-4 h-4 mr-2" />
                  Retake
                </button>

                {/* Confirm Button */}
                <button
                  onClick={confirmCapture}
                  className="bg-green-500 hover:bg-green-600 text-white p-3 rounded-full transition-all"
                >
                  <Check className="w-5 h-5" />
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Hidden Canvas for Image Capture */}
        <canvas
          ref={canvasRef}
          className="hidden"
        />

        {/* Camera Info */}
        <div className="mt-4 text-center">
          {isStreaming && (
            <p className="text-sm text-gray-600">
              Camera active • {facingMode === 'user' ? 'Front' : 'Back'} camera
            </p>
          )}
          {capturedImage && (
            <p className="text-sm text-gray-600">
              Photo captured • Tap ✓ to analyze or ↻ to retake
            </p>
          )}
        </div>
      </div>
    </div>
  );
};

export default CameraCapture;