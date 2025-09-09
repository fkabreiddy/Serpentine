import UserAvatar from "@/components/users/common/user-avatar";
import { useDateHelper } from "@/helpers/relative-date-helper";
import { MessageResponse } from "@/models/responses/message-response";
import { motion } from "framer-motion";
import {
  InfoIcon,
  MessageCircleIcon,
  MessageCircleWarningIcon,
  ReplyIcon,
  TrashIcon,
} from "lucide-react";
import { ReactNode, useCallback, useEffect, useRef, useState } from "react";
import { useDeleteMessage } from "@/hooks/message-hooks";
import CustomDialog from "@/components/common/custom-dialog";
import { useIntersection } from "@/helpers/use-intersection-helper";
import {
  Dropdown,
  DropdownItem,
  DropdownMenu,
  DropdownSection,
  DropdownTrigger,
} from "@heroui/dropdown";
import { useGlobalDataStore } from "@/contexts/global-data-context";
import { useIsMobile } from "@/hooks/use-mobile";

export default function MessageBubble({
  message,
  lastReadMessageDate,
  isAdmin = false,
  isOwner = false,
  userId = "",
  index = 0,
  nextMessageHasTheSameSenderAndDate,
  prevMessageHasTheSameSenderAndDate,
  onLastMessageDateUpdated,
}: {
  message: MessageResponse;
  nextMessageHasTheSameSenderAndDate: boolean;
  prevMessageHasTheSameSenderAndDate: boolean;
  isAdmin: boolean;
  isOwner: boolean;
  userId: string;
  index: number;
  lastReadMessageDate: string;
  onLastMessageDateUpdated: (date: string) => void;
}) {
  const [openDropdown, setOpenDropdown] = useState(false);
  function handleLastMessageDateUpdated(date: string) {
    onLastMessageDateUpdated(date);
  }

  return (
    <MessageDropdown
      open={openDropdown}
      openChanged={setOpenDropdown}
      userId={userId}
      message={message}
      isOwner={isOwner}
      isAdmin={isAdmin}
    >
      <MessageBubbleCard
        openDropdown={() => {
          setOpenDropdown(true);
        }}
        prevMessageHasTheSameSenderAndDate={prevMessageHasTheSameSenderAndDate}
        nextMessageHasTheSameSenderAndDate={nextMessageHasTheSameSenderAndDate}
        onUpdateLastSeenMessageDate={handleLastMessageDateUpdated}
        index={index}
        message={message}
        lastReadMessageDate={lastReadMessageDate}
      />
    </MessageDropdown>
  );
}

