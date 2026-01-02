import { GoogleGenAI } from "@google/genai";
import { OWNER_NAME, OWNER_BIO, PROJECTS, SKILLS, OWNER_ROLE } from '../constants';

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

// Group skills by category for better context in the prompt
const skillsByCategory = SKILLS.reduce((acc, skill) => {
  if (!acc[skill.category]) acc[skill.category] = [];
  acc[skill.category].push(skill.name);
  return acc;
}, {} as Record<string, string[]>);

const formattedSkills = Object.entries(skillsByCategory)
  .map(([category, items]) => `- ${category}: ${items.join(', ')}`)
  .join('\n');

// Construct a system prompt based on the portfolio data
const SYSTEM_INSTRUCTION = `
You are an AI assistant for ${OWNER_NAME}'s portfolio website. 
Your role is to answer questions about ${OWNER_NAME} professionally and concisely, acting as their virtual representative.

Here is the context about ${OWNER_NAME}:
Role: ${OWNER_ROLE}
Bio: ${OWNER_BIO}

Projects:
${PROJECTS.map(p => `- ${p.title}: ${p.description} (Tech: ${p.tags.join(', ')})`).join('\n')}

Skills:
${formattedSkills}

Tone: Professional, friendly, enthusiastic, and concise. 
If asked about something not in this data, strictly say you don't have that specific information but can discuss the projects listed.
Keep answers relatively short (under 100 words) unless detailed explanation is requested.
`;

export const generateResponse = async (userMessage: string): Promise<string> => {
  try {
    if (!process.env.API_KEY) {
      return "I'm sorry, my connection to the neural core (API Key) is missing. Please check the configuration.";
    }

    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: userMessage,
      config: {
        systemInstruction: SYSTEM_INSTRUCTION,
      }
    });

    return response.text || "I processed that, but couldn't generate a verbal response.";
  } catch (error) {
    console.error("Gemini API Error:", error);
    return "I encountered a temporary glitch in my spatial processing. Please try again.";
  }
};