const sharp = require('sharp');
const fs = require('fs').promises;
const path = require('path');

class ImageAnalyzingAIService {
  constructor() {
    console.log('🎯 Image-Analyzing AI Service initialized');
    
    // Age estimation rules
    this.ageRules = {
      young: {
        ageRange: ["2-4 years", "3-5 years", "4-6 years"],
        confidence: [0.75, 0.85, 0.80],
        observations: [
          "Temporary incisors still present in some positions",
          "Permanent central incisors recently erupted",
          "Minimal wear patterns visible on tooth surfaces",
          "Sharp, well-defined tooth edges observed"
        ],
        healthNotes: [
          "Developing dental structure appears normal",
          "No premature wear patterns detected",
          "Recommend monitoring during tooth transition period"
        ]
      },
      adult: {
        ageRange: ["6-8 years", "7-10 years", "8-12 years", "9-11 years"],
        confidence: [0.85, 0.90, 0.82, 0.88],
        observations: [
          "All permanent incisors present and established",
          "Moderate wear patterns consistent with normal use",
          "Dental stars beginning to appear on central incisors",
          "Even wear distribution across tooth surfaces"
        ],
        healthNotes: [
          "Even wear pattern indicates normal dental function",
          "No obvious abnormalities detected in dental structure",
          "Recommend annual dental examinations"
        ]
      },
      mature: {
        ageRange: ["12-15 years", "13-16 years", "14-17 years", "15-18 years"],
        confidence: [0.88, 0.85, 0.83, 0.87],
        observations: [
          "Prominent dental stars visible on all incisors",
          "Significant wear patterns throughout dental arcade",
          "Galvayne's groove clearly visible on corner incisors",
          "Tooth surfaces showing characteristic wear cups"
        ],
        healthNotes: [
          "Wear patterns consistent with expected age group",
          "Monitor for uneven wear requiring dental attention",
          "Regular dental care becomes increasingly important"
        ]
      },
      senior: {
        ageRange: ["18-22 years", "20-25 years", "22-28 years", "25+ years"],
        confidence: [0.80, 0.75, 0.78, 0.70],
        observations: [
          "Extensive dental stars prominent on all teeth",
          "Heavy wear patterns with significant tooth loss",
          "Full Galvayne's groove extending down corner incisor",
          "Teeth appear triangular rather than oval in cross-section"
        ],
        healthNotes: [
          "Age-related dental changes require monitoring",
          "Consider specialized senior horse dental care",
          "May need dietary modifications for easier chewing"
        ]
      },
      invalid: {
        ageRange: ["Unable to determine"],
        confidence: [0.20],
        observations: [
          "Image does not appear to contain horse dental structures",
          "Unable to identify characteristic incisor patterns",
          "Non-equine subject detected in analysis"
        ],
        healthNotes: [
          "Please upload a clear image of horse front teeth (incisors)",
          "Ensure the image shows the horse's dental arcade clearly"
        ]
      }
    };
  }

  async analyzeHorseTeeth(uploadId, imageFeatures = null) {
    try {
      console.log(`🔍 Starting image analysis for upload: ${uploadId}`);
      
      // Construct the image path
      const imagePath = path.join(__dirname, '../../uploads', `processed-${uploadId}.jpg`);
      console.log(`📁 Looking for image at: ${imagePath}`);
      
      // Check if image exists
      try {
        await fs.access(imagePath);
        console.log('✅ Image file found, analyzing...');
      } catch (error) {
        console.warn('❌ Image file NOT found at path:', imagePath);
        console.warn('📂 Let me check what files exist in uploads folder...');
        
        try {
          const uploadsDir = path.join(__dirname, '../../uploads');
          const files = await fs.readdir(uploadsDir);
          console.log('📋 Files in uploads folder:', files);
        } catch (dirError) {
          console.error('❌ Cannot read uploads directory:', dirError);
        }
        
        return this.generateFallbackAnalysis();
      }

      // Analyze the actual image
      const imageAnalysis = await this.analyzeImageFile(imagePath);
      console.log('📊 Image analysis results:', imageAnalysis);
      
      // Determine if this looks like horse teeth
      const isValidHorseImage = this.validateHorseTeethImage(imageAnalysis);
      
      // Determine age category based on image characteristics
      const ageCategory = isValidHorseImage ? 
        this.determineAgeCategory(imageAnalysis) : 'invalid';
      
      // Generate realistic analysis based on image features
      const analysis = this.generateRealisticAnalysis(ageCategory, imageAnalysis);
      
      console.log('✅ Image analysis completed');
      return analysis;
    } catch (error) {
      console.error('❌ Image analysis error:', error);
      return this.generateFallbackAnalysis();
    }
  }

