import { Show } from "solid-js";
import CartContext from "~/context/CartContext";
import ProductContext from "~/context/ProductContext";
import { formatCurrency } from "~/utilities/formatCurrency";

export default function Summary() {
	const { cartItems } = CartContext;
	const { getProduct } = ProductContext;
	return (
		<Show when={cartItems()?.length}>
			<span>
				{formatCurrency(
					cartItems()?.length
						? cartItems()?.reduce(
								(totalPrice, cartItem) =>
									cartItem.quantity * Number(getProduct(cartItem.productId)?.price || 0) +
									totalPrice,
								0
						  )
						: 0
				)}
			</span>
		</Show>
	);
}
