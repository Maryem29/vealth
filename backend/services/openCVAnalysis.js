const cv = require('opencv4nodejs');
const sharp = require('sharp');
const fs = require('fs').promises;
const path = require('path');

class OpenCVAnalysisService {
  constructor() {
    console.log('🔬 OpenCV Analysis Service initialized');
    console.log('📊 OpenCV version:', cv.version);
  }

  /**
   * Main analysis function that processes horse teeth images
   * @param {string} imagePath - Path to the uploaded image
   * @returns {Object} Analysis results with processed images and metrics
   */
  async analyzeHorseTeeth(imagePath) {
    try {
      console.log('🔍 Starting OpenCV analysis for:', imagePath);
      
      // Read the image
      const originalImage = await cv.imreadAsync(imagePath);
      const height = originalImage.rows;
      const width = originalImage.cols;
      
      console.log(`📏 Image dimensions: ${width}x${height}`);

      // Perform multiple analyses
      const results = await Promise.all([
        this.enhanceImage(originalImage),
        this.detectEdges(originalImage),
        this.analyzeContrast(originalImage),
        this.detectTeethWithCascade(originalImage),
        /**this.detectTeethContours(originalImage),*/
        this.assessImageQuality(originalImage)
      ]);

      const [enhanced, edges, contrast, contours, quality] = results;

      // Generate analysis metrics
      const analysisMetrics = await this.generateMetrics(originalImage, enhanced, edges, contours);

      // Save processed images
      const processedImages = await this.saveProcessedImages(imagePath, {
        enhanced,
        edges,
        contours
      });

      return {
        success: true,
        originalDimensions: { width, height },
        quality: quality,
        contrast: contrast,
        metrics: analysisMetrics,
        processedImages: processedImages,
        findings: this.generateFindings(analysisMetrics, quality, contrast),
        timestamp: new Date().toISOString()
      };

    } catch (error) {
      console.error('❌ OpenCV analysis error:', error);
      throw new Error(`Computer vision analysis failed: ${error.message}`);
    }
  }

  /**
   * Enhance image contrast and brightness for better tooth visibility
   */
  async enhanceImage(image) {
    try {
      // Convert to grayscale for processing
      const gray = image.cvtColor(cv.COLOR_BGR2GRAY);
      
      // Apply CLAHE (Contrast Limited Adaptive Histogram Equalization)
      const clahe = new cv.CLAHE(2.0, new cv.Size(8, 8));
      const enhanced = clahe.apply(gray);
      
      // Apply Gaussian blur to reduce noise
      const denoised = enhanced.gaussianBlur(new cv.Size(3, 3), 0);
      
      // Convert back to BGR for saving
      const result = denoised.cvtColor(cv.COLOR_GRAY2BGR);
      
      console.log('✅ Image enhancement completed');
      return result;
    } catch (error) {
      console.error('Enhancement error:', error);
      throw error;
    }
  }

  /**
   * Detect edges to highlight tooth boundaries and wear patterns
   */
  async detectEdges(image) {
    try {
      // Convert to grayscale
      const gray = image.cvtColor(cv.COLOR_BGR2GRAY);
      
      // Apply Gaussian blur
      const blurred = gray.gaussianBlur(new cv.Size(5, 5), 0);
      
      // Canny edge detection
      const edges = blurred.canny(50, 150);
      
      // Dilate edges to make them more visible
      const kernel = cv.getStructuringElement(cv.MORPH_RECT, new cv.Size(2, 2));
      const dilated = edges.dilate(kernel);
      
      // Convert to BGR for colored output
      const result = dilated.cvtColor(cv.COLOR_GRAY2BGR);
      
      console.log('✅ Edge detection completed');
      return result;
    } catch (error) {
      console.error('Edge detection error:', error);
      throw error;
    }
  }

