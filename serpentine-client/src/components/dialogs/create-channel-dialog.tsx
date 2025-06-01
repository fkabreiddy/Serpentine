import React, {useState, useEffect} from "react"

import { cn } from "@/lib/utils"
import { useIsMobile } from "@/hooks/use-mobile"
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
import IconButton from "../icon-button"
import { Plus } from "lucide-react"
import { Popover, PopoverContent, PopoverTrigger } from "@heroui/popover"
import CreateChannelForm from "../forms/create-channel-form"
import { ChannelResponse } from "@/models/responses/channel-response"
import { channel } from "diagnostics_channel"

interface CreateChannelDialogProps{

    onCreate: (channel: ChannelResponse) => void

}


export function CreateChannelDialog({onCreate}:CreateChannelDialogProps) {
  const [open, setOpen] = useState<boolean>(false)
  const isMobile = useIsMobile()




  function handleCreate(channel:ChannelResponse){

    onCreate(channel);
    setOpen(false);
  }



  if (!isMobile) {
    return (
      <Popover isOpen={open} onOpenChange={setOpen}  offset={10} placement="bottom" showArrow={true}>
        <PopoverTrigger>
            <button>
                 <IconButton onClick={()=>{setOpen(true);}} tootltipText="Create a channel" >
                    <Plus className="size-[18px]  cursor-pointer hover:text-yellow-500 transition-all"/>
                </IconButton>  
            </button>
                     

          
        </PopoverTrigger>
      <PopoverContent className="p-3 w-full border-default-50/50 border rounded-xl bg-transparent backdrop-blur-2xl">

        <CreateChannelForm onCreate={handleCreate}/>

      </PopoverContent>
    </Popover>
    )
  }

  return (
    <Drawer open={open} onOpenChange={setOpen}>
      <DrawerTrigger asChild>
       <IconButton onClick={()=>{setOpen(true);}} tootltipText="Create a channel" >
            <Plus className="size-[18px]  cursor-pointer hover:text-yellow-500 transition-all"/>
       
        </IconButton>   
      </DrawerTrigger>
      <DrawerContent className="p-3 py-4 w-full flex flex-col items-center  border-default-50/50 border rounded-xl bg-transparent backdrop-blur-md">
        
        <CreateChannelForm onCreate={handleCreate}/>
        
      </DrawerContent>
    </Drawer>
  )
}

