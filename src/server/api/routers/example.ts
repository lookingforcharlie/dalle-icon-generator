import { z } from "zod";

import {
  createTRPCRouter,
  protectedProcedure,
  publicProcedure,
} from "~/server/api/trpc";

export const exampleRouter = createTRPCRouter({
  hello: publicProcedure
    .input(z.object({ text: z.string() }))
    .query(({ input }) => {
      return {
        greeting: `Hello ${input.text}`,
      };
    }),
  // 'hello' query is a publicProcedure, requires a input, which is an object, contains text, and its value is string
  // and 'hello' will do the query and return that greeting.

  getAll: publicProcedure.query(({ ctx }) => {
    return ctx.prisma.example.findMany();
  }),
  // 'getAll' will do a request to fetch all the data from example table in Prisma Studio, and return it

  getSecretMessage: protectedProcedure.query(() => {
    return "you can now see this secret message!";
  }),
  // 'getSecretMessage', you need authentication to make this work.
});

// This example router has three things inside: 'hello', 'getAll', and 'getSecretMessage'
