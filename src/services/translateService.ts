const BASE_URL = "https://generativelanguage.googleapis.com";

const MODEL_CANDIDATES = [
  { version: "v1", name: "gemini-2.5-flash" }, 
  { version: "v1beta", name: "gemini-3-flash" }, 
  { version: "v1", name: "gemini-1.5-flash" }
];

export const translateTextWithAI = async (text: string, targetLanguage: string): Promise<string> => {
  const API_KEY = process.env.GEMINI_API_KEY;
  
  if (!API_KEY) {
    throw new Error("Missing GEMINI_API_KEY in environment variables");
  }

  let lastError = "";

  for (const model of MODEL_CANDIDATES) {
    try {
      console.log(`Probing: ${model.version}/${model.name}...`);
      
      const response = await fetch(`${BASE_URL}/${model.version}/models/${model.name}:generateContent?key=${API_KEY}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          contents: [{ 
            parts: [{ text: `Translate to ${targetLanguage}: ${text}. Return ONLY the translation.` }] 
          }]
        })
      });

      const data = await response.json();

      if (response.ok && data.candidates?.[0]?.content?.parts?.[0]?.text) {
        console.log(`Success using ${model.name}`);
        return data.candidates[0].content.parts[0].text.trim();
      }

      lastError = data.error?.message || "Unknown Error";
      console.warn(`${model.name} unavailable: ${lastError}`);

    } catch (err: any) {
      lastError = err.message;
      continue;
    }
  }

  throw new Error(`All translation models failed. Last error: ${lastError}`);
};