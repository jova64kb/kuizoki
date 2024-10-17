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
			<a href="/msg">go fetch msg!</a>
		</>
  );
}

