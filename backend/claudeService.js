const { Anthropic } = require('@anthropic-ai/sdk');
const fs = require('fs').promises;
const path = require('path');

const CLAUDE_API_KEY = process.env.CLAUDE_API_KEY;
const client = new Anthropic({ apiKey: CLAUDE_API_KEY });

async function convertPdfToPng(pdfBuffer) {
  console.warn('PDF to PNG conversion is not available. Returning placeholder message.');
  return ['PDF conversion not available'];
}

async function processWithClaude(pdfBuffer) {
  try {
    const images = await convertPdfToPng(pdfBuffer);
    
    const response = await client.messages.create({
      model: 'claude-3-5-sonnet-20240620',
      max_tokens: 2000,
      messages: [
        {
          role: 'user',
          content: [
            { type: 'text', text: 'PDF processing is currently unavailable. This is a placeholder message.' },
          ]
        }
      ]
    });

    return response.content[0].text;
  } catch (error) {
    console.error('Error processing with Claude:', error);
    throw error;
  }
}

module.exports = { processWithClaude };