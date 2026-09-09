import { google } from '@ai-sdk/google';
import { streamText, Message } from 'ai';
import { personalities, PersonalityId } from '@/lib/personalities';

// Allow streaming responses up to 30 seconds
export const maxDuration = 30;

export async function POST(req: Request) {
  try {
    const { messages, personalityId } = await req.json();

    const personality = personalities[personalityId as PersonalityId] || personalities.KurdoAI;

    // Check if API key is configured
    if (!process.env.GOOGLE_GENERATIVE_AI_API_KEY) {
      // Return a simple mock stream if no API key is set
      const mockText = `(Mock Mode) This is a fake response from ${personality.name} because GOOGLE_GENERATIVE_AI_API_KEY is not set in environment variables.`;
      
      const encoder = new TextEncoder();
      const stream = new ReadableStream({
        async start(controller) {
          // Send the mock text in the format expected by useChat (0:"text"\n)
          controller.enqueue(encoder.encode(`0:"${mockText}"\n`));
          controller.close();
        },
      });

      return new Response(stream, {
        headers: {
          'Content-Type': 'text/plain; charset=utf-8',
          'x-vercel-ai-data-stream': 'v1',
        },
      });
    }

    // Convert messages to the format expected by the AI SDK
    // But we need to ensure the system prompt is injected
    
    // We can use the 'system' parameter in streamText
    const apiMessages = messages.filter((m: any) => m.role === 'user' || m.role === 'assistant');

    const result = await streamText({
      // @ts-ignore - Bypass version mismatch between @ai-sdk/google and ai packages
      model: google('gemini-3.8-flash'),
      system: personality.systemPrompt,
      messages: apiMessages,
    });

    return result.toDataStreamResponse();
  } catch (error: any) {
    console.error('Chat API Error:', error);
    return new Response(JSON.stringify({ error: error.message || 'Internal Server Error' }), { status: 500 });
  }
}
