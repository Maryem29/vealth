import React, { useState, useRef } from 'react';
import { 
  Download, 
  RefreshCw, 
  FileText, 
  Calendar,
  User,
  Mail,
  Phone,
  Building,
  Printer,
  Share2
} from 'lucide-react';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';

const ReportDownload = ({ analysisResult, uploadedImage, sessionId, onStartNew }) => {
  const [isGenerating, setIsGenerating] = useState(false);
  const [ownerInfo, setOwnerInfo] = useState({
    ownerName: '',
    horseName: '',
    email: '',
    phone: '',
    stable: ''
  });
  const reportRef = useRef(null);

  const handleInputChange = (field, value) => {
    setOwnerInfo(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const generatePDF = async () => {
    if (!analysisResult) return;
    
    setIsGenerating(true);
    
    try {
      // Create a new PDF document
      const pdf = new jsPDF('p', 'mm', 'a4');
      const pageWidth = pdf.internal.pageSize.getWidth();
      const pageHeight = pdf.internal.pageSize.getHeight();
      
      // Header
      pdf.setFontSize(24);
      pdf.setTextColor(41, 128, 185); // Primary blue
      pdf.text('VEALTH', 20, 25);
      
      pdf.setFontSize(12);
      pdf.setTextColor(100, 100, 100);
      pdf.text('AI Equine Health Assessment Report', 20, 35);
      
      // Date and Report ID
      pdf.setFontSize(10);
      pdf.text(`Report Generated: ${new Date().toLocaleDateString()}`, pageWidth - 70, 25);
      pdf.text(`Report ID: ${analysisResult.analysisId || 'VTH-' + Date.now()}`, pageWidth - 70, 30);
      
      // Line separator
      pdf.setDrawColor(200, 200, 200);
      pdf.line(20, 40, pageWidth - 20, 40);
      
      let yPosition = 50;
      
      // Horse and Owner Information
      if (ownerInfo.horseName || ownerInfo.ownerName) {
        pdf.setFontSize(16);
        pdf.setTextColor(0, 0, 0);
        pdf.text('Horse Information', 20, yPosition);
        yPosition += 10;
        
        pdf.setFontSize(11);
        if (ownerInfo.horseName) {
          pdf.text(`Horse Name: ${ownerInfo.horseName}`, 20, yPosition);
          yPosition += 6;
        }
        if (ownerInfo.ownerName) {
          pdf.text(`Owner: ${ownerInfo.ownerName}`, 20, yPosition);
          yPosition += 6;
        }
        if (ownerInfo.stable) {
          pdf.text(`Stable/Facility: ${ownerInfo.stable}`, 20, yPosition);
          yPosition += 6;
        }
        yPosition += 5;
      }
      
      // Analysis Results
      pdf.setFontSize(16);
      pdf.setTextColor(0, 0, 0);
      pdf.text('Age Estimation Results', 20, yPosition);
      yPosition += 10;
      
      // Age and confidence in a box
      pdf.setFillColor(240, 248, 255);
      pdf.rect(20, yPosition - 5, pageWidth - 40, 20, 'F');
      pdf.setFontSize(14);
      pdf.setTextColor(21, 101, 192);
      pdf.text(`Estimated Age: ${analysisResult.estimatedAge}`, 25, yPosition + 5);
      pdf.text(`Confidence: ${analysisResult.confidencePercentage}`, 25, yPosition + 12);
      yPosition += 25;
      
      // Observations
      pdf.setFontSize(14);
      pdf.setTextColor(0, 0, 0);
      pdf.text('Key Observations', 20, yPosition);
      yPosition += 8;
      
      pdf.setFontSize(10);
      if (analysisResult.observations) {
        analysisResult.observations.forEach((observation, index) => {
          const wrappedText = pdf.splitTextToSize(`• ${observation}`, pageWidth - 50);
          pdf.text(wrappedText, 25, yPosition);
          yPosition += wrappedText.length * 4 + 2;
        });
      }
      yPosition += 5;
      
      // Health Assessment
      pdf.setFontSize(14);
      pdf.text('Health Assessment', 20, yPosition);
      yPosition += 8;
      
      pdf.setFontSize(10);
      if (analysisResult.healthNotes) {
        analysisResult.healthNotes.forEach((note, index) => {
          const wrappedText = pdf.splitTextToSize(`• ${note}`, pageWidth - 50);
          pdf.text(wrappedText, 25, yPosition);
          yPosition += wrappedText.length * 4 + 2;
        });
      }
      yPosition += 10;
      
      // Analysis Method
      pdf.setFontSize(12);
      pdf.text('Analysis Method', 20, yPosition);
      yPosition += 6;
      
      pdf.setFontSize(10);
      pdf.text(`Method: ${analysisResult.analysisMethod}`, 25, yPosition);
      yPosition += 4;
      pdf.text(`Model Version: ${analysisResult.modelVersion}`, 25, yPosition);
      yPosition += 4;
      pdf.text(`Analysis Date: ${new Date(analysisResult.timestamp).toLocaleDateString()}`, 25, yPosition);
      yPosition += 10;
      
      // Disclaimer
      pdf.setFillColor(255, 251, 230);
      pdf.rect(20, yPosition - 5, pageWidth - 40, 25, 'F');
      pdf.setFontSize(10);
      pdf.setTextColor(133, 77, 14);
      pdf.text('IMPORTANT DISCLAIMER:', 25, yPosition + 2);
      const disclaimerText = pdf.splitTextToSize(
        analysisResult.disclaimer || 
        'This analysis provides an estimation based on visible dental characteristics. For definitive age determination and dental health assessment, consult with a qualified equine veterinarian.',
        pageWidth - 50
      );
      pdf.text(disclaimerText, 25, yPosition + 8);
      yPosition += 30;
      
      // Footer
      pdf.setFontSize(8);
      pdf.setTextColor(100, 100, 100);
      pdf.text('Generated by Vealth AI - Equine Health Assistant', 20, pageHeight - 20);
      pdf.text(`Contact: support@vealth.ai | www.vealth.ai`, 20, pageHeight - 15);
      
      // Save the PDF
      const fileName = `Vealth_Report_${ownerInfo.horseName || 'Horse'}_${new Date().toISOString().split('T')[0]}.pdf`;
      pdf.save(fileName);
      
    } catch (error) {
      console.error('PDF generation error:', error);
      alert('Failed to generate PDF. Please try again.');
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Header */}
      <div className="text-center">
        <h2 className="text-3xl font-bold text-gray-900 mb-2">Generate Report</h2>
        <p className="text-gray-600">Add additional information and download your analysis report</p>
      </div>

      {/* Owner Information Form */}
      <div className="card">
        <h3 className="text-xl font-semibold text-gray-900 mb-6 flex items-center">
          <FileText className="w-5 h-5 mr-2" />
          Report Information
        </h3>
        
        <div className="grid md:grid-cols-2 gap-6">
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                <User className="w-4 h-4 inline mr-1" />
                Horse Name
              </label>
              <input
                type="text"
                value={ownerInfo.horseName}
                onChange={(e) => handleInputChange('horseName', e.target.value)}
                placeholder="Enter horse's name"
                className="input-field"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                <User className="w-4 h-4 inline mr-1" />
                Owner Name
              </label>
              <input
                type="text"
                value={ownerInfo.ownerName}
                onChange={(e) => handleInputChange('ownerName', e.target.value)}
                placeholder="Enter owner's name"
                className="input-field"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                <Building className="w-4 h-4 inline mr-1" />
                Stable/Facility
              </label>
              <input
                type="text"
                value={ownerInfo.stable}
                onChange={(e) => handleInputChange('stable', e.target.value)}
                placeholder="Enter stable or facility name"
                className="input-field"
              />
            </div>
          </div>
          
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                <Mail className="w-4 h-4 inline mr-1" />
                Email (Optional)
              </label>
              <input
                type="email"
                value={ownerInfo.email}
                onChange={(e) => handleInputChange('email', e.target.value)}
                placeholder="Enter email address"
                className="input-field"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                <Phone className="w-4 h-4 inline mr-1" />
                Phone (Optional)
              </label>
              <input
                type="tel"
                value={ownerInfo.phone}
                onChange={(e) => handleInputChange('phone', e.target.value)}
                placeholder="Enter phone number"
                className="input-field"
              />
            </div>
            
            <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
              <p className="text-sm text-blue-800">
                <strong>Note:</strong> All information is processed locally and not stored on our servers.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Report Preview */}
      <div className="card">
        <h3 className="text-xl font-semibold text-gray-900 mb-6 flex items-center">
          <Printer className="w-5 h-5 mr-2" />
          Report Preview
        </h3>
        
        <div ref={reportRef} className="bg-white border border-gray-200 rounded-lg p-6 max-h-96 overflow-y-auto">
          {/* Report Header */}
          <div className="border-b pb-4 mb-4">
            <div className="flex justify-between items-start">
              <div>
                <h1 className="text-2xl font-bold text-primary-600">VEALTH</h1>
                <p className="text-gray-600">AI Equine Health Assessment Report</p>
              </div>
              <div className="text-right text-sm text-gray-500">
                <p>Generated: {new Date().toLocaleDateString()}</p>
                <p>Report ID: VTH-{Date.now().toString().slice(-6)}</p>
              </div>
            </div>
          </div>
          
          {/* Horse Information */}
          {(ownerInfo.horseName || ownerInfo.ownerName) && (
            <div className="mb-6">
              <h3 className="text-lg font-semibold mb-2">Horse Information</h3>
              <div className="grid grid-cols-2 gap-4 text-sm">
                {ownerInfo.horseName && <p><strong>Horse:</strong> {ownerInfo.horseName}</p>}
                {ownerInfo.ownerName && <p><strong>Owner:</strong> {ownerInfo.ownerName}</p>}
                {ownerInfo.stable && <p><strong>Stable:</strong> {ownerInfo.stable}</p>}
              </div>
            </div>
          )}
          
          {/* Analysis Results */}
          <div className="mb-6">
            <h3 className="text-lg font-semibold mb-2">Age Estimation Results</h3>
            <div className="bg-primary-50 p-4 rounded-lg mb-4">
              <p className="text-lg"><strong>Estimated Age:</strong> {analysisResult.estimatedAge}</p>
              <p><strong>Confidence:</strong> {analysisResult.confidencePercentage}</p>
            </div>
            
            <h4 className="font-medium mb-2">Key Observations:</h4>
            <ul className="list-disc list-inside space-y-1 text-sm">
              {analysisResult.observations?.map((obs, i) => (
                <li key={i}>{obs}</li>
              ))}
            </ul>
            
            <h4 className="font-medium mb-2 mt-4">Health Assessment:</h4>
            <ul className="list-disc list-inside space-y-1 text-sm">
              {analysisResult.healthNotes?.map((note, i) => (
                <li key={i}>{note}</li>
              ))}
            </ul>
          </div>
          
          {/* Disclaimer */}
          <div className="bg-yellow-50 border border-yellow-200 p-4 rounded-lg">
            <p className="text-sm text-yellow-800">
              <strong>DISCLAIMER:</strong> {analysisResult.disclaimer}
            </p>
          </div>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex flex-col sm:flex-row gap-4 justify-center">
        <button
          onClick={generatePDF}
          disabled={isGenerating}
          className="btn-equine px-8 py-3 text-lg font-semibold flex items-center justify-center disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isGenerating ? (
            <>
              <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
              Generating PDF...
            </>
          ) : (
            <>
              <Download className="w-5 h-5 mr-2" />
              Download PDF Report
            </>
          )}
        </button>
        
        <button
          onClick={onStartNew}
          className="btn-secondary px-8 py-3 text-lg font-semibold flex items-center justify-center"
        >
          <RefreshCw className="w-5 h-5 mr-2" />
          Analyze Another Horse
        </button>
      </div>
      
      {/* Tips */}
      <div className="bg-gray-50 p-4 rounded-lg">
        <h4 className="font-medium text-gray-900 mb-2">Tips for Using Your Report:</h4>
        <ul className="text-sm text-gray-700 space-y-1">
          <li>• Share this report with your veterinarian during check-ups</li>
          <li>• Keep reports organized to track your horse's dental health over time</li>
          <li>• Use this as a starting point for professional dental evaluation</li>
          <li>• Consider annual dental check-ups regardless of this assessment</li>
        </ul>
      </div>
    </div>
  );
};

export default ReportDownload;