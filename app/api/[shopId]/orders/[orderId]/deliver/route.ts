// app/api/[shopId]/orders/[orderId]/deliver/route.ts
import { prisma } from "@/lib/prisma";
import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";

export async function POST(
  req: Request,
  { params }: { params: Promise<{ shopId: string; orderId: string }> },
) {
  const { userId } = await auth();
  if (!userId) return new NextResponse("Unauthorized", { status: 401 });

  const { shopId, orderId } = await params;

  const shop = await prisma.shop.findFirst({
    where: { id: shopId, userId },
  });
  if (!shop) return new NextResponse("Unauthorized", { status: 403 });

  const order = await prisma.order.update({
    where: { id: orderId },
    data: {
      deliveryStatus: "delivered",
      deliveredAt: new Date(), // ← starts 48hr refund window
    },
  });

  return NextResponse.json(order);
}
