const { GoogleGenerativeAI } = require("@google/generative-ai");
const fs = require('fs').promises;
const path = require('path');

// Access your API key as an environment variable (see "Set up your API key" above)
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

const model = genAI.getGenerativeModel({ model: "gemini-1.5-pro" });

// Configuration for retry mechanism
const MAX_RETRIES = 3;
const INITIAL_RETRY_DELAY = 1000; // 1 second

async function delay(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

async function retryWithExponentialBackoff(fn, retries = MAX_RETRIES, initialDelay = INITIAL_RETRY_DELAY) {
  try {
    return await fn();
  } catch (error) {
    if (retries <= 0) {
      throw error;
    }
    
    console.warn(`Retrying operation, attempts left: ${retries}`);
    await delay(initialDelay);
    return retryWithExponentialBackoff(fn, retries - 1, initialDelay * 2);
  }
}

async function processWithGemini(pdfBuffer) {
  const generationConfig = {
    temperature: 1,
    topP: 0.95,
    topK: 64,
    maxOutputTokens: 8192,
  };

  // Convert PDF buffer to base64
  const pdfBase64 = pdfBuffer.toString('base64');

  return retryWithExponentialBackoff(async () => {
    try {
      const prompt = "Your task is to extract the data in this solar quote to generate a comprehensive JSON response containing all of the solar quote data.";
      
      const result = await model.generateContent({
        contents: [
          { role: "user", parts: [{ text: prompt }] },
          { role: "user", parts: [
            { text: "Here's the PDF content in base64 format:" },
            { inlineData: { mimeType: "application/pdf", data: pdfBase64 } }
          ]}
        ],
        generationConfig,
      });

      return result.response.text();
    } catch (error) {
      console.error('Error in Gemini API call:', error);
      
      // Error handling remains the same
      if (error.status === 429) {
        console.warn('Rate limit exceeded. Retrying...');
        throw error; // Retry
      } else if (error.status >= 500) {
        console.warn('Server error. Retrying...');
        throw error; // Retry
      } else if (error.status === 401 || error.status === 403) {
        console.error('Authentication error. Check your API key.');
        throw error; // Don't retry for auth errors
      } else {
        console.error('Unexpected error:', error);
        throw error; // For unexpected errors, we'll still retry
      }
    }
  });
}

module.exports = { processWithGemini };