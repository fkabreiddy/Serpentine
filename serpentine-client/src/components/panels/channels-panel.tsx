import React, { useState, useEffect, useTransition } from "react";
import SearchChannelBar from "../search-channel-bar";
import ChannelCard from "../channels/channel-card";
import {ScrollShadow} from "@heroui/scroll-shadow";
import { AnimatedList } from "@/components/magicui/animated-list";
import { ArchiveIcon } from "lucide-react";
import { useIsMobile } from '../../hooks/use-mobile';
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { useAuthStore } from "@/contexts/authentication-context";
import { PackageOpenIcon } from "lucide-react";
import { useGetChannelsByUserId } from "@/hooks/channel-hooks";
import { SearchIcon } from "lucide-react";

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
import { RocketLaunchIcon } from "@heroicons/react/24/solid";
import { Spinner } from "@heroui/spinner";
import Divider from "../divider";
import { Tooltip } from "@heroui/tooltip";
import IconButton from '../icon-button';
import {Plus} from "lucide-react"


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
          <IconButton tootltipText="Create a channel" >
                <Plus className="size-[18px]  cursor-pointer hover:text-yellow-500 transition-all"/>

          </IconButton>      
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
    const [isMounted, setIsMounted] = useState<boolean>(false);
    const [joinChannelIsOpen, setJoinChannelIsOpen] = useState(false);
    const [showSearchBar, setShowSearchBar] = useState<boolean>(false);

    const {user} = useAuthStore();

    const {getChannelsByUserId, channels, hasMore, loadingChannels, isBusy } = useGetChannelsByUserId();

    useEffect(() => {
      setIsMounted(true);
    }, []);

   

  const hasFetched = React.useRef(false);

  useEffect(() => {
    if (user && !loadingChannels && !isBusy && !hasFetched.current) {
      hasFetched.current = true;
      fetchChannels();
    }
  }, [user]);

  const searchAgain = async () =>{
    
   
  }


  const fetchChannels = async () => {
  
    await getChannelsByUserId({ userId: parseInt(user?.sub ?? "0"), take: 5, skip: channels.length });
     
  };
   

    if (!isMounted) {
        return <></>;
    }

    return(

        <div className="w-[28%] rounded-r-xl border-r border-y max-md:border-y-0 max-md:rounded-b-none bg-neutral-100 dark:bg-neutral-900/20 max-md:w-full flex flex-col  border-defult-100 dark:border-default-50   overflow-auto h-screen scroll-smooth scrollbar-hide">

            <div className="  border-defult-100 dark:border-default-50 flex  justify-between gap-2 backdrop-blur-lg   px-4 py-3  z-[1] sticky top-0 items-center ">
               {showSearchBar ?                 
                  
                  <SearchChannelBar onCancel={() => { setShowSearchBar(false)}} onSearch={setFilter} /> :
                  <>
                    <label className="font-normal text-xs opacity-30 flex-nowrap text-nowrap">Your channels</label>
                    <div className="flex items-center gap-3">

                      <IconButton onClick={()=> setShowSearchBar(true)} tootltipText="Search channels" >
                        <SearchIcon  className="size-[18px]  cursor-pointer hover:text-yellow-500 transition-all"/>

                      </IconButton>
                      <IconButton tootltipText="Archived channels" >
                        <ArchiveIcon className="size-[18px]  cursor-pointer hover:text-yellow-500 transition-all"/>

                      </IconButton>
                      <JoinChannelDrawer open={joinChannelIsOpen} openChanged={setJoinChannelIsOpen} />

                     
                    </div>
                  
                  </>
                 
                 
               }
               
            </div>
            
            <ScrollShadow hideScrollBar className=" flex flex-col px-3 ">
              
              {
                  (channels.length === 0 && loadingChannels === true) ? 
                    
                    <div className="h-screen w-full flex items-center justify-center">
                          <Spinner color="default" variant="spinner" size="sm"/> 

                    </div>
                  : 

                  <>
                     {(channels.length === 0 && hasMore === false && loadingChannels === false) ? (
                      <div className="flex items-center justify-center h-screen flex-col gap-1 px-3 ">
                        <PackageOpenIcon className="size-[30px] animate-bounce  opacity-30"/>
                        <p className="text-xs font-normal text-default-300">No channel yet</p>
                        <p className="text-xs font-normal text-default-300">If you think this is an error <a className="text-yellow-500 ml-1 ${} underline cursor-pointer" onClick={async ()=>{await searchAgain()}}>try again</a></p>

                      </div>
                    ) : (
                      <div className="h-full overflow-auto scrollbar-hide scroll-smooth">
                          {channels
                            .filter(ch => ch.name.toLowerCase().includes(filter.toLowerCase()))
                            .map((ch, i) => (
                              <ChannelCard key={`${i}-${ch.name}`} index={i} channel={ch} />
                          ))}
                        {loadingChannels &&
                        <div className="flex items-center justify-center h-screen flex-col gap-1 px-3 ">
                            <Spinner size="sm" variant="spinner" color="default"/>
                          </div>
                        }

                      
                      </div>
                    )}
                  </>
              
                 
              }
              
              
            </ScrollShadow>

            
        </div>
    )
}

export default ChannelsPanel;