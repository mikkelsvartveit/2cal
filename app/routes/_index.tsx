import type {
	ActionFunction,
	LinksFunction,
	MetaFunction,
} from "@remix-run/cloudflare";
import { redirect, useFetcher } from "@remix-run/react";
import { LoadingSpinner } from "~/components/loadingspinner";
import { Button } from "~/components/ui/button";
import { Textarea } from "~/components/ui/textarea";
import stylesheet from "~/globals.css?url";
import { generateEvent } from "~/lib/generateEvent";

export const links: LinksFunction = () => [
	{ rel: "stylesheet", href: stylesheet },
];

export const meta: MetaFunction = () => {
	return [
		{ title: "2cal" },
		{
			name: "description",
			content: "Add complex events to your calendar using natural language.",
		},
	];
};

export const action: ActionFunction = async ({ request }) => {
	const formData = await request.formData();

	const prompt = formData.get("prompt") as string;
	const datetime = formData.get("datetime") as string;

	const { eventLink, icsFileContent } = await generateEvent(prompt, datetime);

	console.log(eventLink);
	console.log(icsFileContent);

	throw redirect(eventLink);
};

export default function Index() {
	const fetcher = useFetcher();

	const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
		if (e.key === "Enter" && !e.shiftKey) {
			e.preventDefault();
			fetcher.submit(document.getElementById("eventForm") as HTMLFormElement);
		}
	};

	return (
		<main className="mx-auto my-10 max-w-md px-2">
			<fetcher.Form
				id="eventForm"
				method="POST"
				className="flex flex-col items-center gap-4"
			>
				<Textarea
					rows={4}
					name="prompt"
					placeholder="ECON 101 Lecture, in Wheeler Hall 150, every Monday and Wednesday from 9:40 AM to 11 AM until the last week before Christmas"
					onKeyDown={handleKeyDown}
					className="text-base"
				/>

				<input type="hidden" name="datetime" value={new Date().toString()} />

				<Button type="submit">
					{fetcher.state === "submitting" ? <LoadingSpinner /> : "Create event"}
				</Button>
			</fetcher.Form>
		</main>
	);
}
