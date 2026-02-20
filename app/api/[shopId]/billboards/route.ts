import { prisma } from "@/lib/prisma";
import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

export async function POST(
  req: Request,
  { params }: { params: Promise<{ shopId: string }> }, // ✅ Promise
) {
  try {
    const { userId } = await auth();
    const body = await req.json();
    const { label, imageUrl } = body;

    if (!userId) {
      return new NextResponse("Unauthenticated", { status: 401 });
    }

    if (!label) {
      return new NextResponse("Label is required", { status: 400 });
    }

    if (!imageUrl) {
      return new NextResponse("Image Url is required", { status: 400 });
    }

    const { shopId } = await params; // ✅ Await params

    if (!shopId) {
      return new NextResponse("Shop Id is required", { status: 400 });
    }

    const shopByUserId = await prisma.shop.findFirst({
      where: {
        id: shopId, // ✅ Use awaited value
        userId,
      },
    });

    if (!shopByUserId) {
      return new NextResponse("Unauthorized", { status: 403 });
    }

    const billboard = await prisma.billboard.create({
      data: {
        label,
        imageUrl,
        shopId, // ✅ Use awaited value
      },
    });

    return NextResponse.json(billboard);
  } catch (error) {
    console.log("[BILLBOARD_POST]", error);
    return new NextResponse("Internal error", { status: 500 });
  }
}

export async function GET(
  req: Request,
  { params }: { params: Promise<{ shopId: string }> }, // ✅ Promise
) {
  try {
    const { shopId } = await params; // ✅ Await params

    if (!shopId) {
      return new NextResponse("Shop Id is required", { status: 400 });
    }

    const billboards = await prisma.billboard.findMany({
      where: {
        shopId, // ✅ Use awaited value
      },
    });

    return NextResponse.json(billboards);
  } catch (error) {
    console.log("[BILLBOARDS_GET]", error);
    return new NextResponse("Internal error", { status: 500 });
  }
}
