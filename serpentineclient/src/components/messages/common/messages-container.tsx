import { motion } from "motion/react";
import MessageBubble from "./message-bubble";
import { ScrollShadow, spinner, Spinner } from "@heroui/react";
import { useActiveChannelsHubStore } from "@/contexts/active-channels-hub-context.ts";
import { useCallback, useEffect, useRef, useState } from "react";
import { MessageResponse } from "@/models/responses/message-response.ts";
import { HubResult } from "@/models/hub-result";
import { useGetMessagesByGroupId } from "@/hooks/message-hooks";
import { useAuthStore } from "@/contexts/authentication-context";
import { ChannelMemberResponse } from "@/models/responses/channel-member-response";
import { channel } from "diagnostics_channel";
import { useUiSound } from "@/helpers/sound-helper";
import { MessageCircle } from "lucide-react";

interface MessagesContainerProps {
  groupId: string;
  channelMember: ChannelMemberResponse;
}
export default function MessagesContainer({ groupId, channelMember }: MessagesContainerProps) {
  const {
    messages,
    setMessages,
    hasMore,
    fetchingMessages,
    getMessagesByGroupId,
  } = useGetMessagesByGroupId();

  const {user} = useAuthStore();
  const [isMounted, setIsMounted] = useState<boolean>(false);
  const { activeChannelsHub } = useActiveChannelsHubStore();
  const firstRender = useRef(false);
  const observerRef = useRef<IntersectionObserver | null>(null);
  const lastElementRef = useRef<HTMLDivElement | null>(null);
  const {playSubmit} = useUiSound();

  const fetchMessages = async () => {
    if (!groupId) return;

    await getMessagesByGroupId({
      groupId: groupId,
      take: 15,
      skip: messages?.length,
    });
  };

  useEffect(()=>{

    if(!groupId) return;
    
    setIsMounted(true);

  },[groupId])


  useEffect(()=>{

    if(firstRender.current || !isMounted ) return;

    firstRender.current = true;
    fetchMessages();
  },[isMounted])



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

      setMessages((prev) => [ result.data as MessageResponse, ...prev]);
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
    <motion.div className="flex justify-center pt-[60px]  pb-[120px] w-full  h-full ">

        {!isMounted ? 
            <Spinner size="sm" variant="spinner"/> :
            <ScrollShadow className="w-[70%] flex-col-reverse flex pb-[10px] max-md:w-[90%] overflow-scroll  ">
                {messages.map((message, idx) => {
                    const isLast = idx === messages.length - 1;

                    return (
                        <div
                        ref={isLast ? observeLastElement : null}
                        className="w-full"
                        key={message.id.toString()}
                        >
                            <MessageBubble userId={user?.id ?? ""} isOwner={channelMember.isOwner} isAdmin={channelMember.isAdmin} message={message} />
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
        }
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