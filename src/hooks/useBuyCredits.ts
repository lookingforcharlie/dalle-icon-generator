// a custom help hook we can use anywhere to allow user setup session and redirect to it

// import a package to allow Stripe works in frontend, to setup session
import { loadStripe } from "@stripe/stripe-js";
import { api } from "~/utils/api";
import { env } from "../env.mjs";

const stripePromise = loadStripe(env.NEXT_PUBLIC_STRIPE_KEY);

export function useBuyCredits() {
  const checkout = api.checkout.createCheckout.useMutation();

  return {
    buyCredits: async () => {
      // hit the mutation endpoint we just added in checkout.ts, evoke the backend to get the session
      const response = await checkout.mutateAsync();
      // get the strip object
      const stripe = await stripePromise;
      await stripe?.redirectToCheckout({
        sessionId: response.id,
      });
    },
  };
}
