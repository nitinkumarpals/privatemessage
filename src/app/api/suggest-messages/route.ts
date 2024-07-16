import { createGoogleGenerativeAI } from "@ai-sdk/google";
import { streamText, StreamingTextResponse } from 'ai';

const google = createGoogleGenerativeAI({
  apiKey: process.env.GOOGLE_API_KEY,
});

// Allow streaming responses up to 30 seconds
export const maxDuration = 30;

export async function POST(req: Request) {
  try {
    const { messages } = await req.json();
    const userPrompt = messages.prompt;
    const prompt = "Create a list of three open-ended and engaging questions formatted as a single string. Each question should be separated by '||'. These questions are for an anonymous social messaging platform, like Qooh.me, and should be suitable for a diverse audience. Avoid personal or sensitive topics, focusing instead on universal themes that encourage friendly interaction. For example, your output should be structured like this: 'What’s a hobby you’ve recently started?||If you could have dinner with any historical figure, who would it be?||What’s a simple thing that makes you happy?'. Ensure the questions are intriguing, foster curiosity, and contribute to a positive and welcoming conversational environment.";



    const result = await streamText({
      model: google('models/gemini-pro'),
      messages,
    });
  
    return new StreamingTextResponse(result.toAIStream());
  } catch (error) {
    console.error("An unexpected error occurred:", error);
    throw error;
  }
}