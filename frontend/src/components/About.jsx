import React from 'react';
import { Heart, Target, Users, Award, Shield, Lightbulb } from 'lucide-react';

const About = () => {
  const values = [
    {
      icon: <Heart className="w-6 h-6" />,
      title: "Animal Welfare",
      description: "We're passionate about improving equine health and welfare through innovative technology."
    },
    {
      icon: <Target className="w-6 h-6" />,
      title: "Accuracy",
      description: "Our AI models are trained on extensive datasets to provide reliable, scientifically-based results."
    },
    {
      icon: <Users className="w-6 h-6" />,
      title: "Accessibility",
      description: "Making professional-grade equine health tools available to horse owners everywhere."
    },
    {
      icon: <Shield className="w-6 h-6" />,
      title: "Transparency",
      description: "Clear communication about our methods, limitations, and the importance of professional care."
    }
  ];

  const milestones = [
    {
      year: "2024",
      title: "Project Launch",
      description: "Vealth begins as an innovative project to make equine age estimation accessible to all horse owners."
    },
    {
      year: "2024",
      title: "AI Development",
      description: "Development of advanced computer vision models trained on equine dental characteristics."
    },
    {
      year: "2024",
      title: "Beta Release",
      description: "Launch of beta version with core features: image analysis, age estimation, and PDF reports."
    },
    {
      year: "Future",
      title: "Expansion",
      description: "Plans for enhanced features, veterinary partnerships, and additional equine health tools."
    }
  ];

  return (
    <div className="max-w-6xl mx-auto py-12 px-4">
      {/* Header */}
      <div className="text-center mb-16">
        <h1 className="text-4xl font-bold text-gray-900 mb-4">About Vealth</h1>
        <p className="text-xl text-gray-600 max-w-3xl mx-auto">
          Revolutionary AI technology dedicated to advancing equine health and welfare. 
          We believe every horse deserves access to the best possible care.
        </p>
      </div>

      {/* Mission Statement */}
      <div className="mb-16">
        <div className="bg-gradient-to-r from-teal-50 to-blue-50 rounded-lg p-8 border border-teal-200">
          <div className="max-w-4xl mx-auto text-center">
            <div className="w-16 h-16 bg-teal-600 rounded-full flex items-center justify-center mx-auto mb-6">
              <Lightbulb className="w-8 h-8 text-white" />
            </div>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Our Mission</h2>
            <p className="text-lg text-gray-700 leading-relaxed">
              To democratize equine health assessment through cutting-edge AI technology, 
              empowering horse owners with professional-grade tools while supporting 
              veterinary professionals in providing the best possible care.
            </p>
          </div>
        </div>
      </div>

      {/* Values */}
      <div className="mb-16">
        <h2 className="text-3xl font-bold text-center text-gray-900 mb-12">Our Values</h2>
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
          {values.map((value, index) => (
            <div key={index} className="text-center">
              <div className="w-16 h-16 bg-teal-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <div className="text-teal-600">
                  {value.icon}
                </div>
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">{value.title}</h3>
              <p className="text-gray-600">{value.description}</p>
            </div>
          ))}
        </div>
      </div>

      {/* The Problem We Solve */}
      <div className="mb-16">
        <div className="grid md:grid-cols-2 gap-12 items-center">
          <div>
            <h2 className="text-3xl font-bold text-gray-900 mb-4">The Problem We Solve</h2>
            <div className="space-y-4 text-gray-700">
              <p>
                Horse age estimation has traditionally required specialized veterinary expertise, 
                making it inaccessible to many horse owners. This creates several challenges:
              </p>
              <ul className="space-y-2">
                <li className="flex items-start">
                  <div className="w-2 h-2 bg-teal-600 rounded-full mt-2 mr-3 flex-shrink-0"></div>
                  <span>Limited access to professional assessment, especially in remote areas</span>
                </li>
                <li className="flex items-start">
                  <div className="w-2 h-2 bg-teal-600 rounded-full mt-2 mr-3 flex-shrink-0"></div>
                  <span>High costs for routine age verification</span>
                </li>
                <li className="flex items-start">
                  <div className="w-2 h-2 bg-teal-600 rounded-full mt-2 mr-3 flex-shrink-0"></div>
                  <span>Inconsistent assessment methods and accuracy</span>
                </li>
                <li className="flex items-start">
                  <div className="w-2 h-2 bg-teal-600 rounded-full mt-2 mr-3 flex-shrink-0"></div>
                  <span>Lack of documented health history for horses</span>
                </li>
              </ul>
            </div>
          </div>
          <div className="bg-gray-100 rounded-lg p-8">
            <div className="text-center">
              <Award className="w-16 h-16 text-teal-600 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Our Solution</h3>
              <p className="text-gray-700">
                AI-powered age estimation that's accurate, accessible, and affordable - 
                putting professional-grade assessment tools in the hands of every horse owner.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Milestones */}
      <div className="mb-16">
        <h2 className="text-3xl font-bold text-center text-gray-900 mb-12">Our Journey</h2>
        <div className="space-y-8">
          {milestones.map((milestone, index) => (
            <div key={index} className="flex items-start">
              <div className="flex-shrink-0 w-20 text-right mr-8">
                <div className="text-lg font-bold text-teal-600">{milestone.year}</div>
              </div>
              <div className="flex-shrink-0 w-4 h-4 bg-teal-600 rounded-full mt-2 mr-8"></div>
              <div className="flex-1">
                <h3 className="text-lg font-semibold text-gray-900 mb-1">{milestone.title}</h3>
                <p className="text-gray-600">{milestone.description}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Technology */}
      <div className="mb-16">
        <div className="bg-gray-50 rounded-lg p-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Technology Behind Vealth</h2>
          <div className="grid md:grid-cols-3 gap-6">
            <div className="text-center">
              <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-3">
                <div className="w-6 h-6 bg-blue-600 rounded"></div>
              </div>
              <h3 className="font-semibold text-gray-900 mb-2">Computer Vision</h3>
              <p className="text-sm text-gray-600">Advanced image processing algorithms analyze dental characteristics</p>
            </div>
            <div className="text-center">
              <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-3">
                <div className="w-6 h-6 bg-green-600 rounded-full"></div>
              </div>
              <h3 className="font-semibold text-gray-900 mb-2">Machine Learning</h3>
              <p className="text-sm text-gray-600">Neural networks trained on extensive equine dental datasets</p>
            </div>
            <div className="text-center">
              <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-3">
                <div className="w-6 h-6 bg-purple-600 rounded-lg transform rotate-45"></div>
              </div>
              <h3 className="font-semibold text-gray-900 mb-2">Web Technology</h3>
              <p className="text-sm text-gray-600">Modern web platform ensuring accessibility across all devices</p>
            </div>
          </div>
        </div>
      </div>

      {/* Call to Action */}
      <div className="text-center">
        <div className="bg-teal-600 rounded-lg p-8 text-white">
          <h2 className="text-2xl font-bold mb-4">Join the Vealth Community</h2>
          <p className="text-lg mb-6">
            Be part of the revolution in equine health technology. 
            Help us make professional-grade care accessible to every horse.
          </p>
          <button className="bg-white text-teal-600 px-8 py-3 rounded-lg font-semibold hover:bg-gray-100 transition-colors">
            Get Started Today
          </button>
        </div>
      </div>
    </div>
  );
};

export default About;