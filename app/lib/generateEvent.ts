import { claude } from "./claude";

const SYSTEM_PROMPT = `Your task is to write a Google Calendar event link AND an ICS file based on the user's input.

The current date and time is '${new Date().toString()}'.

If the user specifies a repeating event, make sure to include a recurrence rule in both the Google Calendar event link and in the ICS file.

Do NOT specify the timezone.

Do NOT include anything in the description/details unless the user specifies notes, etc.

Your ENTIRE reply should be the event link and the ICS file. Start the response with the event link on the first line, then a blank line, and then the ICS file starting on the third line.`;

export const generateEvent = async (prompt: string) => {
	const response = await claude(SYSTEM_PROMPT, prompt);

	const [eventLink, icsFileContent] = response.split("\n\n");

	return { eventLink, icsFileContent };
};
