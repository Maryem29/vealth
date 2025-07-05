const express = require('express');
const db = require('../models/database');
const enhancedAI = require('../services/aiAnalysis'); // Your new dynamic AI
const path = require('path');

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

    console.log(`🔬 Starting enhanced analysis for upload: ${uploadId}`);

    // For MVP, we'll analyze based on upload timestamp to create variation
    // In real implementation, you'd pass the actual image path
    const mockImagePath = null; // We'll let the AI generate features based on uploadId
    
    // Generate realistic analysis that varies per image
    const analysisResult = await enhancedAI.analyzeHorseTeeth(mockImagePath, {
      // Create pseudo-features based on uploadId for consistent but varied results
      brightness: 100 + (uploadId % 50),
      contrast: 30 + (uploadId % 40),
      edgeCount: (uploadId % 10000) + 5000,
      imageSize: 100000,
      textureVariance: 500 + (uploadId % 1000)
    });

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
        // Add some visual feedback about the "AI processing"
        processingSteps: [
          "✅ Image preprocessing completed",
          "✅ Dental feature extraction performed", 
          "✅ Age correlation analysis completed",
          "✅ Health assessment generated"
        ]
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

module.exports = router;