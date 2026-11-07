import { useState } from "react";
import { createFileRoute, Link } from "@tanstack/react-router";
import { requestPasswordReset } from "@/functions/password-reset";

export const Route = createFileRoute("/forgot-password")({
  head: () => ({
    meta: [
      { title: "Forgot password — JnB Power Tools & Digital Electronics" },
      { name: "robots", content: "noindex" },
    ],
  }),
  component: ForgotPasswordPage,
});

const inputClass =
  "w-full h-12 px-4 rounded-xl border border-border bg-white text-foreground focus:outline-none focus:ring-2 focus:ring-primary";

function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [sent, setSent] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

    async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError("");
    try {
      const res = await requestPasswordReset({ data: { email } });
      if (res.ok) setSent(true);
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
          <h1 className="text-2xl font-bold text-center">Forgot your password?</h1>

          {sent ? (
            <div className="mt-6 text-center">
              <p className="rounded-xl bg-emerald-50 p-4 text-sm text-emerald-800">
                If an account exists for <strong>{email}</strong>, we've sent a link to reset your
                password. It expires in 30 minutes. Check your spam folder if you don't see it.
              </p>
              <Link to="/login" search={{}} className="btn-primary mt-6 inline-flex">
                Back to log in
              </Link>
            </div>
          ) : (
            <>
              <p className="mt-2 text-center text-sm text-muted-foreground">
                Enter your email and we'll send you a link to choose a new password.
              </p>
              <form onSubmit={handleSubmit} className="mt-6 space-y-4">
                <div>
                  <label htmlFor="email" className="mb-1 block text-sm font-medium">
                    Email
                  </label>
                  <input
                    id="email"
                    type="email"
                    autoComplete="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className={inputClass}
                  />
                </div>

                {error && (
                  <p role="alert" className="text-center text-sm text-red-600">
                    {error}
                  </p>
                )}

                <button type="submit" disabled={loading} className="btn-primary w-full py-3">
                  {loading ? "Sending..." : "Send reset link"}
                </button>
              </form>
              <p className="mt-6 text-center text-sm text-muted-foreground">
                <Link to="/login" search={{}} className="font-semibold text-primary">
                  Back to log in
                </Link>
              </p>
            </>
          )}
        </div>
      </div>
    </section>
  );
}