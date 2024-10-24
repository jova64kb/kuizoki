import type { MetaFunction } from "@remix-run/node";
import { json, LoaderFunctionArgs, redirect } from "@remix-run/node";
import { useLoaderData, Link } from "@remix-run/react";
import { commitSession, getSession } from "~/sessions";
import { createCSRFSeed, createCSRFToken } from "~/utils/csrf";

export const meta: MetaFunction = () => {
  return [
    { title: "Kuizoki" },
    { name: "description", content: "login form" },
  ];
};

export async function loader({
  request,
}: LoaderFunctionArgs) {
  const session = await getSession(
    request.headers.get("Cookie")
  );

  if (session.has("userId")) {
    return redirect("/profile");
  }

  let seed: string;
  if (session.has("csrf_seed")) {
    seed = session.get("csrf_seed") as string;
  } else {
    seed = createCSRFSeed();
    session.set("csrf_seed", seed);
  }
  const csrf = createCSRFToken("login", seed);
  const data = {
    csrf,
    error: session.get("error")
  };

  return json(data, {
    headers: {
      "Set-Cookie": await commitSession(session),
    },
  });
}

export default function Index() {
  const { csrf, error } = useLoaderData<typeof loader>();

  return (
    <div className="min-h-screen flex items-center justify-center bg-zinc-900 px-4">
      <div className="w-full max-w-md p-8 space-y-6 bg-zinc-800 border-zinc-700 border-2 rounded-2xl shadow-2xl">
        <h2 className="text-center text-3xl font-extrabold text-gray-100">
          Login to your account
        </h2>
        <form action="/login" method="post" className="mt-8 space-y-6">
          <input type="hidden" name="form_token" value={csrf} />
          <div className="space-y-4">
            <div>
              <label htmlFor="email" className="sr-only">
                Email
              </label>
              <input type="email" name="email" placeholder="Email" className="block w-full px-4 py-3 rounded-lg border border-zinc-700 placeholder-gray-400 text-gray-300 bg-zinc-950 focus:outline-none transition duration-200" />
            </div>
            <div>
              <label htmlFor="password" className="sr-only">
                Password
              </label>
              <input type="password" name="password" placeholder="Password" className="block w-full px-4 py-3 rounded-lg border border-zinc-700 placeholder-gray-400 text-gray-300 bg-zinc-950 focus:outline-none transition duration-200" />
            </div>
          </div>
          <div>
            <button type="submit" className="group relative w-full flex justify-center py-3 px-6 border border-transparent text-lg font-semibold rounded-lg text-white bg-green-700 hover:bg-green-600 transition duration-200">
              Login
            </button>
          </div>
        </form>

        <p className="mt-6 text-center text-sm text-gray-400">
          Don't have an account?{" "}
          <Link to="/register" className="font-medium text-gray-400 hover:text-purple-600">
            Register here!
          </Link>
        </p>

        {error ? <div className="error">{error}</div> : null}
      </div>
    </div>
  );
}