const MessageBubbleCard = ({
  message,
  lastReadMessageDate,
  withImage,
  openDropdown,
  prevMessageHasTheSameSenderAndDate,
  nextMessageHasTheSameSenderAndDate,
  onUpdateLastSeenMessageDate,
}: {
  message: MessageResponse;
  withImage?: boolean;
  prevMessageHasTheSameSenderAndDate:boolean;
  nextMessageHasTheSameSenderAndDate: boolean;
  index: number;
  openDropdown: () => void;
  lastReadMessageDate: string;
  onUpdateLastSeenMessageDate: (date: string) => void;
}) => {
  const { getDate } = useDateHelper();

  const [clicked, setClicked] = useState(false);
  const isMobile = useIsMobile()
  const parragraphContentRef = useRef<HTMLParagraphElement | null>(null);
  const [showMoreContent, setShowMoreContent] = useState(false);
    const [showMoreButton, setShowMoreButton] = useState(false);
  const messageBubbleRef = useRef<HTMLDivElement | null>(null);
  const isVisible = useIntersection(message.id + "-message-bubble-id", "0px");

  
useEffect(() => {
  if (!parragraphContentRef.current) return;

  
  setShowMoreButton(parragraphContentRef.current.clientHeight >= 40);
}, [message.content, parragraphContentRef, isMobile]);

  useEffect(() => {
    if (isVisible && message.createdAt > lastReadMessageDate) {
      onUpdateLastSeenMessageDate(message.createdAt);
    }
  }, [isVisible]);

  const isTheSameSender = nextMessageHasTheSameSenderAndDate;

  return (
    <motion.div
      ref={messageBubbleRef}
      key={message.id.toString() + "-message-bubble"}
      id={message.id.toString() + "-message-bubble-id"}
      onClick={(e) => {
        e.stopPropagation();
        setClicked(false);
        openDropdown();
      }}
      onContextMenu={(e) => {
        e.stopPropagation();
        e.preventDefault();
        openDropdown();
      }}
      className={`w-full max-w-full  group min-h-[30px]   transition-all flex gap-3 items-stretch group  ${clicked ? "bg-neutral-100 dark:bg-neutral-950" : "hover:bg-neutral-100/50 hover:dark:bg-neutral-950/50"} ${nextMessageHasTheSameSenderAndDate ? "pt-0" : "pt-3"} ${prevMessageHasTheSameSenderAndDate ? "pb-0" : "pb-3"} px-3 rounded-lg`}
    >
      <div className="relative flex justify-center  w-[25px] mr-[12px] ">
      
      {isTheSameSender ? 
            <>
              <div className="absolute top-1/2 -translate-y-1/2  dark:bg-neutral-950 bg-neutral-300  group-hover:flex hidden rounded-full px-2  items-center justify-center transition-all">
                <label className="text-[10]">{getDate(message.createdAt).hour}:{getDate(message.createdAt).minute}</label>

              </div>
             <div className="dark:border-neutral-950 border-neutral-300  border-2 h-full  "/> 

            </>
            :
              <>
            
                {message.isNotification ? (
                  <div className="size-[28px] shrink-0 bg-yellow-500 text-white rounded-full flex justify-center items-center">
                    <MessageCircleIcon className="size-[16px] fill-white" />
                  </div>
                ) : (
                  <UserAvatar
                    src={message?.senderProfilePictureUrl ?? ""}
                    userNameFallback={message?.senderUsername ?? "fka.breiddy"}
                  />
                )}
              </>
            }
      </div>
     
      
      <div  className={`w-full  flex flex-col items-start gap-1 ${isTheSameSender && ""}`}>
        <div className={"w-full   flex gap-3 items-start opacity-50   "}>
          
          {isTheSameSender || <>
          
            {!message.isNotification ? (
               <strong className="text-[13px] font-normal ">
                  @{message?.senderUsername}
                </strong>
              ) : (
                <div className="dark:bg-neutral-900 bg-neutral-200 rounded-md px-2 text-[12px]">
                  Notification
                </div>
              )}

               <label className={`text-[13px] font-normal ${isTheSameSender && "hidden group-hover:block"}`}>
                {getDate(message.createdAt).hour}:
                {getDate(message.createdAt).minute}
              </label>
          </>}
        


         
        </div>
        {message.parentId && (
          <ParentMessage
            content={message.parentContent ?? ""}
            senderUsername={message.senderUsername ?? ""}
          />
        )}
        <p
          ref={parragraphContentRef}
          className={`break-words break-all text-start font-normal opacity-80 text-[13px] my-2 ${showMoreContent ? "" : "line-clamp-3"}`}
        >
          {message.content}
        </p>
        {showMoreButton && (
          <a
            className="text-blue-500 text-xs cursor-pointer"
            onClick={(e) => {
              e.stopPropagation();
              setShowMoreContent(!showMoreContent);
            }}
          >
            {showMoreContent ? "Show less..." : "Show more..."}
          </a>
        )}
      </div>
    </motion.div>
  );
};

interface MessageImageProps {
  src: string;
  lenght: number;
  index: number;
}
const MessageImage = ({ src, index, lenght }: MessageImageProps) => {
  return (
    <motion.div
      key={index.toString() + "img"}
      animate={{
        rotateZ: index === lenght - 1 ? 0 : (7 + length - index) * -1,
        x: 0,
      }}
    >
      <img
        src={src}
        className="w-[150px] absolute rounded-lg h-[150px] object-fill cursor-pointer"
      />
    </motion.div>
  );
};

