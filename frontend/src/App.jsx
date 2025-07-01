import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Camera, Upload, History, Settings, Heart } from 'lucide-react';

// Import components (we'll create these next)
import Header from './components/Header';
import CameraCapture from './components/CameraCapture';
import ImageUpload from './components/ImageUpload';
import AnalysisResults from './components/AnalysisResults';
import ReportDownload from './components/ReportDownload';
import LoadingSpinner from './components/LoadingSpinner';

// Import services
import { generateSessionId, getSessionId } from './utils/session';
import api from './services/api';

function App() {
  // State management
  const [currentStep, setCurrentStep] = useState('upload'); // upload, analyzing, results, report
  const [sessionId, setSessionId] = useState(null);
  const [uploadedImage, setUploadedImage] = useState(null);
  const [analysisResult, setAnalysisResult] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [useCamera, setUseCamera] = useState(false);

  // Initialize session on app load
  useEffect(() => {
    const initSession = () => {
      let existingSessionId = getSessionId();
      if (!existingSessionId) {
        existingSessionId = generateSessionId();
      }
      setSessionId(existingSessionId);
      
      // Set session ID in API headers
      api.defaults.headers['x-session-id'] = existingSessionId;
    };

    initSession();
  }, []);

  // Handle image upload/capture
  const handleImageUpload = async (imageFile, imageData) => {
    setIsLoading(true);
    setError(null);
    
    try {
      // Upload image to backend
      const uploadResponse = await api.uploadImage(imageFile, sessionId);
      
      if (uploadResponse.success) {
        setUploadedImage({
          ...uploadResponse.file,
          preview: imageData, // For displaying the image
          uploadId: uploadResponse.uploadId
        });
        setCurrentStep('analyzing');
        
        // Start analysis
        await handleAnalyzeImage(uploadResponse.uploadId);
      }
    } catch (error) {
      console.error('Upload error:', error);
      setError(error.message || 'Failed to upload image');
    } finally {
      setIsLoading(false);
    }
  };

  // Handle image analysis
  const handleAnalyzeImage = async (uploadId) => {
    setIsLoading(true);
    
    try {
      const analysisResponse = await api.analyzeImage(uploadId, sessionId);
      
      if (analysisResponse.success) {
        setAnalysisResult(analysisResponse.result);
        setCurrentStep('results');
      }
    } catch (error) {
      console.error('Analysis error:', error);
      setError(error.message || 'Failed to analyze image');
      setCurrentStep('upload');
    } finally {
      setIsLoading(false);
    }
  };

  // Handle PDF report generation
  const handleGenerateReport = async () => {
    if (!analysisResult) return;
    
    setIsLoading(true);
    
    try {
      const reportResponse = await api.generateReport(analysisResult.analysisId, sessionId);
      
      if (reportResponse.success) {
        setCurrentStep('report');
      }
    } catch (error) {
      console.error('Report generation error:', error);
      setError(error.message || 'Failed to generate report');
    } finally {
      setIsLoading(false);
    }
  };

  // Reset to start new analysis
  const handleStartNew = () => {
    setCurrentStep('upload');
    setUploadedImage(null);
    setAnalysisResult(null);
    setError(null);
    setUseCamera(false);
  };

  // Main render
  return (
    <Router>
      <div className="min-h-screen bg-gray-50">
        <Header />
        
        <main className="container mx-auto px-4 py-8 max-w-4xl">
          {/* Error Message */}
          {error && (
            <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
              <div className="flex">
                <div className="text-red-600">
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                  </svg>
                </div>
                <div className="ml-3">
                  <p className="text-sm text-red-700">{error}</p>
                </div>
                <div className="ml-auto">
                  <button
                    onClick={() => setError(null)}
                    className="text-red-400 hover:text-red-600"
                  >
                    <span className="sr-only">Dismiss</span>
                    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                    </svg>
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Progress Indicator */}
          <div className="mb-8">
            <div className="flex items-center justify-center space-x-4">
              {/* Step indicators */}
              <div className={`flex items-center ${currentStep === 'upload' ? 'text-primary-600' : currentStep === 'analyzing' || currentStep === 'results' || currentStep === 'report' ? 'text-green-600' : 'text-gray-400'}`}>
                <div className={`w-8 h-8 rounded-full flex items-center justify-center ${currentStep === 'upload' ? 'bg-primary-100 border-2 border-primary-600' : currentStep === 'analyzing' || currentStep === 'results' || currentStep === 'report' ? 'bg-green-100 border-2 border-green-600' : 'bg-gray-100 border-2 border-gray-300'}`}>
                  <Upload className="w-4 h-4" />
                </div>
                <span className="ml-2 text-sm font-medium">Upload</span>
              </div>
              
              <div className={`w-8 h-0.5 ${currentStep === 'analyzing' || currentStep === 'results' || currentStep === 'report' ? 'bg-green-600' : 'bg-gray-300'}`}></div>
              
              <div className={`flex items-center ${currentStep === 'analyzing' ? 'text-primary-600' : currentStep === 'results' || currentStep === 'report' ? 'text-green-600' : 'text-gray-400'}`}>
                <div className={`w-8 h-8 rounded-full flex items-center justify-center ${currentStep === 'analyzing' ? 'bg-primary-100 border-2 border-primary-600' : currentStep === 'results' || currentStep === 'report' ? 'bg-green-100 border-2 border-green-600' : 'bg-gray-100 border-2 border-gray-300'}`}>
                  <Heart className="w-4 h-4" />
                </div>
                <span className="ml-2 text-sm font-medium">Analyze</span>
              </div>
              
              <div className={`w-8 h-0.5 ${currentStep === 'results' || currentStep === 'report' ? 'bg-green-600' : 'bg-gray-300'}`}></div>
              
              <div className={`flex items-center ${currentStep === 'results' ? 'text-primary-600' : currentStep === 'report' ? 'text-green-600' : 'text-gray-400'}`}>
                <div className={`w-8 h-8 rounded-full flex items-center justify-center ${currentStep === 'results' ? 'bg-primary-100 border-2 border-primary-600' : currentStep === 'report' ? 'bg-green-100 border-2 border-green-600' : 'bg-gray-100 border-2 border-gray-300'}`}>
                  <Settings className="w-4 h-4" />
                </div>
                <span className="ml-2 text-sm font-medium">Results</span>
              </div>
            </div>
          </div>

          {/* Main Content */}
          <Routes>
            <Route path="/" element={
              <>
                {currentStep === 'upload' && (
                  <div className="space-y-6">
                    {/* Toggle Camera/Upload */}
                    <div className="flex justify-center">
                      <div className="bg-white rounded-lg p-1 shadow-sm border">
                        <button
                          onClick={() => setUseCamera(false)}
                          className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${!useCamera ? 'bg-primary-600 text-white' : 'text-gray-700 hover:bg-gray-100'}`}
                        >
                          Upload Photo
                        </button>
                        <button
                          onClick={() => setUseCamera(true)}
                          className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${useCamera ? 'bg-primary-600 text-white' : 'text-gray-700 hover:bg-gray-100'}`}
                        >
                          Take Photo
                        </button>
                      </div>
                    </div>

                    {/* Camera or Upload Component */}
                    {useCamera ? (
                      <CameraCapture onCapture={handleImageUpload} />
                    ) : (
                      <ImageUpload onUpload={handleImageUpload} />
                    )}
                  </div>
                )}

                {currentStep === 'analyzing' && (
                  <div className="text-center py-12">
                    <LoadingSpinner size="large" />
                    <h2 className="mt-4 text-xl font-semibold text-gray-900">Analyzing Horse Teeth</h2>
                    <p className="mt-2 text-gray-600">Our AI is examining the dental characteristics...</p>
                  </div>
                )}

                {currentStep === 'results' && analysisResult && (
                  <AnalysisResults 
                    result={analysisResult} 
                    uploadedImage={uploadedImage}
                    onGenerateReport={handleGenerateReport}
                    onStartNew={handleStartNew}
                  />
                )}

                {currentStep === 'report' && analysisResult && (
                  <ReportDownload 
                    analysisResult={analysisResult}
                    uploadedImage={uploadedImage}
                    sessionId={sessionId}
                    onStartNew={handleStartNew}
                  />
                )}
              </>
            } />
          </Routes>

          {/* Loading Overlay */}
          {isLoading && (
            <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
              <div className="bg-white rounded-lg p-6 shadow-xl">
                <LoadingSpinner />
                <p className="mt-4 text-gray-600">Processing...</p>
              </div>
            </div>
          )}
        </main>
      </div>
    </Router>
  );
}

export default App;
