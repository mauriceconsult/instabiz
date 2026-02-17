import { prisma } from "@/lib/prisma";
import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";
import { getCurrentUser } from "@/lib/sync-clerk-user";

export async function POST(req: Request) {
    try {
        const { userId } = await auth();
        const body = await req.json();
        const { name } = body;

        if (!userId) {
            return new NextResponse('Unauthorized', { status: 401 });
        }

        if (!name) {
            return new NextResponse('Name and slug are required', { status: 400 });
        }

        // ✅ Get database user (clerkId → database id)
        const user = await getCurrentUser(userId);

        const store = await prisma.shop.create({
            data: {
                name,              
                ownerId: user.id,  // ✅ Use ownerId with database user id
            }
        });

        return NextResponse.json(store);
    } catch (error) { 
        console.log('[STORE_POST]', error);
        return new NextResponse('Internal error', { status: 500 });
    }
}


                       