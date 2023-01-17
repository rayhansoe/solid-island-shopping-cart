import { Show } from "solid-js";
import { unstable_island } from "solid-start";
import CartContext from "~/context/CartContext";
const Summary = unstable_island(() => import("./Summary"));

export default function SummarySection() {
	const { cartItems } = CartContext;

	return (
		<Show when={cartItems()?.length}>
			{/* <div class='flex w-full h-min flex-col p-3 gap-3 sticky bottom-0 bg-white md:border md:border-gray-100 md:border-opacity-90 md:w-2/5 md:top-28 md:shadow-lg md:rounded lg:text-xl lg:w-1/3'> */}
			<div class='flex w-full h-min flex-col gap-3 '>
				<div class='parent-island flex items-center justify-between text-lg font-semibold'>
					<span class='text-lg'>Total:</span>
					<Summary />
				</div>
				<button class='w-full px-2 py-3 bg-blue-500 text-white rounded-md font-semibold hover:bg-blue-400 active:bg-blue-300 '>
					Checkout
				</button>
			</div>
			{/* </div> */}
		</Show>
	);
}
