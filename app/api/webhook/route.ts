import { prisma } from "@/lib/prisma";
import { stripe } from "@/lib/stripe";
import { headers } from "next/headers";
import { NextResponse } from "next/server";
import Stripe from "stripe";

export async function POST(req: Request) {
  const body = await req.text();
  const signature = (await headers()).get("Stripe-signature") as string;
  let event: Stripe.Event;
  try {
    event = stripe.webhooks.constructEvent(
      body,
      signature,
      process.env.STRIPE_WEBHOOK_SECRET!,
    );
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Unknown error";
    return new NextResponse(`Webhook error: ${message}`, { status: 400 });
  }
  const session = event.data.object as Stripe.Checkout.Session;
  const address = session?.customer_details?.address;
  const addressComponents = [
    address?.line1,
    address?.line2,
    address?.city,
    address?.state,
    address?.postal_code,
    address?.country,
  ];
  const addressString = addressComponents.filter((c) => c !== null).join(", ");
  if (event.type === "checkout.session.completed") {
    const order = await prisma.order.update({
      where: {
        id: session?.metadata?.orderId ?? "",
      },
      data: {
        isPaid: true,
        address: addressString,
        phone: session?.customer_details?.phone ?? "",
      },
      include: {
        orderItems: true,
      },
    });
    const productIds = order.orderItems.map((item) => item.productId);
    await prisma.product.updateMany({
      where: {
        id: { in: productIds },
      },
      data: {
        isArchived: true,
      },
    });

    return NextResponse.json(null, { status: 200 });
  }
  return NextResponse.json(null, { status: 200 }); // fallback
}
        
            