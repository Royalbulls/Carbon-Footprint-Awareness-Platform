import express from "express";
import path from "path";
import dotenv from "dotenv";
import { GoogleGenAI, Type } from "@google/genai";
import { createServer as createViteServer } from "vite";

// Load environment variables in local dev
dotenv.config();

const app = express();
const PORT = 3000;

app.use(express.json());

// Lazy-initialized Gemini client to prevent crash on startup if key is missing
let aiClient: GoogleGenAI | null = null;
function getGeminiClient(): GoogleGenAI {
  if (!aiClient) {
    const key = process.env.GEMINI_API_KEY;
    if (!key) {
      throw new Error("GEMINI_API_KEY is not defined in the environment secrets. Please configure it in Settings > Secrets.");
    }
    aiClient = new GoogleGenAI({
      apiKey: key,
      httpOptions: {
        headers: {
          'User-Agent': 'aistudio-build',
        }
      }
    });
  }
  return aiClient;
}

// 1. AI Sustainability Advisor Route
app.post("/api/advisor", async (req, res) => {
  try {
    const { profile, results, logs } = req.body;

    if (!results) {
      res.status(400).json({ error: "No footprint analysis results provided." });
      return;
    }

    const ai = getGeminiClient();

    // Draft a rich context prompt detailing household setup, calculations and history.
    const prompt = `
Analyze the following user profile and carbon footprint calculation details:

---
User Profile:
- Name: ${profile?.name || "User"}
- Country: ${profile?.country || "Worldwide"}
- Household Size: ${profile?.householdSize || 1} person(s)
- Sustainability Target Speed/Goal: ${profile?.sustainabilityGoal || "medium"} (Monthly Target: ${profile?.targetCO2 || 500} kg CO2)

---
Carbon Footprint Measurement results (Values in kg CO2/month):
- Total Monthly CO2: ${results.monthlyCO2} kg
- Annual Projected Footprint: ${results.yearlyCO2} kg
- Sustainability Score (0-100 where higher is cleaner): ${results.sustainabilityScore}
- Waste Diversion Rate: ${results.diversionRate}%
- Category Breakdown:
  - Electricity Consumption: ${results.categoryBreakdown?.electricity || 0} kg
  - Transport Commuting: ${results.categoryBreakdown?.transport || 0} kg
  - Household Waste: ${results.categoryBreakdown?.waste || 0} kg
  - Water Consumption: ${results.categoryBreakdown?.water || 0} kg
  - Flights & Air travel: ${results.categoryBreakdown?.flights || 0} kg

---
Historical records:
${logs && logs.length > 0 
  ? logs.map((l: any) => `- Month: ${l.month}, CO2: ${l.results?.monthlyCO2} kg`).join("\n")
  : "No older records available. This is the first month."
}

Generate structured sustainable recommendations and direct advice following the exact schema provided. Choose a model that delivers practical, realistic, and highly impactful actions. Make recommendations correspond explicitly to the main culprits (e.g., if Transport is high, suggest specific transport adjustments).
`;

    // Prompt instructions and formatting inside systemInstruction
    const systemInstruction = `
You are the AI Sustainability Advisor, an elite environmental scientist and domestic carbon mitigation planner.
Your job is to analyze individual households and recommend pragmatic, cost-effective adjustments to slash emissions.
Always structure recommendations. For each recommendation, provide:
- 'title': concise and encouraging (e.g., 'Switch to Smart Power Strips')
- 'description': detailed, factual rationale with matching figures if appropriate
- 'carbonReduction': expected monthly reduction in kg CO2 (pragmatic, e.g. 10 to 150 kg per action)
- 'feasibility': exactly 'Easy', 'Medium', or 'Hard'
- 'costEffectiveness': exactly 'Low Cost', 'Medium Cost', or 'Investment Required'
- 'category': exactly 'energy', 'transport', 'waste', or 'lifestyle'
- 'impactScore': a computed rating (carbonReduction * feasibility_multiplier * cost_efficiency)

Double-check calculations and ensure the response is perfectly aligned with the request schema. Do not output markdown wrapping on the outermost level—just provide raw JSON fulfilling the schema.
`;

    const responseSchema = {
      type: Type.OBJECT,
      properties: {
        summary: {
          type: Type.STRING,
          description: "A summary paragraph analyzing their performance, complimenting strengths, and pointing out the most impactful areas for improvement."
        },
        keyIssues: {
          type: Type.ARRAY,
          items: { type: Type.STRING },
          description: "List of 2-3 key issues representing their most carbon-intensive choices."
        },
        recommendations: {
          type: Type.ARRAY,
          items: {
            type: Type.OBJECT,
            properties: {
              title: { type: Type.STRING },
              description: { type: Type.STRING },
              carbonReduction: { type: Type.NUMBER },
              feasibility: { type: Type.STRING, description: "Must be exactly 'Easy', 'Medium', or 'Hard'." },
              costEffectiveness: { type: Type.STRING, description: "Must be exactly 'Low Cost', 'Medium Cost', or 'Investment Required'." },
              category: { type: Type.STRING, description: "Must be exactly 'energy', 'transport', 'waste', or 'lifestyle'." },
              impactScore: { type: Type.NUMBER, description: "An integer representing carbonReduction scaled by multipliers." }
            },
            required: ["title", "description", "carbonReduction", "feasibility", "costEffectiveness", "category", "impactScore"]
          },
          description: "A set of 4-6 highly tailored, actionable recommendations."
        },
        projectedSavings: {
          type: Type.ARRAY,
          items: { type: Type.STRING },
          description: "List of 2-3 forward savings predictions reflecting real steps."
        },
        actionPlan: {
          type: Type.ARRAY,
          items: { type: Type.STRING },
          description: "A chronological 3-month action plan (e.g., 'Month 1: ...', 'Month 2: ...')."
        }
      },
      required: ["summary", "keyIssues", "recommendations", "projectedSavings", "actionPlan"]
    };

    const response = await ai.models.generateContent({
      model: "gemini-3.5-flash",
      contents: prompt,
      config: {
        systemInstruction,
        responseMimeType: "application/json",
        responseSchema
      }
    });

    const parsedData = JSON.parse(response.text || "{}");
    res.json({ advice: parsedData });
  } catch (err: any) {
    console.error("Gemini Advisor Request failed:", err);
    res.status(500).json({ 
      error: "Failed to generate AI guidance.",
      details: err.message || err 
    });
  }
});

// Serve frontend
async function main() {
  if (process.env.NODE_ENV !== "production") {
    // Development server with Vite middleware integration
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    // Production serving of built assets
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Express Server running on port ${PORT} (Environment: ${process.env.NODE_ENV || 'development'})`);
  });
}

main().catch(err => {
  console.error("Fatal Server Startup Error:", err);
  process.exit(1);
});
