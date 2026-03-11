import { momo } from "@/lib/momo";
import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";
import { calculateFees, PLATFORM_FEE_PERCENT } from "@/lib/platform";

export const dynamic = "force-dynamic";

export async function POST(
  req: Request,
  { params }: { params: Promise<{ shopId: string }> },
) {
  const { shopId } = await params;
  const {
    productIds,
    phone,
    address,
    deliveryMethod, 
    deliveryCost,
    // deliveryQuoteId, 
  } = await req.json();

  // Fetch shop for currency
  const shop = await prisma.shop.findUnique({
    where: { id: shopId },
  });

  const currency = shop?.currency ?? "UGX";

  // Create order
  const order = await prisma.order.create({
    data: {
      shopId,
      phone,
      address,
      paymentMethod: "mobile_money",
      deliveryMethod,
      deliveryCost,
      // deliveryQuoteId,
      orderItems: {
        create: productIds.map((productId: string) => ({ productId })),
      },
    },
    include: { orderItems: { include: { product: true } } },
  });

  // Calculate fees — single subtotal calculation
  const subtotal = order.orderItems.reduce(
    (sum, item) => sum + item.product.price.toNumber(),
    0,
  );

  const { platformFee, grandTotal } = calculateFees(
    subtotal,
    deliveryCost ?? 0,
  );

  // Initiate MoMo collection
  const referenceId = await momo.collections.requestToPay({
    amount: String(Math.round(grandTotal)),
    currency, // ← dynamic currency
    externalId: order.id,
    payer: { partyIdType: "MSISDN", partyId: phone },
    payerMessage: `Payment for order - includes ${PLATFORM_FEE_PERCENT}% platform fee`,
    payeeNote: "Thank you for your purchase",
  });

  // Store referenceId and platformFee
  await prisma.order.update({
    where: { id: order.id },
    data: { platformFee, paymentRef: referenceId },
  });

  return NextResponse.json({ referenceId, orderId: order.id });
}
