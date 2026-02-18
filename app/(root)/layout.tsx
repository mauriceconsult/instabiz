import { prisma } from "@/lib/prisma";
import { auth } from "@clerk/nextjs/server"
import { redirect } from "next/navigation";

export default async function SetupLayout({
    children,
}: {
    children: React.ReactNode
    }) { 
    const { userId } = await auth();
    if (!userId) {
        redirect("/sign-in");
    }
    const shop = await prisma.shop.findFirst({
        where: {
            userId,
        },
    });
    if (shop) {
        redirect(`/${shop.id}`);
    }
    return (
        <>
            {children}
        </>
    )
}