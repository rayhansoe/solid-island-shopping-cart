import { batch, createRoot, createSignal } from "solid-js";
import { createStore, produce } from "solid-js/store";
import {
	createCartItem$,
	decreaseCartItem$,
	getCartItem$,
	getCartItemByProductId$,
	getCartItems$,
	increaseCartItem$,
	removeCartItem$,
	setCartItemQuantity$,
} from "~/services/CartServices";
import { getProduct$, updateProductPopularityLite$ } from "~/services/ProductServices";
import type { CartItemProps } from "~/types";
import { arraysEqual } from "~/utilities/utils";
import productContext from "./ProductContext";

const data: CartItemProps[] = await getCartItems$();

function createCartContext() {
	const { getProductClient } = productContext;
	const [cartItems, setCartItems] = createStore<CartItemProps[]>(data || []);
	const [isLoading, setIsLoading] = createSignal<boolean>(false);
	const [isSubmitting, setIsSubmitting] = createSignal<boolean>(false);

	const increaseCartItem = async (productId: string) => {
		try {
			setIsSubmitting(true);
			// Get Product & Cart Item
			const product = await getProduct$(productId);
			const item = await getCartItemByProductId$(productId);

			// Check Product
			if (!product?.id || typeof product?.popularity !== "number") {
				batch(() => {
					setIsLoading(false);
					setIsSubmitting(false);
				});
				throw new Error("Failed to get Product or Product is not Found!");
			}

			// Update Product Popu
			await updateProductPopularityLite$(product.id, product.popularity);

			// Check Stock
			if (product.stock === 0) {
				batch(() => {
					setIsLoading(false);
					setIsSubmitting(false);
				});
				throw new Error("Product out of stock!");
			}

			// Check Item
			if (!item?.id) {
				const newCartItem = await createCartItem$(product.id);
				newCartItem &&
					batch(() => {
						setIsLoading(false);
						setIsSubmitting(false);
					});
				return newCartItem;
			}

			// Check if Item quantity is equal with product stock
			if (product.stock === item.quantity) {
				const updatedCartItem = await setCartItemQuantity$(item.id, product.stock);
				updatedCartItem &&
					batch(() => {
						setIsLoading(false);
						setIsSubmitting(false);
					});
				return updatedCartItem;
			}

			// increase item
			const updatedCartItem = await increaseCartItem$(item.id);
			updatedCartItem &&
				batch(() => {
					setIsLoading(false);
					setIsSubmitting(false);
				});
			return updatedCartItem;
		} catch (error) {
			batch(() => {
				setIsLoading(false);
				setIsSubmitting(false);
			});
			console.error(error);
		}
	};

	const decreaseCartItem = async (productId: string) => {
		try {
			setIsSubmitting(true);
			// Get Product & Cart Item
			const product = await getProduct$(productId);
			const item = await getCartItemByProductId$(productId);

			// Check Product
			if (!product?.id || typeof product?.popularity !== "number") {
				batch(() => {
					setIsLoading(false);
					setIsSubmitting(false);
				});
				throw new Error("Failed to get Product or Product is not Found!");
			}

			// Check Item
			if (!item?.id) {
				batch(() => {
					setIsLoading(false);
					setIsSubmitting(false);
				});
				throw new Error("Failed to get Item or Item is not Found!");
			}

			// Update Product Popu
			await updateProductPopularityLite$(product.id, product.popularity);

			if (item.quantity === 1) {
				const removedCartItem = await removeCartItem$(item.id);
				removedCartItem &&
					batch(() => {
						setIsLoading(false);
						setIsSubmitting(false);
					});
				return "removed";
			}

			const decreasedCartItem = await decreaseCartItem$(item.id);
			decreasedCartItem &&
				batch(() => {
					setIsLoading(false);
					setIsSubmitting(false);
				});
			return decreasedCartItem;
		} catch (error) {
			batch(() => {
				setIsLoading(false);
				setIsSubmitting(false);
			});
			console.error(error);
		}
	};

	const removeFromCartItem = async (productId: string) => {
		try {
			setIsSubmitting(true);
			// Get Product & Cart Item
			const product = await getProduct$(productId);
			const item = await getCartItemByProductId$(productId);

			// Check Product
			if (!product?.id || typeof product?.popularity !== "number") {
				batch(() => {
					setIsLoading(false);
					setIsSubmitting(false);
				});
				throw new Error("Failed to get Product or Product is not Found!");
			}

			// Check Item
			if (!item?.id) {
				batch(() => {
					setIsLoading(false);
					setIsSubmitting(false);
				});
				throw new Error("Failed to get Item or Item is not Found!");
			}

			// Update Product Popu
			await updateProductPopularityLite$(product.id, product.popularity);

			const removedCartItem = await removeCartItem$(item.id);
			removedCartItem &&
				batch(() => {
					setIsLoading(false);
					setIsSubmitting(false);
				});
			return "removed";
		} catch (error) {
			batch(() => {
				setIsLoading(false);
				setIsSubmitting(false);
			});
			console.error(error);
		}
	};

	const setCartItemQuantityByProductId = async (productId: string, newQuantity: number) => {
		try {
			setIsSubmitting(true);
			// Get Product & Cart Item
			const product = await getProduct$(productId);
			const item = await getCartItemByProductId$(productId);

			// Check Product
			if (!product?.id || typeof product?.popularity !== "number") {
				batch(() => {
					setIsLoading(false);
					setIsSubmitting(false);
				});
				throw new Error("Failed to get Product or Product is not Found!");
			}

			// Check Item
			if (!item?.id) {
				const createdCartItem = await createCartItem$(product.id);
				createdCartItem &&
					batch(() => {
						setIsLoading(false);
						setIsSubmitting(false);
					});
				return createdCartItem;
			}

			// Update Product Popu
			await updateProductPopularityLite$(product.id, product.popularity);

			if (Number.isNaN(newQuantity)) {
				const updatedCartItem = await setCartItemQuantity$(item.id, item.quantity);
				updatedCartItem &&
					batch(() => {
						setIsLoading(false);
						setIsSubmitting(false);
					});
				return updatedCartItem;
			}

			if (typeof newQuantity !== "number") {
				batch(() => {
					setIsLoading(false);
					setIsSubmitting(false);
				});
				throw new Error("Invalid New Quantity!");
			}

			if (newQuantity === 0) {
				await removeCartItem$(item.id);
				const removedCartItem = await removeCartItem$(item.id);
				removedCartItem &&
					batch(() => {
						setIsLoading(false);
						setIsSubmitting(false);
					});
				return "removed";
			}

			if (product.stock < newQuantity) {
				const updatedCartItem = await setCartItemQuantity$(item.id, product.stock);
				updatedCartItem &&
					batch(() => {
						setIsLoading(false);
						setIsSubmitting(false);
					});
				return updatedCartItem;
			}

			const updatedCartItem = await setCartItemQuantity$(item.id, newQuantity);
			updatedCartItem &&
				batch(() => {
					setIsLoading(false);
					setIsSubmitting(false);
				});
			return updatedCartItem;
		} catch (error) {
			batch(() => {
				setIsLoading(false);
				setIsSubmitting(false);
			});
			console.error(error);
		}
	};

	const setCartItemQuantityByCartItemId = async (cartId: string, newQuantity: number) => {
		try {
			setIsSubmitting(true);
			// Get Product & Cart Item
			const item = await getCartItem$(cartId);

			// Check Item
			if (!item?.id) {
				batch(() => {
					setIsLoading(false);
					setIsSubmitting(false);
				});
				throw new Error("Failed to get Cart Item or Cart Item is not Found!");
			}

			const product = await getProduct$(item.productId);

			// Check Product
			if (!product?.id || typeof product?.popularity !== "number") {
				batch(() => {
					setIsLoading(false);
					setIsSubmitting(false);
				});
				throw new Error("Failed to get Product or Product is not Found!");
			}

			// Update Product Popu
			await updateProductPopularityLite$(product.id, product.popularity);

			if (Number.isNaN(newQuantity)) {
				const updatedCartItem = await setCartItemQuantity$(item.id, item.quantity);
				updatedCartItem &&
					batch(() => {
						setIsLoading(false);
						setIsSubmitting(false);
					});
				return updatedCartItem;
			}

			if (typeof newQuantity !== "number") {
				batch(() => {
					setIsLoading(false);
					setIsSubmitting(false);
				});
				throw new Error("Invalid New Quantity!");
			}

			if (newQuantity === 0) {
				const removedCartItem = await removeCartItem$(item.id);
				removedCartItem &&
					batch(() => {
						setIsLoading(false);
						setIsSubmitting(false);
					});
				return "removed";
			}

			if (product.stock < newQuantity) {
				const updatedCartItem = await setCartItemQuantity$(item.id, product.stock);
				updatedCartItem &&
					batch(() => {
						setIsLoading(false);
						setIsSubmitting(false);
					});
				return updatedCartItem;
			}

			const updatedCartItem = await setCartItemQuantity$(item.id, newQuantity);
			updatedCartItem &&
				batch(() => {
					setIsLoading(false);
					setIsSubmitting(false);
				});
			return updatedCartItem;
		} catch (error) {
			batch(() => {
				setIsLoading(false);
				setIsSubmitting(false);
			});
			console.error(error);
		}
	};

	const handleIncreaseCartItem = async (productId: string) => {
		const response = await increaseCartItem(productId);
		const updatedCartItems = await getCartItems$();

		// Fail to increase item
		if (!response?.id) {
			return;
		}

		// is item exist?
		const item = cartItems.find((item) => item.id === response.id);

		// if it is not then create one
		if (!item) {
			setCartItems(
				produce((items) => {
					items.push(response);
				})
			);
		}

		if (item?.id) {
			// update nested
			setCartItems(
				(item) => item.id === response.id,
				produce((item) => (item.quantity = response.quantity))
			);
		}

		// check if server data and client data is equal
		const isEqual: boolean = arraysEqual(updatedCartItems, cartItems);

		// if equal -> override
		if (!isEqual) {
			setCartItems(updatedCartItems);
			return;
		}

		return;
	};

	const handleDecreaseCartItem = async (productId: string) => {
		const response = await decreaseCartItem(productId);
		const updatedCartItems = await getCartItems$();

		// if item has been removed
		if (!response) {
			return;
		}

		if (response === "removed") {
			setCartItems((items) => items.filter((item) => item.productId !== productId));
		}

		if (typeof response !== "string" && response.id) {
			// update nested
			setCartItems(
				(item) => item.id === response.id,
				produce((item) => (item.quantity = response.quantity))
			);
		}

		// check if server data and client data is equal
		const isEqual: boolean = arraysEqual(updatedCartItems, cartItems);

		// if equal -> override
		if (!isEqual) {
			setCartItems(updatedCartItems);
		}

		return;
	};

	const handleRemoveCartItem = async (productId: string) => {
		const response = await removeFromCartItem(productId);
		const updatedCartItems = await getCartItems$();

		// fail to remove item
		if (!response) {
			return;
		}

		// if item has been removed
		if (response === "removed") {
			setCartItems((items) => items.filter((item) => item.productId !== productId));
		}

		// check if server data and client data is equal
		const isEqual: boolean = arraysEqual(updatedCartItems, cartItems);

		// if equal -> override
		if (!isEqual) {
			setCartItems(updatedCartItems);
		}

		return;
	};

	const handleSetCartItemQuantityByProductId = async (productId: string, quantity: number) => {
		const response = await setCartItemQuantityByProductId(productId, quantity);
		const updatedCartItems = await getCartItems$();

		// if item has been removed
		if (!response) {
			return;
		}

		// if item has been removed
		if (response === "removed") {
			setCartItems((items) => items.filter((item) => item.productId !== productId));
		}

		if (typeof response !== "string" && response.id) {
			// is item exist?
			const item = cartItems.find((item) => item.id === response.id);

			// if it is not then create one
			if (!item) {
				setCartItems(
					produce((items) => {
						items.push(response);
					})
				);
			}

			if (item) {
				// update nested
				setCartItems(
					(item) => item.id === response.id,
					produce((item) => (item.quantity = response.quantity))
				);
			}
		}

		// check if server data and client data is equal
		const isEqual: boolean = arraysEqual(updatedCartItems, cartItems);

		// if equal -> override
		if (!isEqual) {
			setCartItems(updatedCartItems);
		}

		return;
	};

	const handleSetCartItemQuantityByCartItemId = async (cartId: string, quantity: number) => {
		const response = await setCartItemQuantityByCartItemId(cartId, quantity);
		const updatedCartItems = await getCartItems$();

		// if item has been removed
		if (!response) {
			return;
		}

		// if item has been removed
		if (response === "removed") {
			setCartItems((items) => items.filter((item) => item.id !== cartId));
		}

		if (typeof response !== "string" && response.id) {
			// is item exist?
			const item = cartItems.find((item) => item.id === response.id);

			// if it is not then create one
			if (!item) {
				setCartItems(
					produce((items) => {
						items.push(response);
					})
				);
			}

			if (item) {
				// update nested
				setCartItems(
					(item) => item.id === response.id,
					produce((item) => (item.quantity = response.quantity))
				);
			}
		}

		// check if server data and client data is equal
		const isEqual: boolean = arraysEqual(updatedCartItems, cartItems);

		// if equal -> override
		if (!isEqual) {
			setCartItems(updatedCartItems);
		}

		return;
	};

	const getCartQuantity = () => cartItems?.reduce((quantity, item) => item.quantity + quantity, 0);

	const getCartItemClient = (id: string) => cartItems?.find((item) => item.productId === id);

	const getCartItemQuantity = (id: string) =>
		cartItems?.find((item) => item.productId === id)?.quantity;

	const getTotalPrice = () =>
		cartItems?.length
			? cartItems?.reduce(
					(totalPrice, cartItem) =>
						cartItem.quantity * Number(getProductClient(cartItem.productId)?.price) + totalPrice,
					0
			  )
			: 0;

	return {
		cartItems,
		isLoading,
		isSubmitting,
		setCartItems,
		setIsSubmitting,
		setIsLoading,
		handleIncreaseCartItem,
		handleDecreaseCartItem,
		handleRemoveCartItem,
		handleSetCartItemQuantityByCartItemId,
		handleSetCartItemQuantityByProductId,
		getCartQuantity,
		getCartItemClient,
		getCartItemQuantity,
		getTotalPrice,
	};
}
export default createRoot(createCartContext);
