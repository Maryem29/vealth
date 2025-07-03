import React from 'react';
import { Camera, Brain, FileText, CheckCircle, Upload, Eye, Activity } from 'lucide-react';

const HowItWorks = () => {
  const steps = [
    {
      id: 1,
      icon: <Camera className="w-8 h-8" />,
      title: "Capture or Upload",
      description: "Take a clear photo of your horse's front teeth (incisors) using your smartphone or upload an existing image.",
      tips: ["Use good lighting", "Position camera directly in front", "Ensure teeth are clearly visible"]
    },
    {
      id: 2,
      icon: <Brain className="w-8 h-8" />,
      title: "AI Analysis",
      description: "Our advanced AI model analyzes dental characteristics including wear patterns, tooth shape, and developmental markers.",
      tips: ["Processes in real-time", "Analyzes multiple indicators", "Compares against extensive database"]
    },
    {
      id: 3,
      icon: <Activity className="w-8 h-8" />,
      title: "Results & Assessment",
      description: "Receive detailed age estimation with confidence score plus health observations and recommendations.",
      tips: ["Age range estimation", "Health status indicators", "Professional recommendations"]
    },
    {
      id: 4,
      icon: <FileText className="w-8 h-8" />,
      title: "Download Report",
      description: "Generate a comprehensive PDF report to share with your veterinarian or keep for your records.",
      tips: ["Professional format", "Include owner details", "Veterinary disclaimer"]
    }
  ];

  const keyFeatures = [
    {
      icon: <Eye className="w-6 h-6" />,
      title: "Pattern Recognition",
      description: "Advanced computer vision identifies dental wear patterns, star formation, and Galvayne's groove progression."
    },
    {
      icon: <CheckCircle className="w-6 h-6" />,
      title: "Accuracy Assessment",
      description: "Provides confidence scores and uncertainty ranges to help you understand the reliability of estimates."
    },
    {
      icon: <Activity className="w-6 h-6" />,
      title: "Health Indicators",
      description: "Detects potential dental issues like uneven wear, suggesting when professional care might be needed."
    }
  ];

  return (
    <div className="max-w-6xl mx-auto py-12 px-4">
      {/* Header */}
      <div className="text-center mb-16">
        <h1 className="text-4xl font-bold text-gray-900 mb-4">How Vealth Works</h1>
        <p className="text-xl text-gray-600 max-w-3xl mx-auto">
          Revolutionary AI technology makes equine age estimation accessible to horse owners everywhere. 
          Here's how our system provides accurate, reliable results in just minutes.
        </p>
      </div>

      {/* Process Steps */}
      <div className="mb-16">
        <h2 className="text-3xl font-bold text-center text-gray-900 mb-12">The Process</h2>
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
          {steps.map((step, index) => (
            <div key={step.id} className="relative">
              {/* Step Number */}
              <div className="absolute -top-4 -left-4 w-8 h-8 bg-teal-600 text-white rounded-full flex items-center justify-center text-sm font-bold">
                {step.id}
              </div>
              
              {/* Card */}
              <div className="bg-white rounded-lg shadow-md p-6 border border-gray-200 h-full">
                <div className="text-teal-600 mb-4">
                  {step.icon}
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">{step.title}</h3>
                <p className="text-gray-600 mb-4">{step.description}</p>
                
                {/* Tips */}
                <div className="space-y-1">
                  {step.tips.map((tip, tipIndex) => (
                    <div key={tipIndex} className="flex items-center text-sm text-gray-500">
                      <div className="w-1 h-1 bg-teal-500 rounded-full mr-2"></div>
                      {tip}
                    </div>
                  ))}
                </div>
              </div>
              
              {/* Arrow (except for last step) */}
              {index < steps.length - 1 && (
                <div className="hidden lg:block absolute top-1/2 -right-4 transform -translate-y-1/2">
                  <div className="w-8 h-0.5 bg-teal-300"></div>
                  <div className="absolute -right-1 -top-1 w-0 h-0 border-l-2 border-l-teal-300 border-t-2 border-t-transparent border-b-2 border-b-transparent"></div>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Key Features */}
      <div className="mb-16">
        <h2 className="text-3xl font-bold text-center text-gray-900 mb-12">Key Features</h2>
        <div className="grid md:grid-cols-3 gap-8">
          {keyFeatures.map((feature, index) => (
            <div key={index} className="text-center">
              <div className="w-16 h-16 bg-teal-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <div className="text-teal-600">
                  {feature.icon}
                </div>
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">{feature.title}</h3>
              <p className="text-gray-600">{feature.description}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Scientific Basis */}
      <div className="bg-gray-50 rounded-lg p-8 mb-16">
        <h2 className="text-2xl font-bold text-gray-900 mb-4">Scientific Basis</h2>
        <div className="prose max-w-none text-gray-700">
          <p className="mb-4">
            Horse age estimation through dental examination has been practiced by veterinarians for centuries. 
            As horses age, their teeth undergo predictable changes:
          </p>
          <ul className="grid md:grid-cols-2 gap-4 mb-4">
            <li className="flex items-start">
              <CheckCircle className="w-5 h-5 text-teal-600 mr-2 mt-0.5 flex-shrink-0" />
              <span><strong>Wear Patterns:</strong> Teeth gradually wear down with age and use</span>
            </li>
            <li className="flex items-start">
              <CheckCircle className="w-5 h-5 text-teal-600 mr-2 mt-0.5 flex-shrink-0" />
              <span><strong>Dental Stars:</strong> Dark spots appear as secondary dentine is exposed</span>
            </li>
            <li className="flex items-start">
              <CheckCircle className="w-5 h-5 text-teal-600 mr-2 mt-0.5 flex-shrink-0" />
              <span><strong>Galvayne's Groove:</strong> Vertical line appears on corner incisors after age 10</span>
            </li>
            <li className="flex items-start">
              <CheckCircle className="w-5 h-5 text-teal-600 mr-2 mt-0.5 flex-shrink-0" />
              <span><strong>Tooth Shape:</strong> Changes from oval to triangular with advanced age</span>
            </li>
          </ul>
          <p>
            Our AI system has been trained to recognize these patterns and provide accurate age estimates 
            comparable to experienced veterinary professionals.
          </p>
        </div>
      </div>

      {/* Important Disclaimer */}
      <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-6">
        <h3 className="text-lg font-semibold text-yellow-800 mb-2">Important Disclaimer</h3>
        <p className="text-yellow-700">
          While Vealth provides scientifically-based age estimates, it should not replace professional veterinary examination. 
          Always consult with a qualified equine veterinarian for definitive age determination and comprehensive dental health assessment. 
          This tool is designed to supplement, not replace, professional veterinary care.
        </p>
      </div>
    </div>
  );
};

export default HowItWorks;