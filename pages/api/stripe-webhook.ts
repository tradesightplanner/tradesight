// pages/api/stripe-webhook.ts
import type { NextApiRequest, NextApiResponse } from "next";
import Stripe from "stripe";
import { supabaseAdmin } from "../../lib/supabaseAdmin";

export const config = { api: { bodyParser: false } };

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || "", { apiVersion: "2024-11-15" });

async function buffer(readable: any) {
  const chunks = [];
  for await (const chunk of readable) {
    chunks.push(typeof chunk === "string" ? Buffer.from(chunk) : chunk);
  }
  return Buffer.concat(chunks);
}

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const sig = req.headers["stripe-signature"] as string | undefined;
  const raw = await buffer(req);
  try {
    const event = stripe.webhooks.constructEvent(raw, sig || "", process.env.STRIPE_WEBHOOK_SECRET || "");
    if (event.type === "checkout.session.completed") {
      const session = event.data.object as Stripe.Checkout.Session;
      const userId = session.metadata?.user_id as string | undefined;
      const paymentId = session.payment_intent || session.id;
      const amount = session.amount_total || 0;
      const currency = (session.currency || "usd") as string;

      if (userId) {
        // insert purchase & mark paid
        await supabaseAdmin.from("purchases").insert([{
          user_id: userId,
          stripe_payment_id: paymentId as string,
          product: "tradesight_lifetime",
          amount: amount as number,
          currency
        }]);
        await supabaseAdmin.from("user_settings").upsert({ user_id: userId, is_paid: true }, { onConflict: "user_id" });
        console.log("User marked paid:", userId);
      }
    }
    res.json({ received: true });
  } catch (err: any) {
    console.error("Webhook error:", err.message);
    res.status(400).send(`Webhook Error: ${err.message}`);
  }
}
