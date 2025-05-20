import React, { useState, useEffect } from "react";
import SearchChannelBar from "../search-channel-bar";
import ChannelCard from "../channels/channel-card";
import {ScrollShadow} from "@heroui/scroll-shadow";
import { AnimatedList } from "@/components/magicui/animated-list";
import { useIsMobile } from '../../hooks/use-mobile';
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"

import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "@/components/ui/drawer"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

interface ChannelsPanelProps{


}

interface JoinChannelDrawerProps{

    open : boolean 
    openChanged : (change : boolean) => void
}

const JoinChannelDrawer:React.FC<JoinChannelDrawerProps> = () =>{
    
const [open, setOpen] = useState(false);
  const isMobile = useIsMobile();
 
 
  return (
    <Drawer open={open}  onOpenChange={setOpen}>
      <DrawerTrigger asChild>
                <Button variant="light" color="primary" size="sm"  className="font-xs p-0 text-blue-500">Join a channel</Button>
      </DrawerTrigger>
      <DrawerContent className={cn(
        `${isMobile ? "" : "absolute w-[25%] justify-self-end h-screen bottom-0 z-50   flex  flex-col   "} border backdrop-blur-xl bg-default-50 border-default-100`
 
        )}>
        <DrawerHeader className="text-left">
          <DrawerTitle>Edit profile</DrawerTitle>
          <DrawerDescription>
            Make changes to your profile here. Click save when you're done.
          </DrawerDescription>
        </DrawerHeader>
        <ProfileForm className="px-4" />
        <DrawerFooter className="pt-2">
          <DrawerClose asChild>
            <Button variant="outline">Cancel</Button>
          </DrawerClose>
        </DrawerFooter>
      </DrawerContent>
    </Drawer>
  )
}
 
function ProfileForm({ className }: React.ComponentProps<"form">) {
  return (
    <form className={cn("grid items-start gap-4", className)}>
      <div className="grid gap-2">
        <Label htmlFor="email">Email</Label>
        <Input type="email" id="email" defaultValue="shadcn@example.com" />
      </div>
      <div className="grid gap-2">
        <Label htmlFor="username">Username</Label>
        <Input id="username" defaultValue="@shadcn" />
      </div>
      <Button type="submit">Save changes</Button>
    </form>
  )

}

const ChannelsPanel: React.FC<ChannelsPanelProps> = () =>{

    const [filter, setFilter] = useState<string>("");
    const [joinChannelIsOpen, setJoinChannelIsOpen] = useState(false);

    const channels = ["svelte", "blazor", "pokemon", "final-fantasy", "fka-twigs", "youtube"]
    return(

        <div className="w-[23%] bg-white dark:bg-black  max-md:w-full flex flex-col border-r border-y border-default-100 overflow-auto h-screen scroll-smooth scrollbar-hide">
            <div className="border-b border-b-default-100 h-[50px] justify-center backdrop-blur-lg pr-4  p-2  z-[1] sticky top-0 items-center ">
                
                <SearchChannelBar onSearch={setFilter} />
            </div>
            <div className="border-b flex border-default-100 h-[30px] justify-between bg-default-50/50 backdrop-blur-lg   p-3  z-[1] sticky top-[50px] items-center">
                <label className="text-xs  opacity-50">My Channels</label>
                 <JoinChannelDrawer />

                
            </div>
            <ScrollShadow hideScrollBar >
               <ul className=" h-full overflow-auto scrollbar-hide  scroll-smooth">
                    <AnimatedList delay={0} className="gap-0" >
                    {channels
                        .filter(ch => ch.toLowerCase().includes(filter.toLowerCase()))
                        .map((ch, i) => (
                            <ChannelCard  key={`${i}-${ch}`}  index={i} name={ch} />
                        ))}
                    </AnimatedList>
               </ul>
                
              
             
            </ScrollShadow>

            
        </div>
    )
}

export default ChannelsPanel;