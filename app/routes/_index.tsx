import type {
	ActionFunction,
	LinksFunction,
	MetaFunction,
} from "@remix-run/cloudflare";
import {
	redirect,
	redirectDocument,
	useFetcher,
	useSearchParams,
} from "@remix-run/react";
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
		{ title: "2Cal – Create calendar events from text" },
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

	if (format === "google" || format === "outlook") {
		console.log(response);
		return redirect(response);
	}

	if (format === "ics") {
		return redirectDocument(
			`/download-ics?content=${encodeURIComponent(response)}`,
		);
	}
};

export default function Index() {
	const [format, setFormat] = useState("google");
	const [prompt, setPrompt] = useState("");

	const [searchParams, setSearchParams] = useSearchParams();

	const fetcher = useFetcher();

	useEffect(() => {
		// Load last used calendar format
		const savedFormat = localStorage.getItem("calendarFormat");
		if (savedFormat) {
			setFormat(savedFormat);
		}

		// Load prompt from URL
		const urlPrompt = searchParams.get("prompt");
		if (urlPrompt) {
			setPrompt(urlPrompt);
		}
	}, [searchParams]);

	useEffect(() => {
		// If prompt is set in the URL, submit the form automatically
		if (searchParams.get("prompt") && prompt && format) {
			searchParams.delete("prompt");
			setSearchParams(searchParams);

			fetcher.submit(document.getElementById("eventForm") as HTMLFormElement);
		}
	}, [prompt, format, searchParams, setSearchParams, fetcher.submit]);

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
							<SelectItem value="ics">Apple Calendar (ICS)</SelectItem>
							<SelectItem value="outlook">Outlook.com</SelectItem>
						</SelectGroup>
					</SelectContent>
				</Select>

				{format === "outlook" ? (
					<p className="text-sm mb-2 text-orange-400">
						Outlook.com does not support importing recurring events.
					</p>
				) : null}

				<Textarea
					rows={4}
					name="prompt"
					value={prompt}
					onChange={(e) => setPrompt(e.target.value)}
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

			<footer className="mt-12">
				<p className="text-center text-xs text-gray-400">
					Created by{" "}
					<a
						href="https://mikkelsvartveit.com"
						className="underline underline-offset-2"
						target="_blank"
						rel="noreferrer"
					>
						Mikkel Svartveit
					</a>{" "}
					· Source code on{" "}
					<a
						href="https://github.com/mikkelsvartveit/2cal"
						className="underline underline-offset-2"
						target="_blank"
						rel="noreferrer"
					>
						GitHub
					</a>
				</p>
			</footer>
		</main>
	);
}
