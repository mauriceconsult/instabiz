"use client";

import { useStoreModal } from "@/hooks/use-store-modal";
import { useEffect } from "react";


const SetupPage = () => {
  const onOpen = useStoreModal((state) => state.onOpen);
  const isOpen = useStoreModal((state) => state.isOpen);
useEffect(() => {
  if (!isOpen) {
    onOpen();
  }
}, [isOpen, onOpen]);
  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">Setup Page</h1>
    </div>   
  );
}
export default SetupPage;
