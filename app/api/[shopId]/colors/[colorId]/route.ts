import { prisma } from "@/lib/prisma";
import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

export async function GET(
  req: Request,
  { params }: { params: Promise<{ colorId: string }> },
) {
  try {
    if (!(await params).colorId) {
      return new NextResponse("Color ID is required", { status: 400 });
    }

    const color = await prisma.color.findUnique({
      where: {
        id: (await params).colorId,
      },
    });

    return NextResponse.json(color);
  } catch (error) {
    console.log("[COLOR_GET]", error);
    return new NextResponse("Internal error", { status: 500 });
  }
}

export async function PATCH(
  req: Request,
  { params }: {
    params: Promise<{
      shopId: string;
      colorId: string
    }>
  },
) {
  try {
    const { userId } = await auth();
    const body = await req.json();
    const { name, value } = body;

    if (!userId) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    if (!name || typeof name !== "string") {
      return new NextResponse("Name is required", { status: 400 });
    }
    if (!value || typeof value !== "string") {
      return new NextResponse("Image URL is required", { status: 400 });
    }

    if (!(await params).colorId) {
        return new NextResponse("Color Id is required", { status: 400 });
    }   

    const storeByUser = await prisma.shop.findFirst({
      where: {
        id: (await params).shopId,
        userId
      },
    });
    if (!storeByUser) {
      return new NextResponse("Unathorized", {
        status: 403,
      });
    }

    const color = await prisma.color.updateMany({
      where: {
        id: (await params).colorId,
      },
      data: {
        name,
        value,
      },
    });
    return NextResponse.json(color);
  } catch (error) {
    console.log("[COLOR_PATCH]", error);
    return new NextResponse("Internal error", { status: 500 });
  }
}

export async function DELETE(
  req: Request,
  { params }: { params: Promise<{ colorId: string; shopId: string }> }, 
) {
  try {
    const { userId } = await auth();

    if (!userId) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    if (!(await params).colorId) {
      return new NextResponse("Color Id is required", { status: 400 });
    }
    const storeByUser = await prisma.shop.findFirst({
      where: {
        id: (await params).shopId,
      },
    });
    if (!storeByUser) {
      return new NextResponse("Unathorized", {
        status: 403,
      });
    }

    const color = await prisma.color.deleteMany({
      where: {
        id: (await params).colorId,
      },
    });

    return NextResponse.json(color);
  } catch (error) {
    console.log("[COLOR_DELETE]", error);
    return new NextResponse("Internal error", { status: 500 });
  }
}
