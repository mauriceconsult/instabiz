import Stripe from "stripe";

if (!process.env.STRIPE_API_KEY) {
  console.warn("[STRIPE] API key not configured — card payments disabled");
}

export const stripe = new Stripe(process.env.STRIPE_API_KEY!, {
    apiVersion: "2026-02-25.clover",
    typescript: true,
});
