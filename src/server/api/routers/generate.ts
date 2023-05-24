import { z } from "zod";
import { createTRPCRouter, publicProcedure } from "~/server/api/trpc";

// trpc mutation: you want to modify or change something in your backend, like delete insert...
// trpc query: you want to get something back, you not mutating at all
export const generateRouter = createTRPCRouter({
  // define what inputs are needed for this method, here we just need a prompt
  // trpc built-in with zod: zod will automatically validate the input for you
  // we use z.object to define input
  // make sure this endpoint has to have 'prompt' to pass in, otherwise AI won't know what to generate
  // chain on this method with mutation, and write some code when someone does some mutation to this method
  generateIcon: publicProcedure
    .input(
      z.object({
        prompt: z.string(),
      })
    )
    .mutation(({ ctx, input }) => {
      // we gonna use ctx to get user id, prisma object reading writing in the database
      // input carries 'prompt' we send it in
      console.log("We are here from routers folder.", input.prompt);
      return {
        message: "success",
      };
    }),
});
