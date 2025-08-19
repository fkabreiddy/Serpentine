import { motion } from "motion/react";
import MessageBubble from "./message-bubble";
import { Button, ScrollShadow, spinner, Spinner } from "@heroui/react";
import { useActiveChannelsHubStore } from "@/contexts/active-channels-hub-context.ts";
import { useCallback, useEffect, useRef, useState } from "react";
import { MessageResponse } from "@/models/responses/message-response.ts";
import { HubResult } from "@/models/hub-result";
import { useGetMessagesByGroupId } from "@/hooks/message-hooks";
import { useAuthStore } from "@/contexts/authentication-context";
import { ChannelMemberResponse } from "@/models/responses/channel-member-response";
import { channel } from "diagnostics_channel";
import { useUiSound } from "@/helpers/sound-helper";
import {ArrowDown, MessageCircle} from "lucide-react";
import { GroupAccessResponse } from "@/models/responses/group-access-response";
import { useCreateOrUpdateGroupAccess } from "@/hooks/group-access-hooks";

interface MessagesContainerProps {
  groupId: string;
  channelMember: ChannelMemberResponse;
  lastAccess: GroupAccessResponse | null; 
}
export default function MessagesContainer({ groupId, channelMember, lastAccess }: MessagesContainerProps) {
  const {
    messages,
    setMessages,
    hasMore,
    fetchingMessages,
    getMessagesByGroupId,
  } = useGetMessagesByGroupId();

  const {createOrUpdateGroupAccess} = useCreateOrUpdateGroupAccess();
  const {user} = useAuthStore();
  const [isMounted, setIsMounted] = useState<boolean>(false);
  const { activeChannelsHub } = useActiveChannelsHubStore();
  const firstRender = useRef(false);
  const observerRef = useRef<IntersectionObserver | null>(null);
  const lastElementRef = useRef<HTMLDivElement | null>(null);
  const [accessDate, setAccessDate] = useState<Date | null>(null);
  const [isScrolleableToBottom,  setIsScrolleableToBottom] = useState(false);
  const messagesContainerRef = useRef<HTMLElement | null>(null);
  const [countNewUnseenMessage, setCountNewUnseenMessage] = useState(0);
  const [thereAreUnseenMessages, setThereAreUnseenMessages] = useState<boolean>(false);

  const {playSubmit} = useUiSound();
  
  function scrollToLastUnreadMessage(){

    const message = [...messages.filter(m => m.isNewAndUnread === true)].reverse()

    if(message.length >= 1)
    {
      const element = document.getElementById(message[0].id.toString() + "-message-bubble");

      if(element)
      {
        element.scrollIntoView({
          behavior: "smooth", // animación suave
          block: "center"   
        })
      }
    }
  }

  const fetchMessages = async () => {
    if (!groupId) return;

    await getMessagesByGroupId({
      groupId: groupId,
      take: 15,
      skip: messages?.length,
    });
  };

    useEffect(() => {
        if(groupId !== null)
        {
            setAccessDate(new Date());
        }
    }, [groupId]);


    useEffect(()=>{

      if(messages)
      {
        var thereIsAnUnseenMessage  = messages.filter(m => m.isNewAndUnread === true).length >= 1;
        setThereAreUnseenMessages(thereIsAnUnseenMessage)
      }
    },[messages])
    

    

  useEffect(()=>{

    if(!groupId) return;
    
    createOrUpdateGroupAccess({groupId: groupId});
    setIsMounted(true);

    return()=>{
      createOrUpdateGroupAccess({groupId: groupId})
    }

  },[groupId])


  useEffect(()=>{

    if(firstRender.current || !isMounted ) return;

    firstRender.current = true;
    fetchMessages();
  },[isMounted]);


   
  

    


  const observeLastElement = useCallback(
    (node: HTMLDivElement | null) => {
      if (fetchingMessages) return;
      if (observerRef.current) observerRef.current.disconnect();

      observerRef.current = new IntersectionObserver((entries) => {
        if (entries[0].isIntersecting && hasMore) {
          fetchMessages();
        }
      });

      if (node) observerRef.current.observe(node);
      lastElementRef.current = node;
    },
    [fetchingMessages, hasMore, fetchMessages]
  );

   const handleMessageRecieved = useCallback((result: HubResult<MessageResponse>) => {
      if (!result.data) return;

      if (result.data.groupId !== groupId) return;

      result.data.isNewAndUnread = true;
      setMessages((prev) => [ result.data as MessageResponse, ...prev]);
      
      if(isScrolleableToBottom)
      {
          setCountNewUnseenMessage(1);
      }
      
      playSubmit();
    },[groupId]);


    function handleOnReaded( messageId: string)
    {
      
      
      setMessages((prev) => (prev.map(m => m.id === messageId ? {...m, isNewAndUnread: false} : m)))
    }

    
    
  useEffect(() => {
    if (!activeChannelsHub) return;

   

    activeChannelsHub.on("SendMessage", handleMessageRecieved);

    return () => {
      activeChannelsHub.off("SendMessage", handleMessageRecieved);
    };
  }, []);

  return (
    <motion.div className="flex justify-center pt-[60px]   pb-[120px] w-full  h-full ">

        
            <ScrollShadow id={"messages-container"} ref={messagesContainerRef} className="w-[70%]  relative flex-col-reverse  flex pb-[10px] max-md:w-[90%] overflow-scroll  ">
                
                {thereAreUnseenMessages && <NewUnseenMessage onClick={scrollToLastUnreadMessage} unseenMessages={messages.filter(m => m.isNewAndUnread === true).length}/>}

                {messages.map((message, idx) => {
                    const isLast = idx === messages.length - 1;
                     
                    return (
                        <div
                        ref={isLast ? observeLastElement : null}
                        className="w-full"
                        key={message.id.toString()}
                        >
                            <MessageBubble onReaded={handleOnReaded}  userId={user?.id ?? ""} isOwner={channelMember.isOwner} isAdmin={channelMember.isAdmin} message={message} />
                            {idx > 0 && new Date(messages[idx - 1].createdAt).getDay() !==  new Date(messages[idx].createdAt).getDay() && <MessageDateDivider date={new Date(messages[idx].createdAt)}/> }
                        </div>
                    );
                })}

                <>
                  {fetchingMessages && <Spinner size="sm" variant="spinner"/>}
                    {!fetchingMessages && messages.length <= 0 &&
                     <div className="h-full w-full flex flex-col items-center justify-center">
                      <MessageCircle size={30}/>
                      <label>Start the conversation</label>
                      </div> }
                </>
              
            </ScrollShadow>
        
    </motion.div>
  );
}

