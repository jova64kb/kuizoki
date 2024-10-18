import type { MetaFunction } from "@remix-run/node";

export const meta: MetaFunction = () => {
  return [
    { title: "kuizoki" },
    { name: "description", content: "Welcome to kuizoki!" },
  ];
};

export default function Index() {
  return (
		<>
			<h1>Welcome to kuizoki!</h1>
			<ul>
				<li>
					<a href="/msg">go fetch msg!</a>
				</li>
				<li>
					<a href="/login">login</a>
				</li>
			</ul>
		</>
  );
}

