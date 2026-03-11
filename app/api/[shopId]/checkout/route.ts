import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";
import { stripe } from "@/lib/stripe";
import Stripe from "stripe";
import { calculateFees } from "@/lib/platform";

export const dynamic = "force-dynamic";

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
  { params }: { params: Promise<{ shopId: string }> },
) {
  const { shopId } = await params; // ← await and destructure first

  const { productIds, deliveryMethod, deliveryCost, deliveryAddress, phone } =
    await req.json();

  if (!productIds || productIds.length === 0) {
    return new NextResponse("Product Ids are required.", { status: 400 });
  }

  // Fetch shop for currency
  const shop = await prisma.shop.findUnique({
    where: { id: shopId },
  });

  const currency = (shop?.currency ?? "USD").toLowerCase(); // ← one currency for all items

  const products = await prisma.product.findMany({
    where: { id: { in: productIds } },
  });

  const subtotal = products.reduce(
    (sum, product) => sum + product.price.toNumber(),
    0,
  );

  const { platformFee } = calculateFees(subtotal, deliveryCost);

  const line_items: Stripe.Checkout.SessionCreateParams.LineItem[] = [
    // Products
    ...products.map((product) => ({
      quantity: 1,
      price_data: {
        currency, // ← shop currency
        product_data: { name: product.name },
        unit_amount: Math.round(product.price.toNumber() * 100),
      },
    })),
    // Delivery
    ...(deliveryCost > 0
      ? [
          {
            quantity: 1,
            price_data: {
              currency, // ← same currency
              product_data: { name: `Delivery - ${deliveryMethod}` },
              unit_amount: Math.round(deliveryCost * 100),
            },
          },
        ]
      : []),
    // Platform Fee
    {
      quantity: 1,
      price_data: {
        currency, // ← same currency
        product_data: { name: "Platform Fee (10%)" },
        unit_amount: Math.round(platformFee * 100),
      },
    },
  ];

  const order = await prisma.order.create({
    data: {
      shopId,
      phone,
      address: deliveryAddress,
      paymentMethod: "stripe",
      deliveryMethod,
      deliveryCost,
      platformFee,
      orderItems: {
        create: productIds.map((productId: string) => ({ productId })),
      },
    },
  });

  const session = await stripe.checkout.sessions.create({
    line_items,
    mode: "payment",
    billing_address_collection: "required",
    phone_number_collection: { enabled: true },
    success_url: `${process.env.FRONTEND_STORE_URL}/cart?success=1`,
    cancel_url: `${process.env.FRONTEND_STORE_URL}/cart?cancel=1`,
    metadata: { orderId: order.id },
  });

  return NextResponse.json({ url: session.url }, { headers: corsHeaders });
}
