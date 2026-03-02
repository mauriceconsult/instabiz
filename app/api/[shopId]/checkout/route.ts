import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";
import { stripe } from "@/lib/stripe";
import Stripe from "stripe";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, Authorization",
};
export async function OPTIONS() {
  return NextResponse.json({}, { headers: corsHeaders });
}
export async function POST(
  req: Request,
  { params }: { params: { shopId: string } },
) {
  const { productIds, deliveryMethod, deliveryCost, deliveryAddress, phone } =
    await req.json();
  if (!productIds || productIds.length === 0) {
    return new NextResponse("Product Ids are required.", { status: 400 });
  }
  const products = await prisma.product.findMany({
    where: {
      id: {
        in: productIds,
      },
    },
  });
  const line_items: Stripe.Checkout.SessionCreateParams.LineItem[] = [
    ...products.map((product) => ({
      quantity: 1,
      price_data: {
        currency: "USD",
        product_data: {
          name: product.name,
        },
        unit_amount: product.price.toNumber() * 100,
      },
    })),
    ...(deliveryCost > 0
      ? [
          {
            quantity: 1,
            price_data: {
              currency: "USD",
              product_data: { name: `Delivery - ${deliveryMethod}` },
              unit_amount: Math.round(deliveryCost * 100),
            },
          },
        ]
      : []),
  ];
  const order = await prisma.order.create({
    data: {
      shopId: params.shopId,
      phone,
      address: deliveryAddress,
      paymentMethod: "stripe",
      deliveryMethod,
      deliveryCost,
      orderItems: {
        create: productIds.map((productId: string) => ({ productId })),
      },
    },
  });
  const session = await stripe.checkout.sessions.create({
    line_items,
    mode: "payment",
    billing_address_collection: "required",
    phone_number_collection: {
      enabled: true,
    },
    success_url: `${process.env.FRONTEND_STORE_URL}/cart?sucess=1`,
    cancel_url: `${process.env.FRONTEND_STORE_URL}/cart?cancel=1`,
    metadata: {
      orderId: order.id,
    },
  });
  return NextResponse.json(
    { url: session.url },
    {
      headers: corsHeaders,
    },
  );
}
