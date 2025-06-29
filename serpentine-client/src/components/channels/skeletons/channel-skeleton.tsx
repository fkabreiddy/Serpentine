import React from "react";
export default function ChannelSkeleton()
{
    return(
        <div className="w-full flex gap-3 items-center">
            <div className="rounded-full size-6 shrink-0 dark:bg-neutral-800 bg-neutral-200 animate-pulse"/>
            <div className="w-full flex flex-col gap-2">
                <div className="h-[15px] dark:bg-neutral-800 bg-neutral-200 animate-pulse rounded-md"/>

            </div>
        </div>
    )
}