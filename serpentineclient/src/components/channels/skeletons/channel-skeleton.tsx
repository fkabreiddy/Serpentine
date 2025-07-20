import { Skeleton } from "@/components/ui/skeleton";
import React from "react";
import { useLayoutStore } from '../../../contexts/layout-context';
export default function ChannelSkeleton()
{

    const {layout}= useLayoutStore();
    return(
    <div className="w-full flex flex-col items-center gap-3">
        <div>

            {layout.sideBarExpanded ? 
            <Skeleton color="bg-muted"  className="flex rounded-full size-[40px]"/>: 
            <Skeleton color="bg-muted" className="flex rounded-full size-[28px]" />}
 

        </div>

        {layout.sideBarExpanded &&
            <Skeleton color="bg-muted"  className="h-[10px] w-4/5 rounded-lg" />
        }
    </div>
    )
}