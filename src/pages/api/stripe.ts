import { NextApiRequest, NextApiResponse } from "next";

import { buffer } from "micro";
import Stripe from "stripe";
import { prisma } from "~/server/db";
import { env } from "../../env.mjs";

const stripe = new Stripe(env.STRIPE_SECRET_KEY, {
  apiVersion: "2022-11-15",
});

// Stripe won't work without this config setup
export const config = {
  api: {
    bodyParser: false,
  },
};

// traditional Next.JS Api endpoint
const webhook = async (req: NextApiRequest, res: NextApiResponse) => {
  if (req.method === "POST") {
    const buf = await buffer(req);
    // get the signature outta headers
    const sig = req.headers["stripe-signature"] as string;

    let event;

    // use signature to verify the webhook
    try {
      event = stripe.webhooks.constructEvent(
        buf,
        sig,
        env.STRIPE_WEB_HOOK_SECRET
      );
    } catch (err) {
      const error = err as Error;
      res.status(400).send(`Webhook Error: ${error.message}`);
      return;
    }

    console.log("Return an event after verification:", event);

    // Handle the event
    switch (event.type) {
      case "checkout.session.completed":
        const checkoutSessionCompleted = event.data.object as {
          id: string;
          metadata: {
            userId: string;
          };
        };
        // Then define and call a function to handle the event checkout.session.completed
        // when verified successfully, we gonna increment user's credit by certain amount
        await prisma.user.update({
          where: {
            id: checkoutSessionCompleted.metadata.userId,
          },
          data: {
            credit: {
              increment: 100,
            },
          },
        });
        break;
      // ... handle other event types
      default:
        console.log(`Unhandled event type ${event.type}`);
    }

    // Return a 200 response to acknowledge receipt of the event
    res.json({ received: true });
  } else {
    res.setHeader("Allow", "POST");
    res.status(405).end("Method Not Allowed");
  }
};

export default webhook;
