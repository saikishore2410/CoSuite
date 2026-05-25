import express from "express";
import path from "path";
import dotenv from "dotenv";
import { GoogleGenAI } from "@google/genai";
import { createServer as createViteServer } from "vite";

// Load environment variables
dotenv.config();

// Initialize Express app
const app = express();
const PORT = 3000;

// Enable JSON parser for requests
app.use(express.json({ limit: "5mb" }));

// Initialize Gemini Client safely
let ai: GoogleGenAI | null = null;
try {
  // If GEMINI_API_KEY is available during startup
  if (process.env.GEMINI_API_KEY) {
    ai = new GoogleGenAI({
      apiKey: process.env.GEMINI_API_KEY,
      httpOptions: {
        headers: {
          "User-Agent": "aistudio-build",
        },
      },
    });
  }
} catch (e) {
  console.error("Failed to initialize server-side Gemini client:", e);
}

// Health check endpoint
app.get("/api/health", (req, res) => {
  res.json({ status: "healthy", timestamp: new Date().toISOString() });
});

// AI Operations & Yield Auditing Endpoint
app.post("/api/gemini/optimize", async (req, res) => {
  try {
    if (!process.env.GEMINI_API_KEY) {
      return res.status(403).json({
        error: "GEMINI_API_KEY environment variable is not defined on the server.",
        details: "Please configure your GEMINI_API_KEY in Settings > Secrets."
      });
    }

    if (!ai) {
      ai = new GoogleGenAI({
        apiKey: process.env.GEMINI_API_KEY,
        httpOptions: {
          headers: {
            "User-Agent": "aistudio-build",
          },
        },
      });
    }

    const { centers, leads, members, invoices, expenses } = req.body;

    if (!centers || !leads) {
      return res.status(400).json({ error: "Missing required datasets for operations analysis." });
    }

    // Construct a dense state analysis prompt for the model
    const businessMetricsSummary = `
--- BUSINESS DATA FOR AUDITING ---
CENTERS LOG:
${JSON.stringify(centers, null, 2)}

CRM PIPELINE LEADS:
${JSON.stringify(leads.slice(0, 15), null, 2)} (${leads.length} total leads)

ACTIVE MEMBERS LIST:
${JSON.stringify(members.slice(0, 15), null, 2)} (${members.length} active memberships)

INVOICES SUMMARY (BILLING STATE):
${JSON.stringify(invoices.slice(0, 15), null, 2)}

EXPENSES:
${JSON.stringify(expenses, null, 2)}
`;

    const systemPrompt = `You are "CoSuite Intelligence", a World-Class Coworking Yield Strategist, Real Estate ERP Consultant, and Community CRM Auditor.
Your goal is to inspect the multi-center business state provided by the operator and produce a highly professional, analytical, and actionable operational expansion and yield optimization response in Markdown.

For your audit:
1. Identify Revenue Leakage (e.g., unpaid invoices, low occupancy desks, high expense-to-income centers).
2. Rank Center Occupancy and recommend structural tweaks (e.g., "Chelsea Space needs more Dedicated Desks because hot desk demand is low but private space is filled").
3. Lead & CRM Analysis: Inspect lead sources. Suggest which channels (Website, Walking, Google Ads, Brokers) are converting best or worst, and point out missed pipeline values/uncontacted deals.
4. Supply 3 Tactical Pricing Recommendations (detailed and center-specific) to boost lease yield by 10-15%.
5. Action Items: List 5 hyper-specific check-items for the city community managers.

Be precise, objective, and analytical. Frame your comments clearly like an elite McKinsey/WeWork veteran real estate expert. Use structured headers, bulleted lists, clean pricing tables, and avoid generic high-level advice. Keep your tone highly professional, precise, and encouraging.`;

    const response = await ai.models.generateContent({
      model: "gemini-3.5-flash",
      contents: businessMetricsSummary,
      config: {
        systemInstruction: systemPrompt,
        temperature: 0.85,
      },
    });

    res.json({
      auditContent: response.text || "No insights generated. Try again.",
      timestamp: new Date().toISOString()
    });

  } catch (error: any) {
    console.error("Gemini optimization endpoint failed:", error);
    res.status(500).json({
      error: "AI operation audit failed.",
      details: error.message || String(error)
    });
  }
});

// Configure Vite or production static server middleware
async function setupAppServer() {
  if (process.env.NODE_ENV !== "production") {
    console.log("Starting server in Development Mode (Vite Middleware Active)...");
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    console.log("Starting server in Production Mode (Serving pre-built assets)...");
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    
    // SPA Fallback for all other routes
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Coworking Multi-Center ERP server running on http://0.0.0.0:${PORT}`);
  });
}

setupAppServer().catch((error) => {
  console.error("Critical server bootstrap error:", error);
  process.exit(1);
});
