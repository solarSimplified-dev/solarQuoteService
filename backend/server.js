require('dotenv').config();
const express = require('express');
const multer = require('multer');
const cors = require('cors');
const fs = require('fs');
const rateLimit = require('express-rate-limit');
const { uploadFile, saveToDatabase } = require('./cloudStorage');
const { processWithGemini } = require('./geminiService');

const app = express();

// Rate limiting
const apiLimiter = rateLimit({
  windowMs: 60 * 60 * 1000, // 1 hour
  max: 10 // limit each IP to 50 requests per hour
});

// Apply rate limiting to all requests
app.use(apiLimiter);

// Multer configuration
const upload = multer({
  storage: multer.memoryStorage(),
  limits: {
    fileSize: 10 * 1024 * 1024, // 10 MB
    files: 1 // Allow only 1 file per request
  }
});

// Function to log to both console and file
function log(message) {
  console.log(message);
  fs.appendFileSync('server.log', message + '\n');
}

// Enable CORS for all routes
app.use(cors({
  origin: 'http://localhost:3000', // Allow requests from the frontend
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

app.post('/upload', upload.single('file'), async (req, res) => {
  log('Received upload request');
  try {
    if (!req.file) {
      log('No file uploaded');
      return res.status(400).json({ error: 'No file uploaded.' });
    }

    log(`File received: ${req.file.originalname}, Size: ${req.file.size} bytes`);

    // Upload file to Google Cloud Storage
    log('Uploading to Google Cloud Storage...');
    let fileUrl;
    try {
      fileUrl = await uploadFile(req.file);
      log('File uploaded, URL: ' + fileUrl);
    } catch (uploadError) {
      log('Error uploading file to Google Cloud Storage: ' + uploadError);
      return res.status(500).json({ error: 'Error uploading file', details: uploadError.message });
    }

    // Process file with Gemini
    log('Processing with Gemini...');
    let processedResult;
    try {
      processedResult = await processWithGemini(req.file.buffer);
      log('Gemini processing successful. Result: ' + processedResult);
    } catch (geminiError) {
      log('Error processing with Gemini: ' + geminiError);
      return res.status(500).json({ error: 'Error processing with Gemini', details: geminiError.message });
    }

    // Save processed result to database
    log('Saving result to database...');
    let savedData;
    try {
      savedData = await saveToDatabase({
        fileUrl,
        processedResult,
        fileName: req.file.originalname,
        fileSize: req.file.size
      });
      log('Data saved to database successfully: ' + JSON.stringify(savedData));
    } catch (dbError) {
      log('Error saving to database: ' + dbError);
      return res.status(500).json({ error: 'Error saving to database', details: dbError.message });
    }

    res.json({ fileUrl, processedResult, savedData });
  } catch (error) {
    log('Unexpected error: ' + error);
    res.status(500).json({ error: 'Unexpected error', details: error.message });
  }
});

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  log(`Server running on port ${PORT}`);
});