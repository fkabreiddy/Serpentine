import { motion } from "motion/react";
import MessageBubble from "./message-bubble";
import { Button, CalendarDate, ScrollShadow, spinner, Spinner } from "@heroui/react";
import { useActiveChannelsHubStore } from "@/contexts/active-channels-hub-context.ts";
import { useCallback, useEffect, useRef, useState } from "react";
import { MessageResponse } from "@/models/responses/message-response.ts";
import { HubResult } from "@/models/hub-result";
import { useGetCountUnreadMessages, useGetMessagesByGroupId } from "@/hooks/message-hooks";
import { useAuthStore } from "@/contexts/authentication-context";
import { ChannelMemberResponse } from "@/models/responses/channel-member-response";
import { useUiSound } from "@/helpers/sound-helper";
import { ArrowDown, MessageCircle } from "lucide-react";
import { GroupAccessResponse } from "@/models/responses/group-access-response";
import { useCreateOrUpdateGroupAccess } from "@/hooks/group-access-hooks";
import { useGlobalDataStore } from "@/contexts/global-data-context";
import { useDateHelper } from "@/helpers/relative-date-helper";
import { CalendarDateTime, parseDateTime, parseZonedDateTime, ZonedDateTime } from "@internationalized/date";


interface MessagesContainerProps {
  
}
export default function MessagesContainer({
  groupId,
  channelMember,
  lastAccess,
  onNoMessagesAfter
}: {groupId: string;
  channelMember: ChannelMemberResponse;
  lastAccess: GroupAccessResponse | null;
  onNoMessagesAfter: (value: boolean) => void;
}) {

  const containerRef = useRef<HTMLDivElement>(null);

  const {
    messages,
    setMessages,
    hasMoreBefore,
    hasMoreAfter,
    fetchingMessages,
    getMessagesByGroupId,
    getMessagesByGroupIdIsAvailable,
    
  } = useGetMessagesByGroupId();

  const { createOrUpdateGroupAccess, creatingOrUpdatingGroupAccess } =
    useCreateOrUpdateGroupAccess();
  const [lastReadMessageDate, setLastReadMessageDate] = useState<string | null>(
    null
  ); //leave this to a track the client state, the server state is in the lastAccess prop


    const {unreadMessagesCount, getCountUnreadMessages, setUnreadMessagesCount} = useGetCountUnreadMessages();
  
  const { deletedMessageId, setDeletedMessageId } = useGlobalDataStore();
  const { user } = useAuthStore();
  const [isMounted, setIsMounted] = useState<boolean>(false);
  const { activeChannelsHub } = useActiveChannelsHubStore();
  const firstRender = useRef(true);
  const lastGroupIdRef = useRef<string>("");
  const lastReadMessageDateRef = useRef<string | null>(null);
  const {getDate} = useDateHelper();
  const [fetchAfterPerformed, setFetchAfterPerformed] = useState(false);
  const creatingOrUpdatingAccess = useRef<boolean | null>(null);
  const observerRefTop = useRef<IntersectionObserver | null>(null);
  const observerRefBottom = useRef<IntersectionObserver | null>(null);
  const lastElementRef = useRef<HTMLDivElement | null>(null);
  const hasMoreAfterRef = useRef<boolean>(hasMoreAfter);
  const { playSubmit } = useUiSound();


  async function fecthGetUnreadMessagesCount(groupId: string){
      await getCountUnreadMessages({groupId: groupId});
  }

  
  async function fetchCreateOrUpdateGroupAccess() {
    if (!groupId) return;


    const data = {
      groupId: lastGroupIdRef.current,
      lastReadMessageDate: lastReadMessageDateRef.current ,
    }

    await createOrUpdateGroupAccess(data);
  }

  
  

  function handleMessageDateUpdated(date: string) {

    setLastReadMessageDate(date);
    lastReadMessageDateRef.current = date;
  }


  const fetchMessagesBefore = async () => {
    if (!groupId) return;

    new Promise<void>((resolve) => setTimeout(resolve, 2000));
    await getMessagesByGroupId({
      groupId: groupId,
      take: 15,
      after: false,
      indexDate: messages[messages.length - 1]?.createdAt ?? null,
      skip: messages?.length,
    });
  };


  const fetchMessagesAfter = async () => {
   
  
    if(!containerRef.current ) return

    containerRef.current.scrollTop = containerRef.current.scrollTop - 50;
    if (!groupId) return;

    new Promise<void>((resolve) => setTimeout(resolve, 2000));
    await getMessagesByGroupId({
      groupId: groupId,
      take: 15,
      after: true,
      indexDate: messages[0]?.createdAt ?? null,
      skip: messages?.length,
    });

    setFetchAfterPerformed(true);
   
  };

  const observeTop = useCallback(
    (node: HTMLDivElement | null) => {
      if (fetchingMessages || !getMessagesByGroupIdIsAvailable) return;
      if (observerRefTop.current) observerRefTop.current.disconnect();

      observerRefTop.current = new IntersectionObserver((entries) => {
        if (entries[0].isIntersecting && hasMoreBefore) {
          fetchMessagesBefore();
        }
      });

      if (node) observerRefTop.current.observe(node);
      lastElementRef.current = node;
    },
    [fetchingMessages, hasMoreBefore, fetchMessagesBefore]
  );

  const observeBottom = useCallback(
    (node: HTMLDivElement | null) => {
      if (fetchingMessages || !getMessagesByGroupIdIsAvailable) return;

      if (observerRefBottom.current) observerRefBottom.current.disconnect();

      observerRefBottom.current = new IntersectionObserver((entries) => {
        if (entries[0].isIntersecting && hasMoreAfter) {
          fetchMessagesAfter();
        }
      });

      if (node) observerRefBottom.current.observe(node);
      lastElementRef.current = node;
    },
    [fetchingMessages, hasMoreAfter, fetchMessagesAfter]
  );

  //effects

  useEffect(()=>{

    if(groupId !== lastGroupIdRef.current && lastGroupIdRef.current !== ""){

      fetchCreateOrUpdateGroupAccess();

    }

    

    return()=>{

      fetchCreateOrUpdateGroupAccess();
    }
  },[groupId]);

  useEffect(()=>{

    if(fetchAfterPerformed && !hasMoreAfter && lastReadMessageDate === messages[0]?.createdAt){

      setUnreadMessagesCount(0);
    }

  },[fetchAfterPerformed, hasMoreAfter, lastReadMessageDate])

  useEffect(()=>{

    hasMoreAfterRef.current = hasMoreAfter;
    
  },[hasMoreAfter])

  //main flow
  //1. mount component and set the effect so the lastAccess is created once the component is unmounted

  useEffect(() => {
    setIsMounted(true);
    lastGroupIdRef.current = groupId;
  }, []);

 

  useEffect(() => {
    if (lastAccess) {
      setLastReadMessageDate(lastAccess.lastReadMessageDate);
      lastReadMessageDateRef.current = lastAccess.lastReadMessageDate;

    }
  }, [lastAccess]);

  //2. first we need to do the first fetch of messages. We need to especify is there is a last seen message.
  //if there is we shall fetch messages before that date, if not, it means the user is entering for the first time
  //by default the lastReadMessageDate is set as the date the user first entered the group. Btw, we need to check nullability of the access itself
  useEffect(() => {
    if (!firstRender.current || !isMounted) return; //always check if its first render to avoid re-rendering problems

    firstRender.current = false;

    const firstFetch = async () => {

      await getMessagesByGroupId({
        groupId: groupId,
        take: 15,
        after: false,
        indexDate: lastAccess?.lastReadMessageDate ?? null, // this can be null btw
        skip: messages?.length, // this is unecesary
      });

      

    };

    

    firstFetch();
    fecthGetUnreadMessagesCount(groupId);
  }, [isMounted]);

  //other effects

  

  useEffect(() => {
    if (!deletedMessageId) return;

    setMessages((prev) => prev.filter((m) => m.id !== deletedMessageId));

    setDeletedMessageId(null);
  }, [deletedMessageId]);

  useEffect(() => {
    creatingOrUpdatingAccess.current = creatingOrUpdatingGroupAccess;
  }, [creatingOrUpdatingGroupAccess]);

  const handleMessageRecieved = useCallback(
    (result: HubResult<MessageResponse>) => {
      if (!result.data || hasMoreAfterRef.current) return;

      if (result.data.groupId !== groupId) return;

      result.data.recievedInChat = true;
      setMessages((prev) => [result.data as MessageResponse, ...prev]);

      playSubmit();
    },
    [groupId, hasMoreAfter]
  );

  useEffect(() => {
    if (!activeChannelsHub) return;

    activeChannelsHub.on("SendMessage", handleMessageRecieved);

    return () => {
      activeChannelsHub.off("SendMessage", handleMessageRecieved);
    };
  }, []);
  

  return (

    
    <motion.div ref={containerRef} style={{ height: "calc(100vh - 136px)" }} className="flex w-full  mt-[76px] flex-col-reverse items-center max-w-full   h-full overflow-y-auto   ">
      <div
        
        className=" flex flex-col-reverse h-fit w-[90%] pb-[40px]    "
        
      > 
        {unreadMessagesCount > 0 && <UnreadMessagesCountBanner date={lastAccess?.lastReadMessageDate ?? new Date().toString()} count={unreadMessagesCount} />}
        {messages.map((message, idx) => {

          
          const nextMessageHasTheSameSenderAndDate = idx < messages.length - 1 && message.senderId === messages[idx + 1].senderId;
          const prevMessageHasTheSameSenderAndDate = idx > 0  && message.senderId === messages[idx - 1].senderId;

          return (
            
            <div className="w-full " key={message.id + "-wrapper"}>
              {idx < messages.length - 1 &&
                getDate(messages[idx + 1].createdAt).day !==
                  getDate(messages[idx].createdAt).day && (
                  <MessageDateDivider date={messages[idx].createdAt} />
                )}
              {
                idx < messages.length - 1 &&
                lastAccess &&
                !message.recievedInChat &&
                messages[idx + 1].createdAt <= lastAccess.lastReadMessageDate && 
                message.createdAt > lastAccess.lastReadMessageDate &&
                <UnreadMessagesDivider date={lastAccess.lastReadMessageDate}/>
                
              }
              {(idx === 0 && hasMoreAfter && !fetchingMessages && getMessagesByGroupIdIsAvailable) && <div className="w-full " ref={observeBottom}></div>}
              <MessageBubble
               nextMessageHasTheSameSenderAndDate={nextMessageHasTheSameSenderAndDate}
               prevMessageHasTheSameSenderAndDate={prevMessageHasTheSameSenderAndDate}
                lastReadMessageDate={lastReadMessageDate ?? ""}
                index={idx}
                onLastMessageDateUpdated={handleMessageDateUpdated}
                userId={user?.id ?? ""}
                isOwner={channelMember.isOwner}
                isAdmin={channelMember.isAdmin}
                message={message}
              />
             
                
              

              {(idx === messages.length - 1 && hasMoreBefore && !fetchingMessages && getMessagesByGroupIdIsAvailable) &&(
              
              
                <div className="w-full " ref={observeTop}></div>
              )}

            </div>
          );

        })}


        {fetchingMessages && (
          <div className="h-full w-full flex flex-col items-center justify-center">
            <Spinner size="sm" variant="spinner" />
          </div>
        )}
        {!fetchingMessages && !hasMoreBefore && messages.length <= 0 && (
          <div className="h-full w-full flex flex-col items-center justify-center">
            <MessageCircle size={30} />
            <label>Start the conversation</label>
          </div>
        )}
      </div>
    </motion.div>
  );
}



