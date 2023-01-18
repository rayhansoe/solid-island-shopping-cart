import type { VoidComponent } from "solid-js";
import { Show } from "solid-js";
import { Outlet, useRouteData } from "solid-start";
import { createServerData$ } from "solid-start/server";
import NavBar from "~/components/NavBar";
import CartContext from "~/context/CartContext";
import { prisma } from "~/server/db/client";

export function routeData() {
	const { setCartItems } = CartContext;

	const cartItems = createServerData$(
		async () => {
			const data = await prisma.cartItem.findMany();

			return data;
		},
		{
			deferStream: true,
		}
	);

	const data = cartItems();
	data && setCartItems(data);

	return cartItems;
}

const App: VoidComponent = () => {
	const data = useRouteData<typeof routeData>();
	return (
		<>
			<Show when={data()}>
				<NavBar />
				<Outlet />
			</Show>
		</>
	);
};
export default App;
