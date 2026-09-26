import Stripe from "stripe";
import { NextResponse } from "next/server";
import { ConvexHttpClient } from "convex/browser";
import { api } from "@/convex/_generated/api";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!);

const convex = new ConvexHttpClient(
    process.env.NEXT_PUBLIC_CONVEX_URL!
);

export async function POST(req: Request) {
    const body = await req.text();

    const signature = req.headers.get("stripe-signature");

    if (!signature) {
        return NextResponse.json(
            { error: "Missing Stripe signature" },
            { status: 400 }
        );
    }

    try {
        const event = stripe.webhooks.constructEvent(
            body,
            signature,
            process.env.STRIPE_WEBHOOK_SECRET!
        );

        if (event.type === "checkout.session.completed") {
            const session = event.data.object;

            const userId = session.metadata?.userId;
            const tokens = Number(session.metadata?.tokens);

            if (!userId || !tokens) {
                console.error("Missing userId or tokens in Stripe metadata");

                return NextResponse.json(
                    { error: "Missing payment metadata" },
                    { status: 400 }
                );
            }

            const newBalance = await convex.mutation(
                api.users.AddTokens,
                {
                    userId: userId as any,
                    tokens,
                }
            );

            console.log(
                `Payment successful. Added ${tokens} tokens. New balance: ${newBalance}`
            );
        }

        return NextResponse.json({ received: true });
    } catch (error) {
        console.error("Stripe Webhook Error:", error);

        return NextResponse.json(
            { error: "Webhook verification failed" },
            { status: 400 }
        );
    }
}