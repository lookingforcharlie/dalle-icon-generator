import { createTRPCRouter, protectedProcedure } from "~/server/api/trpc";

import Stripe from "stripe";
import { env } from "~/env.mjs";

// Create a stripe object using the secret key
const stripe = new Stripe(`${env.STRIPE_SECRET_KEY}`, {
  apiVersion: "2022-11-15",
});

// create a checkout session
export const checkoutRouter = createTRPCRouter({
  createCheckout: protectedProcedure.mutation(async ({ ctx }) => {
    // stripe.checkout.sessions.create - redirect user to a session checkout page
    // where you can provide a input that user are trying to buy
    // success_url: when someone successfully registered, we can redirect them to the right url
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      metadata: {
        userId: ctx.session.user.id,
      },
      line_items: [{ price: env.PRICE_ID, quantity: 1 }],
      mode: "payment",
      success_url: `${env.HOST_NAME}`,
      cancel_url: `${env.HOST_NAME}`,
    });

    return session;
  }),
});
