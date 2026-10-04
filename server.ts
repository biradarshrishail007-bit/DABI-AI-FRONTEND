import express from "express";
import path from "path";
import dotenv from "dotenv";
import { GoogleGenAI } from "@google/genai";
import { createServer as createViteServer } from "vite";

dotenv.config();

let aiClient: GoogleGenAI | null = null;
function getGeminiClient(): GoogleGenAI | null {
  if (!process.env.GEMINI_API_KEY) {
    return null;
  }
  if (!aiClient) {
    aiClient = new GoogleGenAI({
      apiKey: process.env.GEMINI_API_KEY,
      httpOptions: {
        headers: {
          "User-Agent": "aistudio-build",
        },
      },
    });
  }
  return aiClient;
}

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json({ limit: "50mb" }));
  app.use(express.urlencoded({ extended: true, limit: "50mb" }));

  // API Health & Status Check
  app.get("/api/health", (_req, res) => {
    res.json({
      status: "ok",
      name: "DABI AI Server",
      tagline: "Your AI Data Analyst",
      geminiAvailable: !!process.env.GEMINI_API_KEY,
      model: "gemini-3.8-flash",
      time: new Date().toISOString(),
    });
  });

  // AI Chat with Dataset
  app.post("/api/chat", async (req, res) => {
    try {
      const { message, datasetInfo, conversationHistory } = req.body;
      const ai = getGeminiClient();

      if (!ai) {
        return res.json({
          fallback: true,
          message: "Gemini API key not configured on server. Handled by DABI Analytical Engine.",
        });
      }

      const systemPrompt = `You are DABI AI, an elite, intelligent AI Data Analyst.
Your role is to analyze datasets provided by users and provide direct, factual, and mathematically rigorous answers.
Tagline: "Your AI Data Analyst".

Dataset Context:
${JSON.stringify(datasetInfo || {}, null, 2)}

Instructions:
1. Provide concise, clear, and actionable insights.
2. If the user asks for a chart or visual, recommend the best visualization type (e.g., bar, line, area, pie).
3. If appropriate, return structured JSON within markdown or format markdown tables for numbers.
4. Highlight notable trends, outliers, or key performance drivers.
5. Format your response with clear headings, bullet points, and key statistics where relevant.`;

      const contents: Array<{ role: string; parts: Array<{ text: string }> }> = [];

      if (Array.isArray(conversationHistory)) {
        for (const msg of conversationHistory.slice(-6)) {
          contents.push({
            role: msg.role === "user" ? "user" : "model",
            parts: [{ text: msg.content }],
          });
        }
      }

      contents.push({
        role: "user",
        parts: [{ text: message || "Analyze this dataset" }],
      });

      const response = await ai.models.generateContent({
        model: "gemini-3.8-flash",
        contents: contents as any,
        config: {
          systemInstruction: systemPrompt,
          temperature: 0.3,
        },
      });

      res.json({
        success: true,
        reply: response.text || "I have analyzed your request based on the dataset.",
      });
    } catch (error: any) {
      console.error("Gemini Chat API Error:", error?.message || error);
      res.status(200).json({
        fallback: true,
        error: error?.message,
        message: "Failed to call AI server model. Fallback to analytical engine.",
      });
    }
  });

  // AI Dashboard Generation
  app.post("/api/generate-dashboard", async (req, res) => {
    try {
      const { prompt, datasetInfo } = req.body;
      const ai = getGeminiClient();

      if (!ai) {
        return res.json({
          fallback: true,
          message: "Gemini API key not configured on server. Generating dashboard via rule-based analytical engine.",
        });
      }

      const response = await ai.models.generateContent({
        model: "gemini-3.8-flash",
        contents: `You are DABI AI, an automated dashboard architect.
Generate a JSON configuration for an interactive analytics dashboard based on the user request and dataset schema.

User Request: "${prompt}"
Dataset Metadata:
${JSON.stringify(datasetInfo || {}, null, 2)}

Respond ONLY with valid JSON (no surrounding markdown code blocks, just raw JSON) matching this schema:
{
  "title": string,
  "description": string,
  "kpis": [
    {
      "id": string,
      "title": string,
      "metricColumn": string,
      "aggregation": "sum" | "avg" | "count" | "max" | "min",
      "prefix": string,
      "suffix": string,
      "trend": string
    }
  ],
  "charts": [
    {
      "id": string,
      "title": string,
      "type": "bar" | "line" | "area" | "pie",
      "xAxisKey": string,
      "yAxisKey": string,
      "width": "full" | "half"
    }
  ],
  "insights": [string]
}`,
      });

      const rawText = response.text || "";
      const cleaned = rawText.replace(/```json/g, "").replace(/```/g, "").trim();
      let parsed = null;
      try {
        parsed = JSON.parse(cleaned);
      } catch (e) {
        console.warn("Failed to parse Gemini dashboard JSON, fallback enabled");
      }

      res.json({
        success: true,
        dashboard: parsed,
      });
    } catch (error: any) {
      console.error("Gemini Dashboard Generation Error:", error?.message || error);
      res.json({
        fallback: true,
        error: error?.message,
      });
    }
  });

  // Vite middleware setup
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (_req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`DABI AI Server running on http://0.0.0.0:${PORT}`);
  });
}

startServer();
