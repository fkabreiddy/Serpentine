import React, { useEffect } from "react";
import { motion } from 'motion/react';
import {Tooltip} from "@heroui/tooltip";
import { useAuthStore } from "@/contexts/authentication-context";
import { Spinner } from "@heroui/spinner";
import Avatar from "boring-avatars";
import { useCloseSession } from '../../hooks/user-hooks';
import { Image } from "@heroui/image";
import { ThemeSwitch } from "../theme-switch";
import { Button } from "@heroui/button";
import IconButton from "../icon-button";
import { Plug } from "lucide-react";


interface ProfilePanelProps{


}

const ProfilePanel: React.FC<ProfilePanelProps> = () =>{

    const {userPofilePicture, user, username, setUser, isAuthenticated } = useAuthStore();
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

        <nav className="max-md:h-fit  rounded-r-xl max-md:rounded-t-xl max-md:rounded-b-none bg-neutral-50 dark:bg-neutral-950   relative max-md:w-full max-md:flex-row bg-default-50/10 w-[5%]   min-w-fit border border-default-100 flex flex-col items-center px-3 py-4 max-md:py-2 justify-between gap-3 h-screen  transition-all">
           
            <div className="grain-lighter w-4 h-4 absolute inset-0 opacity-50" />

            {!isAuthenticated ? 
                <Spinner variant="spinner"/> : 
            
                 <>
                    <Tooltip content={user?.nickname} placement="right" size="sm" >
                        <div className="cursor-pointer flex items-center justify-center rounded-full   transition-all text-sm font-semibold">
                            {userPofilePicture ? 
                                    <Image isBlurred src="userProfilePicture" width={30} height={30} className="shrink-0 min-w-[30px] min-h-[30px] max-md:!w-[23px] max-md:!h-[23px] rounded-full"/> 

                                :
                                    <Avatar size={30} className="max-md:!w-[23px] max-md:!h-[23px]" variant="beam" name={username ?? "adam"}/>


                            }
                        </div>
                    </Tooltip>
                  
                        

                 </> 
                
            }
           

           
            <div className="max-md:flex-row  flex flex-col items-center justify-end gap-4 ">

               
                <NotificationsIcon/>
                <SettingIcon/>
                <hr className="border border-default-100 rounded-full w-[50%]"/>
                <div onClick={closeSession}>
                    <LogoutIcon />
                </div>
              
            </div>
          
        </nav>
    )
}

const SettingIcon =  () =>(

 <IconButton tootltipText="Settings">
    <motion.div
                key="setting-icon"
                whileHover={{ rotate: 180 }}
                animate={{ rotate: 0 }}
                exit={{ rotate: -180}}
                className="flex flex-col gap-1 relative"
            >
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-5">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12a7.5 7.5 0 0 0 15 0m-15 0a7.5 7.5 0 1 1 15 0m-15 0H3m16.5 0H21m-1.5 0H12m-8.457 3.077 1.41-.513m14.095-5.13 1.41-.513M5.106 17.785l1.15-.964m11.49-9.642 1.149-.964M7.501 19.795l.75-1.3m7.5-12.99.75-1.3m-6.063 16.658.26-1.477m2.605-14.772.26-1.477m0 17.726-.26-1.477M10.698 4.614l-.26-1.477M16.5 19.794l-.75-1.299M7.5 4.205 12 12m6.894 5.785-1.149-.964M6.256 7.178l-1.15-.964m15.352 8.864-1.41-.513M4.954 9.435l-1.41-.514M12.002 12l-3.75 6.495" />
                </svg>
    </motion.div>
 </IconButton>
           
     
    
        

)

const NotificationsIcon = () =>(

   <IconButton tootltipText="Notifications">
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


const LogoutIcon = () =>(

   <IconButton tootltipText="Logout">
            <motion.div
                key="logout-icon"
                whileHover={{ rotate: 30 }}
                animate={{ rotate: 0 }}
                exit={{ rotate: -30}}
                className="flex flex-col gap-1 relative"
            >
        <Plug className="size-[18px] hover:text-red-500"/>
        </motion.div>
        
    </IconButton>
    
)

export default ProfilePanel;