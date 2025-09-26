import { Skeleton } from "@heroui/react";

export default function ChannelCardMiniSkeleton(){

    return(

        <div className="w-[50px] flex flex-col items-center justify-center gap-2">
            <Skeleton className="rounded-full size-[40px]"/>
            <Skeleton className="h-[10px] w-full rounded-lg"/>
        </div>
    )
}