  /**
   * Analyze image contrast and lighting conditions
   */
  async analyzeContrast(image) {
    try {
      const gray = image.cvtColor(cv.COLOR_BGR2GRAY);
      
      // Calculate histogram
      const histSize = [256];
      const ranges = [0, 256];
      const hist = cv.calcHist([gray], [0], new cv.Mat(), histSize, ranges);
      
      // Calculate contrast metrics
      const mean = gray.mean();
      const stdDev = gray.stdDev();
      const contrast = stdDev.w / mean.w; // Coefficient of variation
      
      // Analyze brightness distribution
      const brightPixels = gray.threshold(200, 255, cv.THRESH_BINARY).countNonZero();
      const darkPixels = gray.threshold(50, 255, cv.THRESH_BINARY_INV).countNonZero();
      const totalPixels = gray.rows * gray.cols;
      
      return {
        contrast: Math.round(contrast * 100) / 100,
        brightness: Math.round(mean.w),
        stdDev: Math.round(stdDev.w),
        brightPixelRatio: Math.round((brightPixels / totalPixels) * 100) / 100,
        darkPixelRatio: Math.round((darkPixels / totalPixels) * 100) / 100
      };
    } catch (error) {
      console.error('Contrast analysis error:', error);
      throw error;
    }
  }



/**
 * Detect teeth using Haar Cascade classifier
 */
async detectTeethWithCascade(image) {
  try {
    // Load your teeth cascade classifier
    const teethCascade = new cv.CascadeClassifier();
    await teethCascade.load('Model/data/result/cascade.xml'); // Update with your actual path
    
    // Convert to grayscale (required for Haar cascades)
    const gray = image.cvtColor(cv.COLOR_BGR2GRAY);
    
    // Equalize histogram to improve contrast
    const equalized = gray.equalizeHist();
    
    // Detect teeth using the cascade
    const teeth = teethCascade.detectMultiScale(
      equalized,
      new cv.RectVector(),
      1.1,  // scaleFactor (adjust as needed)
      5,    // minNeighbors (adjust as needed)
      0,    // flags (usually 0)
      new cv.Size(10, 10), // minSize (minimum tooth size)
      new cv.Size(450, 450) // maxSize (maximum tooth size)
    );
    
    // Draw rectangles around detected teeth
    const result = image.copy();
    const color = new cv.Vec3(0, 255, 0); // Green color
    
    for (let i = 0; i < teeth.size(); i++) {
      const rect = teeth.get(i);
      result.drawRectangle(
        new cv.Point(rect.x, rect.y),
        new cv.Point(rect.x + rect.width, rect.y + rect.height),
        color,
        2
      );
      
      // Label each detection
      result.putText(
        `Tooth ${i + 1}`,
        new cv.Point(rect.x, rect.y - 5),
        cv.FONT_HERSHEY_SIMPLEX,
        0.6,
        color,
        2
      );
    }
    
    console.log(`✅ Detected ${teeth.size()} teeth using cascade classifier`);
    return result;
    
  } catch (error) {
    console.error('Cascade detection error:', error);
    throw error;
  }
}

  /**
   * Detect teeth contours and shapes
   */
 /**  async detectTeethContours(image) {
    try {
      // Convert to grayscale
      const gray = image.cvtColor(cv.COLOR_BGR2GRAY);
      
      // Apply threshold to create binary image
      const binary = gray.threshold(0, 255, cv.THRESH_BINARY + cv.THRESH_OTSU)[1];
      
      // Find contours
      const contours = binary.findContours(cv.RETR_EXTERNAL, cv.CHAIN_APPROX_SIMPLE);
      
      // Filter contours by area (likely teeth)
      const minArea = (image.rows * image.cols) * 0.001; // Minimum 0.1% of image
      const maxArea = (image.rows * image.cols) * 0.1;   // Maximum 10% of image
      
      const teethContours = contours.filter(contour => {
        const area = contour.area;
        return area > minArea && area < maxArea;
      });

      // Draw contours on result image
      const result = image.copy();
      
      teethContours.forEach((contour, index) => {
        const color = new cv.Vec3(0, 255, 0); // Green color
        result.drawContours([contour], -1, color, 2);
        
        // Add contour index
        const moments = contour.moments();
        if (moments.m00 !== 0) {
          const centroid = new cv.Point2(
            moments.m10 / moments.m00,
            moments.m01 / moments.m00
          );
          result.putText(`T${index + 1}`, centroid, cv.FONT_HERSHEY_SIMPLEX, 0.6, color, 2);
        }
      });

      console.log(`✅ Detected ${teethContours.length} potential teeth contours`);
      return result;
    } catch (error) {
      console.error('Contour detection error:', error);
      throw error;
    }
  } */

  /**
   * Assess overall image quality for dental analysis
   */
  async assessImageQuality(image) {
    try {
      const gray = image.cvtColor(cv.COLOR_BGR2GRAY);
      
      // Laplacian variance for blur detection
      const laplacian = gray.laplacian(cv.CV_64F);
      const variance = laplacian.stdDev().w ** 2;
      
      // Determine blur level
      let blurLevel = 'good';
      if (variance < 100) blurLevel = 'very_blurry';
      else if (variance < 300) blurLevel = 'blurry';
      else if (variance < 500) blurLevel = 'slight_blur';
      
      // Overall quality score (0-100)
      let qualityScore = Math.min(100, Math.max(0, (variance - 100) / 10));
      qualityScore = Math.round(qualityScore);

      return {
        blurVariance: Math.round(variance),
        blurLevel: blurLevel,
        qualityScore: qualityScore,
        recommendation: this.getQualityRecommendation(qualityScore, blurLevel)
      };
    } catch (error) {
      console.error('Quality assessment error:', error);
      throw error;
    }
  }

