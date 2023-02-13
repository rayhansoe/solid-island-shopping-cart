import solid from "solid-start/vite";
import { defineConfig } from "vite";

import vercel from "solid-start-vercel";
// import node from "solid-start-node";

export default defineConfig(() => {
	return {
		plugins: [
			solid({ islands: true, islandsRouter: true, ssr: true, adapter: vercel({ edge: false }) }),
			// solid({ islands: true, islandsRouter: true, ssr: true, adapter: node({ edge: false }) }),
		],
		ssr: { external: ["@prisma/client"] },
	};
});
