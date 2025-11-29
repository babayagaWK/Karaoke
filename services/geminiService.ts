import { GoogleGenAI, Type } from "@google/genai";
import { SongMetadata } from "../types";

const apiKey = import.meta.env.VITE_GEMINI_API_KEY;

if (!apiKey) {
  console.warn("⚠️ VITE_GEMINI_API_KEY is not set. AI analysis will not work.");
  console.warn("   Please set it in your .env.local file or environment variables.");
}

const ai = new GoogleGenAI({ apiKey: apiKey || "" });

export const analyzeSongWithGemini = async (base64Audio: string, mimeType: string): Promise<SongMetadata> => {
  if (!apiKey) {
    throw new Error("API Key not configured. Please set VITE_GEMINI_API_KEY in your .env.local file.");
  }

  try {
    const model = "gemini-2.0-flash";

    const response = await ai.models.generateContent({
      model: model,
      contents: {
        parts: [
          {
            inlineData: {
              data: base64Audio,
              mimeType: mimeType,
            },
          },
          {
            text: `Please listen to this audio clip. 
            1. Identify the song title and artist.
            2. Provide the full lyrics for the song.
            3. If it's an instrumental, state that in the lyrics field.
            4. Return the result in Thai or English depending on the song language.
            `,
          },
        ],
      },
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            title: { type: Type.STRING, description: "The title of the song" },
            artist: { type: Type.STRING, description: "The artist or band name" },
            album: { type: Type.STRING, description: "The album name if known" },
            lyrics: { type: Type.STRING, description: "Full lyrics of the song formatted with line breaks" },
            detectedLanguage: { type: Type.STRING, description: "Language of the song (e.g., Thai, English)" }
          },
          required: ["title", "artist", "lyrics"],
        },
      },
    });

    const text = response.text;
    if (!text) throw new Error("No response from Gemini");

    return JSON.parse(text) as SongMetadata;

  } catch (error) {
    console.error("Error analyzing song:", error);
    throw error;
  }
};
