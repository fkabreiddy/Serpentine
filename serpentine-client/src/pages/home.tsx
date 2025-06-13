import React, { useEffect, useState } from "react"
import { Spinner } from "@heroui/spinner";
import { AnimatedGridPattern } from "@/components/magicui/animated-grid-pattern";
import { useGlobalDataStore } from "@/contexts/global-data-context";
import { cn } from "@heroui/theme";
import { FlickeringGrid } from "@/components/magicui/flickering-grid";
import { BoxIcon } from "lucide-react";
import { useIsMobile } from "@/hooks/use-mobile";
import TrendingPosts from "@/components/trending-posts";

interface HomePageProps{

}

export default function HomePage () {

    const [isMounted, setIsMounted] = useState<boolean>(false);
    const [loading, setLoading] = useState<boolean>(true);
    const {currentChatId} = useGlobalDataStore();
    const isMobile = useIsMobile();

    useEffect(() =>{
        setIsMounted(true);
        setLoading(false);
    },[])

    if(!isMounted || loading)
    {
        return (
            <div className="w-screen absolute inset-0 h-screen flex items-center justify-center flex-col gap-2">
                <p className="font-semibold text-xs">Welcome. Keep waiting, we are doing something 4 u</p>
                <Spinner variant="spinner" size="sm"/>
            </div>
        );
    }
    else
    {
        return (
            <div className="flex   flex-col relative h-full w-full items-center justify-center">
               
                <>
                    


                    <div className="flex items-center flex-col gap-2 ">
                        <span className="text-md font-semibold">Welcome to serpentine</span>
                        <span className="text-xs font-normal">Select one group to display the messages</span>
                    </div>
                </>
                
                
                
                    
                    
            </div>
        );
    }

   
  

}

