import { Skeleton } from "@/components/ui/skeleton";
import React from "react";
import { useLayoutStore } from '../../../contexts/layout-context';
export default function ChannelCardSkeleton()
{

    return(
        <Skeleton className="rounded-lg w-[270px] h-[150px]"/>
    )
}