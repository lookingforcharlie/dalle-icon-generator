import {
  createTRPCRouter,
  protectedProcedure,
  publicProcedure,
} from "~/server/api/trpc";

export const userRouter = createTRPCRouter({
  getUserCredits: protectedProcedure.query(async ({ ctx }) => {
    const userObject = await ctx.prisma.user.findUnique({
      where: {
        id: ctx.session.user.id,
      },
    });
    const userCredits = userObject?.credit;
    return userCredits;
  }),
});

// TODO:
// Fetch all the icons in the database for the user who made the request
