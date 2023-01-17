import { Show } from "solid-js";
import { createServerData$ } from "solid-start/server";
import CartContext from "~/context/CartContext";
import ProductContext from "~/context/ProductContext";
import { formatCurrency } from "~/utilities/formatCurrency";
import { prisma } from "~/server/db/client";

export default function Summary() {
	const { cartItems } = CartContext;
	const products = createServerData$(
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
					)
				)}
			</span>
		</Show>
	);
}
