import { ActionFunctionArgs, json, LoaderFunctionArgs, redirect } from "@remix-run/node";
import { useLoaderData } from "@remix-run/react";
import { commitSession, getSession } from "~/sessions";

export async function loader({
  request,
}: LoaderFunctionArgs) {
  const session = await getSession(
    request.headers.get("Cookie")
  );

  if (session.has("userId")) {
    const x = session.get("userId");
    console.log("userId:", x);
    return redirect("/"); // ?
  }

  const data = { error: session.get("error") };

  return json(data, {
    headers: {
      "Set-Cookie": await commitSession(session),
    },
  });
}

// delete!
function validateCredentials(
  email: FormDataEntryValue,
  password: FormDataEntryValue,
): string { 
  return "1";
}

export async function action({
  request
}: ActionFunctionArgs) {
  const session = await getSession(
    request.headers.get("Cookie")
  );
  const form = await request.formData();
  const email = form.get("email");
  const password = form.get("password");

  // real must be async because of db conn!
  const userId = validateCredentials(
    email ?? "",
    password ?? ""
  );

  if (userId == null) {
    session.flash("error", "Invalid email/password");

    return redirect("/login", {
      headers: {
        "Set-Cookie": await commitSession(session),
      },
    });
  }

  // If you need to track a unique ID in your cookie session
  // you will need to add an ID value yourself via session.set().
  session.set("userId", userId);

  // ?
  return redirect("/", {
    headers: {
      "Set-Cookie": await commitSession(session),
    },
  });
}

export default function Login() {
  const { error } = useLoaderData<typeof loader>();

  return (
    <div>
      {error ? <div className="error">{error}</div> : null}
      <form method="POST">
        <div>
          <p>login</p>
        </div>
        <label>
          E-mail: <input type="email" name="email" />
        </label>
        <label>
          Password:{" "}
          <input type="password" name="password" />
        </label>
        <button type="submit">login</button>
      </form>
    </div>
  );
}
