import React, { useState } from "react";
import SearchChannelBar from "../search-channel-bar";
import ChannelCard from "../channels/channel-card";
import {ScrollShadow} from "@heroui/scroll-shadow";
import { AnimatedList } from "@/components/magicui/animated-list";
import { count } from "console";
import { Button } from "@heroui/button";

interface ChannelsPanelProps{


}

const ChannelsPanel: React.FC<ChannelsPanelProps> = () =>{

    const [filter, setFilter] = useState<string>("");
    const [counter, setCounter] = useState<number>(3);
    const channels = ["svelte", "blazor", "pokemon", "final-fantasy", "fka-twigs", "youtube"]
    return(

        <div className="w-[23%] max-md:w-full flex flex-col border-r border-r-default-100 overflow-auto h-screen scroll-smooth scrollbar-hide">
            <div className="border-b border-b-default-100 h-[50px] justify-center backdrop-blur-lg pr-4  p-2  z-[1] sticky top-0 items-center ">
                
                <SearchChannelBar onSearch={setFilter} />
            </div>
            <div className="border-b flex border-default-100 h-[30px] justify-between bg-default-50/50 backdrop-blur-lg   p-3  z-[1] sticky top-[50px] items-center">
                 <label className="text-xs  opacity-50">My Channels</label>
                 <Button variant="" className="hover:underline text-blue-500 text-xs p-0" color="primary">Join a channel</Button>
            </div>
            <ScrollShadow hideScrollBar className=" h-full overflow-auto scroll-smooth">
                <AnimatedList delay={0} className="gap-0" >
                   {channels
                    .filter(ch => ch.toLowerCase().includes(filter.toLowerCase()))
                    .map((ch, i) => (
                        <ChannelCard  key={`${i}-${ch}`}  index={i} name={ch} />
                    ))}
                </AnimatedList>
              
             
            </ScrollShadow>
            
        </div>
    )
}

export default ChannelsPanel;