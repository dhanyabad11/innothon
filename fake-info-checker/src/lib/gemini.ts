import { GoogleGenerativeAI } from '@google/generative-ai';

// Initialize the Gemini API
const genAI = new GoogleGenerativeAI(import.meta.env.VITE_GEMINI_API_KEY);
const model = genAI.getGenerativeModel({ model: 'gemini-pro' });
const visionModel = genAI.getGenerativeModel({ model: 'gemini-pro-vision' });

export async function generateContentSuggestions(prompt: string): Promise<string> {
  try {
    const result = await model.generateContent(prompt);
    const response = await result.response;
    return response.text();
  } catch (error) {
    console.error('Error generating content:', error);
    throw error;
  }
}

export async function improveAccessibility(content: string): Promise<string> {
  const prompt = `Make this social media post more accessible and inclusive, while maintaining its original meaning: "${content}"`;
  try {
    const result = await model.generateContent(prompt);
    const response = await result.response;
    return response.text();
  } catch (error) {
    console.error('Error improving accessibility:', error);
    throw error;
  }
}

export async function suggestContentWarnings(content: string): Promise<string[]> {
  const prompt = `Analyze this content and suggest appropriate content warnings if needed. Return only the warnings as a comma-separated list, or return "none" if no warnings are needed: "${content}"`;
  try {
    const result = await model.generateContent(prompt);
    const response = await result.response;
    const warnings = response.text().split(',').map(w => w.trim());
    return warnings[0].toLowerCase() === 'none' ? [] : warnings;
  } catch (error) {
    console.error('Error suggesting content warnings:', error);
    return [];
  }
}

export async function generateImageDescription(imageUrl: string): Promise<string> {
  try {
    const imageResponse = await fetch(imageUrl);
    const imageBlob = await imageResponse.blob();

    const prompt = "Generate a detailed, accessible description of this image for visually impaired users. Focus on key elements, context, and any text present in the image.";
    
    const result = await visionModel.generateContent([prompt, imageBlob]);
    const response = await result.response;
    return response.text();
  } catch (error) {
    console.error('Error generating image description:', error);
    throw error;
  }
}

export async function translateContent(content: string, targetLanguage: string): Promise<string> {
  const languageNames = {
    en: 'English',
    es: 'Spanish',
    fr: 'French',
    ar: 'Arabic',
    zh: 'Chinese'
  };

  const prompt = `Translate the following text to ${languageNames[targetLanguage as keyof typeof languageNames]}, maintaining its original meaning and context: "${content}"`;
  
  try {
    const result = await model.generateContent(prompt);
    const response = await result.response;
    return response.text();
  } catch (error) {
    console.error('Error translating content:', error);
    throw error;
  }
}