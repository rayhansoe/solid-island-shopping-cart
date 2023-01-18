import { Show } from "solid-js";
import CartContext from "~/context/CartContext";
import ProductContext from "~/context/ProductContext";
import { formatCurrency } from "~/utilities/formatCurrency";

export default function Summary() {
	const { cartItems } = CartContext;
	const { products } = ProductContext;

	return (
		<Show when={cartItems()?.length}>
			<span>
				{formatCurrency(
					cartItems()?.reduce(
						(totalPrice, cartItem) =>
							cartItem.quantity *
								Number(products()?.find((item) => item.id === cartItem.productId)?.price || 0) +
							totalPrice,
						0
					) || 0
				)}
			</span>
		</Show>
	);
}
