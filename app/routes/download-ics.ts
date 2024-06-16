import type { LoaderFunctionArgs } from "@remix-run/cloudflare";

export async function loader({ request }: LoaderFunctionArgs) {
	const icsContent = new URL(request.url).searchParams.get("content");

	return new Response(icsContent, {
		status: 200,
		headers: {
			"Content-Type": "text/calendar",
			"Content-Disposition": "attachment; filename=2cal-event.ics",
		},
	});
}