interface MessageDropdownProps {
  message: MessageResponse;
  isOwner: boolean;
  isAdmin: boolean;
  children: ReactNode;
  userId: string;
  open: boolean;
  openChanged: (value: boolean) => void;
}

const MessageDropdown = ({
  message,
  userId,
  children,
  isOwner,
  isAdmin,
  open,
  openChanged,
}: MessageDropdownProps) => {
  const { getDate } = useDateHelper();
  const { deleteMessage, deletingMessage } = useDeleteMessage();
  const [showConfirmationDialog, setShowConfirmationDialog] = useState(false);
  const { setMessageToReplyTo } = useGlobalDataStore();

  async function fetchDelete() {
    await deleteMessage({ messageId: message.id });
  }

  function handleRepliedMessageChanged(message: MessageResponse | null) {
    setMessageToReplyTo(message);
  }

  return (
    <>
      <CustomDialog
        title="Confirm Deletion"
        open={showConfirmationDialog}
        onOpenChanged={setShowConfirmationDialog}
        onDismiss={() => setShowConfirmationDialog(false)}
        onAccept={() => {
          setShowConfirmationDialog(false);
          fetchDelete();
        }}
      >
        Are you sure you want to delete this message? This action cannot be
        undone.
      </CustomDialog>
      <Dropdown
        isOpen={open}
        onOpenChange={openChanged}
        placement="bottom-end"
        showArrow={true}
        className="bg-neutral-100/50 backdrop-blur-3xl dark:bg-neutral-950/50  "
      >
        <DropdownTrigger>
          <button className="w-full flex justify-start items-start">
            {children}
          </button>
        </DropdownTrigger>
        <DropdownMenu
          disabledKeys={["divider", "divider2", "channelInf"]}
          aria-label="Channel Actions"
          variant="flat"
        >
          <DropdownSection showDivider={true} title={"About this message"}>
            <DropdownItem
              key="channelInfo"
              startContent={<InfoIcon size={16} />}
              className="h-14 gap-2"
            >
              <p className="font-semibold text-xs">
                Sent by: @{message.senderUsername}
              </p>
              <p className="font-normal text-xs opacity-60">
                {" "}
                on {getDate(message.createdAt).month}/
                {getDate(message.createdAt).day}/
                {getDate(message.createdAt).year}
              </p>
            </DropdownItem>
          </DropdownSection>

          <DropdownSection title={"Actions"}>
            <>
              {!message.isNotification && (
                <DropdownItem
                  onClick={() => {
                    handleRepliedMessageChanged(message);
                  }}
                  key="reply"
                  endContent={<ReplyIcon size={16} />}
                >
                  <p className="font-normal text-[13px]">Reply this message</p>
                </DropdownItem>
              )}
            </>

            <DropdownItem
              key="report"
              endContent={<MessageCircleWarningIcon size={16} />}
            >
              <p className="font-normal text-[13px]">Report an issue</p>
            </DropdownItem>
            <>
              {(isAdmin || isOwner || message.senderId === userId) && (
                <DropdownItem
                  color="danger"
                  key="edit"
                  onClick={fetchDelete}
                  endContent={<TrashIcon size={16} />}
                >
                  <p className="font-normal text-[13px]">Delete this message</p>
                </DropdownItem>
              )}
            </>
          </DropdownSection>
        </DropdownMenu>
      </Dropdown>
    </>
  );
};

const ParentMessage = ({
  content,
  senderUsername,
}: {
  content: string;
  senderUsername: string;
}) => (
  <div style={{width: "calc(90% - 20px)"}} className="w-full  flex gap-2 flex-nowrap ">
      <span className="text-blue-600 text-[13px] text-nowrap">Reply to @{senderUsername + ": "}</span>

      <p className="text-[13px] line-clamp-2 font-normal whitespace-pre-line  text-ellipsis overflow-hidden ">
        {content}
      </p>
  </div>
);
