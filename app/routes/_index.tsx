import type { LinksFunction, MetaFunction } from "@remix-run/cloudflare";
import { Button } from "~/components/ui/button";
import { Textarea } from "~/components/ui/textarea";
import stylesheet from "~/globals.css?url";

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

export default function Index() {
	return (
		<main className="mx-auto my-10 max-w-sm">
			<form className="flex flex-col items-center gap-4">
				<Textarea placeholder="ECON 101 Lecture, in Wheeler Hall 150, every Monday and Wednesday from 9:40 AM to 11 AM until the last week before Christmas" />

				<Button>Create event</Button>
			</form>
		</main>
	);
}
