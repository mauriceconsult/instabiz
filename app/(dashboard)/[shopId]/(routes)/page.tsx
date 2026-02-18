import { prisma } from "@/lib/prisma";

interface DashboardPageProps { 
    params: {
        shopId: string;
    }
}

const DashboardPage: React.FC<DashboardPageProps> = async ({ params }) => { 
    const shop = await prisma.shop.findFirst({
      where: {
        id: (await params).shopId,
      },
    });

    return ( 
        <div>
            Active shop: {shop?.name}
        </div>
);     
}
 
export default DashboardPage;