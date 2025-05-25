import {
  Listbox,
  ListboxSection,
  ListboxItem,
  
} from "@heroui/listbox";


import React, { ReactNode } from "react"
import { Popover, PopoverContent, PopoverTrigger } from "@heroui/popover";

interface ChannelCardMenuProps{

    onClose : () => void,
    isOpen : boolean,
    imOwner: boolean,
    children: ReactNode 
}

const ChannelCardMenu:React.FC<ChannelCardMenuProps> = ({onClose, imOwner = false, isOpen = false, children}) =>{

    return (
    <Popover onClose={onClose} backdrop="transparent" isOpen={isOpen} placement="bottom"  showArrow={true}>
      <PopoverTrigger>
        {children}
      </PopoverTrigger>
      <PopoverContent className="backdrop-blur-2xl bg-default-50/30 border-default-100">
        
       <Listbox variant="flat" aria-label="Actions" onAction={(key) => alert(key)}>
       
        <ListboxItem key="Information" className="">
            <div className="flex w-full items-center gap-4 justify-between">
                <div >
                   <p className="text-[13px] font-normal">About</p>  

                </div>
                <AboutIcon/>


            </div>
          
           
        </ListboxItem>

        <ListboxItem key="add"  className="rounded-md">
            <div className="flex w-full items-center gap-4 justify-between">
                <div >
                   <p className="text-[13px] font-normal">Add Group</p>  
                    <p className="text-xs opacity-50">Create a new group for this channel</p>

                </div>
                <AddIcon/>


            </div>
          
           
        </ListboxItem>



        <ListboxItem key="notification"  className="rounded-md">
            <div className="flex w-full items-center gap-4 justify-between">
                <div >
                   <p className="text-[13px] font-normal">Deactivate Notifications</p>  
                    <p className="text-xs opacity-50 max-w-[250px]">When disabled you wont recieve notifications from this channel</p>

                </div>
                <NotificationIcon/>


            </div>
          
           
        </ListboxItem>


        <ListboxItem key="archive"  className="rounded-md">
            <div className="flex w-full items-center gap-4 justify-between">
                <div >
                   <p className="text-[13px] font-normal">Archive Notifications</p>  
                    <p className="text-xs opacity-50 max-w-[250px]">You wont recieve notifications from this channel and it wont appear on this view</p>

                </div>
                <ArchiveIcon/>


            </div>
          
           
        </ListboxItem>
        {imOwner ? <ListboxItem key="delete" color="danger"  className="rounded-md">
            <div className="flex w-full items-center gap-4 justify-between">
                <div >
                   <p className="text-[13px] font-normal">Delete Channel</p>  

                </div>


            </div>
          
           
        </ListboxItem> :
         <ListboxItem key="delete" color="danger"  className="rounded-md">
            <div className="flex w-full items-center gap-4 justify-between">
                <div >
                   <p className="text-[13px] font-normal">Leave Channel</p>  

                </div>


            </div>
          
           
        </ListboxItem>
        }
        
      
      </Listbox>
      </PopoverContent>
    </Popover>
    
  )
}

export default ChannelCardMenu;

const MoreHor = () =>(
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="size-[18px] opacity-80 ">
    <path strokeLinecap="round" strokeLinejoin="round" d="M6.75 12a.75.75 0 1 1-1.5 0 .75.75 0 0 1 1.5 0ZM12.75 12a.75.75 0 1 1-1.5 0 .75.75 0 0 1 1.5 0ZM18.75 12a.75.75 0 1 1-1.5 0 .75.75 0 0 1 1.5 0Z" />
    </svg>

)

const AboutIcon = () =>(
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-4 opacity-50">
  <path strokeLinecap="round" strokeLinejoin="round" d="m11.25 11.25.041-.02a.75.75 0 0 1 1.063.852l-.708 2.836a.75.75 0 0 0 1.063.853l.041-.021M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Zm-9-3.75h.008v.008H12V8.25Z" />
</svg>

)

const AddIcon = () =>(

    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-4">
    <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
    </svg>

)

const ArchiveIcon = () =>(

    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-4">
  <path strokeLinecap="round" strokeLinejoin="round" d="m20.25 7.5-.625 10.632a2.25 2.25 0 0 1-2.247 2.118H6.622a2.25 2.25 0 0 1-2.247-2.118L3.75 7.5m8.25 3v6.75m0 0-3-3m3 3 3-3M3.375 7.5h17.25c.621 0 1.125-.504 1.125-1.125v-1.5c0-.621-.504-1.125-1.125-1.125H3.375c-.621 0-1.125.504-1.125 1.125v1.5c0 .621.504 1.125 1.125 1.125Z" />
</svg>

)

const NotificationIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-4">
    <path strokeLinecap="round" strokeLinejoin="round" d="M9.143 17.082a24.248 24.248 0 0 0 3.844.148m-3.844-.148a23.856 23.856 0 0 1-5.455-1.31 8.964 8.964 0 0 0 2.3-5.542m3.155 6.852a3 3 0 0 0 5.667 1.97m1.965-2.277L21 21m-4.225-4.225a23.81 23.81 0 0 0 3.536-1.003A8.967 8.967 0 0 1 18 9.75V9A6 6 0 0 0 6.53 6.53m10.245 10.245L6.53 6.53M3 3l3.53 3.53" />
    </svg>

)