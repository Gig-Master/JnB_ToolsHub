import { s as getCookie } from "./server-0p_jwNzp.mjs";
import { n as jwtVerify, t as SignJWT } from "../_libs/jose.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/auth.server-CY2MwgHO.js
function getSecret() {
	const s = process.env.ADMIN_JWT_SECRET;
	if (!s || s.length < 32) throw new Error("ADMIN_JWT_SECRET is missing or too short. Set a 32+ character random value in .env.local.");
	return new TextEncoder().encode(s);
}
var SESSION_COOKIE = "jnb_admin_session";
var SESSION_MAX_AGE = 28800;
/** Signs a JWT that proves the bearer is an authenticated admin. */
async function createSessionToken() {
	return new SignJWT({ role: "admin" }).setProtectedHeader({ alg: "HS256" }).setIssuedAt().setExpirationTime(`${SESSION_MAX_AGE}s`).sign(getSecret());
}
/** Returns true if the token is valid AND has role=admin. Never throws. */
async function verifySessionToken(token) {
	if (!token) return false;
	try {
		const { payload } = await jwtVerify(token, getSecret());
		return payload.role === "admin";
	} catch {
		return false;
	}
}
/** Checks the plaintext password against the server-only env var. */
function verifyPassword(input) {
	const expected = process.env.ADMIN_PASSWORD;
	if (!expected) throw new Error("ADMIN_PASSWORD is not set. Add it to .env.local.");
	return input === expected;
}
/** 
* Guard function to be used inside other server functions.
* Throws an error if the user is not authenticated.
*/
async function requireAdmin() {
	if (!await verifySessionToken(getCookie("jnb_admin_session"))) throw new Error("Unauthorized");
}
//#endregion
export { verifyPassword as a, requireAdmin as i, SESSION_MAX_AGE as n, verifySessionToken as o, createSessionToken as r, SESSION_COOKIE as t };
