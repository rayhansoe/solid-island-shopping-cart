import type { Product } from "@prisma/client";
import { For, Show } from "solid-js";
import ProductCard from "./ProductCard";

type StoreSectionProps = {
	products: Product[] | undefined;
};

const StoreSection = (props: StoreSectionProps) => {
	return (
		<>
			<ul class='flex items-center justify-center flex-wrap w-full'>
				<Show when={props.products}>
					<For each={props.products}>{(product) => <ProductCard {...product} />}</For>
				</Show>
			</ul>
		</>
	);
};
export default StoreSection;
