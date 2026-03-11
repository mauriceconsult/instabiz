import { prisma } from "@/lib/prisma";
import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";

export async function PATCH(
  req: Request,
  { params }: { params: Promise<{ shopId: string }> }, // ✅ Promise!
) {
  try {
    const { userId } = await auth();
    const body = await req.json();
    const { name } = body;

    if (!userId) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    if (!name || typeof name !== "string") {
      return new NextResponse("Name is required", { status: 400 });
    }

    const { shopId } = await params; // ✅ Await params first!

    if (!shopId) {
      return new NextResponse("Shop ID is required", { status: 400 });
    }

    const shop = await prisma.shop.updateMany({
      where: {
        id: shopId, // ✅ Now you can use it
        userId,
      },
      data: {
        name,
      },
    });

    return NextResponse.json(shop);
  } catch (error) {
    console.log("[SHOP_PATCH]", error);
    return new NextResponse("Internal error", { status: 500 });
  }
}

export async function DELETE(
  req: Request,
  { params }: { params: Promise<{ shopId: string }> }, // ✅ Promise
) {
  try {
    const { userId } = await auth();

    if (!userId) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const { shopId } = await params; // ✅ Await it

    if (!shopId) {
      return new NextResponse("Shop ID is required", { status: 400 });
    }

    const shop = await prisma.shop.deleteMany({
      where: {
        id: shopId, // ✅ Use awaited value
        userId,
      },
    });

    return NextResponse.json(shop);
  } catch (error) {
    console.log("[SHOP_DELETE]", error);
    return new NextResponse("Internal error", { status: 500 });
  }
}