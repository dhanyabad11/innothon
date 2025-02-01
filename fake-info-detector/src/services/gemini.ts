import { GoogleGenerativeAI } from "@google/generative-ai";

// Initialize the Gemini API with your API key
const genAI = new GoogleGenerativeAI(import.meta.env.VITE_GEMINI_API_KEY);

export async function analyzePost(title: string, content: string) {
    try {
        const model = genAI.getGenerativeModel({ model: "gemini-pro" });

        const prompt = `
      Analyze the following post for truthfulness and credibility:
      
      Title: ${title}
      Content: ${content}
      
      Provide your analysis in the following JSON format:
      {
        "isFake": boolean (true if likely fake, false if likely true),
        "confidence": number (between 0 and 1),
        "explanation": string (brief explanation of your analysis)
      }
    `;

        const result = await model.generateContent(prompt);
        const response = await result.response;
        const text = response.text();

        return JSON.parse(text);
    } catch (error) {
        console.error("Error analyzing post:", error);
        throw error;
    }
}
