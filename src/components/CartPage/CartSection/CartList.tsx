/* eslint-disable solid/reactivity */
import { For, Show } from "solid-js";
import CartContext from "~/context/CartContext";
import CartItem from "./CartItem";

export default function CartList() {
	const { cartItems } = CartContext;

	return (
		<Show when={cartItems?.length}>
			<For each={cartItems}>{(item) => <CartItem {...item} />}</For>
		</Show>
	);
}
