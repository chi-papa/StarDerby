import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import { GoogleGenAI } from "@google/genai";
import dotenv from 'dotenv';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const port = 3000;

app.use(express.json());

// Gemini Setup (Lazy function)
async function getGeminiAdvice(prompt) {
  if (!process.env.GEMINI_API_KEY) {
    throw new Error('GEMINI_API_KEY environment variable is required');
  }
  const genAI = new GoogleGenAI(process.env.GEMINI_API_KEY);
  const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash" });
  const result = await model.generateContent(prompt);
  const response = await result.response;
  return response.text();
}

app.post('/api/breeding-advice', async (req, res) => {
  try {
    const { prompt } = req.body;
    const advice = await getGeminiAdvice(prompt);
    res.json({ advice });
  } catch (error) {
    console.error("Gemini API Error:", error);
    res.status(500).json({ error: error.message });
  }
});

// Serve static files from the build directory
app.use(express.static(path.join(__dirname, 'dist')));

// Fallback to index.html for SPA
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'dist', 'index.html'));
});

app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});
