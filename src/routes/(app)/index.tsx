import { Meta, Title, useRouteData } from "solid-start";
import type { VoidComponent } from "solid-js";
import { Show } from "solid-js";
import { createServerData$ } from "solid-start/server";

import { prisma } from "~/server/db/client";
import CartContext from "~/context/CartContext";
import ProductContext from "~/context/ProductContext";
import StoreSection from "~/components/StoreSection";

export function routeData() {
	const productsData = createServerData$(
		async () => {
			const { setProducts } = ProductContext;
			const data = await prisma.product.findMany();
			data && setProducts(data);

			return data;
		},
		{
			deferStream: true,
		}
	);

	const cartItemsData = createServerData$(
		async () => {
			const { setCartItems } = CartContext;
			const data = await prisma.cartItem.findMany();
			data && setCartItems(data);

			return data;
		},
		{
			deferStream: true,
		}
	);

	return { productsData, cartItemsData };
}

const App: VoidComponent = () => {
	const data = useRouteData<typeof routeData>();
	return (
		<>
			<Title>Store Page</Title>
			<Meta name='description' content='My site is even better now we are on Store Page' />
			<main class='container mx-auto mt-4 flex flex-col gap-2'>
				<div class='flex items-center gap-2'>
					<h1 class='text-3xl font-semibold p-3'>Store</h1>
				</div>
				<Show when={data.cartItemsData()}>
					<Show when={data.productsData()}>
						<StoreSection products={data.productsData()} />
					</Show>
				</Show>
			</main>
		</>
	);
};

export default App;
