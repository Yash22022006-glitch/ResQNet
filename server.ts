import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";
import axios from "axios";
import { GoogleGenAI } from "@google/genai";
import dotenv from "dotenv";

dotenv.config();

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json());

  // OpenRouter Gemma 4 Integration
  const OPENROUTER_URL = "https://openrouter.ai/api/v1/chat/completions";

  app.post("/api/ai/chat", async (req, res) => {
    const { prompt, context, systemInstruction } = req.body;
    
    const apiKey = process.env.OPENROUTER_API_KEY;
    
    if (!apiKey || apiKey.length < 5) {
      console.warn("OPENROUTER_API_KEY is missing or invalid. Please set it in Settings. Falling back to Gemini.");
      return handleGeminiFallback(req, res);
    }

    try {
      console.log("Calling OpenRouter API with model: google/gemma-4-31b-it...");
      const response = await axios.post(
        OPENROUTER_URL,
        {
          model: "google/gemma-4-31b-it",
          messages: [
            { role: "system", content: systemInstruction },
            { role: "user", content: `Context: ${context}\n\nPrompt: ${prompt}` }
          ],
          max_tokens: 16384,
          temperature: 1.0,
          top_p: 0.95,
          stream: false,
          // OpenRouter specific parameters can be added here
        },
        {
          headers: {
            "Authorization": `Bearer ${apiKey.trim()}`,
            "Content-Type": "application/json",
            "HTTP-Referer": process.env.APP_URL || "http://localhost:3000",
            "X-Title": "RESQNET AI",
          },
          timeout: 45000 // 45 second timeout for OpenRouter
        }
      );

      if (response.data && response.data.choices && response.data.choices[0]) {
        res.json({ text: response.data.choices[0].message.content });
      } else {
        throw new Error("Unexpected OpenRouter API response format");
      }
    } catch (error: any) {
      const errorDetail = error.response?.data?.error?.message || error.response?.data?.message || error.message;
      console.error(`OpenRouter API Error (${error.response?.status || 'Unknown'}):`, errorDetail);
      
      // If unauthorized, specifically warn the user
      if (error.response?.status === 401) {
        console.error("CRITICAL: OpenRouter Authentication failed. Check your API key in settings.");
      }
      
      handleGeminiFallback(req, res);
    }
  });

  async function handleGeminiFallback(req: any, res: any) {
    const { prompt, systemInstruction } = req.body;
    const geminiKey = process.env.GEMINI_API_KEY;

    if (!geminiKey) {
      return res.status(500).json({ error: "No AI API keys configured." });
    }

    try {
      const ai = new GoogleGenAI({
        apiKey: geminiKey,
        httpOptions: {
          headers: {
            'User-Agent': 'aistudio-build',
          }
        }
      });
      
      const response = await ai.models.generateContent({
        model: "gemini-3-flash-preview",
        contents: prompt,
        config: {
          systemInstruction: systemInstruction,
        }
      });

      res.json({ text: response.text });
    } catch (err: any) {
      console.error("Gemini Fallback Error:", err);
      res.status(500).json({ error: "Failed to generate AI response." });
    }
  }

  // Vite middleware for development
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();
