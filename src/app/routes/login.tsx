import { ActionFunctionArgs, json, LoaderFunctionArgs, redirect } from "@remix-run/node";
import { useLoaderData } from "@remix-run/react";
import { commitSession, getSession } from "~/sessions";
import { createCSRFSeed, createCSRFToken, validateCSRFToken } from "~/utils/csrf";

export async function loader({
  request,
}: LoaderFunctionArgs) {
  const session = await getSession(
    request.headers.get("Cookie") // untrusted input!
  );

  if (session.has("userId")) {
    return redirect("/"); // ?
  }

  let seed: string;
  if (session.has("csrf_seed")) {
    seed = session.get("csrf_seed") as string;
  } else {
    seed = createCSRFSeed();
    session.set("csrf_seed", seed);
  }
  const csrf = createCSRFToken("login", seed); // used as form_token
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
    request.headers.get("Cookie") // untrusted input!
  );

  if (!session.has("csrf_seed")) {
    session.flash("error", "Missing security token.");
    return redirect("/", {
      headers: {
        "Set-Cookie": await commitSession(session),
      },
    });
  }

  const form = await request.formData(); // src of untrusted input!
  const seed = session.get("csrf_seed") as string;
  try {
    validateCSRFToken(String(form.get("form_token")), "login", seed);
  } catch (error) {
    session.flash("error", "Invalid security token.");
    return redirect("/", {
      headers: {
        "Set-Cookie": await commitSession(session),
      },
    });
  }
  const email = form.get("email"); // untrusted input!
  const password = form.get("password"); // untrusted input!

  // real must be async because of db conn!
  const userId = validateCredentials(
    email ?? "",
    password ?? ""
  );

  if (userId == null) {
    session.flash("error", "Invalid email/password.");
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
  const { csrf, error } = useLoaderData<typeof loader>();

  return (
    <div>
      {error ? <div className="error">{error}</div> : null}
      <form method="POST">
        <input type="hidden" name="form_token" value={csrf} />
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
