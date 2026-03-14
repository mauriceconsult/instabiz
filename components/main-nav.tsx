"use client";

import { cn } from "@/lib/utils";
import Link from "next/link";
import { useParams, usePathname } from "next/navigation";

export function MainNav({
  className,
  // ...props
}: React.HTMLAttributes<HTMLElement>) {
  const pathname = usePathname();
  const params = useParams();

  const routes = [
    {
      href: `/${params.shopId}/guide`,
      label: "User Guide",
      active: pathname === `/${params.shopId}/guide`,
    },
    {
      href: `/${params.shopId}`,
      label: "Overview",
      active: pathname === `/${params.shopId}`,
    },
    {
      href: `/${params.shopId}/billboards`,
      label: "Billboards",
      active: pathname === `/${params.shopId}/billboards`,
    },
    {
      href: `/${params.shopId}/categories`,
      label: "Categories",
      active: pathname === `/${params.shopId}/categories`,
    },
    {
      href: `/${params.shopId}/sizes`,
      label: "Sizes",
      active: pathname === `/${params.shopId}/sizes`,
    },
    {
      href: `/${params.shopId}/colors`,
      label: "Colors",
      active: pathname === `/${params.shopId}/colors`,
    },
    {
      href: `/${params.shopId}/products`,
      label: "Products",
      active: pathname === `/${params.shopId}/products`,
    },
    {
      href: `/${params.shopId}/orders`,
      label: "Orders",
      active: pathname === `/${params.shopId}/orders`,
    },
    {
      href: `/${params.shopId}/refunds`,
      label: "Refunds",
      active: pathname === `/${params.shopId}/refunds`,
    },
    {
      href: `/${params.shopId}/settings`,
      label: "Settings",
      active: pathname === `/${params.shopId}/settings`,
    },
  ];
  return (
    <nav className={cn("flex items-center space-x-4 lg:space-x-6", className)}>
      {routes.map((route) => (
        <Link
          key={route.href}
          href={route.href}
          className={cn(
            "text-sm font-medium transition-colors hover:text-primary",
            route.active
              ? "text-black dark:text-white"
              : "text-muted-foreground",
          )}
        >
          {route.label}
        </Link>
      ))}
    </nav>
  );
}