interface MessageDateDividerProps{

  date: Date
}

function MessageDateDivider({date}:MessageDateDividerProps){

  const monthNames = [
  'January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December'
];
  return(

    <div className="flex gap-3 w-full items-center opacity-60">
      <hr className="w-full  border-neutral-300 dark:border-neutral-800"/>
      <p className="text-[13px] whitespace-nowrap"> {monthNames[date.getMonth()]} {date.getUTCDate()}, {date.getFullYear()}</p>
      <hr className="w-full  border-neutral-300 dark:border-neutral-800"/>

    </div>
  )
}

const  NewMessagesDivider = () => (
<div className="flex gap-3 w-full items-center opacity-60">
            <hr className="w-full  border-blue-500 dark:border-neutral-800"/>
            <p className="text-[13px] text-blue-500 whitespace-nowrap">New Messages</p>
            <hr className="w-full  border-blue-500 dark:border-neutral-800"/>

        </div>

)

interface NewUnseenMessageProps{
    
    unseenMessages: number;
    onClick: ()=> void;
    
}
const NewUnseenMessage = ({unseenMessages, onClick}:NewUnseenMessageProps) =>(
    
    <motion.div 
    key={"scroll-to-last-unseen-message"}
    initial={{opacity: 0, bottom: -30}}
    animate={{opacity: 1, bottom: 20, transform: 1}}
    whileHover={{transform: 1.05}}
    className={"sticky w-full !cursor-pointer flex right-[0px] bottom-[20px] z-[30]"}>
        <Button onPress={()=> onClick()} size="sm" className={"  w-fit flex ml-auto items-center gap-2  rounded-xl text-[11px]  text-white bg-blue-600 p-2"}>
            {unseenMessages} new messages
            <ArrowDown size={13}/>
        </Button>
    </motion.div>
  
)