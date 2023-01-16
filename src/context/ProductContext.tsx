import type { Product } from "@prisma/client";
import { createRoot, createSignal } from "solid-js";

function createProductContext() {
	const [products, setProducts] = createSignal<Product[]>();

	// const [productsResource, { refetch }] = createResource(loadProducts);

	const getProduct = (id: string) => products()?.find((product) => product.id === id);

	const getStockItem = (id: string) => products()?.find((product) => product.id === id)?.stock;

	// createEffect(() => productsResource() && setProducts(productsResource()));

	return { products, setProducts, getProduct, getStockItem };
}
export default createRoot(createProductContext);
