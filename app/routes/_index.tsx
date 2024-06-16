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

	// Sleep for 2 seconds to simulate a slow request
	const { eventLink, icsFileContent } = await generateEvent(prompt);

	console.log(eventLink);
	console.log(icsFileContent);

	throw redirect(eventLink);
};

export default function Index() {
	const fetcher = useFetcher();

	return (
		<main className="mx-auto my-10 max-w-sm">
			<fetcher.Form method="POST" className="flex flex-col items-center gap-4">
				<Textarea
					name="prompt"
					placeholder="ECON 101 Lecture, in Wheeler Hall 150, every Monday and Wednesday from 9:40 AM to 11 AM until the last week before Christmas"
				/>

				<Button>
					{fetcher.state === "submitting" ? <LoadingSpinner /> : "Create event"}
				</Button>
			</fetcher.Form>
		</main>
	);
}
