import { prisma } from "@/lib/prisma";
import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";

export async function GET(
  req: Request,
  { params }: { params: Promise<{ sizeId: string }> },
) {
  try {
    if (!(await params).sizeId) {
      return new NextResponse("Size ID is required", { status: 400 });
    }

    const size = await prisma.size.findUnique({
      where: {
        id: (await params).sizeId,
      },
    });

    return NextResponse.json(size);
  } catch (error) {
    console.log("[SIZE_GET]", error);
    return new NextResponse("Internal error", { status: 500 });
  }
}

export async function PATCH(
  req: Request,
  { params }: {
    params: Promise<{
      shopId: string;
      sizeId: string
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

    if (!(await params).sizeId) {
        return new NextResponse("Size Id is required", { status: 400 });
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

    const size = await prisma.size.updateMany({
      where: {
        id: (await params).sizeId,
      },
      data: {
        name,
        value,
      },
    });
    return NextResponse.json(size);
  } catch (error) {
    console.log("[SIZE_PATCH]", error);
    return new NextResponse("Internal error", { status: 500 });
  }
}

export async function DELETE(
  req: Request,
  { params }: { params: Promise<{ sizeId: string; shopId: string }> }, 
) {
  try {
    const { userId } = await auth();

    if (!userId) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    if (!(await params).sizeId) {
      return new NextResponse("Size Id is required", { status: 400 });
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

    const size = await prisma.size.deleteMany({
      where: {
        id: (await params).sizeId,
      },
    });

    return NextResponse.json(size);
  } catch (error) {
    console.log("[SIZE_DELETE]", error);
    return new NextResponse("Internal error", { status: 500 });
  }
}
