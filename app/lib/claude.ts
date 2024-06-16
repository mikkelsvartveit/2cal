import Anthropic from "@anthropic-ai/sdk";

const anthropic = new Anthropic({
	apiKey: import.meta.env.VITE_ANTHROPIC_API_KEY,
});

export const claude = async (systemPrompt: string, userPrompt: string) => {
	const claudeResponse = await anthropic.messages.create({
		model: "claude-3-haiku-20240307",
		max_tokens: 4096,
		system: systemPrompt,
		messages: [
			{
				role: "user",
				content: userPrompt,
			},
		],
	});

	const message = claudeResponse.content[0];

	if (message.type === "text") {
		return message.text;
	}

	throw new Error("Unexpected response from Claude");
};
