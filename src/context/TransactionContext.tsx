import type { Transaction, TransactionItem } from "@prisma/client";
import { batch, createRoot, createSignal } from "solid-js";
import server$ from "solid-start/server";
import { getCartItems$, removeCartItems$ } from "~/services/CartServices";
import { decreaseProductStock$ } from "~/services/ProductServices";
import { createTransaction$, createTransactionItem$ } from "~/services/TransactionServices";
import CartContext from "./CartContext";

function createTransactionContext() {
	const [transactions, setTransactions] = createSignal<Transaction[]>([]);
	const [transactionItems, setTransactionItems] = createSignal<TransactionItem[]>([]);
	const { setCartItems, setIsSubmitting, setIsLoading } = CartContext;

	const logNew = server$(() => {
		console.log("Start");
	});

	const log = server$((text: string) => {
		console.log(`Log: ${text}`);
	});

	const logEnd = server$(() => {
		console.log("End");
	});

	const createTransaction = async () => {
		try {
			setIsSubmitting(true);
			await logNew();
			const cartItems = await getCartItems$();
			await log("get cart items");

			if (!cartItems.length) {
				batch(() => {
					setIsLoading(false);
					setIsSubmitting(false);
				});
				throw new Error("there is no item in cart right now.");
			}

			const newTransaction = await createTransaction$();
			await log("create new transaction");

			if (!newTransaction) {
				batch(() => {
					setIsLoading(false);
					setIsSubmitting(false);
				});
				throw new Error("failed to proceed this transaction, please try again!");
			}

			const newTransactionItems = await createTransactionItem$(newTransaction.id);
			await log("create new transaction items");

			cartItems?.forEach(async (item) => {
				await decreaseProductStock$(item.productId, item.quantity);
			});
			// await decreaseProductsStockExperimental$(cartItems);
			// await log("decrease products stock");

			if (!newTransactionItems) {
				batch(() => {
					setIsLoading(false);
					setIsSubmitting(false);
				});
				throw new Error("failed to create new transaction Items record, please try again!");
			}

			// cartItems.forEach(async (item) => {
			// 	await removeCartItem$(item.id);
			// });
			await removeCartItems$();
			await log("remove cart items");

			const newCartItems = await getCartItems$();
			await log("get new cart items");

			if (newCartItems.length) {
				batch(() => {
					setIsLoading(false);
					setIsSubmitting(false);
				});
				throw new Error("failed to create new transaction Items record, please try again!");
			}

			await logEnd();
		} catch (error) {
			batch(() => {
				setIsLoading(false);
				setIsSubmitting(false);
			});
			console.error(error);
		}
	};

	const handleCreateTransaction = () => {
		createTransaction();
		setCartItems([]);
	};

	return {
		transactions,
		transactionItems,
		setTransactions,
		setTransactionItems,
		handleCreateTransaction,
	};
}
export default createRoot(createTransactionContext);
