import { createFileRoute, redirect, useRouter, Link } from "@tanstack/react-router";
import { useQueryClient } from "@tanstack/react-query";
import { LogOut } from "lucide-react";
import { getMe, logoutCustomer } from "@/functions/customer";
import { AddressSection } from "@/components/account/AddressSection";
import { OrderHistory } from "@/components/account/OrderHistory";

type AccountSearch = { welcome?: boolean };

export const Route = createFileRoute("/account")({
  validateSearch: (search: Record<string, unknown>): AccountSearch => ({
    welcome: search.welcome === true || String(search.welcome) === "1" ? true : undefined,
  }),
  // Runs before the page loads: logged-out visitors are sent to the login page.
  beforeLoad: async () => {
    const user = await getMe();
    if (!user) {
      throw redirect({ to: "/login", search: { redirect: "/account" } });
    }
    return { user };
  },
  head: () => ({
    meta: [
      { title: "My Account — JnB Power Tools & Digital Electronics" },
      { name: "robots", content: "noindex" },
    ],
  }),
  component: AccountPage,
});

function AccountPage() {
  const { user } = Route.useRouteContext();
  const { welcome } = Route.useSearch();
  const router = useRouter();
  const queryClient = useQueryClient();

  async function handleLogout() {
    await logoutCustomer();
    await router.navigate({ to: "/" });
    await queryClient.invalidateQueries({ queryKey: ["me"] });
    queryClient.removeQueries({ queryKey: ["addresses"] });
    queryClient.removeQueries({ queryKey: ["my-orders"] });
  }

  return (
    <>
      <section className="bg-secondary text-white py-12">
        <div className="container-x">
          <h1 className="text-3xl md:text-4xl font-bold">
            {welcome ? "Welcome to JnB!" : "My Account"}
          </h1>
          <p className="mt-2 text-white/70">
            {welcome
              ? "Your account is ready. Add a delivery address to finish setting up."
              : `Hello, ${user.name}`}
          </p>
        </div>
      </section>

      <section className="py-10 bg-background">
        <div className="container-x space-y-6">
          <AddressSection
            defaultName={user.name}
            defaultPhone={user.phone}
            autoOpen={welcome}
          />

          <OrderHistory />

          <div className="max-w-xl card-surface p-6">
            <h2 className="text-lg font-semibold">Your details</h2>
            <dl className="mt-4 space-y-3 text-sm">
              <div className="flex justify-between gap-4">
                <dt className="text-muted-foreground">Name</dt>
                <dd className="font-medium">{user.name}</dd>
              </div>
              <div className="flex justify-between gap-4">
                <dt className="text-muted-foreground">Email</dt>
                <dd className="font-medium break-all">{user.email}</dd>
              </div>
              <div className="flex justify-between gap-4">
                <dt className="text-muted-foreground">Phone</dt>
                <dd className="font-medium">{user.phone ?? "Not added"}</dd>
              </div>
            </dl>

            <div className="mt-6 flex flex-wrap gap-3">
              <Link to="/products" search={{}} className="btn-primary">
                Continue shopping
              </Link>
              <button type="button" onClick={handleLogout} className="btn-outline cursor-pointer">
                <LogOut className="h-4 w-4" /> Log out
              </button>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}