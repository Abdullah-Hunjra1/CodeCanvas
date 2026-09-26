import Stripe from "stripe";
import { NextResponse } from "next/server";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!);

export async function POST(req: Request) {
  try {
    const { name, value, userId } = await req.json();

    if (!userId) {
      return NextResponse.json(
        { error: "User ID is required" },
        { status: 400 }
      );
    }

    const pricingOptions = {
      Basic: {
        price: 4.99,
        tokens: 50000,
      },
      Starter: {
        price: 9.99,
        tokens: 120000,
      },
      Pro: {
        price: 19.99,
        tokens: 2500000,
      },
      "Unlimted (License)": {
        price: 49.99,
        tokens: 999999999,
      },
    };

    const selectedPlan =
      pricingOptions[name as keyof typeof pricingOptions];

    if (!selectedPlan || selectedPlan.tokens !== value) {
      return NextResponse.json(
        { error: "Invalid pricing option" },
        { status: 400 }
      );
    }

    const session = await stripe.checkout.sessions.create({
      mode: "payment",

      metadata: {
        userId: userId,
        tokens: String(selectedPlan.tokens),
      },

      line_items: [
        {
          price_data: {
            currency: "usd",
            product_data: {
              name: `${name} - ${selectedPlan.tokens} Tokens`,
            },
            unit_amount: Math.round(selectedPlan.price * 100),
          },
          quantity: 1,
        },
      ],

      success_url: `${process.env.NEXT_PUBLIC_APP_URL}/pricing?success=true`,
      cancel_url: `${process.env.NEXT_PUBLIC_APP_URL}/pricing?canceled=true`,
    });

    return NextResponse.json({
      url: session.url,
    });
  } catch (error) {
    console.error("Stripe Checkout Error:", error);

    return NextResponse.json(
      { error: "Failed to create checkout session" },
      { status: 500 }
    );
  }
}