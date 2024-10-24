import { json, redirect, type LoaderFunctionArgs, type MetaFunction } from "@remix-run/node";
import { useLoaderData } from "@remix-run/react";
import { getSession } from "~/sessions";

export const meta: MetaFunction = () => {
  return [
    { title: "Profile" },
    { name: "description", content: "Profile informations." },
  ];
};

// NOTE! when retrieving data this must be sanitized.
// because we might have failed to not trust input
// somewhere...

export async function loader({
  request
}: LoaderFunctionArgs) {
  const session = await getSession(
    request.headers.get("Cookie")
  );

  if (!session.has("userId")) {
    return redirect("/");
  }

  const sessionData = { userId: session.get("userId") };
  return json(sessionData);
}

export default function Profile() {
  // xss could happen here...
  const { userId } = useLoaderData<typeof loader>();
  return (
    <>
      <h1>Profile</h1>
      <p>{userId}</p>
    </>
  );
}