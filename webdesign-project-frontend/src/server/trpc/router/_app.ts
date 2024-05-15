import { router } from "../trpc";
import { authRouter } from "./auth";
import { catalogRouter } from "./catalog";
import { exampleRouter } from "./example";
import { userRouter } from "./users";

export const appRouter = router({
  example: exampleRouter,
  auth: authRouter,
  catalog: catalogRouter,
  user: userRouter,
});

// export type definition of API
export type AppRouter = typeof appRouter;
