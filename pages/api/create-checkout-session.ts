// pages/api/create-checkout-session.ts
import type { NextApiRequest, NextApiResponse } from "next";
import Stripe from "stripe";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || "", { apiVersion: "2024-11-15" });

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "POST") return res.status(405).json({ error: "Method not allowed" });

  try {
    const { userId, email } = req.body || {};
    if (!userId || !email) return res.status(400).json({ error: "Missing userId/email" });

    const session = await stripe.checkout.sessions.create({
      mode: "payment",
      payment_method_types: ["card"],
      line_items: [{ price: process.env.STRIPE_PRICE_ID!, quantity: 1 }],
      customer_email: email,
      success_url: `${req.headers.origin}/?checkout_success=true&session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${req.headers.origin}/?checkout_canceled=true`,
      metadata: { user_id: userId }
    });

    res.status(200).json({ url: session.url });
  } catch (err: any) {
    console.error("create-checkout-session error:", err);
    res.status(500).json({ error: "Internal server error" });
  }
}