function MessageDateDivider({ date }: {date: string}) {
  const { getDate } = useDateHelper();

  const monthNames = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ];
  return (
    <div className="flex gap-3 w-full items-center opacity-60">
       <div className="flex  w-full items-center justify-end ">
          <hr className="w-[30px] border-2 border-neutral-300 rounded-l-full dark:border-neutral-800" />
          <p className="text-[13px] whitespace-nowrap bg-neutral-300 dark:bg-neutral-800  px-2 rounded-md">
            {" "}
            {monthNames[getDate(date).month - 1]} {getDate(date).day},{" "}
            {getDate(date).year}
          </p>
      </div>
    </div>
  );
}

const UnreadMessagesDivider = ({date}:{date: string}) => {
  const { getDate } = useDateHelper();

  const monthNames = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ];
  return (
    <div className="flex  w-full items-center justify-end">
      <hr className="w-[30px] border-2 border-blue-600 rounded-l-full " />
      <p className="text-[13px] whitespace-nowrap bg-blue-600  px-2 rounded-md"> New since
        {" "}
        {monthNames[getDate(date).month - 1]} {getDate(date).day},{" "}
        {getDate(date).year}  at {getDate(date).hour}:{getDate(date).minute}
      </p>
    </div>
  );};


const UnreadMessagesCountBanner = ({count, date}: {count: number, date: string})=>{

  return(

    <div className="absolute px-3 py-2 flex items-center justify-between  w-full bg-pink-500/50 backdrop-blur-md z-[30] left-[0] text-white h-fit top-[76px]">
      <p className="text-xs">You have {count} unread messages since {new Date(date).toDateString()}, {new Date(date).getHours()}:{new Date(date).getMinutes()}  </p>
    </div>
  )
}
