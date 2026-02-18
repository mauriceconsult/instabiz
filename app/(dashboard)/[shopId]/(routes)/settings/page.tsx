import { prisma } from "@/lib/prisma";
import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import { SettingsForm } from "./components/settings-form";

interface SettingsPageProps {
    params: {
        shopId: string;
    }
}

const SettingsPage: React.FC<SettingsPageProps> = async ({ params }) => { 
    const { userId } = await auth();
    if (!userId) { 
        return redirect("/sign-in");
    }
    const shop = await prisma.shop.findFirst({
      where: {
        id: (await params).shopId,
        userId,
      },
    });
    if (!shop) {
        return redirect("/");
    }

    return ( 
        <div className="flex-col">
            <div className="flex-1 space-y-4 p-8 pt-6">
                <SettingsForm initialData={shop} />
            </div>
            
        </div>
     );
}
 
export default SettingsPage;