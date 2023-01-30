import { Show } from "solid-js";
import CartContext from "~/context/CartContext";

const CartQuantity = () => {
	const { cartItems } = CartContext;
	return (
		<Show when={cartItems?.length}>
			<div class='absolute flex justify-center items-center rounded-3xl px-2 bg-red-600 text-white text-xs font-extrabold min-w-[1.5rem] min-h-[1.5rem] -top-1 -right-1 translate-x-1/3 -translate-y-[8%]'>
				{cartItems?.reduce((quantity, item) => item.quantity + quantity, 0)}
				<span class='animate-ping absolute inline-flex h-full w-full rounded-3xl bg-red-600 opacity-25' />
			</div>
		</Show>
	);
};
export default CartQuantity;
