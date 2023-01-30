import server$, { createServerData$ } from "solid-start/server";
import { prisma } from "~/server/db/client";
import { getCartItems$, getTotalPrice$ } from "./CartServices";

// CREATE

// Create Transaction
// export const createTransaction = async () => {
// 	const totalPrice = await getTotalPrice$();
// 	return await prisma.transaction.create({
// 		data: {
// 			totalPrice,
// 			createdAt: new Date(),
// 			updatedAt: new Date(),
// 		},
// 	});
// };

// Create Transaction Server Function
export const createTransaction$ = server$(async () => {
	const totalPrice = await getTotalPrice$();
	return await prisma.transaction.create({
		data: {
			totalPrice,
			createdAt: new Date(),
			updatedAt: new Date(),
		},
	});
});

// Create Transaction Item
// export const createTransactionItem = async (transactionId: string) => {
// 	const cartItems = await getCartItems$();

// 	cartItems.forEach(async (item) => {
// 		await prisma.transactionItem.create({
// 			data: {
// 				createdAt: new Date(),
// 				updatedAt: new Date(),
// 				quantity: item.quantity,
// 				productId: item.productId,
// 				transactionId,
// 			},
// 		});
// 	});

// 	return await prisma.transactionItem.findMany({
// 		where: {
// 			transactionId,
// 		},
// 	});
// };

// Create Transaction Item Server Function
export const createTransactionItem$ = server$(async (transactionId: string) => {
	const cartItems = await getCartItems$();

	cartItems.forEach(async (item) => {
		await prisma.transactionItem.create({
			data: {
				createdAt: new Date(),
				updatedAt: new Date(),
				quantity: item.quantity,
				productId: item.productId,
				transactionId,
			},
		});
	});

	return await prisma.transactionItem.findMany({
		where: {
			transactionId,
		},
	});
});

// READ

// get Transactions
// export const getTransactions = async () => {
// 	return await prisma.transaction.findMany();
// };

// get Transactions Server Function
export const getTransactions$ = server$(async () => {
	return await prisma.transaction.findMany();
});

// get Transactions Server Resource
export const getServerTransactionsData$ = () =>
	createServerData$(
		async () => {
			return await prisma.transaction.findMany();
		},
		{
			deferStream: true,
		}
	);

// get Transaction
// export const getTransaction = async (transactionId: string) => {
// 	return await prisma.transaction.findUnique({
// 		where: {
// 			id: transactionId,
// 		},
// 	});
// };

// get Transaction Server Function
export const getTransaction$ = server$(async (transactionId: string) => {
	return await prisma.transaction.findUnique({
		where: {
			id: transactionId,
		},
	});
});

// get Transaction Server Resource
export const getServerTransactionData$ = () =>
	createServerData$(
		async (transactionId: string) => {
			return await prisma.transaction.findUnique({
				where: {
					id: transactionId,
				},
			});
		},
		{
			deferStream: true,
		}
	);

// get Transaction Items
// export const getTransactionItems = async () => {
// 	return await prisma.transactionItem.findMany();
// };

// get Transaction Items Server Function
export const getTransactionItems$ = server$(async () => {
	return await prisma.transactionItem.findMany();
});

// get Transaction Items Server Resource
export const getServerTransactionItemsData$ = () =>
	createServerData$(
		async () => {
			return await prisma.transactionItem.findMany();
		},
		{
			deferStream: true,
		}
	);

// get Transaction Item
// export const getTransactionItem = async (transactionItemId: string) => {
// 	return await prisma.transactionItem.findUnique({
// 		where: {
// 			id: transactionItemId,
// 		},
// 	});
// };

// get Transaction Item Server Function
export const getTransactionItem$ = server$(async (transactionItemId: string) => {
	return await prisma.transactionItem.findUnique({
		where: {
			id: transactionItemId,
		},
	});
});

// get Transaction Item Server Resource
export const getServerTransactionItemData$ = () =>
	createServerData$(
		async (transactionItemId: string) => {
			return await prisma.transactionItem.findUnique({
				where: {
					id: transactionItemId,
				},
			});
		},
		{
			deferStream: true,
		}
	);
