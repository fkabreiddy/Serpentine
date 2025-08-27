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
import { useGlobalDataStore } from "@/contexts/global-data-context";
import { group } from "console";
import {
  
  parseDateTime,
} from "@internationalized/date";
import { useDateHelper } from "@/helpers/relative-date-helper";

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

  const {createOrUpdateGroupAccess, creatingOrUpdatingGroupAccess} = useCreateOrUpdateGroupAccess();
  const [lastReadMessageDate, setLastReadMessageDate] = useState<string | null>(null)
  const {deletedMessageId, setDeletedMessageId} = useGlobalDataStore();
  const {user} = useAuthStore();
  const [isMounted, setIsMounted] = useState<boolean>(false);
  const { activeChannelsHub } = useActiveChannelsHubStore();
  const firstRender = useRef(false);

  const [unreadMessagesCount, setUnreadMessagesCount] = useState<number>(0);
  const creatingOrUpdatingAccess = useRef<boolean | null>(null);
  const observerRef = useRef<IntersectionObserver | null>(null);
  const lastElementRef = useRef<HTMLDivElement | null>(null);
  const [isScrolleableToBottom,  setIsScrolleableToBottom] = useState(false);
  const messagesContainerRef = useRef<HTMLElement | null>(null);

  const {playSubmit} = useUiSound();
  const {getDate} = useDateHelper();

  async function fetchCreateOrUpdateGroupAccess() {

    if(!groupId) return;

    await createOrUpdateGroupAccess({
      groupId: groupId,
      lastReadMessageDate: lastReadMessageDate,
    });
  }

  function handleMessageRead(message: MessageResponse){

    setLastReadMessageDate(message.createdAt);
  }

  useEffect(() => {
      if(lastAccess)
      {
          setLastReadMessageDate(lastAccess.lastReadMessageDate);
          console.log("Date setted: ", new Date(lastAccess.lastReadMessageDate));

      }

      return()=>{
        fetchCreateOrUpdateGroupAccess();
      }
  }, [lastAccess]);

  useEffect(()=>{

    if(lastReadMessageDate && messages)
    {
      console.log("From parent: ", lastReadMessageDate);
        setUnreadMessagesCount(messages.filter(m => m.createdAt > lastReadMessageDate).length);
    }
  },[lastReadMessageDate, messages.length])






  function scrollToLastUnreadMessage(){

    if(!lastReadMessageDate) return;
    const message = [...messages.filter(m => m.createdAt >= lastReadMessageDate)].reverse()

    if(message.length >= 1)
    {
      const element = document.getElementById(message[0].id.toString() + "-message-bubble-id");

      if(element)
      {
        element.scrollIntoView({
          behavior: "smooth", // animación suave
          block: "center"   
        })
      }
    }
  }

  useEffect(() => {
    if (!deletedMessageId) return;

    setMessages((prev) =>
      prev.filter((m) => m.id !== deletedMessageId)
    );

    setDeletedMessageId(null);
  }, [deletedMessageId]);

  const fetchMessages = async () => {
    if (!groupId) return;

    await getMessagesByGroupId({
      groupId: groupId,
      take: 15,
      skip: messages?.length,
    });
  };

  
  

  useEffect(() => {

    creatingOrUpdatingAccess.current = creatingOrUpdatingGroupAccess;
  },[creatingOrUpdatingGroupAccess])

  

  


  useEffect(()=>{

    if(firstRender.current || !isMounted ) return;

    firstRender.current = true;
    fetchMessages();
  },[isMounted]);

  useEffect(() => {
    setIsMounted(true);
  }, []);

   
  

  const scrollToBottom = useCallback(() => {

    const container = document.getElementById("messages-container");
    if (container) {
      container.scrollTo({
        top: container.scrollHeight,
        behavior: "smooth"
      });
    }
  }, []);



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

      console.log(result.data);
      setMessages((prev) => ([ result.data as MessageResponse, ...prev]));
      
     
      playSubmit();
    },[groupId]);



    
    
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
                
                {unreadMessagesCount >= 1 && <NewUnseenMessage onClick={scrollToLastUnreadMessage} unseenMessages={unreadMessagesCount}/>}

                {messages.map((message, idx) => {
                    const isLast = idx === messages.length - 1;
                   
                    return (
                        <div
                        ref={isLast ? observeLastElement : null}
                        className="w-full"
                        key={message.id.toString()}
                        >
                            <MessageBubble lastReadMessageDate={lastReadMessageDate ?? ""} index={idx} onReaded={handleMessageRead}  userId={user?.id ?? ""} isOwner={channelMember.isOwner} isAdmin={channelMember.isAdmin} message={message} />
                            {idx > 0 && getDate(messages[idx - 1].createdAt).day !==  getDate(messages[idx].createdAt).day && <MessageDateDivider date={messages[idx - 1].createdAt}/> }
                        </div>
                    );
                })}

                <>
                  {fetchingMessages && <Spinner size="sm" variant="spinner"/>}
                    {!fetchingMessages && !hasMore && messages.length <= 0 &&
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

  date: string
}

function MessageDateDivider({date}:MessageDateDividerProps){
  const {getDate} = useDateHelper();

  const monthNames = [
  'January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December'
];
  return(

    <div className="flex gap-3 w-full items-center opacity-60">
      <hr className="w-full  border-neutral-300 dark:border-neutral-800"/>
      <p className="text-[13px] whitespace-nowrap"> {monthNames[getDate(date).month]} {getDate(date).day}, {getDate(date).year}</p>
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