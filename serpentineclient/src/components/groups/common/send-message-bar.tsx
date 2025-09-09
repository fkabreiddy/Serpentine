import IconButton from "@/components/common/icon-button";
import { useActiveChannelsHubStore } from "@/contexts/active-channels-hub-context";
import { useActiveUserHubStore } from "@/contexts/active-user-hub-context";
import { GroupResponse } from "@/models/responses/group-response";
import { Button, Spinner } from "@heroui/react";
import { HubConnectionState } from "@microsoft/signalr";
import { ArrowRight, FilePlusIcon, ImagePlus, X } from "lucide-react";
import { motion } from "motion/react";
import { useEffect, useRef, useState } from "react";
import {useCreateMessage} from "@/hooks/message-hooks.ts";
import { CreateMessageRequest } from "@/models/requests/messages/create-message-request";
import { MessageResponse } from "@/models/responses/message-response";
import { useGlobalDataStore } from "@/contexts/global-data-context";


export default function SendMessageBar({
  group,
  loading = false,
  hasPermisson = false,
}: {
  group: GroupResponse | null;
  loading: boolean;
  hasPermisson?: boolean;
}) {
  const textArea = useRef<HTMLTextAreaElement | null>(null);
  const [isListening, setIsListening] = useState(false);
  const [alignEnd, setAlignEnd] = useState(false);
  const {messageToReplyTo, setMessageToReplyTo} = useGlobalDataStore();
  const [createMessageRequest, setCreateMessageRequest] = useState<CreateMessageRequest>({
    
    content: "",
    isNotification: false,
    groupId: group?.id ?? ""
  })
  const { activeChannels, activeChannelsHubsState } =
  useActiveChannelsHubStore();

  useEffect(()=>{

    if( messageToReplyTo?.groupId === group?.id || messageToReplyTo === null)
    {
      setCreateMessageRequest((prev)=>({...prev, parentId: messageToReplyTo?.id ?? null}))
    }
  },[messageToReplyTo])
  useEffect(()=>{

    return()=>{
      setMessageToReplyTo(null);
    }
  },[])
  
  const {createMessage, creatingMessage, message} = useCreateMessage();

  useEffect(()=>{
    
    if(!group) return;

    setCreateMessageRequest((prev)=>({...prev, groupId: group.id}));

  },[group])


useEffect(() => {
    const textarea = document.getElementById("send-message-textarea");
    if (!textarea) return;

    const checkHeight = () => {
      const fontSize = parseFloat(getComputedStyle(textarea).fontSize); // px
      const emToPx = 2 * fontSize; // 2em en px
      const currentHeight = textarea.scrollHeight;

      if (currentHeight >= emToPx) {
        setAlignEnd(true);
      } else {
        setAlignEnd(false);
      }
    };

    checkHeight();

    textarea.addEventListener("input", checkHeight);
    return () => textarea.removeEventListener("input", checkHeight);
  }, []);


  useEffect(()=>{

    if(message)
    {
      setMessageToReplyTo(null);
      setCreateMessageRequest((prev)=>({...prev, content: ""}));

    }
  },[message])
  async function fetchCreateMessage(){

    const formData = new FormData();
    Object.entries(createMessageRequest).forEach(([key, value]) => {
      if (value instanceof File || value === null) {

        if(value === undefined) value = null;
        if (value) formData.append(key, value);
      } else {
        formData.append(key, value as string);
      }
    });
    

    await createMessage(formData);

  }

  const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setCreateMessageRequest((prev)=>({...prev, content: e.target.value}));
  };
  
  
  

    
 

  useEffect(() => {
    setIsListening(!!activeChannels.find((ch) => ch === group?.channelId));
  }, [activeChannels, group]);

  return (
    <div
      className={` ${(loading || !group || !hasPermisson) && "opacity-50"} w-full  pb-4 py-2 px-3  absolute left-0 bottom-0 flex flex-col items-center`}
    >
      {messageToReplyTo && <MessageToReply onCancelReply={()=>{setMessageToReplyTo(null)}} message={messageToReplyTo}/> }

      <div
      id={"send-message-containter"}
        className={`w-[90%] flex ${alignEnd  ? "flex-col items-end" : ""} transition-all  backdrop-blur-xl  h-fit max-h-[400px] dark:bg-neutral-950/50 bg-neutral-300/50 p-3 max-md:w-[90%] rounded-3xl border dark:border-neutral-900 border-neutral-100 gap-2 z-[30]`}
      >
          
        <div className="w-full">
          <textarea
            value={createMessageRequest.content}
            onChange={handleChange}
            id={"send-message-textarea"}
            ref={textArea}
            disabled={loading || !group || !hasPermisson}
            className=" w-full px-2 border-0 !outline-none !bg-transparent resize-none break-words break-all text-start font-normal opacity-80 text-[13px]"

            maxLength={1000}
            style={{ backgroundColor: "transparent !important", border: "0" }}
            autoCorrect="false"
            minLength={1}
            required={true}
          />
        </div>
        

          <div className="flex items-center gap-2">
              {isListening ? (
                <div className="bg-green-600 animate-pulse rounded-full size-[5px]">
                  
                </div>
              ) : (
                <div className="bg-red-600 rounded-full size-[5px]">
                  
                </div>
              )}

              {loading || creatingMessage ? (
                <Spinner size="sm" variant="spinner" />
              ) : (
                <IconButton  disabled={(createMessageRequest.content.length < 1 && createMessageRequest.content.length > 1000) || creatingMessage } onClick={() => {fetchCreateMessage()}} tooltipText="Send">
                  <motion.div
                    key="send-icon"
                    whileHover={{ rotate: -40 }}
                    animate={{ rotate: 0 }}
                    exit={{ rotate: 40 }}
                    className="flex  relative"
                  >
                    <ArrowRight className="size-[16px] " />
                  </motion.div>
                </IconButton>
              )}
          </div>
         
        
         
         
    
      </div>
    </div>
  );
}


const MessageToReply = ({message, onCancelReply}:{message: MessageResponse, onCancelReply: ()=>void}) =>(
<div className="w-[90%]  flex justify-center px-1">
<motion.div
  key={"message-to-reply-div"}
  initial={{y: "30px", opacity: 0}}
  animate={{y: "10px", opacity: 1}}

  className="w-full bg-neutral-100 dark:bg-neutral-900 backdrop-blur-md z-[30] rounded-t-xl p-3 items-center   pb-[20px] flex justify-between gap-2">
       <p className="text-[13px] line-clamp-2 font-normal whitespace-pre-line  text-ellipsis overflow-hidden "><span className="text-blue-600">Replying to @{message.senderUsername}:</span> {message.content}</p>
       <IconButton onClick={onCancelReply} tooltipText="Cancel reply">
        <X size={14}/>
       </IconButton>
  </motion.div>
</div>
  
)