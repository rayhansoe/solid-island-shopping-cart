import type { CartItem } from "@prisma/client";
import { createRoot, createSignal } from "solid-js";
import server$ from "solid-start/server";
import { prisma } from "~/server/db/client";
import productContext from "./ProductContext";

function createCartContext() {
	const { getProduct } = productContext;
	const [cartItems, setCartItems] = createSignal<CartItem[]>([]);

	const loadCart = server$(async () => {
		const cartItems = await prisma.cartItem.findMany({ where: { status: true } });

		return cartItems;
	});

	const increaseCartItem = server$(async (id: string) => {
		const product = await prisma.product.findUnique({ where: { id } });
		const item = await prisma.cartItem.findFirst({ where: { productId: id } });

		if (!item && product?.stock) {
			await prisma.cartItem.create({
				data: {
					quantity: 1,
					createdAt: new Date(),
					updatedAt: new Date(),
					productId: product.id,
					isChecked: true,
					status: true,
				},
			});
		}

		if (product?.stock && item?.id) {
			if (product.stock > item.quantity && product.stock !== 0) {
				await prisma.cartItem.update({
					where: { id: item.id },
					data: { quantity: item.quantity + 1, updatedAt: new Date() },
				});
			}
		}
	});

	const decreaseCartItem = server$(async (id: string) => {
		const item = await prisma.cartItem.findFirst({
			where: { productId: id },
		});

		if (item?.quantity === 1) {
			await prisma.cartItem.delete({ where: { id: item?.id } });
		}

		if (item?.quantity && item.quantity > 1) {
			await prisma.cartItem.update({
				where: { id: item?.id },
				data: { updatedAt: new Date(), quantity: item?.quantity - 1 },
			});
		}
	});

	const removeFromCartItem = server$(async (id: string) => {
		const item = await prisma.cartItem.findFirst({
			where: { productId: id },
		});

		await prisma.cartItem.delete({ where: { id: item?.id } });
	});

	const setCartItemQuantity = server$(async (data: { id: string; quantity: number }) => {
		const product = await prisma.product.findUnique({ where: { id: data.id } });
		const item = await prisma.cartItem.findFirst({
			where: { productId: data.id },
		});

		if (Number.isNaN(data.quantity)) {
			await prisma.cartItem.update({
				where: { id: item?.id },
				data: { updatedAt: new Date(), quantity: item?.quantity },
			});
		} else if (typeof data.quantity === "number") {
			if (item && product) {
				if (data.quantity === 0) {
					await prisma.cartItem.delete({ where: { id: item?.id } });
				}
				if (product.stock < data.quantity) {
					await prisma.cartItem.update({
						where: { id: item?.id },
						data: { updatedAt: new Date(), quantity: product.stock },
					});
				} else {
					await prisma.cartItem.update({
						where: { id: item?.id },
						data: { updatedAt: new Date(), quantity: data.quantity },
					});
				}
			} else {
				await prisma.cartItem.create({
					data: {
						quantity: 1,
						createdAt: new Date(),
						updatedAt: new Date(),
						isChecked: true,
						status: true,
						productId: data.id,
					},
				});
			}
		}
	});

	const handleIncreaseCartItem = async (id: string) => {
		await increaseCartItem(id);
		setCartItems(await loadCart());
		// data && setCartItems(data);
	};

	const handleDecreaseCartItem = async (id: string) => {
		await decreaseCartItem(id);
		const data = await loadCart();
		data && setCartItems(data);
	};

	const handleRemoveCartItem = async (id: string) => {
		await removeFromCartItem(id);
		const data = await loadCart();
		data && setCartItems(data);
	};

	const handleSetCartItemQuantity = async (id: string, quantity: number) => {
		await setCartItemQuantity({ id, quantity });
		const data = await loadCart();
		data && setCartItems(data);
	};

	const getCartQuantity = () =>
		cartItems()?.reduce((quantity, item) => item.quantity + quantity, 0);

	const getCartItem = (id: string) => cartItems()?.find((item) => item.productId === id);

	const getCartItemQuantity = (id: string) =>
		cartItems()?.find((item) => item.productId === id)?.quantity;

	const getTotalPrice = () =>
		cartItems()?.length
			? cartItems()?.reduce(
					(totalPrice, cartItem) =>
						cartItem.quantity * Number(getProduct(cartItem.productId)?.price) + totalPrice,
					0
			  )
			: 0;

	return {
		cartItems,
		setCartItems,
		handleIncreaseCartItem,
		increaseCartItem,
		handleDecreaseCartItem,
		handleRemoveCartItem,
		handleSetCartItemQuantity,
		getCartQuantity,
		getCartItem,
		getCartItemQuantity,
		getTotalPrice,
	};
}
export default createRoot(createCartContext);
