import { useState } from "react";

export const useOrigin = () => { 
    const [isMounted, setIsMounted] = useState(false);
    const origin = typeof window !== "undefined" && window.location.origin ? window.location.origin : "";
    if (!isMounted) {
        setIsMounted(true);
    }  
   
    return origin;
}