import { createServerFn } from "@tanstack/react-start";
import {
  getCookie,
  setCookie,
  deleteCookie,
} from "@tanstack/react-start/server";
import {
  SESSION_COOKIE,
  SESSION_MAX_AGE,
  createSessionToken,
  verifySessionToken,
  verifyPassword,
} from "@/lib/auth.server";

/* ── Login ── */
export const loginAdmin = createServerFn({ method: "POST" })
  .validator((d: { password: string }) => d)
  .handler(async ({ data }) => {
    if (!verifyPassword(data.password)) {
      return { ok: false as const, error: "Invalid password" };
    }

    const token = await createSessionToken();
    setCookie(SESSION_COOKIE, token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      path: "/",
      maxAge: SESSION_MAX_AGE,
    });

    return { ok: true as const };
  });

/* ── Logout ── */
export const logoutAdmin = createServerFn({ method: "POST" }).handler(
  async () => {
    deleteCookie(SESSION_COOKIE, { path: "/" });
    return { ok: true as const };
  },
);

/* ── Session check (safe to call from any page on load) ── */
export const checkAdmin = createServerFn({ method: "GET" }).handler(
  async () => {
    const token = getCookie(SESSION_COOKIE);
    return { authed: await verifySessionToken(token) };
  },
);