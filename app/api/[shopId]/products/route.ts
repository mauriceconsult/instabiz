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
    const { shopId } = await params;
    const body = await req.json();
    const {
      name,
      price,
      categoryId,
      colorId,
      sizeId,
      images,
      isFeatured,
      isArchived,
    } = body;

    if (!userId) return new NextResponse("Unauthenticated", { status: 401 });
    if (!name) return new NextResponse("Name is required", { status: 400 });
    if (!images || !images.length)
      return new NextResponse("Images are required", { status: 400 });
    if (price === undefined || price === null)
      return new NextResponse("Price is required", { status: 400 });
    if (!categoryId)
      return new NextResponse("Category Id is required", { status: 400 });
    if (!colorId)
      return new NextResponse("Color Id is required", { status: 400 });
    if (!sizeId)
      return new NextResponse("Size Id is required", { status: 400 });
    if (!shopId)
      return new NextResponse("Shop Id is required", { status: 400 });

    const shopByUserId = await prisma.shop.findFirst({
      where: { id: shopId, userId },
    });

    if (!shopByUserId) return new NextResponse("Unauthorized", { status: 403 });

    const product = await prisma.product.create({
      data: {
        name,
        price,
        isFeatured,
        isArchived,
        categoryId,
        sizeId,
        colorId,
        shopId,
        images: {
          createMany: {
            data: images.map((image: { url: string }) => image),
          },
        },
      },
    });

    return NextResponse.json(product);
  } catch (error) {
    console.log("[PRODUCTS_POST]", error);
    return new NextResponse("Internal error", { status: 500 });
  }
}

export async function GET(
  req: Request,
  { params }: { params: Promise<{ shopId: string }> },
) {
  try {
    const { searchParams } = new URL(req.url);
    const categoryId = searchParams.get("categoryId") || undefined;
    const colorId = searchParams.get("colorId") || undefined;
    const sizeId = searchParams.get("sizeId") || undefined;
    const isFeatured = searchParams.get("isFeatured");
    const { shopId } = await params;

    if (!shopId) {
      return new NextResponse("Shop Id is required", { status: 400 });
    }

    const products = await prisma.product.findMany({
      where: {
        shopId: (await params).shopId,
        categoryId,
        colorId,
        sizeId,
        isFeatured: isFeatured ? true : undefined,
        isArchived: false,
      },
      include: {
        images: true,
        category: true,
        color: true,
        size: true,
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    return NextResponse.json(products);
  } catch (error) {
    console.log("[PRODUCTS_GET]", error);
    return new NextResponse("Internal error", { status: 500 });
  }
}
