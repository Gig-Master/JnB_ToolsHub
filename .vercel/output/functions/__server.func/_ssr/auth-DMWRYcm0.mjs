import { c as setCookie, o as deleteCookie, r as createServerFn, s as getCookie } from "./server-0p_jwNzp.mjs";
import { t as createServerRpc } from "./createServerRpc-CcX0hp8W.mjs";
import { a as verifyPassword, n as SESSION_MAX_AGE, o as verifySessionToken, r as createSessionToken, t as SESSION_COOKIE } from "./auth.server-CY2MwgHO.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/auth-DMWRYcm0.js
var loginAdmin_createServerFn_handler = createServerRpc({
	id: "82bc87f3c8ea7f7206115deac652e8a309955880255df402d4287d65393bd104",
	name: "loginAdmin",
	filename: "src/functions/auth.ts"
}, (opts) => loginAdmin.__executeServer(opts));
var loginAdmin = createServerFn({ method: "POST" }).validator((d) => d).handler(loginAdmin_createServerFn_handler, async ({ data }) => {
	if (!verifyPassword(data.password)) return {
		ok: false,
		error: "Invalid password"
	};
	const token = await createSessionToken();
	setCookie(SESSION_COOKIE, token, {
		httpOnly: true,
		secure: true,
		sameSite: "lax",
		path: "/",
		maxAge: SESSION_MAX_AGE
	});
	return { ok: true };
});
var logoutAdmin_createServerFn_handler = createServerRpc({
	id: "5d777995768fee2a05f63a1d54a281bfa366dbc981cc2926e86e67db60df389d",
	name: "logoutAdmin",
	filename: "src/functions/auth.ts"
}, (opts) => logoutAdmin.__executeServer(opts));
var logoutAdmin = createServerFn({ method: "POST" }).handler(logoutAdmin_createServerFn_handler, async () => {
	deleteCookie(SESSION_COOKIE, { path: "/" });
	return { ok: true };
});
var checkAdmin_createServerFn_handler = createServerRpc({
	id: "68cde2a3b6ddfaf50bcf6a844a69632354466d889d9f58f30d4adb4197e70e17",
	name: "checkAdmin",
	filename: "src/functions/auth.ts"
}, (opts) => checkAdmin.__executeServer(opts));
var checkAdmin = createServerFn({ method: "GET" }).handler(checkAdmin_createServerFn_handler, async () => {
	const token = getCookie(SESSION_COOKIE);
	return { authed: await verifySessionToken(token) };
});
//#endregion
export { checkAdmin_createServerFn_handler, loginAdmin_createServerFn_handler, logoutAdmin_createServerFn_handler };
