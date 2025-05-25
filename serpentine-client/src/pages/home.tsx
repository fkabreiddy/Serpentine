import React, { useEffect, useState } from "react"
import { Spinner } from "@heroui/spinner";
import { AnimatedGridPattern } from "@/components/magicui/animated-grid-pattern";
import { useGlobalDataStore } from "@/contexts/global-data-context";
import { cn } from "@heroui/theme";

interface HomePageProps{

}

export default function HomePage () {

    const [isMounted, setIsMounted] = useState<boolean>(false);
    const [loading, setLoading] = useState<boolean>(true);
    const {currentChatId} = useGlobalDataStore();


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
            <div className="flex flex-col relative h-screen w-full items-center justify-center">
                {!currentChatId || currentChatId <= 0 ?
                    <></>

                    :
                    <nav className="top-0 px-3  py-2 dark:bg-black bg-white z-20 flex items-center absolute border-b border-default-100 h-[50px] w-full">
                        
                    </nav>
                }
                {!currentChatId || currentChatId <= 0 ?
                    <>
                        <AnimatedGridPattern
                            numSquares={30}
                            maxOpacity={0.05}
                            duration={3}
                            repeatDelay={1}
                            className={cn(
                            "[mask-image:radial-gradient(500px_circle_at_center,white,transparent)]",
                            "  h-screen opacity-60 left-[150px]  skew-y-12 fixed",
                            )}
                        />

                        <div className="flex items-center flex-col gap-2">

                            <span>
                                         ٩(*❛⊰❛)～❤

                            </span>
                            <span className="text-md font-semibold">Welcome to serpentine</span>
                            <span className="text-xs font-normal">How are you doing today?</span>
                        </div>
                    </>
                    
                    :
                    <></>
                }
            </div>
        );
    }

   
  

}

