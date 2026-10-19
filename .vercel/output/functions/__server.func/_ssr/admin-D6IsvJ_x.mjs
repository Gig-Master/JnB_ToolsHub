import { a as require_jsx_runtime } from "../_libs/react+tanstack__react-query.mjs";
import { b as useNavigate, f as useRouterState, h as Outlet, y as Link } from "../_libs/@tanstack/react-router+[...].mjs";
import { C as LogOut, T as LayoutDashboard, k as ExternalLink } from "../_libs/lucide-react.mjs";
import { i as logoutAdmin } from "./router-C6IrYpw5.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/admin-D6IsvJ_x.js
var import_jsx_runtime = require_jsx_runtime();
function AdminLayout() {
	const navigate = useNavigate();
	if (useRouterState({ select: (s) => s.location.pathname }) === "/admin/login") return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Outlet, {});
	async function handleLogout() {
		await logoutAdmin();
		navigate({ to: "/admin/login" });
	}
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "flex min-h-screen bg-slate-50",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("aside", {
			className: "w-64 bg-[#102A43] text-white flex flex-col hidden md:flex",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "p-6 text-xl font-bold border-b border-white/10",
					children: "JnB Admin"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("nav", {
					className: "flex-1 p-4 space-y-2",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Link, {
						to: "/admin",
						className: "flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-white/10 transition-colors [&.active]:bg-white/10",
						activeProps: { className: "active" },
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(LayoutDashboard, { size: 20 }), " Dashboard"]
					})
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "p-4 border-t border-white/10 space-y-2",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("a", {
						href: "/",
						target: "_blank",
						className: "flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-white/10 text-sm text-slate-300",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ExternalLink, { size: 18 }), " View Live Site"]
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
						onClick: handleLogout,
						className: "flex w-full items-center gap-3 px-4 py-3 rounded-lg hover:bg-red-500/20 text-red-400 transition-colors",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(LogOut, { size: 20 }), " Log Out"]
					})]
				})
			]
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("main", {
			className: "flex-1 p-8",
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Outlet, {})
		})]
	});
}
//#endregion
export { AdminLayout as component };
