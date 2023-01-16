import type { VoidComponent } from "solid-js";
import { Show } from "solid-js";
import { Outlet, useRouteData } from "solid-start";
import { createServerData$ } from "solid-start/server";
import NavBar from "~/components/NavBar";
import CartContext from "~/context/CartContext";
import { prisma } from "~/server/db/client";

export function routeData() {
	return createServerData$(
		async () => {
			const { setCartItems } = CartContext;

			const data = await prisma.cartItem.findMany();
			setCartItems(data);

			return data;
		},
		{
			deferStream: true,
		}
	);
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
