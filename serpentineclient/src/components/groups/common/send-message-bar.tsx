import IconButton from "@/components/common/icon-button";
import { useActiveChannelsHubStore } from "@/contexts/active-channels-hub-context";
import { useActiveUserHubStore } from "@/contexts/active-user-hub-context";
import { HubConnectionState } from "@microsoft/signalr";
import { ArrowRight, FilePlusIcon, ImagePlus } from "lucide-react";
import { motion } from "motion/react";
import { useRef } from "react"

export default function SendMessageBar()
{

    const textArea = useRef<HTMLTextAreaElement | null>(null);
    function autoGrow(element: HTMLTextAreaElement | null)
    {
        if(element)
            element.style.height = (element.scrollHeight) + "px"
    }
     
    const {activeChannelsHub, activeChannelsHubsState} = useActiveChannelsHubStore();
    return(
        <div className="  w-full  pb-4 py-2 px-3  absolute left-0 bottom-0 flex flex-col items-center">
            
            <div className={`w-[70%]   backdrop-blur-xl backdrop-opacity-70  h-fit max-h-[400px] dark:bg-neutral-900/20 bg-neutral-300/20 p-3 max-md:w-[90%] rounded-3xl border dark:border-neutral-900 border-neutral-100 `}>

                <textarea
                    ref={textArea}
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
                        {(() => {
                            switch (activeChannelsHubsState) {
                                case HubConnectionState.Connected:
                                return <p className="text-green-600 animate-pulse shrink-0  text-xs font-normal">Listening</p>
                                case HubConnectionState.Disconnected:
                                return <p className="text-red-600 text-xs shrink-0 font-normal">Not listening</p>;
                            
                                default:
                                return <p className="text-yellow-500 text-xs shrink-0 font-normal">Reconnecting</p>;
                            }
                        })()}
                    </div>
                   
                    <div className="flex items-center gap-3 group">
                        <IconButton onClick={()=>{}} tooltipText="Attatch document">
                            
                                <FilePlusIcon className="size-[16px] "/>

                         
                        
                        
                        </IconButton>
                         <IconButton onClick={()=>{}} tooltipText="Attatch image">
                            
                                <ImagePlus className="size-[16px] "/>

                         
                        
                        
                        </IconButton>
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
                    </div>


                       
                   
                        
                
                </div>
            </div>
           
        </div>
    )
}