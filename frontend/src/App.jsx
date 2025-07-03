import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import { Camera, Upload, History, Settings, Heart } from 'lucide-react';

// Import components
import Header from './components/Header.jsx';
import CameraCapture from './components/CameraCapture.jsx';
import ImageUpload from './components/ImageUpload.jsx';
import AnalysisResults from './components/AnalysisResults.jsx';
import ReportDownload from './components/ReportDownload.jsx';
import LoadingSpinner from './components/LoadingSpinner.jsx';
import HowItWorks from './components/HowItWorks.jsx';
import About from './components/About.jsx';
import Contact from './components/Contact.jsx';

// Import services
import { generateSessionId, getSessionId } from './utils/session';
import apiService from './services/api';

// Main App Component
function AppContent() {
  const location = useLocation();
  const isHomePage = location.pathname === '/';
  
  // State management
  const [currentStep, setCurrentStep] = useState('upload');
  const [sessionId, setSessionId] = useState(null);
  const [uploadedImage, setUploadedImage] = useState(null);
  const [analysisResult, setAnalysisResult] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [useCamera, setUseCamera] = useState(false);

  // Initialize session on app load
  useEffect(() => {
    const initSession = () => {
      try {
        let existingSessionId = getSessionId();
        if (!existingSessionId) {
          existingSessionId = generateSessionId();
        }
        setSessionId(existingSessionId);
        console.log('Session initialized:', existingSessionId);
      } catch (error) {
        console.error('Session initialization error:', error);
        const fallbackSessionId = 'session_' + Date.now();
        setSessionId(fallbackSessionId);
      }
    };

    initSession();
  }, []);

  // Reset to upload step when navigating to home
  useEffect(() => {
    if (isHomePage) {
      setCurrentStep('upload');
      setError(null);
    }
  }, [isHomePage]);

  // Handle image upload/capture
  const handleImageUpload = async (imageFile, imageData) => {
    console.log('Upload started:', imageFile.name);
    setIsLoading(true);
    setError(null);
    
    try {
      // Mock upload response for testing
      const mockUploadResponse = {
        success: true,
        uploadId: Date.now(),
        file: {
          id: Date.now(),
          filename: imageFile.name,
          originalname: imageFile.name,
          size: imageFile.size,
          url: imageData,
          uploadedAt: new Date().toISOString()
        }
      };

      setUploadedImage({
        ...mockUploadResponse.file,
        preview: imageData,
        uploadId: mockUploadResponse.uploadId
      });
      setCurrentStep('analyzing');
      
      // Start analysis after a short delay
      setTimeout(() => {
        handleAnalyzeImage(mockUploadResponse.uploadId);
      }, 2000);
      
    } catch (error) {
      console.error('Upload error:', error);
      setError(error.message || 'Failed to upload image');
      setIsLoading(false);
    }
  };

  // Handle image analysis
  const handleAnalyzeImage = async (uploadId) => {
    console.log('Analysis started for upload:', uploadId);
    setIsLoading(true);
    
    try {
      // Mock analysis result
      const mockAnalysisResult = {
        success: true,
        result: {
          analysisId: uploadId,
          estimatedAge: '8-10 years',
          confidence: 0.85,
          confidencePercentage: '85%',
          category: 'adult',
          observations: [
            'Permanent central incisors show moderate wear',
            'Dental stars visible on central incisors',
            'Corner incisors show early Galvayne\'s groove development'
          ],
          healthNotes: [
            'Even wear pattern observed',
            'No obvious abnormalities detected',
            'Recommend routine dental check-up'
          ],
          healthStatus: 'normal',
          analysisMethod: 'Deep Learning Dental Pattern Recognition',
          modelVersion: 'v2.1.3',
          timestamp: new Date().toISOString(),
          disclaimer: 'This analysis provides an estimation based on visible dental characteristics. For definitive age determination and dental health assessment, consult with a qualified equine veterinarian.'
        }
      };
      
      setAnalysisResult(mockAnalysisResult.result);
      setCurrentStep('results');
      
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
    
    console.log('Report generation started');
    setCurrentStep('report');
  };

  // Reset to start new analysis
  const handleStartNew = () => {
    console.log('Starting new analysis');
    setCurrentStep('upload');
    setUploadedImage(null);
    setAnalysisResult(null);
    setError(null);
    setUseCamera(false);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      <main className="container mx-auto px-4 py-8 max-w-4xl">
        <Routes>
          {/* Home Page - Main Analysis Tool */}
          <Route path="/" element={
            <>
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
                  <div className={`flex items-center ${currentStep === 'upload' ? 'text-teal-600' : currentStep === 'analyzing' || currentStep === 'results' || currentStep === 'report' ? 'text-green-600' : 'text-gray-400'}`}>
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center ${currentStep === 'upload' ? 'bg-teal-100 border-2 border-teal-600' : currentStep === 'analyzing' || currentStep === 'results' || currentStep === 'report' ? 'bg-green-100 border-2 border-green-600' : 'bg-gray-100 border-2 border-gray-300'}`}>
                      <Upload className="w-4 h-4" />
                    </div>
                    <span className="ml-2 text-sm font-medium">Upload</span>
                  </div>
                  
                  <div className={`w-8 h-0.5 ${currentStep === 'analyzing' || currentStep === 'results' || currentStep === 'report' ? 'bg-green-600' : 'bg-gray-300'}`}></div>
                  
                  <div className={`flex items-center ${currentStep === 'analyzing' ? 'text-teal-600' : currentStep === 'results' || currentStep === 'report' ? 'text-green-600' : 'text-gray-400'}`}>
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center ${currentStep === 'analyzing' ? 'bg-teal-100 border-2 border-teal-600' : currentStep === 'results' || currentStep === 'report' ? 'bg-green-100 border-2 border-green-600' : 'bg-gray-100 border-2 border-gray-300'}`}>
                      <Heart className="w-4 h-4" />
                    </div>
                    <span className="ml-2 text-sm font-medium">Analyze</span>
                  </div>
                  
                  <div className={`w-8 h-0.5 ${currentStep === 'results' || currentStep === 'report' ? 'bg-green-600' : 'bg-gray-300'}`}></div>
                  
                  <div className={`flex items-center ${currentStep === 'results' ? 'text-teal-600' : currentStep === 'report' ? 'text-green-600' : 'text-gray-400'}`}>
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center ${currentStep === 'results' ? 'bg-teal-100 border-2 border-teal-600' : currentStep === 'report' ? 'bg-green-100 border-2 border-green-600' : 'bg-gray-100 border-2 border-gray-300'}`}>
                      <Settings className="w-4 h-4" />
                    </div>
                    <span className="ml-2 text-sm font-medium">Results</span>
                  </div>
                </div>
              </div>

              {/* Main Content */}
              {currentStep === 'upload' && (
                <div className="space-y-6">
                  {/* Toggle Camera/Upload */}
                  <div className="flex justify-center">
                    <div className="bg-white rounded-lg p-1 shadow-sm border">
                      <button
                        onClick={() => setUseCamera(false)}
                        className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${!useCamera ? 'bg-teal-600 text-white' : 'text-gray-700 hover:bg-gray-100'}`}
                      >
                        Upload Photo
                      </button>
                      <button
                        onClick={() => setUseCamera(true)}
                        className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${useCamera ? 'bg-teal-600 text-white' : 'text-gray-700 hover:bg-gray-100'}`}
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

              {/* Loading Overlay */}
              {isLoading && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                  <div className="bg-white rounded-lg p-6 shadow-xl">
                    <LoadingSpinner />
                    <p className="mt-4 text-gray-600">Processing...</p>
                  </div>
                </div>
              )}
            </>
          } />

          {/* How It Works Page */}
          <Route path="/how-it-works" element={<HowItWorks />} />

          {/* About Page */}
          <Route path="/about" element={<About />} />

          {/* Contact Page */}
          <Route path="/contact" element={<Contact />} />
        </Routes>
      </main>
    </div>
  );
}

// Main App wrapper with Router
function App() {
  return (
    <Router>
      <AppContent />
    </Router>
  );
}

export default App;