import { Skeleton } from "@heroui/react";

export default function GroupCardSkeleton(){

    return(
        <div  className="relative mb-5 last:-mb-[4px]"
>
            <div className="absolute left-0 top-3 w-4 h-[10px] border-b-2 border-l-2  dark:border-neutral-800 border-neutral-200 rounded-bl-2xl" />

            <div className="flex transition-all   flex-col items-end w-full">
                <div
                style={{ width: "calc(100% - 24px)" }}
                className=" flex items-center justify-between gap-1"
                >
                        

                    <div className="flex text-ellipsis overflow-hidden   w-full flex-col gap-1">
                        <Skeleton className="rounded-lg w-full h-[20px]"/>
                        <Skeleton className="rounded-lg w-[80%] h-[10px]"/>
                    </div>
                    
        
                
                
                </div>
            </div>
        </div>
      
       
    )
}