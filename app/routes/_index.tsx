import type {
	ActionFunction,
	LinksFunction,
	MetaFunction,
} from "@remix-run/cloudflare";
import { redirect, redirectDocument, useFetcher } from "@remix-run/react";
import { useEffect, useState } from "react";
import { LoadingSpinner } from "~/components/loadingspinner";
import { Button } from "~/components/ui/button";
import {
	Select,
	SelectContent,
	SelectGroup,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "~/components/ui/select";
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
	const format = formData.get("format") as string;
	const datetime = formData.get("datetime") as string;

	const response = await generateEvent(prompt, format, datetime);

	if (format === "google") {
		return redirect(response);
	}

	if (format === "ics") {
		return redirectDocument(
			`/download-ics?content=${encodeURIComponent(response)}`,
		);
	}
};

export default function Index() {
	const fetcher = useFetcher();
	const [format, setFormat] = useState("google");

	useEffect(() => {
		const savedFormat = localStorage.getItem("calendarFormat");
		if (savedFormat) {
			setFormat(savedFormat);
		}
	}, []);

	const handleFormatChange = (value: string) => {
		setFormat(value);
		localStorage.setItem("calendarFormat", value);
	};

	const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
		if (e.key === "Enter" && !e.shiftKey) {
			e.preventDefault();
			fetcher.submit(document.getElementById("eventForm") as HTMLFormElement);
		}
	};

	return (
		<main className="mx-auto my-10 max-w-md px-4">
			<fetcher.Form
				id="eventForm"
				method="POST"
				className="flex flex-col items-center"
			>
				<Select name="format" value={format} onValueChange={handleFormatChange}>
					<SelectTrigger className="min-w-56 flex-grow mb-2">
						<SelectValue />
					</SelectTrigger>

					<SelectContent>
						<SelectGroup>
							<SelectItem value="google">Google Calendar</SelectItem>
							<SelectItem value="ics">Apple Calendar (.ics)</SelectItem>
						</SelectGroup>
					</SelectContent>
				</Select>
				<Textarea
					rows={4}
					name="prompt"
					placeholder="ECON 101 Lecture, in Wheeler Hall 150, every Monday and Wednesday from 9:40 AM to 11 AM until the last week before Christmas"
					required
					onKeyDown={handleKeyDown}
					className="text-base mb-4"
				/>

				<input type="hidden" name="datetime" value={new Date().toString()} />

				<Button type="submit">
					{fetcher.state === "submitting" ? <LoadingSpinner /> : "Create event"}
				</Button>
			</fetcher.Form>
		</main>
	);
}
