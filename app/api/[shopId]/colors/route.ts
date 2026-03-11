import { prisma } from "@/lib/prisma";
import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";

export async function POST(
  req: Request,
  { params }: { params: Promise<{ shopId: string }> }, 
) {
  try {
    const { userId } = await auth();
    const body = await req.json();
    const { name, value } = body;

    if (!userId) {
      return new NextResponse("Unauthenticated", { status: 401 });
    }

    if (!name) {
      return new NextResponse("Name is required", { status: 400 });
    }

    if (!value) {
      return new NextResponse("Value is required", { status: 400 });
    }

    if (!(await params).shopId) {
      return new NextResponse("Shop Id is required", { status: 400 });
    }

    const shopByUserId = await prisma.shop.findFirst({
      where: {
        id: (await params).shopId, 
        userId,
      },
    });

    if (!shopByUserId) {
      return new NextResponse("Unauthorized", { status: 403 });
    }

    const color = await prisma.color.create({
      data: {
        name,
        value,
        shopId: (await params).shopId, 
      },
    });

    return NextResponse.json(color);
  } catch (error) {
    console.log("[COLORS_POST]", error);
    return new NextResponse("Internal error", { status: 500 });
  }
}

export async function GET(
  req: Request,
  { params }: { params: Promise<{ shopId: string }> },
) {
  try {
    const { shopId } = await params; 

    if (!shopId) {
      return new NextResponse("Shop Id is required", { status: 400 });
    }

    const colors = await prisma.color.findMany({
      where: {
        shopId: (await params).shopId
      },
    });

    return NextResponse.json(colors);
  } catch (error) {
    console.log("[COLORS_GET]", error);
    return new NextResponse("Internal error", { status: 500 });
  }
}
