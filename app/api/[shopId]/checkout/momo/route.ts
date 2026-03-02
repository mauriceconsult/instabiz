// app/api/[shopId]/checkout/momo/route.ts
import { momo } from "@/lib/momo";
import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function POST(
  req: Request,
  { params }: { params: Promise<{ shopId: string }> },
) {
  const { shopId } = await params;
  const { productIds, phone, address } = await req.json();

  // Create order
  const order = await prisma.order.create({
    data: {
      shopId,
      phone,
      address,
      paymentMethod: "mobile_money",
      orderItems: {
        create: productIds.map((productId: string) => ({ productId })),
      },
    },
    include: { orderItems: { include: { product: true } } },
  });

  // Calculate total
  const total = order.orderItems.reduce(
    (sum, item) => sum + item.product.price.toNumber(),
    0,
  );

  // Initiate MoMo collection
  const referenceId = await momo.collections.requestToPay({
    amount: String(total),
    currency: "UGX",
    externalId: order.id,
    payer: { partyIdType: "MSISDN", partyId: phone },
    payerMessage: "Payment for order",
    payeeNote: "Thank you for your purchase",
  });

  // Store referenceId for status polling
  await prisma.order.update({
    where: { id: order.id },
    data: { paymentRef: referenceId },
  });

  return NextResponse.json({ referenceId, orderId: order.id });
}
