import { useState } from "react";
import { createFileRoute, Link } from "@tanstack/react-router";
import { resetPassword } from "@/functions/password-reset";
import { PasswordStrength } from "@/components/account/PasswordStrength";
import { passwordMeetsPolicy } from "@/lib/password-strength";

type ResetSearch = { token?: string };

export const Route = createFileRoute("/reset-password")({
  validateSearch: (search: Record<string, unknown>): ResetSearch => ({
    token: typeof search.token === "string" ? search.token : undefined,
  }),
  head: () => ({
    meta: [
      { title: "Reset password — JnB Power Tools & Digital Electronics" },
      { name: "robots", content: "noindex" },
      // Keeps the token in the address bar from being passed to other sites
      { name: "referrer", content: "no-referrer" },
    ],
  }),
  component: ResetPasswordPage,
});

const inputClass =
  "w-full h-12 px-4 rounded-xl border border-border bg-white text-foreground focus:outline-none focus:ring-2 focus:ring-primary";

function ResetPasswordPage() {
  const { token } = Route.useSearch();
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [error, setError] = useState("");
  const [done, setDone] = useState(false);
  const [loading, setLoading] = useState(false);

  const passwordOk = passwordMeetsPolicy(password);
  const matches = password === confirm;

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!token) return;
    if (!matches) {
      setError("The two passwords don't match.");
      return;
    }
    setLoading(true);
    setError("");
    try {
      const res = await resetPassword({ data: { token, password } });
      if (res.ok) setDone(true);
      else setError(res.error);
    } catch {
      setError("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <section className="py-14 bg-background">
      <div className="container-x">
        <div className="mx-auto w-full max-w-md card-surface p-8">
          <h1 className="text-2xl font-bold text-center">Choose a new password</h1>

          {!token ? (
            <div className="mt-6 text-center">
              <p className="text-sm text-muted-foreground">
                This reset link is incomplete. Please request a new one.
              </p>
              <Link to="/forgot-password" className="btn-primary mt-6 inline-flex">
                Request a new link
              </Link>
            </div>
          ) : done ? (
            <div className="mt-6 text-center">
              <p className="rounded-xl bg-emerald-50 p-4 text-sm text-emerald-800">
                Your password has been changed. You've been signed out everywhere, so log in with
                your new password.
              </p>
              <Link to="/login" search={{}} className="btn-primary mt-6 inline-flex">
                Log in
              </Link>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="mt-6 space-y-4">
              <div>
                <label htmlFor="password" className="mb-1 block text-sm font-medium">
                  New password
                </label>
                <input
                  id="password"
                  type="password"
                  autoComplete="new-password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className={inputClass}
                />
                <PasswordStrength password={password} />
              </div>
              <div>
                <label htmlFor="confirm" className="mb-1 block text-sm font-medium">
                  Confirm new password
                </label>
                <input
                  id="confirm"
                  type="password"
                  autoComplete="new-password"
                  required
                  value={confirm}
                  onChange={(e) => setConfirm(e.target.value)}
                  className={inputClass}
                />
                {confirm && !matches && (
                  <p className="mt-1 text-xs text-red-600">The passwords don't match yet.</p>
                )}
              </div>

              {error && (
                <p role="alert" className="text-center text-sm text-red-600">
                  {error}{" "}
                  {error.includes("expired") && (
                    <Link to="/forgot-password" className="font-semibold underline">
                      Request a new link
                    </Link>
                  )}
                </p>
              )}

              <button
                type="submit"
                disabled={loading || !passwordOk || !matches}
                className="btn-primary w-full py-3"
              >
                {loading ? "Saving..." : "Change password"}
              </button>
            </form>
          )}
        </div>
      </div>
    </section>
  );
}