import React, { ReactNode, useEffect, useRef, useState } from "react";
import { motion } from 'motion/react';
import { useAuthStore } from "@/contexts/authentication-context";
import { Spinner } from "@heroui/spinner";
import Avatar from "boring-avatars";
import { Image } from "@heroui/image";
import { useLayoutStore } from "@/contexts/layout-context";
import { useCloseSession } from "@/hooks/user-hooks";
import IconButton from "@/components/common/icon-button";
import SearchBar from "@/components/search-channel-bar";
import { ThemeSwitch } from "@/components/theme-switch";
import { PlugIcon, SendIcon, Square } from "lucide-react";
import SearchPopover from "./search-popover";
import { useIsMobile } from "@/hooks/use-mobile";
import GeneralSearcher from "@/components/common/general-searcher";
import { useActiveUser } from "@/helpers/active-user-hub";
import { HubResult } from "@/models/hub-result";
import { Skeleton } from "@heroui/skeleton";
import { useActiveUserHubStore } from "@/contexts/active-user-hub-context";
import { HubConnectionState } from "@microsoft/signalr";
import { Tooltip } from "@heroui/tooltip";
import {Badge} from "@heroui/badge";
import { Dropdown, DropdownItem, DropdownMenu, DropdownTrigger } from "@heroui/dropdown";
import { useGlobalDataStore } from "@/contexts/global-data-context";
import SquarePattern from "@/components/common/square-pattern";
import NoisePattern from "@/components/common/crosshatch-pattern";
import CrosshatchPattern from "@/components/common/crosshatch-pattern";

interface ProfilePanelProps{

}

const AppBar: React.FC<ProfilePanelProps> = () =>{

const {userPofilePicture, user, username, setUser, isAuthenticated } = useAuthStore();
   const {activeUserHubConnectionState, activeUsersHub} = useActiveUserHubStore();
   const alreadyMounted = useRef<boolean>(false);
   const {currentGroupId} = useGlobalDataStore();

    
   

    const {disconnectFromActiveUsersHub}= useActiveUser();
    const {closeSession} = useCloseSession();
    const isMobile = useIsMobile();
   
    
    const getConnectionStateText  = () : "success" | "danger" | "warning" | "default" | "primary" | "secondary" =>{
        switch (activeUserHubConnectionState) {
            case HubConnectionState.Connected:
                return "success";
            case HubConnectionState.Disconnected:
                return "danger";
            case HubConnectionState.Reconnecting:
                return "secondary";
            default:
                return "default";
        }
    }
    
    useEffect(()=>{

        setUser(()=>{});

    },[])

    useEffect(()=>{

       
        if(!isAuthenticated)
        {
            disconnectFromActiveUsersHub();
            closeSession();
        }

        

    }, [isAuthenticated, user])

    return(

        <nav id="app-bar" className=" z-[10]  bg-white dark:bg-neutral-950/50   sticky top-0 w-full    border-b border-default-100 flex items-center px-3 py-2 max-md:justify-end justify-between gap-3 h-fit transition-all">
                <div className="absolute inset-0 w-full h-full backdrop-blur-xl backdrop-opacity-70   z-[-1]"/>

                <CrosshatchPattern/>
            
            <div/>

            {
                !isMobile ? 
                <GeneralSearcher onChannelsSearched={()=>{}}/> :
                <SearchPopover/>
                
            }

           
            <div className=" flex  items-center justify-end gap-4 ">

                <ThemeSwitch/>
                
                <NotificationsIcon/>
               
                {isAuthenticated &&
                    <Tooltip content={activeUserHubConnectionState.toString()} placement="bottom" size="sm" showArrow={true} >
                        <Badge color={getConnectionStateText()} content="" isDot={true} placement="bottom-left">
                            <div className="cursor-pointer flex items-center justify-center rounded-full   transition-all text-sm font-semibold">
                                {userPofilePicture ? 
                                        <Image isBlurred src="userProfilePicture" width={28} height={28} className="shrink-0 min-w-[28px] min-h-[28px] max-md:!w-[28px] max-md:!h-[28px] rounded-full"/> 

                                    :
                                        <Avatar size={28} variant="beam" name={username ?? "adam"}/>


                                }
                            </div>
                            
                        </Badge>
                       
                    </Tooltip>
                   
                        
                }
                
                
            </div>

              
        </nav>
    )
}


const NotificationsIcon = () =>(

   <IconButton onClick={()=>{}} tooltipText="Notifications">
         <motion.div
            key="notifications-icon"
            whileHover={{ rotate: 30 }}
            animate={{ rotate: 0 }}
            exit={{ rotate: -30}}
            className="flex  relative"
        >
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-5 ">
        <path strokeLinecap="round" strokeLinejoin="round" d="M14.857 17.082a23.848 23.848 0 0 0 5.454-1.31A8.967 8.967 0 0 1 18 9.75V9A6 6 0 0 0 6 9v.75a8.967 8.967 0 0 1-2.312 6.022c1.733.64 3.56 1.085 5.455 1.31m5.714 0a24.255 24.255 0 0 1-5.714 0m5.714 0a3 3 0 1 1-5.714 0" />
        </svg>

        </motion.div>
       
       
    </IconButton>

  

)




interface AvatarDropdownProps{
    children: ReactNode;
    status: HubConnectionState ;
    onLogout: ()=> void;
}

const AvatarDropdown : React.FC<AvatarDropdownProps> = ({children, status = HubConnectionState.Disconnected, onLogout}) => (
    <Dropdown>
      <DropdownTrigger>
        <button>{children}</button>
      </DropdownTrigger>
      <DropdownMenu aria-label="Static Actions">
        <DropdownItem key="conectionInfo" isReadOnly={true}>
            <div className="w-full flex gap-3 items-center">
                {(() => {
                    switch (status) {
                        case HubConnectionState.Connected:
                            return <div className="bg-green-600 size-[6px] rounded-full text-xs font-semibold"/>
                        case HubConnectionState.Disconnected:
                            return <div className="bg-red-600 size-[6px] rounded-full font-semibold"/>;
                        case HubConnectionState.Reconnecting:
                            return <Spinner size="sm" variant="spinner" />;
                        default:
                            return <div className="text-gray-500 text-xs">Unknown</div>;
                    }
                })()}
                <label className="text-xs">{status.toString()}</label>

            </div>
        </DropdownItem>
        <DropdownItem key="logout" onClick={onLogout} endContent={<PlugIcon className="size-4 shrink-0"/>}>Logout</DropdownItem>
        
      </DropdownMenu>
    </Dropdown>
)



export default AppBar;