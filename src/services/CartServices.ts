import server$, { createServerData$ } from "solid-start/server";
import { prisma } from "~/server/db/client";

// CREATE
// Create Cart Item
export const createCartItem$ = server$(async (productId: string) => {
	return await prisma.cartItem.create({
		data: {
			quantity: 1,
			createdAt: new Date(),
			updatedAt: new Date(),
			productId,
			isChecked: true,
			status: true,
		},
		select: { id: true, isChecked: true, productId: true, quantity: true, status: true },
	});
});

// Create Cart Item Raw
export const createCartItemRaw$ = server$(async (productId: string) => {
	return await prisma.cartItem.create({
		data: {
			quantity: 1,
			createdAt: new Date(),
			updatedAt: new Date(),
			productId,
			isChecked: true,
			status: true,
		},
	});
});

// READ
// get CartItems
export const getCartItems$ = server$(async () => {
	const cartItems = await prisma.cartItem.findMany({
		select: { id: true, isChecked: true, productId: true, quantity: true, status: true },
	});

	return cartItems;
});

// get CartItems Raw
export const getCartItemsRaw$ = server$(async () => {
	const cartItems = await prisma.cartItem.findMany();

	return cartItems;
});

// get CartItems with Server Data
export const getServerCartItemsData$ = createServerData$(async () => {
	const cartItems = await prisma.cartItem.findMany({
		select: { id: true, isChecked: true, productId: true, quantity: true, status: true },
	});

	return cartItems;
});

// get CartItems with Server Data Raw
export const getServerCartItemsDataRaw$ = createServerData$(async () => {
	const cartItems = await prisma.cartItem.findMany();

	return cartItems;
});

// get CartItem
export const getCartItem$ = server$(async (cartId: string) => {
	const cartItem = await prisma.cartItem.findUnique({
		where: { id: cartId },
		select: { id: true, isChecked: true, productId: true, quantity: true, status: true },
	});

	return cartItem;
});

// get CartItem by Product Id
export const getCartItemByProductId$ = server$(async (productId: string) => {
	const cartItem = await prisma.cartItem.findFirst({
		where: { productId },
		select: { id: true, isChecked: true, productId: true, quantity: true, status: true },
	});

	return cartItem;
});

// get CartItem Raw
export const getCartItemRaw$ = server$(async (cartId: string) => {
	const cartItem = await prisma.cartItem.findUnique({ where: { id: cartId } });

	return cartItem;
});

// get CartItem by Product Id
export const getCartItemByProductIdRaw$ = server$(async (productId: string) => {
	const cartItem = await prisma.cartItem.findFirst({ where: { productId } });

	return cartItem;
});

// UPDATE
// Increase Cart Item Quantity
export const increaseCartItem$ = server$(async (cartId: string, prevQuantity: number) => {
	return await prisma.cartItem.update({
		where: { id: cartId },
		data: { quantity: prevQuantity + 1, updatedAt: new Date() },
		select: { id: true, isChecked: true, productId: true, quantity: true, status: true },
	});
});

// Increase Cart Item Quantity Raw
export const increaseCartItemRaw$ = server$(async (cartId: string, prevQuantity: number) => {
	return await prisma.cartItem.update({
		where: { id: cartId },
		data: { quantity: prevQuantity + 1, updatedAt: new Date() },
	});
});

// Decrease Cart Item Quantity
export const decreaseCartItem$ = server$(async (cartId: string, prevQuantity: number) => {
	return await prisma.cartItem.update({
		where: { id: cartId },
		data: { quantity: prevQuantity - 1, updatedAt: new Date() },
		select: { id: true, isChecked: true, productId: true, quantity: true, status: true },
	});
});

// Decrease Cart Item Quantity Raw
export const decreaseCartItemRaw$ = server$(async (cartId: string, prevQuantity: number) => {
	return await prisma.cartItem.update({
		where: { id: cartId },
		data: { quantity: prevQuantity - 1, updatedAt: new Date() },
	});
});

// set Cart Item Quantity
export const setCartItemQuantity$ = server$(async (cartId: string, newQuantity: number) => {
	return await prisma.cartItem.update({
		where: { id: cartId },
		data: { quantity: newQuantity, updatedAt: new Date() },
		select: { id: true, isChecked: true, productId: true, quantity: true, status: true },
	});
});

// set Cart Item Quantity Raw
export const setCartItemQuantityRaw$ = server$(async (cartId: string, newQuantity: number) => {
	return await prisma.cartItem.update({
		where: { id: cartId },
		data: { quantity: newQuantity, updatedAt: new Date() },
	});
});

// DELETE
// delete Cart Item
export const removeCartItem$ = server$(async (cartId: string) => {
	await prisma.cartItem.delete({
		where: { id: cartId },
	});
});

// delete Cart Item
export const removeCartItems$ = server$(async () => {
	await prisma.cartItem.deleteMany();
});
