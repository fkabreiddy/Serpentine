import IconButton from "@/components/common/icon-button";
import UserAvatar from "@/components/users/common/user-avatar";
import { useDateHelper } from "@/helpers/relative-date-helper";
import { MessageResponse } from "@/models/responses/message-response";
import { motion } from "framer-motion";
import {
  BellIcon,
  EditIcon,
  InfoIcon,
  MessageCircleIcon,
  MessageCircleWarningIcon,
  MoreVertical,
  ReplyIcon,
  TrashIcon,
} from "lucide-react";
import { ReactNode, useCallback, useEffect, useRef, useState } from "react";
import Stack from "./message-image-stack";
import { useDeleteMessage } from "@/hooks/message-hooks";
import CustomDialog from "@/components/common/custom-dialog";
import { useIntersection } from "@/helpers/use-intersection-helper";
import { parseDateTime, parseZonedDateTime } from "@internationalized/date";
import { parse } from "path";
import {
  Dropdown,
  DropdownItem,
  DropdownMenu,
  DropdownSection,
  DropdownTrigger,
} from "@heroui/dropdown";
import { useAuthStore } from "@/contexts/authentication-context";



type MessageBubbleProps = {
  message: MessageResponse;
  withImage?: boolean;
  isAdmin: boolean;
  isOwner: boolean;
  userId: string;
  index: number;
  lastReadMessageDate: string;
  onReaded: (message: MessageResponse) => void;
};

export default function MessageBubble({
  message,
  lastReadMessageDate,
  isAdmin = false,
  isOwner = false,
  userId = "",
  index = 0,
  withImage,
  onReaded,
}: MessageBubbleProps) {


    const [openDropdown, setOpenDropdown] = useState(false);
    function handleOnReaded(message: MessageResponse) {
      onReaded(message);
    }

  return (
   <MessageDropdown open={openDropdown} openChanged={setOpenDropdown} userId={userId} message={message} isOwner={isOwner} isAdmin={isAdmin}>
     <MessageBubbleCard openDropdown={()=>{setOpenDropdown(true)}} onReaded={handleOnReaded} index={index} message={message}  lastReadMessageDate={lastReadMessageDate}/>
   </MessageDropdown>
  );
}



type MessageBubbleCardProps = {
  message: MessageResponse;
  withImage?: boolean;
  index: number;
  openDropdown: () => void;
  lastReadMessageDate: string;
  onReaded: (message: MessageResponse) => void;
};

const MessageBubbleCard = ({
  message,
  lastReadMessageDate,
  withImage,
  openDropdown,
  onReaded,
}: MessageBubbleCardProps) => {
  const { getDate } = useDateHelper();

  const [clicked, setClicked] = useState(false);
  const [images, setImages] = useState<string[]>([]);

  const [showMoreContent, setShowMoreContent] = useState(false);
  const messageBubbleRef = useRef<HTMLDivElement | null>(null);
  const isVisible = useIntersection(messageBubbleRef, "0px");

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      const container = document.getElementById(
        message.id.toString() + "-message-bubble-id"
      );
      if (container && !container.contains(event.target as Node)) {
        setClicked(false); // clic fuera → cerrar
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [message]);

  useEffect(() => {
    if (isVisible) {
      if (message.createdAt > lastReadMessageDate) {
        console.log("Marking message as read: ", message.id);
        onReaded(message);
      }
    }
  }, [lastReadMessageDate, isVisible]);

  return (
    <motion.div
      ref={messageBubbleRef}
      key={message.id.toString() + "-message-bubble"}
      id={message.id.toString() + "-message-bubble-id"}
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      
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
      className={`w-full transition-all flex gap-3 items-start group  ${clicked ? "bg-neutral-100 dark:bg-neutral-950" : "hover:bg-neutral-100/50 hover:dark:bg-neutral-950/50"} p-3 rounded-lg`}
    >
      {message.isNotification ? (
        <div className="size-[28px] shrink-0 bg-yellow-500 text-white  rounded-full flex justify-center items-center">
          <MessageCircleIcon className="size-[16px] fill-white" />
        </div>
      ) : (
        <UserAvatar
          src={message?.senderProfilePictureUrl ?? ""}
          userNameFallback={message?.senderUsername ?? "fka.breiddy"}
        />
      )}
      <div className="w-full flex flex-col items-start gap-1">
        <div className={"w-full flex gap-3 items-start opacity-50"}>
          {!message.isNotification ? (
            <strong className="text-[13px] font-normal ">
              @{message?.senderUsername}
            </strong>
          ) : (
            <div className="dark:bg-neutral-900 bg-neutral-200 rounded-md px-2 text-[12px]">
              Notification
            </div>
          )}
          <label className="text-[13px] font-normal ">
            {getDate(message.createdAt).hour}:
            {getDate(message.createdAt).minute}
          </label>
        </div>

        {withImage && (
          <div className="relative h-[180px] w-[180px] py-2 ">
            {images.map((image, index) => (
              <MessageImage
                lenght={images.length}
                src={image}
                index={index}
                key={index}
              />
            ))}
          </div>
        )}
        <p
          className={` w-full text-start font-normal opacity-80 text-[13px] whitespace-pre-line  text-ellipsis overflow-hidden ${showMoreContent ? "" : "line-clamp-3"}`}
        >
          {message.content}
        </p>

        {message.content.length >= 100 && (
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
}




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
  userId: string
  open: boolean;
  openChanged:(value: boolean)=>void;
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

  async function fetchDelete() {
    await deleteMessage({ messageId: message.id });
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
              {getDate(message.createdAt).day}/{getDate(message.createdAt).year}
            </p>
          </DropdownItem>
        </DropdownSection>

        <DropdownSection  title={"Actions"}>
          <>
            {!message.isNotification && (
              <DropdownItem key="reply" endContent={<ReplyIcon size={16} />}>
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
              <DropdownItem color="danger" key="edit" endContent={<TrashIcon size={16} />}>
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
