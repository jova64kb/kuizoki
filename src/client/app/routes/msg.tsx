import type { MetaFunction } from "@remix-run/node";

import type { LoaderArgs } from "@remix-run/node";
import { json } from "@remix-run/node";
import { useLoaderData } from "@remix-run/react";

export const meta: MetaFunction = () => {
	return [
		{ title: "msg" },
		{ name: "description", content: "Test message" },
	];
};

// BFF?
export const loader = async (args: LoaderArgs) => {
	const response = await fetch(
		"http://localhost:5064/msg"
	);

	return response;
};

export default function Msg() {
	// get msg from loader function
	const message = useLoaderData<typeof loader>();

	return (
		<>
			<h1>msg</h1>
			<p>{message}</p>
		</>
	);
}

