import { ActionFunction, redirect } from "@remix-run/node";
import { useActionData } from "@remix-run/react";

export const action: ActionFunction = async ({ request }) => {
	const formData = await request.formData();
	const email = formData.get("email");
	const password = formData.get("password");

	const response = await fetch("http://localhost:5064/login", {
		method: "POST",
		headers: {
			"Content-Type": "application/x-www-form-urlencoded",
		},
		body: `email=${email}&password=${password}`,
		credentials: "include",
	});

	// return redirect("/"); this doesn't allow the cookie to be set...
	return response;
};

export default function Login() {
	const actionData = useActionData();

	return (
	<div>
		<h1>Login</h1>
		<form method="post">
			<input type="email" name="email" id="email" required />
			<input type="password" name="password" id="password" required />
			<button type="submit">Login</button>
		</form>
	</div>
	);
}

