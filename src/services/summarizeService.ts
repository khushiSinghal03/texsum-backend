import { GoogleGenerativeAI } from "@google/generative-ai";

export async function summarizeTextWithAI(
  text: string, 
  length: 'short' | 'medium' | 'long',
  style: 'paragraph' | 'bullets'
) {
  const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY as string);
  
  // Using the stable 2026 model we identified
  const model = genAI.getGenerativeModel({ model: "gemini-3-flash-preview" });

  const lengthInstructions = {
    short: "Summarize this in 1-2 concise sentences.",
    medium: "Summarize this in a well-developed paragraph.",
    long: "Provide a comprehensive and detailed summary."
  };

  // FORCE formatting based on the 'style' parameter
  const styleInstruction = style === 'bullets' 
    ? "MANDATORY: Format the summary as a clean list of bullet points using '-' for each point." 
    : "MANDATORY: Format the summary as a cohesive, flowing paragraph. Do not use bullet points.";

  const prompt = `
    You are an expert summarizer. 
    Target Length: ${lengthInstructions[length]}
    Required Format: ${styleInstruction}
    
    Source Text:
    ${text}
  `;

  const result = await model.generateContent(prompt);
  const response = await result.response;
  return response.text();
}