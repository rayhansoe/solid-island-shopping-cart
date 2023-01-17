import type { CartItem, Product } from "@prisma/client";
import { Show } from "solid-js";
import { unstable_island } from "solid-start";
import CartContext from "~/context/CartContext";

const CartList = unstable_island(() => import("./CartList"));

type CartSectionProps = {
	products: Product[] | undefined;
	cartItems: CartItem[] | undefined;
};

export default function CartSection(props: CartSectionProps) {
	const { cartItems } = CartContext;
	return (
		<Show when={cartItems()?.length}>
			<CartList cartItems={props.cartItems} products={props.products} />
		</Show>
	);
}
