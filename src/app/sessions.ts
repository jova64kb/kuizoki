import { createCookie, createCookieSessionStorage } from "@remix-run/node";

const secret = process.env.COOKIE_SECRET || "";

// use SessionData to store:
// - client ip address => inconvenient for mobile users
// - user-agent
// - e-mail
// - username
// - user id
// - role
// - privilege level
// - access rights
// - language preferences
// - account id
// - current state
// - last login
// - session timeouts
// - other internal session details
// NOTE! you could store a jwt token here...

type SessionData = {
  userId: string; // userId is a name.
  csrf_seed: string;
};

type SessionFlashData = {
  error: string;
};

const { getSession, commitSession, destroySession } =
  createCookieSessionStorage<SessionData, SessionFlashData>({
      cookie: createCookie("__Host-SID", {
        path: "/",
        secrets: [secret],
        maxAge: 30 * 60, // see below!
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