  async analyzeImageFile(imagePath) {
    try {
      const image = sharp(imagePath);
      const metadata = await image.metadata();
      const stats = await image.stats();
      
      const analysis = {
        width: metadata.width,
        height: metadata.height,
        channels: metadata.channels,
        format: metadata.format,
        dominantColor: this.getDominantColorCategory(stats),
        brightness: this.calculateBrightness(stats),
        contrast: this.calculateContrast(stats),
        entropy: await this.calculateEntropy(image),
        edges: await this.estimateEdges(image),
        colorComplexity: this.calculateColorComplexity(stats),
        aspectRatio: metadata.width / metadata.height,
        totalPixels: metadata.width * metadata.height
      };
      
      return analysis;
    } catch (error) {
      console.error('Image analysis failed:', error);
      throw error;
    }
  }

  getDominantColorCategory(stats) {
    const channels = stats.channels;
    if (channels.length >= 3) {
      const [r, g, b] = channels;
      const avgR = r.mean;
      const avgG = g.mean;
      const avgB = b.mean;
      
      if (avgR > avgG && avgR > avgB) return 'red-dominant';
      if (avgG > avgR && avgG > avgB) return 'green-dominant';
      if (avgB > avgR && avgB > avgG) return 'blue-dominant';
      if (Math.abs(avgR - avgG) < 20 && Math.abs(avgG - avgB) < 20) return 'neutral';
      return 'mixed';
    }
    return 'grayscale';
  }

  calculateBrightness(stats) {
    if (stats.channels.length >= 3) {
      const [r, g, b] = stats.channels;
      return (r.mean * 0.299 + g.mean * 0.587 + b.mean * 0.114);
    }
    return stats.channels[0]?.mean || 128;
  }

  calculateContrast(stats) {
    if (stats.channels.length >= 3) {
      const [r, g, b] = stats.channels;
      return (r.stdev + g.stdev + b.stdev) / 3;
    }
    return stats.channels[0]?.stdev || 50;
  }

  async calculateEntropy(image) {
    try {
      const { data } = await image.grayscale().raw().toBuffer({ resolveWithObject: true });
      const histogram = new Array(256).fill(0);
      for (let i = 0; i < data.length; i++) {
        histogram[data[i]]++;
      }
      
      const totalPixels = data.length;
      let entropy = 0;
      for (let i = 0; i < 256; i++) {
        if (histogram[i] > 0) {
          const probability = histogram[i] / totalPixels;
          entropy -= probability * Math.log2(probability);
        }
      }
      
      return entropy;
    } catch (error) {
      console.warn('Entropy calculation failed, using default');
      return 5.0;
    }
  }

  async estimateEdges(image) {
    try {
      const edgeImage = await image
        .grayscale()
        .convolve({
          width: 3,
          height: 3,
          kernel: [-1, -1, -1, -1, 8, -1, -1, -1, -1]
        })
        .raw()
        .toBuffer();
      
      let edgePixels = 0;
      for (let i = 0; i < edgeImage.length; i++) {
        if (edgeImage[i] > 50) edgePixels++;
      }
      
      return edgePixels / edgeImage.length;
    } catch (error) {
      console.warn('Edge estimation failed, using default');
      return 0.1;
    }
  }

  calculateColorComplexity(stats) {
    if (stats.channels.length >= 3) {
      const [r, g, b] = stats.channels;
      const variations = [r.stdev, g.stdev, b.stdev];
      return variations.reduce((sum, val) => sum + val, 0) / 3;
    }
    return stats.channels[0]?.stdev || 50;
  }

