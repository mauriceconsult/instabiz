import { prisma } from "@/lib/prisma";
import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const { userId } = await auth();
    const body = await req.json();
    const { name } = body;

    if (!userId) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    if (!name) {
      return new NextResponse("Name is required", { status: 400 });
    }

    // ✅ Simplified - no getCurrentUser needed, use Clerk userId directly
    const shop = await prisma.shop.create({
      data: {
        name,
        userId, // ✅ Now stores Clerk userId directly
      },
    });

    return NextResponse.json(shop);
  } catch (error) {
    console.log("[SHOP_POST]", error);
    return new NextResponse("Internal error", { status: 500 });
  }
}
