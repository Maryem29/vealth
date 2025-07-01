const express = require('express');
const multer = require('multer');
const path = require('path');
const sharp = require('sharp');
const { v4: uuidv4 } = require('uuid');
const fs = require('fs').promises;
const db = require('../models/database');

const router = express.Router();

// Configure multer for file uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, path.join(__dirname, '../../uploads'));
  },
  filename: (req, file, cb) => {
    const uniqueName = `${Date.now()}-${uuidv4()}${path.extname(file.originalname)}`;
    cb(null, uniqueName);
  }
});

// File filter for images only
const fileFilter = (req, file, cb) => {
  const allowedTypes = /jpeg|jpg|png|gif|webp/;
  const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase());
  const mimetype = allowedTypes.test(file.mimetype);

  if (mimetype && extname) {
    return cb(null, true);
  } else {
    cb(new Error('Only image files are allowed (jpeg, jpg, png, gif, webp)'));
  }
};

const upload = multer({
  storage: storage,
  limits: {
    fileSize: 10 * 1024 * 1024, // 10MB limit
  },
  fileFilter: fileFilter
});

// Middleware to ensure user session
const ensureSession = async (req, res, next) => {
  try {
    let sessionId = req.headers['x-session-id'] || req.body.sessionId;
    
    if (!sessionId) {
      sessionId = uuidv4();
      await db.createUser(sessionId);
    } else {
      // Check if user exists, create if not
      const user = await db.getUser(sessionId);
      if (!user) {
        await db.createUser(sessionId);
      }
    }
    
    req.sessionId = sessionId;
    next();
  } catch (error) {
    console.error('Session error:', error);
    res.status(500).json({ error: 'Session management error' });
  }
};

// Image upload endpoint
router.post('/', ensureSession, upload.single('image'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: 'No image file provided' });
    }

    const { filename, originalname, size, mimetype, path: filePath } = req.file;
    
    // Process image with Sharp (resize, optimize)
    const processedImagePath = path.join(path.dirname(filePath), `processed-${filename}`);
    
    await sharp(filePath)
      .resize(800, 600, { 
        fit: 'inside',
        withoutEnlargement: true 
      })
      .jpeg({ quality: 85 })
      .toFile(processedImagePath);

    // Save upload info to database
    const uploadId = await db.saveUpload({
      sessionId: req.sessionId,
      filename: `processed-${filename}`,
      originalName: originalname,
      filePath: processedImagePath,
      fileSize: size,
      mimeType: mimetype
    });

    // Get file stats for the processed image
    const stats = await fs.stat(processedImagePath);

    res.json({
      success: true,
      sessionId: req.sessionId,
      uploadId: uploadId,
      file: {
        id: uploadId,
        filename: `processed-${filename}`,
        originalname: originalname,
        size: stats.size,
        url: `/uploads/processed-${filename}`,
        uploadedAt: new Date().toISOString()
      },
      message: 'Image uploaded and processed successfully'
    });

  } catch (error) {
    console.error('Upload error:', error);
    res.status(500).json({ 
      error: 'Failed to upload image',
      details: error.message
    });
  }
});

// Get upload history for session
router.get('/history', ensureSession, async (req, res) => {
  try {
    const history = await db.getAnalysisHistory(req.sessionId);
    res.json({
      success: true,
      history: history
    });
  } catch (error) {
    console.error('History fetch error:', error);
    res.status(500).json({ error: 'Failed to fetch upload history' });
  }
});

// Get specific upload
router.get('/:uploadId', ensureSession, async (req, res) => {
  try {
    const { uploadId } = req.params;
    // Add database query for specific upload
    res.json({
      success: true,
      message: 'Upload details endpoint ready'
    });
  } catch (error) {
    console.error('Upload fetch error:', error);
    res.status(500).json({ error: 'Failed to fetch upload details' });
  }
});

module.exports = router;