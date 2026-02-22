import { prisma } from "@/lib/prisma";
import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

export async function GET(
  req: Request,
  { params }: { params: Promise<{ categoryId: string }> },
) {
  try {
    if (!(await params).categoryId) {
      return new NextResponse("Category ID is required", { status: 400 });
    }

    const category = await prisma.category.findUnique({
      where: {
        id: (await params).categoryId,
      },
    });

    return NextResponse.json(category);
  } catch (error) {
    console.log("[CATEGORIES_GET]", error);
    return new NextResponse("Internal error", { status: 500 });
  }
}

export async function PATCH(
  req: Request,
  { params }: {
    params: Promise<{
      shopId: string;
      categoryId: string
    }>
  },
) {
  try {
    const { userId } = await auth();
    const body = await req.json();
    const { name, billboardId } = body;

    if (!userId) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    if (!name || typeof name !== "string") {
      return new NextResponse("Name is required", { status: 400 });
    }
    if (!billboardId || typeof billboardId !== "string") {
      return new NextResponse("Billboard Id is required", { status: 400 });
    }

    if (!(await params).categoryId) {
        return new NextResponse("Category Id is required", { status: 400 });
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

    const category = await prisma.category.updateMany({
      where: {
        id: (await params).categoryId,
      },
      data: {
        name,
        billboardId,
      },
    });
    return NextResponse.json(category);
  } catch (error) {
    console.log("[CATEGORY_PATCH]", error);
    return new NextResponse("Internal error", { status: 500 });
  }
}

export async function DELETE(
  req: Request,
  { params }: { params: Promise<{ categoryId: string; shopId: string }> }, 
) {
  try {
    const { userId } = await auth();

    if (!userId) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    if (!(await params).categoryId) {
      return new NextResponse("Category Id is required", { status: 400 });
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

    const category = await prisma.category.deleteMany({
      where: {
        id: (await params).categoryId,
      },
    });

    return NextResponse.json(category);
  } catch (error) {
    console.log("[CATEGORY_DELETE]", error);
    return new NextResponse("Internal error", { status: 500 });
  }
}
