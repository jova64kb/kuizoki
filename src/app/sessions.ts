import { createCookie, createCookieSessionStorage } from "@remix-run/node";

const secret = process.env.COOKIE_SECRET || "";

type SessionData = {
  userId: string;
};

type SessionFlashData = {
  error: string;
};

const { getSession, commitSession, destroySession } =
  createCookieSessionStorage<SessionData, SessionFlashData>({
      cookie: createCookie("__Host-kuizoki_auth", {
        path: "/",
        secrets: [secret],
        maxAge: 30 * 24 * 60 * 60, // see below!
        httpOnly: true,
        secure: true,
        sameSite: "strict",
      })
  });

export { getSession, commitSession, destroySession };


// Potential improvements and considerations:
//   - Shorter maxAge for highly sensitive applications.
//   - Rotating secrets.
//   - Regenerating session on sensitive actions.
