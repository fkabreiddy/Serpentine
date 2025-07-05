import { Skeleton } from "@/components/ui/skeleton";
import React from "react";
import { useLayoutStore } from '../../../contexts/layout-context';
export default function ChannelSkeleton()
{

    const {layout}= useLayoutStore();
    return(
    <div className="w-full flex items-center gap-3">
        <div>
            <Skeleton className="flex rounded-full w-[24px] h-[24px]" />
        </div>

        {layout.sideBarExpanded &&
            <div className="w-full flex flex-col gap-2">
                <Skeleton className="h-[10px] w-4/5 rounded-lg" />
            </div>
        }
    </div>
    )
}