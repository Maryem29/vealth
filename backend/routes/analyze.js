const express = require('express');
const db = require('../models/database');
const aiService = require('../services/aiAnalysis');

const router = express.Router();

// Middleware to ensure user session
const ensureSession = async (req, res, next) => {
  try {
    const sessionId = req.headers['x-session-id'] || req.body.sessionId;
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

// Analyze uploaded image
router.post('/', ensureSession, async (req, res) => {
  try {
    const { uploadId } = req.body;
    
    if (!uploadId) {
      return res.status(400).json({ error: 'Upload ID is required' });
    }

    // Simulate processing time
    await new Promise(resolve => setTimeout(resolve, 2000));

    // Get AI analysis (mock for now)
    const analysisResult = await aiService.analyzeHorseTeeth(uploadId);

    // Save analysis to database
    const analysisId = await db.saveAnalysis({
      uploadId: uploadId,
      sessionId: req.sessionId,
      estimatedAge: analysisResult.estimatedAge,
      confidenceScore: analysisResult.confidence,
      observations: analysisResult.observations,
      healthNotes: analysisResult.healthNotes
    });

    res.json({
      success: true,
      analysisId: analysisId,
      result: {
        ...analysisResult,
        analysisId: analysisId,
        timestamp: new Date().toISOString()
      }
    });

  } catch (error) {
    console.error('Analysis error:', error);
    res.status(500).json({ 
      error: 'Failed to analyze image',
      details: error.message
    });
  }
});

// Get analysis result
router.get('/:analysisId', ensureSession, async (req, res) => {
  try {
    const { analysisId } = req.params;
    
    // Query database for analysis result
    // For now, return success message
    res.json({
      success: true,
      message: 'Analysis retrieval endpoint ready',
      analysisId: analysisId
    });

  } catch (error) {
    console.error('Analysis fetch error:', error);
    res.status(500).json({ error: 'Failed to fetch analysis' });
  }
});

// Re-analyze image with different parameters
router.post('/reanalyze', ensureSession, async (req, res) => {
  try {
    const { uploadId, options } = req.body;
    
    if (!uploadId) {
      return res.status(400).json({ error: 'Upload ID is required' });
    }

    // Get new analysis with different parameters
    const analysisResult = await aiService.analyzeHorseTeeth(uploadId, options);

    const analysisId = await db.saveAnalysis({
      uploadId: uploadId,
      sessionId: req.sessionId,
      estimatedAge: analysisResult.estimatedAge,
      confidenceScore: analysisResult.confidence,
      observations: analysisResult.observations,
      healthNotes: analysisResult.healthNotes
    });

    res.json({
      success: true,
      analysisId: analysisId,
      result: {
        ...analysisResult,
        analysisId: analysisId,
        timestamp: new Date().toISOString()
      }
    });

  } catch (error) {
    console.error('Re-analysis error:', error);
    res.status(500).json({ 
      error: 'Failed to re-analyze image',
      details: error.message
    });
  }
});

module.exports = router;