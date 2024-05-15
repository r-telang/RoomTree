import { z } from "zod";

import { router, publicProcedure } from "../trpc";

export const userRouter = router({
    isUserAdmin: publicProcedure
        .input(z.object({ email: z.string() }))
        .query(async ({ ctx, input }) => {

            const user = await ctx.prisma.adminUsers.findFirst({
                where: {
                    email: input.email
                }
            })

            return user ? true : false
        }),

    isUserOwner: publicProcedure
        .input(z.object({ email: z.string() }))
        .query(async ({ ctx, input }) => {

            const user = await ctx.prisma.ownerUsers.findFirst({
                where: {
                    email: input.email
                }
            })

            return user ? true : false
        }),

});
