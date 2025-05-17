import React, { useEffect, useState } from "react"
import { Spinner } from "@heroui/spinner";
import { Loader } from "lucide-react";
import { AuthorizeView } from "@/components/authorize-view";

interface HomePageProps{

}

export default function HomePage () {

    const [isMounted, setIsMounted] = useState<boolean>(false);
    const [loading, setLoading] = useState<boolean>(true);


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
        return (<>


        </>);
    }

   
  

}

