import OpenAI from "openai";

const openai = new OpenAI({
	baseURL: "https://openrouter.ai/api/v1",
	apiKey: import.meta.env.VITE_OPENROUTER_API_KEY,
	defaultHeaders: {
		"HTTP-Referer": "https://2cal.app",
		"X-Title": "2Cal",
	},
});

export const llm = async (systemPrompt: string, userPrompt: string) => {
	const completion = await openai.chat.completions.create({
		model: "google/gemini-2.0-flash-001",
		temperature: 0,
		max_tokens: 4096,
		messages: [
			{
				role: "system",
				content: systemPrompt,
			},
			{
				role: "user",
				content: userPrompt,
			},
		],
	});

	const message = completion.choices[0].message;

	if (message.content) {
		return message.content;
	}

	throw new Error("Unexpected response from OpenRouter");
};
