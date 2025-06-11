import {useState} from "react"

import { useIsMobile } from "@/hooks/use-mobile"

import {
  Drawer,
  DrawerContent,
  DrawerTrigger,
} from "@/components/ui/drawer"
import { Plus } from "lucide-react"
import CreateChannelForm from "../forms/create-channel-form"
import { ChannelResponse } from "@/models/responses/channel-response"
import DrawerButton from "../sidebar-button"
import Modal from "../modal"

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
      <>
        <DrawerButton  text="Create a channel" onClick={()=> setOpen(true)} >
                  <Plus className="size-[18px]  cursor-pointer group-hover:text-blue-500 transition-all"/>
        </DrawerButton>  
       {open && 
        <Modal onClose={()=>{setOpen(false)}}>
          
            <CreateChannelForm onCreate={handleCreate}/>
            
        </Modal>}
      </>
      
     
    )
  }

  return (
    <Drawer open={open} onOpenChange={setOpen}>
      <DrawerTrigger asChild>
       <DrawerButton onClick={()=>{setOpen(true);}} text="Create a channel" >
          <Plus className="size-[18px]  cursor-pointer group-hover:text-blue-500 transition-all"/>
        </DrawerButton>  
      </DrawerTrigger>
      <DrawerContent className="p-3 py-4 w-full flex flex-col items-center  border-default-50/50 border rounded-xl bg-transparent backdrop-blur-md">
        
        <CreateChannelForm onCreate={handleCreate}/>
        
      </DrawerContent>
    </Drawer>
  )
}