  /**
   * Generate comprehensive analysis metrics
   */
  async generateMetrics(original, enhanced, edges, contours) {
    try {
      const gray = original.cvtColor(cv.COLOR_BGR2GRAY);
      
      // Count edge pixels
      const edgeGray = edges.cvtColor(cv.COLOR_BGR2GRAY);
      const edgePixels = edgeGray.countNonZero();
      const totalPixels = gray.rows * gray.cols;
      const edgeRatio = edgePixels / totalPixels;

      // Calculate enhancement improvement
      const originalMean = gray.mean().w;
      const enhancedGray = enhanced.cvtColor(cv.COLOR_BGR2GRAY);
      const enhancedMean = enhancedGray.mean().w;
      const brightnessImprovement = enhancedMean - originalMean;

      return {
        edgePixelCount: edgePixels,
        edgeRatio: Math.round(edgeRatio * 1000) / 1000,
        brightnessImprovement: Math.round(brightnessImprovement),
        processingTime: Date.now(),
        detectedFeatures: edgePixels > totalPixels * 0.1 ? 'high' : edgePixels > totalPixels * 0.05 ? 'medium' : 'low'
      };
    } catch (error) {
      console.error('Metrics generation error:', error);
      throw error;
    }
  }

  /**
   * Save processed images to disk
   */
  async saveProcessedImages(originalPath, processedImages) {
    try {
      const dir = path.dirname(originalPath);
      const basename = path.basename(originalPath, path.extname(originalPath));
      
      const savedImages = {};

      for (const [type, image] of Object.entries(processedImages)) {
        const filename = `${basename}_${type}.jpg`;
        const filepath = path.join(dir, filename);
        
        await cv.imwriteAsync(filepath, image);
        savedImages[type] = `/uploads/${filename}`;
        console.log(`✅ Saved ${type} image: ${filename}`);
      }

      return savedImages;
    } catch (error) {
      console.error('Error saving processed images:', error);
      throw error;
    }
  }

  /**
   * Generate AI analysis findings based on computer vision results
   */
  generateFindings(metrics, quality, contrast) {
    const findings = [];

    // Image quality findings
    if (quality.qualityScore >= 80) {
      findings.push("✅ Excellent image quality detected - optimal for dental analysis");
    } else if (quality.qualityScore >= 60) {
      findings.push("⚠️ Good image quality - analysis can proceed with confidence");
    } else {
      findings.push("❌ Image quality could be improved - consider retaking photo");
    }

    // Contrast findings
    if (contrast.contrast > 0.5) {
      findings.push("✅ High contrast image - tooth features clearly distinguishable");
    } else if (contrast.contrast > 0.3) {
      findings.push("⚠️ Moderate contrast - some enhancement applied for better analysis");
    } else {
      findings.push("❌ Low contrast detected - enhanced processing applied");
    }

    // Edge detection findings
    if (metrics.edgeRatio > 0.1) {
      findings.push("✅ Strong dental feature detection - clear tooth boundaries identified");
    } else if (metrics.edgeRatio > 0.05) {
      findings.push("⚠️ Moderate feature detection - some dental structures visible");
    } else {
      findings.push("❌ Limited feature detection - image may need better positioning");
    }

    // Brightness findings
    if (contrast.brightness >= 120 && contrast.brightness <= 180) {
      findings.push("✅ Optimal lighting conditions for dental examination");
    } else if (contrast.brightness < 120) {
      findings.push("⚠️ Image appears dark - enhanced brightness for better visibility");
    } else {
      findings.push("⚠️ Image appears overexposed - contrast adjustment applied");
    }

    return findings;
  }

  /**
   * Get quality improvement recommendations
   */
  getQualityRecommendation(score, blurLevel) {
    if (score >= 80) {
      return "Image quality is excellent for analysis";
    } else if (score >= 60) {
      return "Good quality image - minor enhancements applied";
    } else if (blurLevel === 'very_blurry') {
      return "Image is too blurry - please ensure camera is focused and steady";
    } else if (blurLevel === 'blurry') {
      return "Image has some blur - try using better lighting and stable camera position";
    } else {
      return "Image quality can be improved - ensure good lighting and clear focus on teeth";
    }
  }

  /**
   * Clean up temporary files
   */
  async cleanup(imagePaths) {
    try {
      for (const imagePath of imagePaths) {
        await fs.unlink(imagePath);
      }
    } catch (error) {
      console.error('Cleanup error:', error);
    }
  }
}

module.exports = new OpenCVAnalysisService();