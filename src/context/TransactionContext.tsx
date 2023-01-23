import type { Transaction, TransactionItem } from "@prisma/client";
import { createRoot, createSignal } from "solid-js";
import server$ from "solid-start/server";
import { prisma } from "~/server/db/client";
import CartContext from "./CartContext";

function createTransactionContext() {
	const [transactions, setTransactions] = createSignal<Transaction[]>([]);
	const [transactionItems, setTransactionItems] = createSignal<TransactionItem[]>([]);
	const { setCartItems } = CartContext;

	const createTransaction = server$(async () => {
		try {
			const cartItems = await prisma.cartItem.findMany();
			const products = await prisma.product.findMany();
			const totalPrice =
				cartItems?.reduce(
					(totalPrice, cartItem) =>
						cartItem.quantity *
							Number(products?.find((item) => item.id === cartItem.productId)?.price || 0) +
						totalPrice,
					0
				) || 0;
			if (!cartItems.length) {
				throw new Error("there is no item in cart right now.");
			}
			const newTransaction = await prisma.transaction.create({
				data: { createdAt: new Date(), updatedAt: new Date(), totalPrice },
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

			cartItems?.forEach(async (item) => {
				const product = await prisma.product.findUnique({ where: { id: item.productId } });
				if (product?.stock && product.popularity) {
					await prisma.product.update({
						where: { id: item.productId },
						data: { stock: product.stock - item.quantity, popularity: product.popularity + 5 },
					});
				}
			});

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
export default createRoot(createTransactionContext);
