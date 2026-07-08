import { createGoogleGenerativeAI } from "@ai-sdk/google";

if (!process.env.GEMINI_API_KEY) {
  // Not thrown at import time in prod to avoid breaking builds; checked at call sites.
  console.warn("GEMINI_API_KEY is not set — AI features will fail.");
}

export const google = createGoogleGenerativeAI({
  apiKey: process.env.GEMINI_API_KEY,
});

// Configurable model, defaults to a fast + capable Gemini model.
export const MODEL_ID = process.env.GEMINI_MODEL ?? "gemini-2.5-flash";

export const planModel = google(MODEL_ID);
