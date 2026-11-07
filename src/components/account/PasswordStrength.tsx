import { Check, X } from "lucide-react";
import { checkPassword, passwordStrength } from "@/lib/password-strength";

const BAR_COLORS = ["bg-slate-200", "bg-red-500", "bg-amber-500", "bg-lime-500", "bg-emerald-600"];
const TEXT_COLORS = ["text-muted-foreground", "text-red-600", "text-amber-600", "text-lime-700", "text-emerald-700"];

export function PasswordStrength({ password }: { password: string }) {
  const { score, label } = passwordStrength(password);
  const c = checkPassword(password);

  const rules = [
    { ok: c.length, text: "At least 8 characters", required: true },
    { ok: c.upper, text: "An uppercase letter (A-Z)", required: true },
    { ok: c.lower, text: "A lowercase letter (a-z)", required: true },
    { ok: c.number, text: "A number (0-9)", required: true },
    { ok: c.symbol, text: "A special character (!@#$%)", required: false },
    { ok: c.long, text: "12 or more characters", required: false },
  ];

  return (
    <div className="mt-2">
      <div className="flex gap-1" aria-hidden="true">
        {[1, 2, 3, 4].map((i) => (
          <span
            key={i}
            className={`h-1.5 flex-1 rounded-full transition-colors ${
              score >= i ? BAR_COLORS[score] : "bg-slate-200"
            }`}
          />
        ))}
      </div>

      <p aria-live="polite" className={`mt-1 text-xs font-semibold ${TEXT_COLORS[score]}`}>
        {password ? `Password strength: ${label}` : "Choose a strong password"}
      </p>

      <ul className="mt-2 grid gap-1 text-xs sm:grid-cols-2">
        {rules.map((r) => (
          <li
            key={r.text}
            className={`flex items-center gap-1.5 ${r.ok ? "text-emerald-700" : "text-muted-foreground"}`}
          >
            {r.ok ? <Check className="h-3.5 w-3.5" /> : <X className="h-3.5 w-3.5" />}
            <span>
              {r.text}
              {!r.required && <span className="opacity-70"> (stronger)</span>}
            </span>
          </li>
        ))}
      </ul>
    </div>
  );
}