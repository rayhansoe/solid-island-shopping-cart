import type { Transaction, TransactionItem } from "@prisma/client";
import { createRoot, createSignal } from "solid-js";
import server$ from "solid-start/server";
import { prisma } from "~/server/db/client";
import CartContext from "./CartContext";

function createProductContext() {
	const [transactions, setTransactions] = createSignal<Transaction[]>();
	const [transactionItems, setTransactionItems] = createSignal<TransactionItem[]>();
	const { setCartItems } = CartContext;

	const createTransaction = server$(async () => {
		try {
			const cartItems = await prisma.cartItem.findMany();
			if (!cartItems.length) {
				throw new Error("there is no item in cart right now.");
			}
			const newTransaction = await prisma.transaction.create({
				data: { createdAt: new Date(), updatedAt: new Date() },
			});
			if (!newTransaction) {
				throw new Error("failed to proceed this transaction, please try again!");
			}

			cartItems.forEach(async (item) => {
				await prisma.transactionItem.create({
					data: {
						createdAt: new Date(),
						updatedAt: new Date(),
						quantity: item.quantity,
						productId: item.productId,
						transactionId: newTransaction.id,
					},
				});
			});

			const newTransactionItems = await prisma.transactionItem.findMany();

			if (!newTransactionItems) {
				throw new Error("failed to create new transaction Items record, please try again!");
			}

			await prisma.cartItem.deleteMany();

			const newCartItems = await prisma.cartItem.findMany();

			if (newCartItems.length) {
				throw new Error("failed to create new transaction Items record, please try again!");
			}
		} catch (error) {
			console.error(error);
		}
	});

	const handleCreateTransaction = async () => {
		await createTransaction();
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
export default createRoot(createProductContext);
