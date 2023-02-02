import { debounce } from "@solid-primitives/scheduled";
import { batch, createEffect, createResource, createSignal, Show } from "solid-js";
import { redirect, useNavigate } from "solid-start";
import CartContext from "~/context/CartContext";
import ProductContext from "~/context/ProductContext";
import TransactionContext from "~/context/TransactionContext";
import { formatCurrency } from "~/utilities/formatCurrency";

export default function Summary() {
	const { cartItems, isLoading, isSubmitting, setCartItems, setIsLoading, setIsSubmitting } =
		CartContext;
	const { products } = ProductContext;
	const { handleCreateTransaction, createTransaction$, rd$ } = TransactionContext;
	const navigate = useNavigate();

	const [url, setUrl] = createSignal("");

	createEffect(() => {
		if (url() !== "") {
			navigate(url());
		}
	});

	const update = (newValue: string) => {
		navigate(`${newValue}`);
	};

	const debouncedUpdate = debounce(update, 500);

	return (
		<Show when={cartItems?.length}>
			<div class='parent-island flex items-center justify-between text-lg font-semibold'>
				<span class='text-lg'>Total:</span>
				<span>
					{formatCurrency(
						cartItems?.reduce(
							(totalPrice, cartItem) =>
								cartItem.quantity *
									Number(products?.find((item) => item.id === cartItem.productId)?.price || 0) +
								totalPrice,
							0
						) || 0
					)}
				</span>
			</div>
			<button
				disabled={isLoading() || isSubmitting() ? true : false}
				// onClick={() => {
				// 	const r = handleCreateTransaction();
				// 	r.then((response) => {
				// 		if (response?.transaction) {
				// 			batch(() => {
				// 				setIsLoading(false);
				// 				setIsSubmitting(false);
				// 				setCartItems([]);
				// 			});

				// 			console.log("sukes");

				// 			// throw redirect(`/transaction/${response.transaction.id}`);
				// 			navigate(`/transaction/${response?.transaction.id}`, { replace: true });
				// 			return;
				// 		}
				// 		batch(() => {
				// 			setIsLoading(false);
				// 			setIsSubmitting(false);
				// 		});
				// 		console.log("pail");
				// 		// throw redirect("/");
				// 		navigate("/", { replace: true });
				// 		return;
				// 	}).catch((e) => {
				// 		console.error(e);
				// 		// throw redirect("/");
				// 		navigate("/", { replace: true });
				// 	});
				// }}
				// onClick={() => {
				// 	setIsSubmitting(true);
				// 	createTransaction$()
				// 		.then((r) => {
				// 			if (r?.transaction) {
				// 				console.log("sukes");
				// 				batch(() => {
				// 					setIsLoading(false);
				// 					setIsSubmitting(false);
				// 					setCartItems([]);
				// 					setUrl(`/transaction/${r?.transaction.id}`);
				// 				});

				// 				return;
				// 			}
				// 			batch(() => {
				// 				setIsLoading(false);
				// 				setIsSubmitting(false);
				// 			});
				// 		})
				// 		.catch((e) => {
				// 			console.error(e);
				// 			navigate("/", { replace: true });
				// 		});
				// }}
				onClick={() => debouncedUpdate("/transaction")}
				class='w-full px-2 py-3 bg-blue-500 text-white rounded-md font-semibold hover:bg-blue-400 active:bg-blue-300 disabled:cursor-not-allowed disabled:bg-blue-100 disabled:text-gray-500'
			>
				Checkout
			</button>
		</Show>
	);
}
