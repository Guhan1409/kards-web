import { GoogleGenAI, Type } from "@google/genai";
import { BusinessCard } from '../types';

const API_KEY = process.env.API_KEY;

if (!API_KEY) {
  throw new Error("API_KEY environment variable not set");
}

const ai = new GoogleGenAI({ apiKey: API_KEY });

const cardSchema = {
  type: Type.OBJECT,
  properties: {
    name: { type: Type.STRING, description: "The full name of the person." },
    title: { type: Type.STRING, description: "The job title or position." },
    company: { type: Type.STRING, description: "The name of the company or organization." },
    phone: { type: Type.STRING, description: "The primary phone number. Include country code if present." },
    email: { type: Type.STRING, description: "The primary email address." },
    website: { type: Type.STRING, description: "The company or personal website URL." },
    address: { type: Type.STRING, description: "The full physical address." },
  },
  required: ["name", "title", "company", "phone", "email", "website", "address"]
};

export const extractInfoFromImage = async (imageBase64: string): Promise<Omit<BusinessCard, 'id' | 'cardImage'>> => {
  try {
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: {
        parts: [
          {
            inlineData: {
              mimeType: 'image/jpeg',
              data: imageBase64,
            },
          },
          {
            text: "You are an expert business card scanner. Analyze the provided image of a business card and extract the contact information. Provide the output in the requested JSON format. If a field is not present on the card, return an empty string for that field."
          }
        ],
      },
      config: {
        responseMimeType: "application/json",
        responseSchema: cardSchema,
      },
    });

    const text = response.text?.trim();

    if (!text) {
      throw new Error("The AI returned an empty response. The image might be blurry, out of focus, or poorly lit. Please try again with a clearer picture.");
    }
    
    let extractedData;
    try {
        extractedData = JSON.parse(text);
    } catch (parseError) {
        console.error("Error parsing JSON from Gemini response:", parseError, "Response text:", text);
        throw new Error("The AI could not read the card's layout. Please try a different angle or better lighting.");
    }

    return {
        name: extractedData.name || '',
        title: extractedData.title || '',
        company: extractedData.company || '',
        phone: extractedData.phone || '',
        email: extractedData.email || '',
        website: extractedData.website || '',
        address: extractedData.address || '',
    };
  } catch (error) {
    console.error("Error extracting business card info:", error);
    if (error instanceof Error && (error.message.includes("blurry") || error.message.includes("layout") || error.message.includes("empty response"))) {
        // Forward our custom, user-friendly errors
        throw error;
    }
    // Generic error for other issues (network, API key, etc.)
    throw new Error("Failed to connect to the AI service. Please check your network connection and try again.");
  }
};