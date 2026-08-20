import { createCallerFactory, createTRPCRouter } from "~/server/api/trpc";
import { emptyRouter } from "./routers/empty";
import { flyspotGdanskNov26Router } from "./routers/flyspotGdanskNov26";
import { pancakesOnTheBeachRouter } from "./routers/pancakesOnTheBeach";

/**
 * This is the primary router for your server.
 *
 * All routers added in /api/routers should be manually added here.
 */
export const appRouter = createTRPCRouter({
  empty: emptyRouter,
  flyspotGdanskNov26: flyspotGdanskNov26Router,
  pancakesOnTheBeach: pancakesOnTheBeachRouter,
});

// export type definition of API
export type AppRouter = typeof appRouter;

/**
 * Create a server-side caller for the tRPC API.
 * @example
 * const trpc = createCaller(createContext);
 * const res = await trpc.post.all();
 *       ^? Post[]
 */
export const createCaller = createCallerFactory(appRouter);
