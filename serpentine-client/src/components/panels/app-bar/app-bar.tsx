import React, { useEffect } from "react";
import { motion } from 'motion/react';
import { useAuthStore } from "@/contexts/authentication-context";
import { Spinner } from "@heroui/spinner";
import Avatar from "boring-avatars";
import { Image } from "@heroui/image";
import { useLayoutStore } from "@/contexts/layout-context";
import { useCloseSession } from "@/hooks/user-hooks";
import IconButton from "@/components/common/icon-button";
import SearchChannelBar from "@/components/search-channel-bar";
import { ThemeSwitch } from "@/components/theme-switch";


interface ProfilePanelProps{

}

const AppBar: React.FC<ProfilePanelProps> = () =>{

    const {userPofilePicture, user, username, setUser, isAuthenticated } = useAuthStore();
    const [filter, setFilter] = React.useState<string>("");
    const {closeSession} = useCloseSession();

  
    
    useEffect(()=>{

        setUser(()=>{});

    },[])

    useEffect(()=>{

        if(!isAuthenticated)
        {
            closeSession();
        }

    }, [isAuthenticated, user])

    return(

        <nav id="app-bar" className=" z-[10]  bg-white dark:bg-black   sticky top-0 w-full    border-b border-default-100 flex items-center px-3 py-2  justify-between gap-3 h-fit transition-all">
            
            <div className="doodle-pattern "/>

             
           
            <div/>
            <SearchChannelBar onSearch={setFilter} /> 

           
            <div className=" flex  items-center justify-end gap-4 ">

                <ThemeSwitch/>
                <NotificationsIcon/>
               
                {!isAuthenticated ? 
                    <Spinner variant="spinner"/> : 
                
                    <div className="cursor-pointer flex items-center justify-center rounded-full   transition-all text-sm font-semibold">
                        {userPofilePicture ? 
                                <Image isBlurred src="userProfilePicture" width={30} height={30} className="shrink-0 min-w-[30px] min-h-[30px] max-md:!w-[23px] max-md:!h-[23px] rounded-full"/> 

                            :
                                <Avatar size={30} className="max-md:!w-[23px] max-md:!h-[23px]" variant="beam" name={username ?? "adam"}/>


                        }
                    </div>
                        
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
            className="flex flex-col gap-1 relative"
        >
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-5">
        <path strokeLinecap="round" strokeLinejoin="round" d="M14.857 17.082a23.848 23.848 0 0 0 5.454-1.31A8.967 8.967 0 0 1 18 9.75V9A6 6 0 0 0 6 9v.75a8.967 8.967 0 0 1-2.312 6.022c1.733.64 3.56 1.085 5.455 1.31m5.714 0a24.255 24.255 0 0 1-5.714 0m5.714 0a3 3 0 1 1-5.714 0" />
        </svg>

        </motion.div>
       
       
    </IconButton>

  

)




export default AppBar;