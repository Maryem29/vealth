const sqlite3 = require('sqlite3').verbose();
const path = require('path');

const dbPath = path.join(__dirname, '../../database/vealth.db');

class Database {
  constructor() {
    this.db = new sqlite3.Database(dbPath, (err) => {
      if (err) {
        console.error('❌ Error opening database:', err.message);
      } else {
        console.log('✅ Connected to SQLite database');
      }
    });
  }

  initialize() {
    // Create tables if they don't exist
    this.createTables();
  }

  createTables() {
    // Users table (for session management)
    const createUsersTable = `
      CREATE TABLE IF NOT EXISTS users (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        session_id TEXT UNIQUE NOT NULL,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        last_active DATETIME DEFAULT CURRENT_TIMESTAMP
      )
    `;

    // Image uploads table
    const createUploadsTable = `
      CREATE TABLE IF NOT EXISTS uploads (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        session_id TEXT NOT NULL,
        filename TEXT NOT NULL,
        original_name TEXT NOT NULL,
        file_path TEXT NOT NULL,
        file_size INTEGER,
        mime_type TEXT,
        uploaded_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (session_id) REFERENCES users (session_id)
      )
    `;

    // Analysis results table
    const createAnalysisTable = `
      CREATE TABLE IF NOT EXISTS analysis_results (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        upload_id INTEGER NOT NULL,
        session_id TEXT NOT NULL,
        estimated_age TEXT,
        confidence_score REAL,
        observations TEXT,
        health_notes TEXT,
        analysis_timestamp DATETIME DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (upload_id) REFERENCES uploads (id),
        FOREIGN KEY (session_id) REFERENCES users (session_id)
      )
    `;

    // Reports table
    const createReportsTable = `
      CREATE TABLE IF NOT EXISTS reports (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        analysis_id INTEGER NOT NULL,
        session_id TEXT NOT NULL,
        report_data TEXT,
        pdf_path TEXT,
        generated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (analysis_id) REFERENCES analysis_results (id),
        FOREIGN KEY (session_id) REFERENCES users (session_id)
      )
    `;

    // Execute table creation
    this.db.serialize(() => {
      this.db.run(createUsersTable, (err) => {
        if (err) console.error('❌ Error creating users table:', err);
        else console.log('✅ Users table ready');
      });

      this.db.run(createUploadsTable, (err) => {
        if (err) console.error('❌ Error creating uploads table:', err);
        else console.log('✅ Uploads table ready');
      });

      this.db.run(createAnalysisTable, (err) => {
        if (err) console.error('❌ Error creating analysis table:', err);
        else console.log('✅ Analysis table ready');
      });

      this.db.run(createReportsTable, (err) => {
        if (err) console.error('❌ Error creating reports table:', err);
        else console.log('✅ Reports table ready');
      });
    });
  }

  // Helper methods for database operations
  createUser(sessionId) {
    return new Promise((resolve, reject) => {
      const query = `INSERT INTO users (session_id) VALUES (?)`;
      this.db.run(query, [sessionId], function(err) {
        if (err) reject(err);
        else resolve(this.lastID);
      });
    });
  }

  getUser(sessionId) {
    return new Promise((resolve, reject) => {
      const query = `SELECT * FROM users WHERE session_id = ?`;
      this.db.get(query, [sessionId], (err, row) => {
        if (err) reject(err);
        else resolve(row);
      });
    });
  }

  saveUpload(uploadData) {
    return new Promise((resolve, reject) => {
      const query = `
        INSERT INTO uploads (session_id, filename, original_name, file_path, file_size, mime_type)
        VALUES (?, ?, ?, ?, ?, ?)
      `;
      const { sessionId, filename, originalName, filePath, fileSize, mimeType } = uploadData;
      
      this.db.run(query, [sessionId, filename, originalName, filePath, fileSize, mimeType], function(err) {
        if (err) reject(err);
        else resolve(this.lastID);
      });
    });
  }

  saveAnalysis(analysisData) {
    return new Promise((resolve, reject) => {
      const query = `
        INSERT INTO analysis_results (upload_id, session_id, estimated_age, confidence_score, observations, health_notes)
        VALUES (?, ?, ?, ?, ?, ?)
      `;
      const { uploadId, sessionId, estimatedAge, confidenceScore, observations, healthNotes } = analysisData;
      
      this.db.run(query, [
        uploadId, 
        sessionId, 
        estimatedAge, 
        confidenceScore, 
        JSON.stringify(observations), 
        JSON.stringify(healthNotes)
      ], function(err) {
        if (err) reject(err);
        else resolve(this.lastID);
      });
    });
  }

  getAnalysisHistory(sessionId, limit = 10) {
    return new Promise((resolve, reject) => {
      const query = `
        SELECT a.*, u.original_name, u.uploaded_at
        FROM analysis_results a
        JOIN uploads u ON a.upload_id = u.id
        WHERE a.session_id = ?
        ORDER BY a.analysis_timestamp DESC
        LIMIT ?
      `;
      
      this.db.all(query, [sessionId, limit], (err, rows) => {
        if (err) reject(err);
        else {
          // Parse JSON strings back to objects
          const results = rows.map(row => ({
            ...row,
            observations: JSON.parse(row.observations || '[]'),
            health_notes: JSON.parse(row.health_notes || '[]')
          }));
          resolve(results);
        }
      });
    });
  }

  close() {
    this.db.close((err) => {
      if (err) console.error('❌ Error closing database:', err);
      else console.log('✅ Database connection closed');
    });
  }
}

module.exports = new Database();