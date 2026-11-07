import { useState } from "react";
import { createFileRoute, Link, useRouter } from "@tanstack/react-router";
import { useQueryClient } from "@tanstack/react-query";
import { loginCustomer } from "@/functions/customer";
import { safeRedirect } from "@/lib/redirect";

type LoginSearch = { redirect?: string };

export const Route = createFileRoute("/login")({
  validateSearch: (search: Record<string, unknown>): LoginSearch => ({
    redirect: typeof search.redirect === "string" ? search.redirect : undefined,
  }),
  head: () => ({
    meta: [
      { title: "Log in — JnB Power Tools & Digital Electronics" },
      { name: "robots", content: "noindex" },
    ],
  }),
  component: LoginPage,
});

const inputClass =
  "w-full h-12 px-4 rounded-xl border border-border bg-white text-foreground focus:outline-none focus:ring-2 focus:ring-primary";

function LoginPage() {
  const { redirect } = Route.useSearch();
  const router = useRouter();
  const queryClient = useQueryClient();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError("");
    try {
      const res = await loginCustomer({ data: { email, password } });
      if (!res.ok) {
        setError(res.error);
        return;
      }
      await queryClient.invalidateQueries({ queryKey: ["me"] });
      router.history.push(safeRedirect(redirect));
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
          <h1 className="text-2xl font-bold text-center">Log in</h1>
          <p className="mt-2 text-center text-sm text-muted-foreground">
            Welcome back. Log in to check out and see your orders.
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
            <div>
              <label htmlFor="password" className="mb-1 block text-sm font-medium">
                Password
              </label>
              <input
                id="password"
                type="password"
                autoComplete="current-password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className={inputClass}
              />
                <div className="mt-1 text-right">
                 <Link to="/forgot-password" className="text-xs font-semibold text-primary">
                  Forgot your password?
                 </Link>
                </div>
            </div>

            {error && (
              <p role="alert" className="text-center text-sm text-red-600">
                {error}
              </p>
            )}

            <button type="submit" disabled={loading} className="btn-primary w-full py-3">
              {loading ? "Logging in..." : "Log in"}
            </button>
          </form>

          <p className="mt-6 text-center text-sm text-muted-foreground">
            New here?{" "}
            <Link to="/signup" search={{ redirect }} className="font-semibold text-primary">
              Create an account
            </Link>
          </p>
        </div>
      </div>
    </section>
  );
}