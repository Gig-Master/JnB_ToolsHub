import { createFileRoute, Outlet, redirect, Link, useNavigate, useRouterState } from "@tanstack/react-router";
import { checkAdmin, logoutAdmin } from "@/functions/auth";
import { LayoutDashboard, LogOut, ExternalLink } from "lucide-react";

export const Route = createFileRoute("/admin")({
  beforeLoad: async ({ location }) => {
    // Allow access to the login page without being authenticated
    if (location.pathname === "/admin/login") return;
    
    // Check auth for all other /admin routes
    const { authed } = await checkAdmin();
    if (!authed) {
      throw redirect({ to: "/admin/login" });
    }
  },
  component: AdminLayout,
});

function AdminLayout() {
  const navigate = useNavigate();
  const pathname = useRouterState({ select: (s) => s.location.pathname });

  // If we are on the login page, just render the outlet (no sidebar)
  if (pathname === "/admin/login") {
    return <Outlet />;
  }

  async function handleLogout() {
    await logoutAdmin();
    navigate({ to: "/admin/login" });
  }

  return (
    <div className="flex min-h-screen bg-slate-50">
      {/* Sidebar */}
      <aside className="w-64 bg-[#102A43] text-white flex flex-col hidden md:flex">
        <div className="p-6 text-xl font-bold border-b border-white/10">
          JnB Admin
        </div>
        <nav className="flex-1 p-4 space-y-2">
          <Link 
            to="/admin" 
            className="flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-white/10 transition-colors [&.active]:bg-white/10"
            activeProps={{ className: "active" }}
          >
            <LayoutDashboard size={20} /> Dashboard
          </Link>
        </nav>
        <div className="p-4 border-t border-white/10 space-y-2">
          <a href="/" target="_blank" className="flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-white/10 text-sm text-slate-300">
            <ExternalLink size={18} /> View Live Site
          </a>
          <button onClick={handleLogout} className="flex w-full items-center gap-3 px-4 py-3 rounded-lg hover:bg-red-500/20 text-red-400 transition-colors">
            <LogOut size={20} /> Log Out
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 p-8">
        <Outlet />
      </main>
    </div>
  );
}