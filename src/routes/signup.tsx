import { useState } from "react";
import { createFileRoute, Link, useRouter } from "@tanstack/react-router";
import { useQueryClient } from "@tanstack/react-query";
import { signupCustomer } from "@/functions/customer";
import { safeRedirect } from "@/lib/redirect";
import { PasswordStrength } from "@/components/account/PasswordStrength";
import { passwordMeetsPolicy } from "@/lib/password-strength";

type SignupSearch = { redirect?: string };

export const Route = createFileRoute("/signup")({
  validateSearch: (search: Record<string, unknown>): SignupSearch => ({
    redirect: typeof search.redirect === "string" ? search.redirect : undefined,
  }),
  head: () => ({
    meta: [
      { title: "Create account — JnB Power Tools & Digital Electronics" },
      { name: "robots", content: "noindex" },
    ],
  }),
  component: SignupPage,
});

const inputClass =
  "w-full h-12 px-4 rounded-xl border border-border bg-white text-foreground focus:outline-none focus:ring-2 focus:ring-primary";

function SignupPage() {
  const { redirect } = Route.useSearch();
  const router = useRouter();
  const queryClient = useQueryClient();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const passwordOk = passwordMeetsPolicy(password);
  
  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError("");
    try {
      const res = await signupCustomer({
        data: { name, email, phone: phone || undefined, password },
      });
      if (!res.ok) {
        setError(res.error);
        return;
      }
      await queryClient.invalidateQueries({ queryKey: ["me"] });
         router.history.push(safeRedirect(redirect, "/account?welcome=1"));
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
          <h1 className="text-2xl font-bold text-center">Create your account</h1>
          <p className="mt-2 text-center text-sm text-muted-foreground">
            Save your details and track your orders.
          </p>

          <form onSubmit={handleSubmit} className="mt-6 space-y-4">
            <div>
              <label htmlFor="name" className="mb-1 block text-sm font-medium">
                Full name
              </label>
              <input
                id="name"
                type="text"
                autoComplete="name"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                className={inputClass}
              />
            </div>
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
              <label htmlFor="phone" className="mb-1 block text-sm font-medium">
                Phone <span className="font-normal text-muted-foreground">(optional)</span>
              </label>
              <input
                id="phone"
                type="tel"
                autoComplete="tel"
                placeholder="0712345678"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
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
                autoComplete="new-password"
                required
                minLength={8}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className={inputClass}
              />
                 <PasswordStrength password={password} />
            </div>

            {error && (
              <p role="alert" className="text-center text-sm text-red-600">
                {error}
              </p>
            )}

            <button type="submit" disabled={loading || !passwordOk} className="btn-primary w-full py-3">
              {loading ? "Creating account..." : "Create account"}
            </button>
          </form>

          <p className="mt-6 text-center text-sm text-muted-foreground">
            Already have an account?{" "}
            <Link to="/login" search={{ redirect }} className="font-semibold text-primary">
              Log in
            </Link>
          </p>
        </div>
      </div>
    </section>
  );
}