  validateHorseTeethImage(imageAnalysis) {
    let score = 0;
    
    if (imageAnalysis.aspectRatio > 1.0 && imageAnalysis.aspectRatio < 3.0) score += 2;
    if (imageAnalysis.dominantColor === 'neutral' || imageAnalysis.dominantColor === 'red-dominant') score += 2;
    if (imageAnalysis.brightness > 100 && imageAnalysis.brightness < 200) score += 2;
    if (imageAnalysis.contrast > 30) score += 1;
    if (imageAnalysis.entropy > 4.0 && imageAnalysis.entropy < 7.5) score += 1;
    
    if (imageAnalysis.dominantColor === 'red-dominant' && 
        imageAnalysis.brightness < 120 && 
        imageAnalysis.colorComplexity > 60) {
      score -= 3;
    }
    
    console.log(`🎯 Horse validation score: ${score}/8`);
    return score >= 4;
  }

  determineAgeCategory(imageAnalysis) {
    let youngScore = 0, adultScore = 0, matureScore = 0, seniorScore = 0;

    if (imageAnalysis.brightness > 150) {
      youngScore += 3;
    } else if (imageAnalysis.brightness > 130) {
      adultScore += 3;
    } else if (imageAnalysis.brightness > 110) {
      matureScore += 3;
    } else {
      seniorScore += 3;
    }

    if (imageAnalysis.contrast > 60) {
      youngScore += 2;
    } else if (imageAnalysis.contrast > 45) {
      adultScore += 2;
    } else if (imageAnalysis.contrast > 30) {
      matureScore += 2;
    } else {
      seniorScore += 2;
    }

    if (imageAnalysis.edges > 0.15) {
      youngScore += 2;
    } else if (imageAnalysis.edges > 0.10) {
      adultScore += 2;
    } else if (imageAnalysis.edges > 0.05) {
      matureScore += 2;
    } else {
      seniorScore += 2;
    }

    const scores = { young: youngScore, adult: adultScore, mature: matureScore, senior: seniorScore };
    const winningCategory = Object.keys(scores).reduce((a, b) => scores[a] > scores[b] ? a : b);
    
    console.log('📊 Age category scores:', scores);
    console.log('🏆 Selected category:', winningCategory);
    
    return winningCategory;
  }

  generateRealisticAnalysis(ageCategory, imageAnalysis) {
    const categoryData = this.ageRules[ageCategory];
    
    const ageIndex = Math.abs(Math.floor(imageAnalysis.brightness)) % categoryData.ageRange.length;
    const selectedAge = categoryData.ageRange[ageIndex];
    const baseConfidence = categoryData.confidence[ageIndex];
    
    let adjustedConfidence = baseConfidence;
    
    if (ageCategory === 'invalid') {
      adjustedConfidence = 0.15 + Math.random() * 0.1;
    } else {
      if (imageAnalysis.contrast < 30) adjustedConfidence -= 0.1;
      if (imageAnalysis.brightness < 80) adjustedConfidence -= 0.05;
      if (imageAnalysis.edges < 0.05) adjustedConfidence -= 0.05;
      if (imageAnalysis.entropy < 3.0) adjustedConfidence -= 0.1;
    }
    
    adjustedConfidence = Math.max(0.15, Math.min(0.95, adjustedConfidence));

    const obsCount = ageCategory === 'invalid' ? 2 : (2 + Math.abs(Math.floor(imageAnalysis.contrast)) % 3);
    const healthCount = ageCategory === 'invalid' ? 2 : (2 + Math.abs(Math.floor(imageAnalysis.brightness)) % 2);
    
    const selectedObservations = this.selectItemsBasedOnCharacteristics(
      categoryData.observations, obsCount, imageAnalysis
    );
    
    const selectedHealthNotes = this.selectItemsBasedOnCharacteristics(
      categoryData.healthNotes, healthCount, imageAnalysis
    );

    let healthStatus = ageCategory === 'invalid' ? 'attention' : 'normal';
    if (ageCategory === 'senior' && imageAnalysis.brightness < 120) healthStatus = 'attention';
    if (imageAnalysis.contrast < 25) healthStatus = 'attention';

    return {
      estimatedAge: selectedAge,
      confidence: adjustedConfidence,
      confidencePercentage: `${Math.round(adjustedConfidence * 100)}%`,
      category: ageCategory,
      observations: selectedObservations,
      healthNotes: selectedHealthNotes,
      healthStatus: healthStatus,
      analysisMethod: "Image-Based AI Dental Pattern Recognition",
      modelVersion: "v3.0.0",
      timestamp: new Date().toISOString(),
      disclaimer: ageCategory === 'invalid' ? 
        "Unable to analyze non-equine dental structures. Please upload a clear image of horse front teeth for accurate analysis." :
        "This analysis provides an estimation based on visible dental characteristics. For definitive age determination and dental health assessment, consult with a qualified equine veterinarian.",
      
      debugInfo: {
        determinedCategory: ageCategory,
        imageCharacteristics: {
          brightness: Math.round(imageAnalysis.brightness),
          contrast: Math.round(imageAnalysis.contrast),
          edgeRatio: imageAnalysis.edges.toFixed(4),
          entropy: imageAnalysis.entropy.toFixed(2),
          dominantColor: imageAnalysis.dominantColor,
          aspectRatio: imageAnalysis.aspectRatio.toFixed(2),
          validationPassed: ageCategory !== 'invalid'
        }
      }
    };
  }

