// a custom help hook we can use anywhere to allow user setup session and redirect to it
// import a package to allow Stripe works in frontend

import { loadStripe } from "@stripe/stripe-js";
import { env } from "~/env.mjs";
import { api } from "~/utils/api";

const stripePromise = loadStripe(`${env.NEXT_PUBLIC_STRIPE_KEY}`);

export function useBuyCredits() {
  const checkout = api.checkout.createCheckout.useMutation();

  return {
    buyCredits: async () => {
      const response = await checkout.mutateAsync();
      const stripe = await stripePromise;
      await stripe?.redirectToCheckout({
        sessionId: response.id,
      });
    },
  };
}
