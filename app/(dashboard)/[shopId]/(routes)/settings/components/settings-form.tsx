"use client";

import { Button } from "@/components/ui/button";
import { Heading } from "@/components/ui/heading";
import { Separator } from "@/components/ui/separator";
import { Shop } from "@prisma/client";
import { Trash } from "lucide-react";

interface SettingsFormProps { 
    initialData: Shop;
}

export const SettingsForm: React.FC<SettingsFormProps> = ({ initialData }) => { 
    return (
      <>
        <div className="flex items-center justify-between">
          <Heading
            title="Settings"
            description="Manage your store preferences"
          />
          <Button variant="destructive" size={"sm"} onClick={() => {}}>
            <Trash className="h-4 w-4" />
          </Button>
            </div>
            <Separator/>
            
      </>
    );
}