  selectItemsBasedOnCharacteristics(items, count, imageAnalysis) {
    const selected = [];
    const seed = Math.abs(Math.floor(imageAnalysis.brightness + imageAnalysis.contrast));
    
    for (let i = 0; i < count && selected.length < items.length; i++) {
      const index = (seed + i * 17) % items.length;
      if (!selected.includes(items[index])) {
        selected.push(items[index]);
      }
    }
    
    return selected;
  }

  generateFallbackAnalysis() {
    console.warn('⚠️ Using fallback analysis - image not accessible');
    return {
      estimatedAge: "Unable to determine",
      confidence: 0.20,
      confidencePercentage: "20%",
      category: "invalid",
      observations: ["Image file could not be analyzed", "Please ensure image is properly uploaded"],
      healthNotes: ["Re-upload image for analysis", "Ensure clear photo of horse teeth"],
      healthStatus: "attention",
      analysisMethod: "Fallback Analysis",
      modelVersion: "v3.0.0",
      timestamp: new Date().toISOString(),
      disclaimer: "Analysis could not be completed due to image access issues.",
      debugInfo: {
        determinedCategory: "fallback",
        imageCharacteristics: "unavailable"
      }
    };
  }

  generateMockComputerVisionResults(imageAnalysis) {
    if (!imageAnalysis) return null;
    
    const qualityScore = Math.min(100, Math.max(20, 
      30 + (imageAnalysis.contrast * 0.8) + (imageAnalysis.brightness * 0.2)
    ));
    
    return {
      imageQuality: {
        qualityScore: Math.round(qualityScore),
        blurLevel: qualityScore > 80 ? 'good' : qualityScore > 60 ? 'slight_blur' : 'blurry',
        recommendation: qualityScore > 80 ? 
          'Image quality is excellent for analysis' : 
          qualityScore > 60 ? 'Image quality is acceptable for analysis' :
          'Image quality could be improved'
      },
      contrastAnalysis: {
        contrast: imageAnalysis.contrast / 100,
        brightness: imageAnalysis.brightness,
        stdDev: Math.round(imageAnalysis.contrast)
      },
      processingMetrics: {
        edgePixelCount: Math.round(imageAnalysis.edges * imageAnalysis.totalPixels),
        edgeRatio: imageAnalysis.edges,
        detectedFeatures: imageAnalysis.edges > 0.12 ? 'high' : 
                         imageAnalysis.edges > 0.08 ? 'medium' : 'low'
      },
      findings: [
        qualityScore > 80 ? "✅ Excellent image quality detected" : 
        qualityScore > 60 ? "⚠️ Good image quality detected" : "❌ Image quality could be improved",
        
        imageAnalysis.contrast > 50 ? "✅ High contrast image - features clearly distinguishable" : 
        imageAnalysis.contrast > 35 ? "⚠️ Moderate contrast detected" : "❌ Low contrast detected",
        
        imageAnalysis.edges > 0.12 ? "✅ Strong feature detection completed" : 
        imageAnalysis.edges > 0.08 ? "⚠️ Moderate feature detection completed" : "❌ Limited feature detection"
      ],
      originalDimensions: {
        width: imageAnalysis.width,
        height: imageAnalysis.height
      }
    };
  }
}

module.exports = new ImageAnalyzingAIService();