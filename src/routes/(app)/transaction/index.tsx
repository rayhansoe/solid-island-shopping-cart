import { batch, For, Show } from "solid-js";
import { useRouteData } from "solid-start";
import { createServerData$ } from "solid-start/server";
import ProductContext from "~/context/ProductContext";
import TransactionContext from "~/context/TransactionContext";
import { prisma } from "~/server/db/client";

export function routeData() {
	const { setProducts } = ProductContext;
	const { setTransactions, setTransactionItems } = TransactionContext;

	const transactions = createServerData$(
		async () => {
			const data = await prisma.transaction.findMany();
			return data;
		},
		{
			deferStream: true,
		}
	);

	const transactionItems = createServerData$(
		async () => {
			const data = await prisma.transactionItem.findMany();
			return data;
		},
		{
			deferStream: true,
		}
	);

	const products = createServerData$(
		async () => {
			const data = await prisma.product.findMany();
			return data;
		},
		{
			deferStream: true,
		}
	);

	const transactionsData = transactions();
	const transactionItemsData = transactionItems();
	const productsData = products();

	batch(() => {
		transactionsData && setTransactions(transactionsData);
		transactionItemsData && setTransactionItems(transactionItemsData);
		productsData && setProducts(productsData);
	});

	return { transactions, transactionItems, products };
}

export default function Page() {
	const { transactions, transactionItems, products } = useRouteData<typeof routeData>();
	return (
		<Show when={transactions()?.length && transactionItems()?.length && products()?.length}>
			<For each={transactions()}>
				{(transaction) => (
					<details>
						<summary>{JSON.stringify(transaction)}</summary>
						<For each={transactionItems()?.filter((item) => item.transactionId === transaction.id)}>
							{(item) => (
								<>
									<p>
										{JSON.stringify(products()?.find((product) => product.id === item.productId))}
									</p>
									<p>{JSON.stringify(item)}</p>
								</>
							)}
						</For>
					</details>
				)}
			</For>
		</Show>
	);
}
