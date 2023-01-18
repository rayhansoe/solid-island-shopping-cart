import { Show } from "solid-js";
import { createServerData$ } from "solid-start/server";
import { Meta, Title, useRouteData } from "solid-start";

import { prisma } from "~/server/db/client";
import CartContext from "~/context/CartContext";
import ProductContext from "~/context/ProductContext";
import CartPage from "~/components/CartPage";

export function routeData() {
	const { setProducts } = ProductContext;
	const { setCartItems } = CartContext;
	const products = createServerData$(
		async () => {
			const data = await prisma.product.findMany();

			return data;
		},
		{
			deferStream: true,
		}
	);

	const cartItems = createServerData$(
		async () => {
			const data = await prisma.cartItem.findMany();

			return data;
		},
		{
			deferStream: true,
		}
	);

	const cartItemsData = cartItems();
	const productsData = products();

	cartItemsData && setCartItems(cartItemsData);
	productsData && setProducts(productsData);

	return { products, cartItems };
}

function cart() {
	const data = useRouteData<typeof routeData>();
	return (
		<>
			<Title>Cart Page</Title>
			<Meta name='description' content='My site is even better now we are on Cart Page' />
			<main class='container h-full mx-auto mt-4 flex flex-col gap-2 sm:max-w-[640px] md:max-w-3xl lg:max-w-5xl xl:max-w-7xl:'>
				<div class='flex items-center gap-2'>
					<h1 class='text-2xl font-semibold p-3 lg:text-3xl'>Cart</h1>
				</div>
				<Show when={data.cartItems() && data.products()}>
					<CartPage />
				</Show>
			</main>
		</>
	);
}
export default cart;
