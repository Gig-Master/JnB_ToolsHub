import { o as asc } from "../_libs/drizzle-orm+postgres.mjs";
import { d as db, r as createServerFn, u as categories } from "./server-0p_jwNzp.mjs";
import { t as createServerRpc } from "./createServerRpc-CcX0hp8W.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/categories-DOoCFvrR.js
var listCategories_createServerFn_handler = createServerRpc({
	id: "0bf3a33a81d4829e7b266836c6612b89a8625168ac7404401956e47af771509a",
	name: "listCategories",
	filename: "src/functions/categories.ts"
}, (opts) => listCategories.__executeServer(opts));
var listCategories = createServerFn({ method: "GET" }).handler(listCategories_createServerFn_handler, async () => {
	return db.query.categories.findMany({
		with: { subcategories: { orderBy: (s, { asc }) => [asc(s.name)] } },
		orderBy: [asc(categories.sortOrder)]
	});
});
//#endregion
export { listCategories_createServerFn_handler };
