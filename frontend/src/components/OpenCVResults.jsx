import React, { useState } from 'react';
import { 
  Eye, 
  Zap, 
  TrendingUp, 
  Camera, 
  Settings, 
  Info,
  ChevronDown,
  ChevronUp,
  Image as ImageIcon,
  Cpu,
  BarChart3,
  Layers
} from 'lucide-react';

const OpenCVResults = ({ computerVision, enhancedFindings }) => {
  const [showTechnicalDetails, setShowTechnicalDetails] = useState(false);
  const [selectedProcessedImage, setSelectedProcessedImage] = useState('enhanced');

  if (!computerVision) {
    return null;
  }

  const getQualityColor = (score) => {
    if (score >= 80) return 'text-green-600 bg-green-50 border-green-200';
    if (score >= 60) return 'text-yellow-600 bg-yellow-50 border-yellow-200';
    return 'text-red-600 bg-red-50 border-red-200';
  };

  const getQualityIcon = (score) => {
    if (score >= 80) return '🟢';
    if (score >= 60) return '🟡';
    return '🔴';
  };

  const getFeatureColor = (level) => {
    switch (level) {
      case 'high': return 'text-green-600 bg-green-50';
      case 'medium': return 'text-yellow-600 bg-yellow-50';
      case 'low': return 'text-red-600 bg-red-50';
      default: return 'text-gray-600 bg-gray-50';
    }
  };

  const processedImageOptions = [
    { 
      key: 'enhanced', 
      label: 'Enhanced Image', 
      icon: <Zap className="w-4 h-4" />,
      description: 'CLAHE contrast enhancement for improved visibility'
    },
    { 
      key: 'edges', 
      label: 'Edge Detection', 
      icon: <TrendingUp className="w-4 h-4" />,
      description: 'Canny edge detection highlighting tooth boundaries'
    },
    { 
      key: 'contours', 
      label: 'Tooth Contours', 
      icon: <Eye className="w-4 h-4" />,
      description: 'Automated detection of individual tooth structures'
    }
  ];

  return (
    <div className="bg-gradient-to-r from-blue-50 to-purple-50 border border-blue-200 rounded-lg p-6 mt-6">
      {/* Header */}
      <div className="flex items-center mb-6">
        <div className="w-12 h-12 bg-gradient-to-r from-blue-600 to-purple-600 rounded-full flex items-center justify-center mr-4">
          <Camera className="w-7 h-7 text-white" />
        </div>
        <div>
          <h3 className="text-2xl font-bold text-gray-900">Computer Vision Analysis</h3>
          <p className="text-sm text-gray-600">Advanced image processing with OpenCV</p>
        </div>
      </div>

      {/* Enhanced Findings */}
      {enhancedFindings && enhancedFindings.length > 0 && (
        <div className="mb-6 p-4 bg-white rounded-lg border border-blue-200 shadow-sm">
          <h4 className="font-semibold text-gray-900 mb-3 flex items-center">
            <Info className="w-5 h-5 mr-2 text-blue-600" />
            AI + Computer Vision Insights
          </h4>
          <div className="grid gap-3">
            {enhancedFindings.map((finding, index) => (
              <div key={index} className="flex items-start space-x-3 p-3 bg-gradient-to-r from-blue-50 to-purple-50 rounded-lg">
                <div className="text-xl mt-0.5 flex-shrink-0">
                  {finding.includes('🎯') ? '🎯' : 
                   finding.includes('✅') ? '✅' : 
                   finding.includes('⚠️') ? '⚠️' : 
                   finding.includes('🦷') ? '🦷' :
                   finding.includes('📸') ? '📸' :
                   finding.includes('🔧') ? '🔧' : '🔍'}
                </div>
                <span className="text-sm text-gray-700 font-medium">
                  {finding.replace(/[🎯✅⚠️🔍🦷📸🔧]/g, '').trim()}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Key Metrics Dashboard */}
      <div className="grid md:grid-cols-3 gap-6 mb-6">
        {/* Image Quality Score */}
        <div className={`p-6 rounded-lg border shadow-sm ${getQualityColor(computerVision.imageQuality.qualityScore)}`}>
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center">
              <BarChart3 className="w-5 h-5 mr-2" />
              <span className="text-sm font-semibold">Image Quality</span>
            </div>
            <span className="text-3xl">{getQualityIcon(computerVision.imageQuality.qualityScore)}</span>
          </div>
          <div className="text-3xl font-bold mb-1">{computerVision.imageQuality.qualityScore}/100</div>
          <div className="text-xs opacity-80 capitalize">
            {computerVision.imageQuality.blurLevel.replace('_', ' ')} quality
          </div>
          <div className="mt-2 w-full bg-white bg-opacity-50 rounded-full h-2">
            <div 
              className="bg-current h-2 rounded-full transition-all duration-1000"
              style={{ width: `${computerVision.imageQuality.qualityScore}%` }}
            ></div>
          </div>
        </div>

        {/* Contrast Analysis */}
        <div className="p-6 bg-white rounded-lg border border-gray-200 shadow-sm">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center">
              <Layers className="w-5 h-5 mr-2 text-purple-600" />
              <span className="text-sm font-semibold text-gray-700">Contrast Analysis</span>
            </div>
            <TrendingUp className="w-6 h-6 text-purple-600" />
          </div>
          <div className="text-3xl font-bold text-gray-900 mb-1">
            {typeof computerVision.contrastAnalysis.contrast === 'number' 
              ? computerVision.contrastAnalysis.contrast.toFixed(2)
              : computerVision.contrastAnalysis.contrast}
          </div>
          <div className="text-xs text-gray-600">
            Brightness: {computerVision.contrastAnalysis.brightness}
          </div>
          <div className="text-xs text-gray-500 mt-1">
            Std Dev: {computerVision.contrastAnalysis.stdDev}
          </div>
        </div>

        {/* Feature Detection */}
        <div className={`p-6 rounded-lg border shadow-sm ${getFeatureColor(computerVision.processingMetrics.detectedFeatures)}`}>
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center">
              <Cpu className="w-5 h-5 mr-2" />
              <span className="text-sm font-semibold">Feature Detection</span>
            </div>
            <Eye className="w-6 h-6" />
          </div>
          <div className="text-3xl font-bold mb-1 capitalize">
            {computerVision.processingMetrics.detectedFeatures}
          </div>
          <div className="text-xs opacity-80">
            Edge Ratio: {(computerVision.processingMetrics.edgeRatio * 100).toFixed(2)}%
          </div>
          <div className="text-xs opacity-70 mt-1">
            {computerVision.processingMetrics.edgePixelCount?.toLocaleString()} edge pixels
          </div>
        </div>
      </div>

      {/* Processed Images Section */}
      <div className="mb-6">
        <h4 className="text-xl font-semibold text-gray-900 mb-4 flex items-center">
          <ImageIcon className="w-5 h-5 mr-2" />
          Computer Vision Processing Results
        </h4>
        
        {/* Image Type Selector */}
        <div className="flex flex-wrap gap-2 mb-4">
          {processedImageOptions.map((option) => (
            <button
              key={option.key}
              onClick={() => setSelectedProcessedImage(option.key)}
              className={`flex items-center px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                selectedProcessedImage === option.key
                  ? 'bg-blue-600 text-white shadow-md transform scale-105'
                  : 'bg-white text-gray-700 hover:bg-gray-100 border border-gray-300 hover:border-blue-300'
              }`}
            >
              {option.icon}
              <span className="ml-2">{option.label}</span>
            </button>
          ))}
        </div>

        {/* Display Selected Processed Image */}
        <div className="bg-white rounded-lg border border-gray-200 shadow-sm overflow-hidden">
          {computerVision.processedImages && computerVision.processedImages[selectedProcessedImage] ? (
            <div>
              <img
                src={computerVision.processedImages[selectedProcessedImage]}
                alt={`${selectedProcessedImage} processed image`}
                className="w-full max-h-96 object-contain bg-gray-50"
                onError={(e) => {
                  // Fallback for missing processed images
                  e.target.style.display = 'none';
                  e.target.nextSibling.style.display = 'flex';
                }}
              />
              {/* Fallback placeholder */}
              <div className="w-full h-96 bg-gray-100 items-center justify-center hidden">
                <div className="text-center text-gray-500">
                  <ImageIcon className="w-16 h-16 mx-auto mb-2 opacity-50" />
                  <p className="text-sm">Processed image preview</p>
                  <p className="text-xs">{selectedProcessedImage} analysis</p>
                </div>
              </div>
              
              {/* Image Description */}
              <div className="p-4 bg-gray-50 border-t">
                <div className="flex items-start space-x-3">
                  {processedImageOptions.find(opt => opt.key === selectedProcessedImage)?.icon}
                  <div>
                    <h5 className="font-medium text-gray-900">
                      {processedImageOptions.find(opt => opt.key === selectedProcessedImage)?.label}
                    </h5>
                    <p className="text-sm text-gray-600 mt-1">
                      {processedImageOptions.find(opt => opt.key === selectedProcessedImage)?.description}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          ) : (
            /* Placeholder when no processed image available */
            <div className="w-full h-96 bg-gray-100 flex items-center justify-center">
              <div className="text-center text-gray-500">
                <ImageIcon className="w-16 h-16 mx-auto mb-2 opacity-50" />
                <p className="text-sm font-medium">Processing Complete</p>
                <p className="text-xs">{selectedProcessedImage} analysis performed</p>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Computer Vision Findings */}
      <div className="mb-6 p-5 bg-white rounded-lg border border-gray-200 shadow-sm">
        <h4 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
          <Settings className="w-5 h-5 mr-2 text-blue-600" />
          Computer Vision Findings
        </h4>
        <div className="grid gap-3">
          {computerVision.findings.map((finding, index) => (
            <div key={index} className="flex items-start space-x-3 p-3 rounded-lg border border-gray-100 hover:border-blue-200 transition-colors">
              <div className="text-lg mt-0.5 flex-shrink-0">
                {finding.includes('✅') ? '✅' : 
                 finding.includes('⚠️') ? '⚠️' : 
                 finding.includes('❌') ? '❌' : '🔍'}
              </div>
              <span className="text-sm text-gray-700">
                {finding.replace(/[✅⚠️❌🔍]/g, '').trim()}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Technical Details (Expandable) */}
      <div className="bg-white rounded-lg border border-gray-200 shadow-sm">
        <button
          onClick={() => setShowTechnicalDetails(!showTechnicalDetails)}
          className="w-full p-4 flex items-center justify-between text-left hover:bg-gray-50 transition-colors"
        >
          <div className="flex items-center">
            <Cpu className="w-5 h-5 mr-2 text-gray-600" />
            <span className="font-semibold text-gray-900">Technical Processing Details</span>
          </div>
          {showTechnicalDetails ? (
            <ChevronUp className="w-5 h-5 text-gray-500" />
          ) : (
            <ChevronDown className="w-5 h-5 text-gray-500" />
          )}
        </button>
        
        {showTechnicalDetails && (
          <div className="p-4 border-t border-gray-200 bg-gray-50">
            <div className="grid md:grid-cols-2 gap-6">
              {/* Image Processing Metrics */}
              <div>
                <h5 className="font-medium text-gray-900 mb-3">Processing Metrics</h5>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Edge Pixel Count:</span>
                    <span className="font-mono">
                      {computerVision.processingMetrics.edgePixelCount?.toLocaleString() || 'N/A'}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Edge Ratio:</span>
                    <span className="font-mono">
                      {(computerVision.processingMetrics.edgeRatio * 100).toFixed(4)}%
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Feature Level:</span>
                    <span className="font-mono capitalize">
                      {computerVision.processingMetrics.detectedFeatures}
                    </span>
                  </div>
                </div>
              </div>

              {/* Image Quality Metrics */}
              <div>
                <h5 className="font-medium text-gray-900 mb-3">Quality Assessment</h5>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Quality Score:</span>
                    <span className="font-mono">{computerVision.imageQuality.qualityScore}/100</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Blur Level:</span>
                    <span className="font-mono capitalize">
                      {computerVision.imageQuality.blurLevel.replace('_', ' ')}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Brightness:</span>
                    <span className="font-mono">{computerVision.contrastAnalysis.brightness}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Contrast:</span>
                    <span className="font-mono">
                      {typeof computerVision.contrastAnalysis.contrast === 'number' 
                        ? computerVision.contrastAnalysis.contrast.toFixed(3)
                        : computerVision.contrastAnalysis.contrast}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Recommendation */}
            <div className="mt-4 p-3 bg-blue-50 border border-blue-200 rounded-lg">
              <p className="text-sm text-blue-800">
                <strong>Recommendation:</strong> {computerVision.imageQuality.recommendation}
              </p>
            </div>

            {/* Original Dimensions (if available) */}
            {computerVision.originalDimensions && (
              <div className="mt-4 text-xs text-gray-500">
                <p>Original image dimensions: {computerVision.originalDimensions.width} × {computerVision.originalDimensions.height} pixels</p>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Technology Badge */}
      <div className="mt-4 text-center">
        <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-gradient-to-r from-blue-100 to-purple-100 text-blue-800 border border-blue-200">
          <Cpu className="w-3 h-3 mr-1" />
          Powered by OpenCV Computer Vision
        </span>
      </div>
    </div>
  );
};

export default OpenCVResults;