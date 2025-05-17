import { Image } from "@heroui/image";
import React, { useEffect } from "react";
import { motion } from 'motion/react';
import { ThemeSwitch } from "../theme-switch";
import {Tooltip} from "@heroui/tooltip";
import { useAuthStore } from "@/contexts/authentication-context";
import { Spinner } from "@heroui/spinner";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import defaultPfp from "../../../public/doodle3.svg"
import { useCloseSession } from '../../hooks/user-hooks';


interface ProfilePanelProps{


}

const ProfilePanel: React.FC<ProfilePanelProps> = () =>{

    const {userPofilePicture, username, setUser, isAuthenticated } = useAuthStore();
    const {closeSession} = useCloseSession();

    useEffect(()=>{

        setUser();

    },[])

    return(

        <div className="max-md:h-fit max-md:w-full max-md:flex-row bg-default-50/30 w-[5%]  relative min-w-fit border-r border-default-100 flex flex-col items-center px-3 py-4 justify-between gap-3 h-screen opacity-50 hover:opacity-100 transition-all">
            <div className="grain w-4 h-4 absolute inset-0 opacity-50" />
           
            {!isAuthenticated ? 
                <Spinner variant="spinner"/> : 
            
                <Tooltip content={username} size="sm" placement="right" >
                    <Avatar>
                        <AvatarImage src={userPofilePicture ?? ""} alt="@shadcn" />
                        <AvatarFallback>{username === null || username === "" ? "S" : username.at(0)?.toUpperCase()}</AvatarFallback>
                    </Avatar>
                </Tooltip>
            }
           

           
            <div className="max-md:flex-row  flex flex-col items-center justify-end gap-4 ">
                  <ThemeSwitch/>

                
                <NotificationsIcon/>
                <SettingIcon/>
                <hr className="border border-default-100 rounded-full w-[50%]"/>
                <div onClick={closeSession}>
                    <LogoutIcon />
                </div>
              
            </div>
          
        </div>
    )
}

const SettingIcon =  () =>(

    <Tooltip content="Setting" size="sm" placement="right" >
        <button className="p-1 bg-blue-700/60 hover:scale-[102%] rounded-full cursor-pointer hover:bg-blue-700  transition-background !text-white flex items-center justify-center">
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
       
       
    </button>
    </Tooltip>
    
    
        

)

const NotificationsIcon = () =>(

    <Tooltip content="Notifications" size="sm" placement="right" >
          <button className="p-[6px] bg-purple-700/60 hover:scale-[102%] rounded-full cursor-pointer hover:bg-purple-700  transition-background !text-white flex items-center justify-center">
         <motion.div
            key="setting-icon"
            whileHover={{ rotate: 30 }}
            animate={{ rotate: 0 }}
            exit={{ rotate: -30}}
            className="flex flex-col gap-1 relative"
        >
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-4">
        <path strokeLinecap="round" strokeLinejoin="round" d="M14.857 17.082a23.848 23.848 0 0 0 5.454-1.31A8.967 8.967 0 0 1 18 9.75V9A6 6 0 0 0 6 9v.75a8.967 8.967 0 0 1-2.312 6.022c1.733.64 3.56 1.085 5.455 1.31m5.714 0a24.255 24.255 0 0 1-5.714 0m5.714 0a3 3 0 1 1-5.714 0" />
        </svg>

        </motion.div>
       
       
    </button>
        
    </Tooltip>

  

)


const LogoutIcon = () =>(

    <Tooltip content="Logout" size="sm" placement="right" >
            <button  className="p-[6px] bg-red-700/60 hover:scale-[102%] rounded-full cursor-pointer hover:bg-red-700  transition-background !text-white flex items-center justify-center">
            <motion.div
                key="logout-icon"
                whileHover={{ rotate: 30 }}
                animate={{ rotate: 0 }}
                exit={{ rotate: -30}}
                className="flex flex-col gap-1 relative"
            >
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-4">
            <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 9V5.25A2.25 2.25 0 0 1 10.5 3h6a2.25 2.25 0 0 1 2.25 2.25v13.5A2.25 2.25 0 0 1 16.5 21h-6a2.25 2.25 0 0 1-2.25-2.25V15m-3 0-3-3m0 0 3-3m-3 3H15" />
            </svg>


            </motion.div>
        
        
        </button>
    </Tooltip>
    
)

export default ProfilePanel;