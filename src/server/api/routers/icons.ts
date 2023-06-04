import {
  createTRPCRouter,
  protectedProcedure,
  publicProcedure,
} from "~/server/api/trpc";

export const iconsRouter = createTRPCRouter({
  getIcons: protectedProcedure.query(async ({ ctx }) => {
    const icons = await ctx.prisma.icon.findMany({
      where: {
        userId: ctx.session.user.id,
      },
      orderBy: {
        createdAt: "desc",
      },
    });
    return icons;
  }),
  getCommunityIcons: publicProcedure.query(async ({ ctx }) => {
    // get the 50 latest created icons
    const icons = await ctx.prisma.icon.findMany({
      take: 50,
      orderBy: {
        createdAt: "desc",
      },
    });
    return icons;
  }),
});

// TODO:
// Fetch all the icons in the database for the user who made the request
