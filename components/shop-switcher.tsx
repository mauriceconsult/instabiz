"use client";

import { Shop } from "@prisma/client";
import { Popover, PopoverContent, PopoverTrigger } from "./ui/popover";
import { useStoreModal } from "@/hooks/use-store-modal";
import { useParams, useRouter } from "next/navigation";
import { useState } from "react";
import { Button } from "./ui/button";
import { Check, ChevronsUpDown, PlusCircle, Store } from "lucide-react";
import { cn } from "@/lib/utils";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandSeparator,
} from "./ui/command";

type PopoverTriggerProps = React.ComponentPropsWithoutRef<
  typeof PopoverTrigger
>;

interface ShopSwitcherProps extends PopoverTriggerProps {
  items: Shop[];
}

export default function ShopSwitcher({
  className,
  items = [],
}: ShopSwitcherProps) {
  const shopModal = useStoreModal();
  const params = useParams();
  const router = useRouter();
  const formattedItems = items.map((item) => ({
    label: item.name,
    value: item.id,
  }));
  const [open, setOpen] = useState(false);
  const currentShop = formattedItems.find(
    (item) => item.value === params.shopId,
  );
  const onShopSelect = (shop: { value: string; label: string }) => {
    setOpen(false);
    router.push(`/${shop.value}`);
  };
  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          size="sm"
          role="combobox"
          aria-expanded={open}
          aria-label="Select a shop"
          className={cn("w-50 justify-between", className)}          
        >
          <Store className="mr-2 h-4 w-4" />
          {currentShop?.label || "Select a shop"}
          <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-50 p-0">
        <Command>
          <CommandList>
            <CommandInput placeholder="Search shop..." />
            <CommandEmpty>No shop found.</CommandEmpty>
            <CommandGroup heading="Shops">
              {formattedItems.map((shop) => (
                <CommandItem
                  key={shop.value}
                  onSelect={() => onShopSelect(shop)}
                  className="text-sm"
                >
                  <Store className="mr-2 h-4 w-4" />
                  {shop.label}
                  <Check
                    className={cn(
                      "ml-auto h-4 w-4",
                      currentShop?.value === shop.value
                        ? "opacity-100"
                        : "opacity-0",
                    )}
                  />
                </CommandItem>
              ))}
            </CommandGroup>
          </CommandList>
          <CommandSeparator />
          <CommandList>
            <CommandGroup>
              <CommandItem
                onSelect={() => {
                  setOpen(false);
                  shopModal.onOpen();
                }}
              >
                <PlusCircle className="mr-2 h-5 w-5" />
                Create shop
              </CommandItem>
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
}
