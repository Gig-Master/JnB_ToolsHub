import { r as __toESM } from "../_runtime.mjs";
import { a as require_jsx_runtime, o as require_react } from "../_libs/react+tanstack__react-query.mjs";
import { r as createServerFn } from "./server-0p_jwNzp.mjs";
import { M as Clock, N as CircleCheck, S as Mail, _ as Phone, f as Send, x as MapPin, y as MessageCircle } from "../_libs/lucide-react.mjs";
import { c as emailHref, f as createSsrRpc, l as phoneHref, o as BUSINESS, s as MAP, u as whatsappHref } from "./router-C6IrYpw5.mjs";
import { n as objectType, r as stringType, t as literalType } from "../_libs/zod.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/contact-BT5V_4Qy.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
var schema$1 = objectType({
	name: stringType().trim().min(1).max(100),
	phone: stringType().trim().min(7).max(20),
	email: stringType().trim().email().max(255).optional().or(literalType("")),
	subject: stringType().trim().min(1).max(150),
	message: stringType().trim().min(1).max(1e3)
});
var submitContact = createServerFn({ method: "POST" }).inputValidator((data) => schema$1.parse(data)).handler(createSsrRpc("1ac20e83585a55e943670fa4670b07889b610801a7a21f28dc367c19f92e50fd"));
var schema = objectType({
	name: stringType().trim().min(1, "Name is required").max(100),
	phone: stringType().trim().min(7, "Enter a valid phone number").max(20),
	email: stringType().trim().email("Enter a valid email").max(255).optional().or(literalType("")),
	subject: stringType().trim().min(1, "Subject is required").max(150),
	message: stringType().trim().min(1, "Message is required").max(1e3)
});
function ContactPage() {
	const [status, setStatus] = (0, import_react.useState)("idle");
	const [errors, setErrors] = (0, import_react.useState)({});
	async function onSubmit(e) {
		e.preventDefault();
		const fd = new FormData(e.currentTarget);
		const data = Object.fromEntries(fd);
		const parsed = schema.safeParse(data);
		if (!parsed.success) {
			const errs = {};
			parsed.error.issues.forEach((i) => errs[String(i.path[0])] = i.message);
			setErrors(errs);
			return;
		}
		setErrors({});
		setStatus("sending");
		try {
			await submitContact({ data: parsed.data });
			setStatus("success");
			e.target.reset();
		} catch {
			setStatus("error");
		}
	}
	const cards = [
		{
			icon: Phone,
			title: "Call us",
			value: `+${BUSINESS.phone}`,
			href: phoneHref
		},
		{
			icon: MessageCircle,
			title: "WhatsApp",
			value: `+${BUSINESS.whatsapp}`,
			href: whatsappHref()
		},
		{
			icon: Mail,
			title: "Email",
			value: BUSINESS.email,
			href: emailHref
		},
		{
			icon: MapPin,
			title: "Visit us",
			value: "Royal Palm Mall, Mfangano St",
			href: MAP.placeUrl
		},
		{
			icon: Clock,
			title: "Hours",
			value: "Mon-Sat: 5:45am – 9pm",
			href: void 0
		}
	];
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("section", {
		className: "bg-secondary text-white py-14",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "container-x max-w-3xl",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
				className: "text-4xl md:text-5xl font-bold",
				children: "Contact JnB Power Tools & Digital Electronics"
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "mt-4 text-white/80 text-lg",
				children: "Whether you need product advice, a quote, or help placing an order — we're here to help. Reach us the way that suits you."
			})]
		})
	}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("section", {
		className: "py-14 bg-background",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "container-x",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "grid gap-4 sm:grid-cols-2 lg:grid-cols-5",
				children: cards.map((c) => {
					const inner = /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "h-11 w-11 rounded-xl bg-primary/10 text-primary grid place-items-center",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(c.icon, { className: "h-5 w-5" })
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "mt-4 text-xs font-semibold text-muted-foreground uppercase tracking-wider",
							children: c.title
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "mt-1 font-semibold text-sm",
							children: c.value
						})
					] });
					return c.href ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("a", {
						href: c.href,
						target: c.href.startsWith("http") ? "_blank" : void 0,
						rel: "noreferrer",
						className: "card-surface p-5 border border-border block",
						children: inner
					}, c.title) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "card-surface p-5 border border-border",
						children: inner
					}, c.title);
				})
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "mt-12 grid lg:grid-cols-2 gap-8",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "card-surface p-6 md:p-8 border border-border",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
							className: "text-2xl font-bold",
							children: "Send us a message"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "mt-1 text-sm text-muted-foreground",
							children: "We usually reply within a few hours during business hours."
						}),
						status === "success" && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "mt-6 flex items-center gap-2 rounded-xl bg-emerald-50 text-emerald-800 border border-emerald-200 p-4 text-sm",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CircleCheck, { className: "h-5 w-5" }), " Thanks — your message was received. We'll be in touch."]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("form", {
							onSubmit,
							noValidate: true,
							className: "mt-6 space-y-4",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
									label: "Full name",
									name: "name",
									required: true,
									error: errors.name
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
									label: "Phone number",
									name: "phone",
									type: "tel",
									required: true,
									error: errors.phone
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
									label: "Email (optional)",
									name: "email",
									type: "email",
									error: errors.email
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
									label: "Subject",
									name: "subject",
									required: true,
									error: errors.subject
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
										htmlFor: "message",
										className: "text-sm font-medium",
										children: "Message *"
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("textarea", {
										id: "message",
										name: "message",
										rows: 5,
										required: true,
										className: "mt-1.5 w-full rounded-xl border border-input bg-background px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary"
									}),
									errors.message && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
										className: "mt-1 text-xs text-destructive",
										children: errors.message
									})
								] }),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
									type: "submit",
									disabled: status === "sending",
									className: "btn-primary w-full disabled:opacity-60",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Send, { className: "h-4 w-4" }), status === "sending" ? "Sending..." : "Send message"]
								}),
								status === "error" && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
									className: "text-sm text-destructive text-center",
									children: "Couldn't send — please try WhatsApp or call."
								})
							]
						})
					]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "space-y-6",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "rounded-2xl overflow-hidden aspect-video bg-muted shadow-card",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("iframe", {
							title: "JnB Power Tools location on Google Maps",
							src: MAP.embedUrl,
							className: "h-full w-full border-0",
							loading: "lazy",
							referrerPolicy: "no-referrer-when-downgrade"
						})
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "grid grid-cols-3 gap-3",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("a", {
								href: phoneHref,
								className: "card-surface p-4 border border-border text-center hover:border-primary",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Phone, { className: "h-5 w-5 mx-auto text-primary" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
									className: "mt-2 text-xs font-semibold",
									children: "Call Now"
								})]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("a", {
								href: whatsappHref(),
								target: "_blank",
								rel: "noreferrer",
								className: "card-surface p-4 border border-border text-center hover:border-accent",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(MessageCircle, { className: "h-5 w-5 mx-auto text-accent" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
									className: "mt-2 text-xs font-semibold",
									children: "WhatsApp"
								})]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("a", {
								href: MAP.directionsUrl,
								target: "_blank",
								rel: "noreferrer",
								className: "card-surface p-4 border border-border text-center hover:border-primary",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(MapPin, { className: "h-5 w-5 mx-auto text-primary" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
									className: "mt-2 text-xs font-semibold",
									children: "Directions"
								})]
							})
						]
					})]
				})]
			})]
		})
	})] });
}
function Field({ label, name, type = "text", required, error }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [
		/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
			htmlFor: name,
			className: "text-sm font-medium",
			children: [
				label,
				" ",
				required && "*"
			]
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
			id: name,
			name,
			type,
			required,
			className: "mt-1.5 w-full rounded-xl border border-input bg-background px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary"
		}),
		error && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
			className: "mt-1 text-xs text-destructive",
			children: error
		})
	] });
}
//#endregion
export { ContactPage as component };
