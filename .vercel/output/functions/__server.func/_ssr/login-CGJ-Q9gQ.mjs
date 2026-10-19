import { r as __toESM } from "../_runtime.mjs";
import { a as require_jsx_runtime, o as require_react } from "../_libs/react+tanstack__react-query.mjs";
import { b as useNavigate } from "../_libs/@tanstack/react-router+[...].mjs";
import { w as Lock } from "../_libs/lucide-react.mjs";
import { r as loginAdmin } from "./router-C6IrYpw5.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/login-CGJ-Q9gQ.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
function LoginPage() {
	const [password, setPassword] = (0, import_react.useState)("");
	const [error, setError] = (0, import_react.useState)("");
	const [loading, setLoading] = (0, import_react.useState)(false);
	const navigate = useNavigate();
	async function handleSubmit(e) {
		e.preventDefault();
		setLoading(true);
		setError("");
		const res = await loginAdmin({ data: { password } });
		if (res.ok) await navigate({ to: "/admin" });
		else {
			setError(res.error);
			setLoading(false);
		}
	}
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: "min-h-screen flex items-center justify-center bg-slate-50 px-4",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "max-w-md w-full bg-white rounded-2xl shadow-xl p-8 border border-slate-100",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "w-12 h-12 bg-[#0B5ED7]/10 text-[#0B5ED7] rounded-xl flex items-center justify-center mx-auto mb-6",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Lock, { size: 24 })
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
					className: "text-2xl font-bold text-center text-slate-900 mb-2",
					children: "Admin Portal"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "text-center text-slate-500 mb-8 text-sm",
					children: "Enter your password to manage products."
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("form", {
					onSubmit: handleSubmit,
					className: "space-y-4",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
							type: "password",
							value: password,
							onChange: (e) => setPassword(e.target.value),
							placeholder: "Admin Password",
							className: "w-full px-4 py-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-[#0B5ED7]/50",
							required: true
						}) }),
						error && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "text-red-500 text-sm text-center",
							children: error
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
							type: "submit",
							disabled: loading,
							className: "w-full btn-primary py-3",
							children: loading ? "Authenticating..." : "Log In"
						})
					]
				})
			]
		})
	});
}
//#endregion
export { LoginPage as component };
