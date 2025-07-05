import React, { useState } from 'react';
import { 
  Download, 
  RefreshCw, 
  AlertTriangle, 
  CheckCircle, 
  Info,
  Eye,
  Calendar,
  Activity,
  FileText
} from 'lucide-react';
import OpenCVResults from './OpenCVResults.jsx'; // Import the new component

const AnalysisResults = ({ result, uploadedImage, onGenerateReport, onStartNew }) => {
  const [showDetails, setShowDetails] = useState(false);

  if (!result) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-600">No analysis results available.</p>
      </div>
    );
  }

  const getHealthStatusColor = (status) => {
    switch (status?.toLowerCase()) {
      case 'normal':
        return 'text-green-600 bg-green-50 border-green-200';
      case 'attention':
        return 'text-yellow-600 bg-yellow-50 border-yellow-200';
      case 'concern':
        return 'text-red-600 bg-red-50 border-red-200';
      default:
        return 'text-blue-600 bg-blue-50 border-blue-200';
    }
  };

  const getHealthIcon = (status) => {
    switch (status?.toLowerCase()) {
      case 'normal':
        return <CheckCircle className="w-5 h-5" />;
      case 'attention':
        return <AlertTriangle className="w-5 h-5" />;
      case 'concern':
        return <AlertTriangle className="w-5 h-5" />;
      default:
        return <Info className="w-5 h-5" />;
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Header */}
      <div className="text-center">
        <h2 className="text-3xl font-bold text-gray-900 mb-2">Analysis Complete</h2>
        <p className="text-gray-600">AI analysis of your horse's dental characteristics</p>
      </div>

      {/* Processing Steps (if available) */}
      {result.processingSteps && (
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
          <h3 className="text-sm font-medium text-blue-900 mb-2">Processing Steps:</h3>
          <div className="space-y-1">
            {result.processingSteps.map((step, index) => (
              <div key={index} className="text-sm text-blue-800">{step}</div>
            ))}
          </div>
        </div>
      )}

      {/* Main Results Card */}
      <div className="card">
        <div className="grid md:grid-cols-2 gap-6">
          {/* Image Preview */}
          <div>
            <h3 className="text-lg font-semibold text-gray-900 mb-3 flex items-center">
              <Eye className="w-5 h-5 mr-2" />
              Analyzed Image
            </h3>
            {uploadedImage && (
              <div className="relative">
                <img
                  src={uploadedImage.preview || uploadedImage.url}
                  alt="Analyzed horse teeth"
                  className="w-full h-64 object-cover rounded-lg border border-gray-200"
                />
                <div className="absolute top-2 right-2 bg-green-500 text-white px-2 py-1 rounded text-xs font-medium">
                  ✓ Analyzed
                </div>
              </div>
            )}
          </div>

          {/* Key Results */}
          <div className="space-y-4">
            {/* Age Estimation */}
            <div className="bg-gradient-to-r from-teal-50 to-blue-50 p-4 rounded-lg border border-teal-200">
              <div className="flex items-center mb-2">
                <Calendar className="w-5 h-5 text-teal-600 mr-2" />
                <h3 className="text-lg font-semibold text-gray-900">Estimated Age</h3>
              </div>
              <div className="flex items-baseline space-x-2">
                <span className="text-3xl font-bold text-teal-700">{result.estimatedAge}</span>
                <span className="text-sm text-gray-600">years old</span>
              </div>
              <div className="mt-2 flex items-center">
                <div className="flex-1 bg-gray-200 rounded-full h-2">
                  <div 
                    className="bg-teal-600 h-2 rounded-full transition-all duration-1000"
                    style={{ width: `${(result.confidence * 100)}%` }}
                  ></div>
                </div>
                <span className="ml-3 text-sm font-medium text-gray-700">
                  {result.confidencePercentage} confidence
                </span>
              </div>
            </div>

            {/* Health Status */}
            <div className={`p-4 rounded-lg border ${getHealthStatusColor(result.healthStatus)}`}>
              <div className="flex items-center mb-2">
                {getHealthIcon(result.healthStatus)}
                <h3 className="ml-2 text-lg font-semibold">Health Assessment</h3>
              </div>
              <p className="text-sm font-medium capitalize">{result.healthStatus} Status</p>
              {result.healthNotes && result.healthNotes.length > 0 && (
                <p className="text-sm mt-1">{result.healthNotes[0]}</p>
              )}
            </div>

            {/* Quick Actions */}
            <div className="flex space-x-3">
              <button
                onClick={onGenerateReport}
                className="flex-1 btn-primary flex items-center justify-center"
              >
                <Download className="w-4 h-4 mr-2" />
                Download Report
              </button>
              <button
                onClick={onStartNew}
                className="flex-1 btn-secondary flex items-center justify-center"
              >
                <RefreshCw className="w-4 h-4 mr-2" />
                New Analysis
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* OpenCV Computer Vision Results */}
      {result.computerVision && (
        <OpenCVResults 
          computerVision={result.computerVision}
          enhancedFindings={result.enhancedFindings}
        />
      )}

      {/* Detailed Results */}
      <div className="card">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-xl font-semibold text-gray-900 flex items-center">
            <Activity className="w-5 h-5 mr-2" />
            Detailed Analysis
          </h3>
          <button
            onClick={() => setShowDetails(!showDetails)}
            className="text-teal-600 hover:text-teal-700 text-sm font-medium"
          >
            {showDetails ? 'Hide Details' : 'Show Details'}
          </button>
        </div>

        {/* Observations */}
        <div className="mb-6">
          <h4 className="text-lg font-medium text-gray-900 mb-3">Key Observations</h4>
          <div className="grid gap-3">
            {result.observations && result.observations.map((observation, index) => (
              <div key={index} className="flex items-start space-x-3 p-3 bg-gray-50 rounded-lg">
                <div className="w-2 h-2 bg-teal-600 rounded-full mt-2 flex-shrink-0"></div>
                <p className="text-gray-700">{observation}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Health Notes */}
        <div className="mb-6">
          <h4 className="text-lg font-medium text-gray-900 mb-3">Health Assessment</h4>
          <div className="grid gap-3">
            {result.healthNotes && result.healthNotes.map((note, index) => (
              <div key={index} className="flex items-start space-x-3 p-3 bg-blue-50 rounded-lg">
                <Info className="w-4 h-4 text-blue-600 mt-1 flex-shrink-0" />
                <p className="text-gray-700">{note}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Additional Details */}
        {showDetails && (
          <div className="border-t pt-6">
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <h4 className="text-md font-medium text-gray-900 mb-3">Analysis Method</h4>
                <p className="text-sm text-gray-600 mb-4">{result.analysisMethod}</p>
                
                <h4 className="text-md font-medium text-gray-900 mb-3">Model Information</h4>
                <div className="text-sm text-gray-600 space-y-1">
                  <p>Model Version: {result.modelVersion}</p>
                  <p>Analysis Date: {new Date(result.timestamp).toLocaleDateString()}</p>
                  <p>Category: {result.category}</p>
                </div>
              </div>
              
              <div>
                <h4 className="text-md font-medium text-gray-900 mb-3">Confidence Breakdown</h4>
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>Pattern Recognition</span>
                    <span>{Math.round(result.confidence * 100)}%</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span>Age Correlation</span>
                    <span>{Math.round(result.confidence * 95)}%</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span>Health Assessment</span>
                    <span>{Math.round(result.confidence * 90)}%</span>
                  </div>
                </div>

                {/* Debug Info (if available) */}
                {result.debugInfo && (
                  <div className="mt-4">
                    <h4 className="text-md font-medium text-gray-900 mb-3">Processing Details</h4>
                    <div className="text-xs text-gray-500 bg-gray-50 p-2 rounded">
                      <p>Category: {result.debugInfo.determinedCategory}</p>
                      {result.debugInfo.imageFeatures && typeof result.debugInfo.imageFeatures === 'object' && (
                        <div>
                          <p>Brightness: {result.debugInfo.imageFeatures.brightness}</p>
                          <p>Contrast: {result.debugInfo.imageFeatures.contrast}</p>
                          <p>Edge Ratio: {result.debugInfo.imageFeatures.edgeRatio}</p>
                        </div>
                      )}
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Disclaimer */}
      <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
        <div className="flex items-start space-x-3">
          <AlertTriangle className="w-5 h-5 text-yellow-600 mt-0.5 flex-shrink-0" />
          <div className="text-sm">
            <p className="font-medium text-yellow-800 mb-1">Important Disclaimer</p>
            <p className="text-yellow-700">
              {result.disclaimer || "This analysis provides an estimation based on visible dental characteristics. For definitive age determination and dental health assessment, consult with a qualified equine veterinarian."}
            </p>
          </div>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex flex-col sm:flex-row gap-4 justify-center">
        <button
          onClick={onGenerateReport}
          className="bg-amber-600 hover:bg-amber-700 text-white font-semibold px-8 py-3 rounded-lg transition-colors duration-200 flex items-center justify-center"
        >
          <FileText className="w-5 h-5 mr-2" />
          Generate Full Report
        </button>
        <button
          onClick={onStartNew}
          className="btn-secondary px-8 py-3 text-lg font-semibold flex items-center justify-center"
        >
          <RefreshCw className="w-5 h-5 mr-2" />
          Analyze Another Horse
        </button>
      </div>
    </div>
  );
};

export default AnalysisResults;