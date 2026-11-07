import { useEffect, useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { MapPin, Plus, Pencil, Trash2, Star } from "lucide-react";
import { KENYA_COUNTIES } from "@/data/kenya";
import {
  listMyAddresses,
  saveAddress,
  deleteAddress,
  setDefaultAddress,
  type AddressDTO,
} from "@/functions/addresses";

interface FormState {
  id?: string;
  label: string;
  recipientName: string;
  phone: string;
  county: string;
  town: string;
  street: string;
  landmark: string;
  isDefault: boolean;
}

const inputClass =
  "w-full h-11 px-3 rounded-xl border border-border bg-white text-foreground focus:outline-none focus:ring-2 focus:ring-primary";

const emptyForm = (name: string, phone: string | null): FormState => ({
  label: "Home",
  recipientName: name,
  phone: phone ?? "",
  county: "Nairobi",
  town: "",
  street: "",
  landmark: "",
  isDefault: false,
});

const fromAddress = (a: AddressDTO): FormState => ({
  id: a.id,
  label: a.label,
  recipientName: a.recipientName,
  phone: a.phone,
  county: a.county,
  town: a.town,
  street: a.street,
  landmark: a.landmark ?? "",
  isDefault: a.isDefault,
});

export function AddressSection({
  defaultName,
  defaultPhone,
  autoOpen,
}: {
  defaultName: string;
  defaultPhone: string | null;
  autoOpen?: boolean;
}) {
  const queryClient = useQueryClient();
  const { data: addresses = [], isLoading } = useQuery({
    queryKey: ["addresses"],
    queryFn: () => listMyAddresses(),
  });

  const [form, setForm] = useState<FormState | null>(null);
  const [error, setError] = useState("");
  const [autoOpened, setAutoOpened] = useState(false);

  // Right after signup, open the form straight away if there are no addresses yet
  useEffect(() => {
    if (autoOpen && !autoOpened && !isLoading && addresses.length === 0) {
      setForm(emptyForm(defaultName, defaultPhone));
      setAutoOpened(true);
    }
  }, [autoOpen, autoOpened, isLoading, addresses.length, defaultName, defaultPhone]);

  const refresh = () => queryClient.invalidateQueries({ queryKey: ["addresses"] });

  const save = useMutation({
    mutationFn: (f: FormState) =>
      saveAddress({ data: { ...f, landmark: f.landmark || undefined } }),
    onSuccess: (res) => {
      if (res.ok) {
        setForm(null);
        setError("");
        refresh();
      } else {
        setError(res.error);
      }
    },
    onError: () => setError("Something went wrong. Please try again."),
  });

  const remove = useMutation({
    mutationFn: (id: string) => deleteAddress({ data: { id } }),
    onSuccess: refresh,
  });

  const makeDefault = useMutation({
    mutationFn: (id: string) => setDefaultAddress({ data: { id } }),
    onSuccess: refresh,
  });

  const set = <K extends keyof FormState>(key: K, value: FormState[K]) =>
    setForm((f) => (f ? { ...f, [key]: value } : f));

  return (
    <div className="max-w-xl card-surface p-6">
      <div className="flex items-center justify-between gap-3">
        <h2 className="flex items-center gap-2 text-lg font-semibold">
          <MapPin className="h-5 w-5 text-primary" /> Delivery addresses
        </h2>
        {!form && addresses.length < 5 && (
          <button
            type="button"
            onClick={() => {
              setError("");
              setForm(emptyForm(defaultName, defaultPhone));
            }}
            className="inline-flex items-center gap-1 text-sm font-semibold text-primary cursor-pointer"
          >
            <Plus className="h-4 w-4" /> Add address
          </button>
        )}
      </div>

      {isLoading ? (
        <div className="mt-4 h-20 animate-pulse rounded-xl bg-slate-200" />
      ) : (
        <>
          {addresses.length === 0 && !form && (
            <p className="mt-4 rounded-xl bg-muted p-4 text-sm text-muted-foreground">
              Add a delivery address so we can send your orders to your door.
            </p>
          )}

          <ul className="mt-4 space-y-3">
            {addresses.map((a) => (
              <li key={a.id} className="rounded-xl border border-border p-4 text-sm">
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <p className="flex items-center gap-2 font-semibold">
                      {a.label}
                      {a.isDefault && (
                        <span className="rounded-full bg-primary/10 px-2 py-0.5 text-[11px] font-semibold text-primary">
                          Default
                        </span>
                      )}
                    </p>
                    <p className="mt-1">{a.recipientName} · {a.phone}</p>
                    <p className="text-muted-foreground">
                      {a.street}, {a.town}, {a.county}
                    </p>
                    {a.landmark && <p className="text-muted-foreground">Note: {a.landmark}</p>}
                  </div>
                </div>
                <div className="mt-3 flex flex-wrap gap-4 text-xs font-semibold">
                  <button
                    type="button"
                    onClick={() => {
                      setError("");
                      setForm(fromAddress(a));
                    }}
                    className="inline-flex items-center gap-1 text-primary cursor-pointer"
                  >
                    <Pencil className="h-3.5 w-3.5" /> Edit
                  </button>
                  {!a.isDefault && (
                    <button
                      type="button"
                      onClick={() => makeDefault.mutate(a.id)}
                      className="inline-flex items-center gap-1 text-primary cursor-pointer"
                    >
                      <Star className="h-3.5 w-3.5" /> Make default
                    </button>
                  )}
                  <button
                    type="button"
                    onClick={() => {
                      if (window.confirm("Delete this address?")) remove.mutate(a.id);
                    }}
                    className="inline-flex items-center gap-1 text-red-600 cursor-pointer"
                  >
                    <Trash2 className="h-3.5 w-3.5" /> Delete
                  </button>
                </div>
              </li>
            ))}
          </ul>
        </>
      )}

      {form && (
        <form
          onSubmit={(e) => {
            e.preventDefault();
            setError("");
            save.mutate(form);
          }}
          className="mt-4 space-y-3 rounded-xl border border-border bg-muted/40 p-4"
        >
          <h3 className="font-semibold">{form.id ? "Edit address" : "New address"}</h3>

          <div className="grid gap-3 sm:grid-cols-2">
            <div>
              <label htmlFor="addr-label" className="mb-1 block text-xs font-medium">Label</label>
              <select
                id="addr-label"
                value={form.label}
                onChange={(e) => set("label", e.target.value)}
                className={inputClass}
              >
                <option>Home</option>
                <option>Work</option>
                <option>Other</option>
              </select>
            </div>
            <div>
              <label htmlFor="addr-county" className="mb-1 block text-xs font-medium">County</label>
              <select
                id="addr-county"
                value={form.county}
                onChange={(e) => set("county", e.target.value)}
                className={inputClass}
              >
                {KENYA_COUNTIES.map((c) => (
                  <option key={c} value={c}>{c}</option>
                ))}
              </select>
            </div>
            <div>
              <label htmlFor="addr-name" className="mb-1 block text-xs font-medium">Recipient name</label>
              <input
                id="addr-name"
                required
                autoComplete="name"
                value={form.recipientName}
                onChange={(e) => set("recipientName", e.target.value)}
                className={inputClass}
              />
            </div>
            <div>
              <label htmlFor="addr-phone" className="mb-1 block text-xs font-medium">Phone</label>
              <input
                id="addr-phone"
                required
                type="tel"
                autoComplete="tel"
                placeholder="0712345678"
                value={form.phone}
                onChange={(e) => set("phone", e.target.value)}
                className={inputClass}
              />
            </div>
          </div>

          <div>
            <label htmlFor="addr-town" className="mb-1 block text-xs font-medium">
              Town / estate / area
            </label>
            <input
              id="addr-town"
              required
              placeholder="e.g. Kilimani"
              value={form.town}
              onChange={(e) => set("town", e.target.value)}
              className={inputClass}
            />
          </div>
          <div>
            <label htmlFor="addr-street" className="mb-1 block text-xs font-medium">
              Street, building and house number
            </label>
            <input
              id="addr-street"
              required
              placeholder="e.g. Argwings Kodhek Rd, Studio House, Apt 4B"
              value={form.street}
              onChange={(e) => set("street", e.target.value)}
              className={inputClass}
            />
          </div>
          <div>
            <label htmlFor="addr-landmark" className="mb-1 block text-xs font-medium">
              Nearby landmark or delivery notes <span className="font-normal text-muted-foreground">(optional)</span>
            </label>
            <input
              id="addr-landmark"
              placeholder="e.g. Opposite the petrol station, blue gate"
              value={form.landmark}
              onChange={(e) => set("landmark", e.target.value)}
              className={inputClass}
            />
          </div>

          <label className="flex items-center gap-2 text-sm">
            <input
              type="checkbox"
              checked={form.isDefault}
              disabled={addresses.find((a) => a.id === form.id)?.isDefault}
              onChange={(e) => set("isDefault", e.target.checked)}
              className="h-4 w-4"
            />
            Use as my default address
          </label>

          {error && (
            <p role="alert" className="text-sm text-red-600">
              {error}
            </p>
          )}

          <div className="flex gap-3">
            <button type="submit" disabled={save.isPending} className="btn-primary">
              {save.isPending ? "Saving..." : "Save address"}
            </button>
            <button
              type="button"
              onClick={() => {
                setForm(null);
                setError("");
              }}
              className="btn-outline cursor-pointer"
            >
              Cancel
            </button>
          </div>
        </form>
      )}
    </div>
  );
}