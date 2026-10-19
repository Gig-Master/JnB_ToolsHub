import { r as createServerFn } from "./server-0p_jwNzp.mjs";
import { f as createSsrRpc } from "./router-C6IrYpw5.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/products-Biw2sqGQ.js
/** List all products (optionally filtered by featured) */
var listProducts = createServerFn({ method: "GET" }).validator((d) => d ?? {}).handler(createSsrRpc("7168ced1940421b873830f33fc8824b97133dba4136aae2ddd63332934576763"));
createServerFn({ method: "GET" }).validator((d) => d).handler(createSsrRpc("66405e49fd4871c86fc1a1e9e73f969fef1c4b599498313c0e81262dbd18bbd2"));
/** Create or Update a product */
var saveProduct = createServerFn({ method: "POST" }).validator((d) => d).handler(createSsrRpc("43a2dc4a6e34c02494169e94cf31f0b525e46514cd3149950e534f01e87a1fc0"));
/** Delete a product (and its images via CASCADE and Supabase Storage) */
var deleteProduct = createServerFn({ method: "POST" }).validator((d) => d).handler(createSsrRpc("8abd195734467057fe3fd3db958ff277fd2feaced401ea18c2f4f3dfad191dda"));
//#endregion
export { listProducts as n, saveProduct as r, deleteProduct as t };
