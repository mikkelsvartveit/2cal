import type { LinksFunction, MetaFunction } from "@remix-run/cloudflare";
import stylesheet from "~/globals.css?url";

export const links: LinksFunction = () => [
  { rel: "stylesheet", href: stylesheet },
];

export const meta: MetaFunction = () => {
  return [
    { title: "New Remix App" },
    {
      name: "description",
      content: "Welcome to Remix on Cloudflare!",
    },
  ];
};

export default function Index() {
  return <h1 className="text-2xl">Hello World</h1>;
}
