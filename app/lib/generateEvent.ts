import { llm } from "./llm";

const SYSTEM_PROMPT_TEMPLATE = `Your task is to write a {{response_type}} based on the user's input.

The current date and time is '{{datetime}}'.

If the user does not specify the start time, default to the current date/time.

If the user does not specify the end time or duration, default to 1 hour after the start time.

If the user specifies a repeating event, make sure to include a recurrence rule in the {{response_type}}.

Do NOT specify the timezone.

Do NOT include anything in the description/details unless the user specifies notes, etc.

Your ENTIRE reply should be the {{response_type}}.`;

export const generateEvent = async (
	prompt: string,
	format: string,
	datetime: string,
) => {
	let responseType = "";
	if (format === "google") {
		responseType = "Google Calendar event link";
	} else if (format === "ics") {
		responseType = "ICS file";
	} else if (format === "outlook") {
		responseType = "Outlook.com calendar event link";
	}

	const systemPrompt = SYSTEM_PROMPT_TEMPLATE.replaceAll(
		"{{response_type}}",
		responseType,
	).replace("{{datetime}}", datetime);

	let response = await llm(systemPrompt, prompt);

	if (format === "ics") {
		// Remove code fence from ICS response
		response = response.replace(/```ics\n|\n```/g, "").trim();
	}

	return response
};
