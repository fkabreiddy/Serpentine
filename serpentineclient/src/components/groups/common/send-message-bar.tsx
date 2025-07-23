import IconButton from "@/components/common/icon-button";
import { useActiveChannelsHubStore } from "@/contexts/active-channels-hub-context";
import { useActiveUserHubStore } from "@/contexts/active-user-hub-context";
import { GroupResponse } from "@/models/responses/group-response";
import { Spinner } from "@heroui/react";
import { HubConnectionState } from "@microsoft/signalr";
import { ArrowRight, FilePlusIcon, ImagePlus } from "lucide-react";
import { motion } from "motion/react";
import { useEffect, useRef, useState } from "react"


interface SendMessageBarProps{

    group: GroupResponse | null;
    loading: boolean;
    hasPermisson?: boolean;
}
export default function SendMessageBar({group, loading = false, hasPermisson = false}:SendMessageBarProps)
{

    const textArea = useRef<HTMLTextAreaElement | null>(null);
    const [isListening, setIsListening] = useState(false);
    const {activeChannels, activeChannelsHubsState} = useActiveChannelsHubStore();

    function autoGrow(element: HTMLTextAreaElement | null)
    {
        if(element)
            element.style.height = (element.scrollHeight) + "px"
    }

    useEffect(()=>{
        
        setIsListening(!!activeChannels.find(ch => ch === group?.channelId));
    },[activeChannels, group])
     
    return(
        <div className={` ${(loading || !group || !hasPermisson) && "opacity-50"} w-full  pb-4 py-2 px-3  absolute left-0 bottom-0 flex flex-col items-center`}>
            
            <div className={`w-[70%]   backdrop-blur-xl backdrop-opacity-70  h-fit max-h-[400px] dark:bg-neutral-900/20 bg-neutral-300/20 p-3 max-md:w-[90%] rounded-3xl border dark:border-neutral-900 border-neutral-100 `}>

                <textarea
                    ref={textArea}
                    disabled ={loading || !group || !hasPermisson}
                    className=" w-full p-3 border-0 !outline-none !bg-transparent resize-none"
                    maxLength={1000}
                    style={{backgroundColor: "transparent !important", border: "0"}}
                    autoCorrect="false"
                    onInput={() => autoGrow(textArea.current)}
                    minLength={1}
                    required={true}

                />
                <div className=" w-full flex justify-between items-center gap-2 ">
                   

                    <div className="flex items-center gap-3">
                        {isListening?
                                
                             <p className="text-green-600 animate-pulse shrink-0  text-xs font-normal">
                                Listening
                             </p> :
                             <p className="text-red-600 text-xs shrink-0 font-normal">
                                Not Listening
                             </p>
                            
                               
                        }
                        

                    </div>

                   
                    <div className="flex items-center gap-3 group">
                        <IconButton onClick={()=>{}} tooltipText="Attatch document">
                            
                                <FilePlusIcon className="size-[16px] "/>

                         
                        
                        
                        </IconButton>
                         <IconButton onClick={()=>{}} tooltipText="Attatch image">
                            
                                <ImagePlus className="size-[16px] "/>

                         
                        
                        
                        </IconButton>

                        {loading ?
                        
                            <Spinner size="sm" variant="spinner"/> :
                             <IconButton disabled={true} onClick={()=>{}} tooltipText="Send">
                                <motion.div
                                    key="send-icon"
                                    whileHover={{ rotate: -40 }}
                                    animate={{ rotate: 0 }}
                                    exit={{ rotate: 40}}
                                    className="flex  relative"
                                >
                                    <ArrowRight className="size-[16px] "/>

                                </motion.div>
                        
                        
                        </IconButton>
                            
                        }
                       
                    </div>


                       
                   
                        
                
                </div>
            </div>
           
        </div>
    )
}