import { redirect, type LoaderFunctionArgs } from "@remix-run/cloudflare";

export async function loader({ params }: LoaderFunctionArgs) {
	const prompt = params.prompt;

	return redirect(`/?prompt=${prompt}`);
}
