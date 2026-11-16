import { createFileRoute } from "@tanstack/react-router";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import { MessageCircle, Phone, Mail, Check, Trash2 } from "lucide-react";
import {
  listMessagesAdmin,
  setMessageHandled,
  deleteMessageAdmin,
  type AdminMessageDTO,
} from "@/functions/admin-messages";

export const Route = createFileRoute("/admin/messages")({
  component: AdminMessagesPage,
});

const FILTERS = [
  { key: "new", label: "New" },
  { key: "handled", label: "Handled" },
  { key: "all", label: "All" },
] as const;

function AdminMessagesPage() {
  const [filter, setFilter] = useState<(typeof FILTERS)[number]["key"]>("new");

  const { data: messages = [], isLoading, isError } = useQuery({
    queryKey: ["admin-messages", filter],
    queryFn: () => listMessagesAdmin({ data: { status: filter === "all" ? undefined : filter } }),
    refetchInterval: 60_000,
  });

  return (
    <div className="max-w-4xl mx-auto">
      <h1 className="text-2xl font-bold text-slate-900">Messages</h1>
      <p className="text-slate-500">Messages sent from the Contact page. You also get each one by email.</p>

      <div className="mt-6 flex flex-wrap gap-2">
        {FILTERS.map((f) => (
          <button
            key={f.key}
            type="button"
            onClick={() => setFilter(f.key)}
            className={`rounded-full px-4 py-1.5 text-sm font-semibold cursor-pointer ${
              filter === f.key ? "bg-[#102A43] text-white" : "bg-white border border-slate-200 text-slate-600"
            }`}
          >
            {f.label}
          </button>
        ))}
      </div>

      <div className="mt-6 space-y-4">
        {isLoading && <p>Loading messages...</p>}
        {isError && <p className="text-red-600">Could not load messages. Please refresh.</p>}
        {!isLoading && !isError && messages.length === 0 && (
          <p className="rounded-2xl border border-slate-200 bg-white p-8 text-center text-slate-500">
            {filter === "new" ? "No new messages. You're all caught up." : "No messages here yet."}
          </p>
        )}
        {messages.map((m) => (
          <MessageCard key={m.id} m={m} />
        ))}
      </div>
    </div>
  );
}

function MessageCard({ m }: { m: AdminMessageDTO }) {
  const queryClient = useQueryClient();
  const refresh = () => queryClient.invalidateQueries({ queryKey: ["admin-messages"] });
  const failed = () => alert("Could not update this message. Please refresh and try again.");

  const handled = useMutation({
    mutationFn: (h: boolean) => setMessageHandled({ data: { id: m.id, handled: h } }),
    onSuccess: (r) => (r.ok ? refresh() : failed()),
    onError: failed,
  });
  const remove = useMutation({
    mutationFn: () => deleteMessageAdmin({ data: { id: m.id } }),
    onSuccess: (r) => (r.ok ? refresh() : failed()),
    onError: failed,
  });

  const isNew = m.status === "new";
  const wa = `https://wa.me/${m.phone}?text=${encodeURIComponent(
    `Hello ${m.name}, this is JnB Power Tools replying to your message: "${m.subject}".`,
  )}`;
  const mail = m.email
    ? `mailto:${m.email}?subject=${encodeURIComponent("Re: " + m.subject)}`
    : null;

  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <p className="text-lg font-bold text-slate-900">{m.subject}</p>
          <p className="text-sm text-slate-600">
            {m.name} · {m.phone}
            {m.email ? ` · ${m.email}` : ""}
          </p>
          <p className="text-xs text-slate-500">
            {new Date(m.createdAt).toLocaleString("en-KE", {
              timeZone: "Africa/Nairobi",
              dateStyle: "medium",
              timeStyle: "short",
            })}
          </p>
        </div>
        <span
          className={`rounded-full px-3 py-1 text-xs font-semibold ${
            isNew ? "bg-amber-100 text-amber-800" : "bg-green-100 text-green-800"
          }`}
        >
          {isNew ? "New" : "Handled"}
        </span>
      </div>

      <p className="mt-4 whitespace-pre-wrap rounded-xl bg-slate-50 p-4 text-sm text-slate-800">
        {m.message}
      </p>

      <div className="mt-4 flex flex-wrap items-center gap-3 text-sm font-semibold">
        <a href={wa} target="_blank" rel="noreferrer" className="inline-flex items-center gap-1 text-green-700">
          <MessageCircle className="h-4 w-4" /> WhatsApp
        </a>
        <a href={`tel:+${m.phone}`} className="inline-flex items-center gap-1 text-slate-700">
          <Phone className="h-4 w-4" /> Call
        </a>
        {mail && (
          <a href={mail} className="inline-flex items-center gap-1 text-blue-700">
            <Mail className="h-4 w-4" /> Email
          </a>
        )}
        <button
          type="button"
          disabled={handled.isPending}
          onClick={() => handled.mutate(isNew)}
          className="ml-auto inline-flex items-center gap-1 rounded-lg border border-slate-200 px-3 py-1.5 cursor-pointer hover:bg-slate-50"
        >
          <Check className="h-4 w-4" /> {isNew ? "Mark as handled" : "Reopen"}
        </button>
        <button
          type="button"
          disabled={remove.isPending}
          onClick={() => {
            if (confirm("Delete this message permanently?")) remove.mutate();
          }}
          className="inline-flex items-center gap-1 text-red-600 cursor-pointer"
        >
          <Trash2 className="h-4 w-4" /> Delete
        </button>
      </div>
    </div>
  );
}