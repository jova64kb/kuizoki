import { ActionFunctionArgs, LoaderFunctionArgs, redirect } from "@remix-run/node";
import { commitSession, getSession } from "~/sessions";
import { validateCSRFToken } from "~/utils/csrf";

export function loader({ request }: LoaderFunctionArgs) {
  throw new Response("Not Found", { status: 404 });
};

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
    return redirect("/", {
      headers: {
        "Set-Cookie": await commitSession(session),
      },
    });
  }

  // If you need to track a unique ID in your cookie session
  // you will need to add an ID value yourself via session.set().
  session.set("userId", userId);

  // ?
  return redirect("/profile", {
    headers: {
      "Set-Cookie": await commitSession(session),
    },
  });
}
