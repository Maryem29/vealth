const express = require('express');
const path = require('path');
const fs = require('fs').promises;
const db = require('../models/database');

const router = express.Router();

// Middleware to ensure user session
const ensureSession = async (req, res, next) => {
  try {
    const sessionId = req.headers['x-session-id'] || req.query.sessionId;
    if (!sessionId) {
      return res.status(401).json({ error: 'Session ID required' });
    }
    req.sessionId = sessionId;
    next();
  } catch (error) {
    console.error('Session error:', error);
    res.status(500).json({ error: 'Session management error' });
  }
};

// Generate PDF report for analysis
router.post('/generate', ensureSession, async (req, res) => {
  try {
    const { analysisId, reportOptions = {} } = req.body;
    
    if (!analysisId) {
      return res.status(400).json({ error: 'Analysis ID is required' });
    }

    // Get analysis data from database
    // For now, we'll create a mock report structure
    const reportData = await generateReportData(analysisId, req.sessionId, reportOptions);
    
    // Generate PDF (we'll implement this in the frontend for now)
    const reportId = Date.now(); // Simple ID for now
    
    res.json({
      success: true,
      reportId: reportId,
      reportData: reportData,
      downloadUrl: `/api/reports/download/${reportId}?sessionId=${req.sessionId}`,
      message: 'Report generated successfully'
    });

  } catch (error) {
    console.error('Report generation error:', error);
    res.status(500).json({ 
      error: 'Failed to generate report',
      details: error.message
    });
  }
});

// Download generated report
router.get('/download/:reportId', ensureSession, async (req, res) => {
  try {
    const { reportId } = req.params;
    
    // For now, return report data for frontend PDF generation
    res.json({
      success: true,
      message: 'Report download endpoint ready',
      reportId: reportId,
      note: 'PDF generation will be handled by frontend'
    });

  } catch (error) {
    console.error('Report download error:', error);
    res.status(500).json({ error: 'Failed to download report' });
  }
});

// Get report history
router.get('/history', ensureSession, async (req, res) => {
  try {
    const history = await db.getAnalysisHistory(req.sessionId);
    
    res.json({
      success: true,
      reports: history.map(item => ({
        id: item.id,
        analysisId: item.id,
        estimatedAge: item.estimated_age,
        confidence: item.confidence_score,
        originalName: item.original_name,
        analysisDate: item.analysis_timestamp,
        reportGenerated: true
      }))
    });

  } catch (error) {
    console.error('Report history error:', error);
    res.status(500).json({ error: 'Failed to fetch report history' });
  }
});

// Helper function to generate report data
async function generateReportData(analysisId, sessionId, options) {
  // This would typically fetch from database
  // For now, return structured report data
  
  const reportData = {
    reportInfo: {
      id: analysisId,
      generatedAt: new Date().toISOString(),
      generatedBy: 'Vealth AI Analysis System',
      version: '1.0.0'
    },
    horseInfo: {
      imageAnalyzed: true,
      analysisDate: new Date().toISOString(),
      ...(options.horseDetails || {})
    },
    analysis: {
      estimatedAge: '8-10 years', // This would come from DB
      confidence: '85%',
      method: 'Deep Learning Dental Pattern Recognition',
      modelVersion: 'v2.1.3'
    },
    observations: [
      'Permanent central incisors show moderate wear',
      'Dental stars visible on central incisors',
      'Corner incisors show Galvayne\'s groove development'
    ],
    healthAssessment: {
      status: 'Normal',
      notes: [
        'Even wear pattern observed',
        'No obvious abnormalities detected',
        'Recommend routine dental check-up'
      ],
      recommendations: [
        'Continue regular dental monitoring',
        'Schedule professional dental evaluation annually',
        'Monitor eating habits for changes'
      ]
    },
    disclaimer: 'This analysis provides an estimation based on visible dental characteristics. For definitive age determination and dental health assessment, consult with a qualified equine veterinarian.',
    footer: {
      companyName: 'Vealth - AI Equine Health Assistant',
      contactInfo: 'For questions about this report, please consult your veterinarian',
      reportValidUntil: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000).toISOString() // 1 year
    }
  };

  return reportData;
}

module.exports = router;