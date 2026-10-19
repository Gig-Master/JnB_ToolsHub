import { r as createServerFn } from "./server-0p_jwNzp.mjs";
import { t as createServerRpc } from "./createServerRpc-CcX0hp8W.mjs";
import { n as objectType, r as stringType, t as literalType } from "../_libs/zod.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/contact.functions-W2iSkhBy.js
var schema = objectType({
	name: stringType().trim().min(1).max(100),
	phone: stringType().trim().min(7).max(20),
	email: stringType().trim().email().max(255).optional().or(literalType("")),
	subject: stringType().trim().min(1).max(150),
	message: stringType().trim().min(1).max(1e3)
});
var submitContact_createServerFn_handler = createServerRpc({
	id: "1ac20e83585a55e943670fa4670b07889b610801a7a21f28dc367c19f92e50fd",
	name: "submitContact",
	filename: "src/lib/contact.functions.ts"
}, (opts) => submitContact.__executeServer(opts));
var submitContact = createServerFn({ method: "POST" }).inputValidator((data) => schema.parse(data)).handler(submitContact_createServerFn_handler, async ({ data }) => {
	console.log("[contact] new submission", {
		...data,
		receivedAt: (/* @__PURE__ */ new Date()).toISOString()
	});
	return { ok: true };
});
//#endregion
export { submitContact_createServerFn_handler };
