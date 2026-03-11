import { prisma } from "@/lib/prisma";
import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";

export async function GET(
  req: Request,
  { params }: { params: Promise<{ billboardId: string }> },
) {
  try {
    if (!(await params).billboardId) {
      return new NextResponse("Billboard ID is required", { status: 400 });
    }

    const billboard = await prisma.billboard.findUnique({
      where: {
        id: (await params).billboardId,
      },
    });

    return NextResponse.json(billboard);
  } catch (error) {
    console.log("[BILLBOARD_GET]", error);
    return new NextResponse("Internal error", { status: 500 });
  }
}

export async function PATCH(
  req: Request,
  { params }: {
    params: Promise<{
      shopId: string;
      billboardId: string
    }>
  },
) {
  try {
    const { userId } = await auth();
    const body = await req.json();
    const { label, imageUrl } = body;

    if (!userId) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    if (!label || typeof label !== "string") {
      return new NextResponse("Name is required", { status: 400 });
    }
    if (!imageUrl || typeof imageUrl !== "string") {
      return new NextResponse("Image URL is required", { status: 400 });
    }

    if (!(await params).billboardId) {
        return new NextResponse("Billboard Id is required", { status: 400 });
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

    const billboard = await prisma.billboard.updateMany({
      where: {
        id: (await params).billboardId,
      },
      data: {
        label,
        imageUrl,
      },
    });
    return NextResponse.json(billboard);
  } catch (error) {
    console.log("[BILLBOARD_PATCH]", error);
    return new NextResponse("Internal error", { status: 500 });
  }
}

export async function DELETE(
  req: Request,
  { params }: { params: Promise<{ billboardId: string; shopId: string }> }, 
) {
  try {
    const { userId } = await auth();

    if (!userId) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    if (!(await params).billboardId) {
      return new NextResponse("Billboard Id is required", { status: 400 });
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

    const billboard = await prisma.billboard.deleteMany({
      where: {
        id: (await params).billboardId,
      },
    });

    return NextResponse.json(billboard);
  } catch (error) {
    console.log("[BILLBOARD_DELETE]", error);
    return new NextResponse("Internal error", { status: 500 });
  }
}
