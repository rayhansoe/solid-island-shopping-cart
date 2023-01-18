import type { Product } from "@prisma/client";
import { createRoot, createSignal } from "solid-js";
import server$ from "solid-start/server";
import { prisma } from "~/server/db/client";

const loadProduct = server$(async () => {
	const products = await prisma.product.findMany();

	return products;
});

const data = await loadProduct();

function createProductContext() {
	const [products, setProducts] = createSignal<Product[]>(data || []);

	// const [productsResource, { refetch }] = createResource(loadProducts);

	const getProduct = (id: string) => products()?.find((product) => product.id === id);

	const getStockItem = (id: string) => products()?.find((product) => product.id === id)?.stock;

	// createEffect(() => productsResource() && setProducts(productsResource()));

	return { products, setProducts, getProduct, getStockItem };
}
export default createRoot(createProductContext);
