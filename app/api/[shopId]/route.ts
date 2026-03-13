// instabiz/app/api/[shopId]/route.ts
import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";

export async function GET(
  req: Request,
  { params }: { params: Promise<{ shopId: string }> },
) {
  const { shopId } = await params;

  const shop = await prisma.shop.findUnique({
    where: { id: shopId },
  });

  if (!shop) {
    return new NextResponse("Shop not found", { status: 404 });
  }

  return NextResponse.json({
    id: shop.id,
    name: shop.name,
    currency: shop.currency,
    country: shop.country,
  });
}
