import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { loginAdmin } from "@/functions/auth";
import { Lock } from "lucide-react";

export const Route = createFileRoute("/admin/login")({
  component: LoginPage,
});

function LoginPage() {
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError("");

    const res = await loginAdmin({ data: { password } });
    
    if (res.ok) {
      // Invalidate the router so beforeLoad re-runs and picks up the new cookie
      await navigate({ to: "/admin" });
    } else {
      setError(res.error);
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50 px-4">
      <div className="max-w-md w-full bg-white rounded-2xl shadow-xl p-8 border border-slate-100">
        <div className="w-12 h-12 bg-[#0B5ED7]/10 text-[#0B5ED7] rounded-xl flex items-center justify-center mx-auto mb-6">
          <Lock size={24} />
        </div>
        <h1 className="text-2xl font-bold text-center text-slate-900 mb-2">Admin Portal</h1>
        <p className="text-center text-slate-500 mb-8 text-sm">Enter your password to manage products.</p>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Admin Password"
              className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-[#0B5ED7]/50"
              required
            />
          </div>
          {error && <p className="text-red-500 text-sm text-center">{error}</p>}
          <button
            type="submit"
            disabled={loading}
            className="w-full btn-primary py-3"
          >
            {loading ? "Authenticating..." : "Log In"}
          </button>
        </form>
      </div>
    </div>
  );
}