import tailwindcss from '@tailwindcss/vite';
import path from 'path';
import {fileURLToPath} from 'url';
import {defineConfig, loadEnv} from 'vite';
import { GoogleGenAI } from "@google/genai";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export default defineConfig(({mode}) => {
  const env = loadEnv(mode, '.', '');
  
  return {
    plugins: [
      tailwindcss(),
      {
        name: 'gemini-api',
        configureServer(server) {
          server.middlewares.use(async (req, res, next) => {
            if (req.url === '/api/breeding-advice' && req.method === 'POST') {
              let body = '';
              req.on('data', chunk => { body += chunk; });
              req.on('end', async () => {
                try {
                  const { prompt } = JSON.parse(body);
                  const apiKey = env.GEMINI_API_KEY || process.env.GEMINI_API_KEY;
                  
                  if (!apiKey) {
                    res.statusCode = 500;
                    res.end(JSON.stringify({ error: 'GEMINI_API_KEY not found on server' }));
                    return;
                  }

                  const genAI = new GoogleGenAI(apiKey);
                  const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash" });
                  const result = await model.generateContent(prompt);
                  const response = await result.response;
                  res.setHeader('Content-Type', 'application/json');
                  res.end(JSON.stringify({ advice: response.text() }));
                } catch (e) {
                  res.statusCode = 500;
                  res.end(JSON.stringify({ error: e.message }));
                }
              });
            } else {
              next();
            }
          });
        }
      }
    ],
    resolve: {
      alias: {
        '@': path.resolve(__dirname, '.'),
      },
    },
    server: {
      hmr: process.env.DISABLE_HMR !== 'true',
    },
  };
});
