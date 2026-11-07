import { Link } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { Package } from "lucide-react";
import { listMyOrders } from "@/functions/orders";
import { statusBadge, statusLabel } from "@/lib/order-status";
import { formatPrice } from "@/lib/utils";

export function OrderHistory() {
  const { data: orders = [], isLoading } = useQuery({
    queryKey: ["my-orders"],
    queryFn: () => listMyOrders(),
  });

  return (
    <div className="max-w-xl card-surface p-6">
      <h2 className="flex items-center gap-2 text-lg font-semibold">
        <Package className="h-5 w-5 text-primary" /> My orders
      </h2>

      {isLoading ? (
        <div className="mt-4 h-20 animate-pulse rounded-xl bg-slate-200" />
      ) : orders.length === 0 ? (
        <p className="mt-4 rounded-xl bg-muted p-4 text-sm text-muted-foreground">
          You have not placed any orders yet.
        </p>
      ) : (
        <ul className="mt-4 space-y-3">
          {orders.map((o) => (
            <li key={o.orderNumber}>
              <Link
                to="/order/$orderNumber"
                params={{ orderNumber: o.orderNumber }}
                className="flex items-center justify-between gap-3 rounded-xl border border-border p-4 text-sm hover:bg-muted/50"
              >
                <span>
                  <span className="block font-semibold">{o.orderNumber}</span>
                  <span className="text-xs text-muted-foreground">
                    {new Date(o.createdAt).toLocaleDateString("en-KE", {
                      timeZone: "Africa/Nairobi",
                      dateStyle: "medium",
                    })}
                  </span>
                </span>
                <span className="text-right">
                  <span className="block font-semibold">{formatPrice(o.total)}</span>
                  <span
                    className={`mt-1 inline-block rounded-full px-2 py-0.5 text-[11px] font-semibold ${statusBadge(o.status)}`}
                  >
                    {statusLabel(o.status, o.fulfilment)}
                  </span>
                </span>
              </Link>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}