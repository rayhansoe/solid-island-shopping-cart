import solid from "solid-start/vite";
import { defineConfig } from "vite";
// @ts-expect-error no typing
import vercel from "solid-start-vercel";

export default defineConfig(() => {
	return {
		plugins: [
			solid({
				islands: true,
				islandsRouter: true,
				ssr: true,
				adapter: vercel({ edge: true }),
			}),
		],
	};
});
