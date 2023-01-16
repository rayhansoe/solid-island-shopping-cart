import type { Prisma } from "@prisma/client";
import { PrismaClient } from "@prisma/client";
import { serverEnv } from "~/env/server";

declare global {
	// eslint-disable-next-line no-var
	var prisma: PrismaClient | undefined;
}

export const prisma: PrismaClient<
	Prisma.PrismaClientOptions,
	never,
	Prisma.RejectOnNotFound | Prisma.RejectPerOperation | undefined
> =
	// @ts-expect-error no typing
	global.prisma ||
	new PrismaClient({
		log: serverEnv.NODE_ENV === "development" ? ["query", "error", "warn"] : ["error"],
	});

if (serverEnv.NODE_ENV !== "production") {
	// @ts-expect-error no typing
	global.prisma = prisma;
}
