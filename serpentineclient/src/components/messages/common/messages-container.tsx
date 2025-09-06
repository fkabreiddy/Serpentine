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
import { useUiSound } from "@/helpers/sound-helper";
import { ArrowDown, MessageCircle } from "lucide-react";
import { GroupAccessResponse } from "@/models/responses/group-access-response";
import { useCreateOrUpdateGroupAccess } from "@/hooks/group-access-hooks";
import { useGlobalDataStore } from "@/contexts/global-data-context";
import { useDateHelper } from "@/helpers/relative-date-helper";

interface MessagesContainerProps {
  groupId: string;
  channelMember: ChannelMemberResponse;
  lastAccess: GroupAccessResponse | null;
  unreadMessagesChanged: (count: number) => void;
}
export default function MessagesContainer({
  groupId,
  channelMember,
  lastAccess,
  unreadMessagesChanged,
}: MessagesContainerProps) {
  const {
    messages,
    setMessages,
    hasMoreBefore,
    hasMoreAfter,
    fetchingMessages,
    getMessagesByGroupId,
    getMessagesByGroupIdIsAvailable
  } = useGetMessagesByGroupId();

  const { createOrUpdateGroupAccess, creatingOrUpdatingGroupAccess } =
    useCreateOrUpdateGroupAccess();
  const [lastReadMessageDate, setLastReadMessageDate] = useState<string | null>(
    null
  ); //leave this to a track the client state, the server state is in the lastAccess prop

  const { deletedMessageId, setDeletedMessageId } = useGlobalDataStore();
  const { user } = useAuthStore();
  const [isMounted, setIsMounted] = useState<boolean>(false);
  const { activeChannelsHub } = useActiveChannelsHubStore();
  const firstRender = useRef(true);
  const lastGroupId = useRef<string>("");

  const [unreadMessagesCount, setUnreadMessagesCount] = useState<number>(0);
  const creatingOrUpdatingAccess = useRef<boolean | null>(null);
  const observerRefTop = useRef<IntersectionObserver | null>(null);
  const observerRefBottom = useRef<IntersectionObserver | null>(null);
  const lastElementRef = useRef<HTMLDivElement | null>(null);

  const { playSubmit } = useUiSound();
  const { getDate } = useDateHelper();

  

  //functions

  async function fetchCreateOrUpdateGroupAccess() {
    if (!groupId) return;

    await createOrUpdateGroupAccess({
      groupId: lastGroupId.current,
      lastReadMessageDate: lastReadMessageDate,
    });
  }

  function handleMessageDateUpdated(date: string) {
    setLastReadMessageDate(date);
  }

  useEffect(() => {
    unreadMessagesChanged(unreadMessagesCount);
  }, [unreadMessagesCount]);

  const fetchMessagesBefore = async () => {
    if (!groupId) return;

    new Promise<void>((resolve) => setTimeout(resolve, 2000));
    await getMessagesByGroupId({
      groupId: groupId,
      take: 15,
      after: false,
      indexDate: messages[messages.length - 1]?.createdAt,
      skip: messages?.length,
    });
  };

  const fetchMessagesAfter = async () => {
    if (!groupId) return;

    new Promise<void>((resolve) => setTimeout(resolve, 2000));
    await getMessagesByGroupId({
      groupId: groupId,
      take: 15,
      after: true,
      indexDate: messages[0]?.createdAt,
      skip: messages?.length,
    });
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

  //main flow
  //1. mount component and set the effect so the lastAccess is created once the component is unmounted

  useEffect(() => {
    setIsMounted(true);
    lastGroupId.current = groupId;
  }, []);

 

  useEffect(() => {
    if (lastAccess) {
      setLastReadMessageDate(lastAccess.lastReadMessageDate);
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
        indexDate: lastAccess?.lastReadMessageDate, // this can be null btw
        skip: messages?.length,
      });


    };

    firstFetch();
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
      if (!result.data) return;

      if (result.data.groupId !== groupId) return;

      console.log(result.data);

      setMessages((prev) => [result.data as MessageResponse, ...prev]);

      playSubmit();
    },
    [groupId]
  );

  useEffect(() => {
    if (!activeChannelsHub) return;

    activeChannelsHub.on("SendMessage", handleMessageRecieved);

    return () => {
      activeChannelsHub.off("SendMessage", handleMessageRecieved);
    };
  }, []);

  return (
    <motion.div className="flex justify-center pt-[60px]   pb-[70px] w-full  h-full ">
      <div
        className="relative w-[70%] max-md:w-[90%] flex flex-col-reverse overflow-auto"
        style={{ height: "calc(100vh - 130px)" }}
      >
        {messages.map((message, idx) => {
          return (
            <>
              {(idx === 0 && hasMoreAfter && !fetchingMessages && getMessagesByGroupIdIsAvailable) && <div className="w-full " ref={observeBottom}></div>}
              <MessageBubble
                lastReadMessageDate={lastReadMessageDate ?? ""}
                index={idx}
                onMessageSateChanged={(e) => setUnreadMessagesCount((prev)=>(prev + e))}
                onLastMessageDateUpdated={handleMessageDateUpdated}
                userId={user?.id ?? ""}
                isOwner={channelMember.isOwner}
                isAdmin={channelMember.isAdmin}
                message={message}
              />
              {idx < messages.length - 1 &&
                getDate(messages[idx + 1].createdAt).day !==
                  getDate(messages[idx].createdAt).day && (
                  <MessageDateDivider date={messages[idx].createdAt} />
                )}
              {(idx === messages.length - 1 && hasMoreBefore && !fetchingMessages && getMessagesByGroupIdIsAvailable) &&(
                <div className="w-full" ref={observeTop}></div>
              )}
            </>
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

interface MessageDateDividerProps {
  date: string;
}

function MessageDateDivider({ date }: MessageDateDividerProps) {
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
      <hr className="w-full  border-neutral-300 dark:border-neutral-800" />
      <p className="text-[13px] whitespace-nowrap">
        {" "}
        {monthNames[getDate(date).month - 1]} {getDate(date).day},{" "}
        {getDate(date).year}
      </p>
      <hr className="w-full  border-neutral-300 dark:border-neutral-800" />
    </div>
  );
}

const NewMessagesDivider = () => (
  <div className="flex gap-3 w-full items-center opacity-60">
    <hr className="w-full  border-blue-500 dark:border-neutral-800" />
    <p className="text-[13px] text-blue-500 whitespace-nowrap">New Messages</p>
    <hr className="w-full  border-blue-500 dark:border-neutral-800" />
  </div>
);
