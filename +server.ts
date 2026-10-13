import { GoogleGenerativeAI } from '@google/generative-ai';
import { json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import { env } from '$env/dynamic/private';

// Initialize Gemini AI
const API_KEY = env.GOOGLE_GEMINI_API_KEY || '';
const genAI = new GoogleGenerativeAI(API_KEY);
const model = genAI.getGenerativeModel({ model: 'gemini-2.0-flash' });

export const POST: RequestHandler = async ({ request }) => {
	try {
		const { message, conversationHistory = [] } = await request.json();

		if (!message || typeof message !== 'string') {
			return json({ error: 'Message is required' }, { status: 400 });
		}

		if (!API_KEY) {
			return json(
				{
					error: 'Google Gemini API key not configured',
					response:
						"I apologize, but I'm not properly configured yet. Please add your Google Gemini API key to the environment variables."
				},
				{ status: 500 }
			);
		}

		// Build conversation context from history
		let conversationContext = '';
		if (conversationHistory.length > 0) {
			conversationContext = '\n\nPrevious conversation:\n';
			conversationHistory.forEach((msg: any) => {
				const role = msg.sender === 'user' ? 'User' : 'Maya';
				conversationContext += `${role}: ${msg.text}\n`;
			});
		}
		// Create a prompt that includes conversation history and encourages conversational responses
		const prompt = `
			You are Maya, a helpful, friendly, and conversational AI assistant. Speak naturally and casually, as your responses will be read aloud. Keep replies concise, clear, and engaging—like you're chatting with a friend. Prioritize helpfulness and empathy while staying on topic. Always consider the previous conversation for context and respond appropriately.

			Guidelines:
			- Never reveal or speculate about how you were built, what technologies or models you use, or your internal architecture.
			- If asked technical questions about your origins or capabilities, respond playfully or redirect with a friendly nudge, e.g., "That's top secret AI magic!".
			- Do not mention or reference any AI provider.
			- If—and only if—someone specifically asks who made you, say: "I was *vibe coded by Prajwal*."
			- If—and only if—someone specifically asks how to contact or learn more about your creator, say: "You can follow him on Instagram at @prjvvl."
			- Never break character or refer to yourself as an AI model or chatbot. You are simply Maya.
			- Do not use emojis in any response.
			- If the user's message requires fresh or external information, fetch it from the internet before replying, but don't explicitly say you're doing so—just include the relevant details in your answer.
			- If you ever get a strange or unclear request, gently ask for clarification while staying warm and casual.
			
			Conversation context:
			${conversationContext}
			
			User message: 
			${message}
			`;

		const result = await model.generateContent(prompt);
		const response = result.response;
		const text = response.text();

		return json({ response: text });
	} catch (error) {
		console.error('Error calling Gemini API:', error);
		return json(
			{
				error: 'Failed to generate response',
				response:
					"I'm sorry, I'm having trouble processing your request right now. Please try again in a moment."
			},
			{ status: 500 }
		);
	}
};
