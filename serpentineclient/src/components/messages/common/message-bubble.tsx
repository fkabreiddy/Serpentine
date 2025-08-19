import IconButton from "@/components/common/icon-button";
import UserAvatar from "@/components/users/common/user-avatar";
import { useDateHelper } from "@/helpers/relative-date-helper";
import { MessageResponse } from "@/models/responses/message-response";
import { motion } from "framer-motion";
import { BellIcon, EditIcon, InfoIcon, MessageCircleIcon, ReplyIcon, TrashIcon } from "lucide-react";
import { useCallback, useEffect, useRef, useState } from "react";
import Stack from "./message-image-stack";

type MessageBubbleProps =
{
    message: MessageResponse
    withImage?: boolean
    isAdmin: boolean;
    isOwner: boolean;
    userId: string;
    onReaded: ( messageId: string ) => void;
}

export default function MessageBubble({message, isAdmin = false, isOwner = false, userId = "", withImage, onReaded}:MessageBubbleProps)
{

    const {getRelativeDate} = useDateHelper();
    const [clicked, setClicked] = useState(false);
    const [images, setImages] = useState<string[]>( [
        "https://images.unsplash.com/photo-1480074568708-e7b720bb3f09?q=80&w=500&auto=format" ,
        "https://images.unsplash.com/photo-1449844908441-8829872d2607?q=80&w=500&auto=format" ,
        "https://images.unsplash.com/photo-1452626212852-811d58933cae?q=80&w=500&auto=format" ,
        "https://images.unsplash.com/photo-1572120360610-d971b9d7767c?q=80&w=500&auto=format" 
    ]);

    const [showMoreContent, setShowMoreContent] = useState(false);
    const messageBubbleDivRef = useRef<HTMLDivElement | null>(null);
    let observerRef = useRef<IntersectionObserver | null>(null);
    


   
    useEffect(() => {
        function handleClickOutside(event: MouseEvent) {
        if (messageBubbleDivRef.current && !messageBubbleDivRef.current.contains(event.target as Node)) {
            setClicked(false); // clic fuera → cerrar
        }
        }

        document.addEventListener("mousedown", handleClickOutside);
        return () => {
        document.removeEventListener("mousedown", handleClickOutside);
        };
    }, []);

   const observeLastElement = useCallback(
       (node: HTMLDivElement | null) => {
        
         if (!message.isNewAndUnread) return;
         
         if (observerRef.current) observerRef.current.disconnect();
   
         observerRef.current = new IntersectionObserver((entries) => {
           if (entries[0].isIntersecting && message.isNewAndUnread) {
             onReaded(message.id);
           }
         });
   
         if (node) observerRef.current.observe(node);
         messageBubbleDivRef.current = node;
       },
       [message]
     );
    return(

        <motion.div        
        ref={observeLastElement}
        key={message.id.toString() + "-message-bubble"}
        id={message.id.toString() + "-message-bubble"}

        initial={{opacity: 0, y: -10}}
        animate={{opacity: 1, y: 0}}
        onClick={(e)=>{ e.stopPropagation(); setClicked(false) } }
        onContextMenu={(e)=>{ e.stopPropagation(); e.preventDefault(); setClicked(true) } }
        className={`w-full transition-all flex gap-3 items-start group  ${clicked ? "bg-neutral-100 dark:bg-neutral-950" : "hover:bg-neutral-100/50 hover:dark:bg-neutral-950/50"} p-3 rounded-lg`}
        >
            {message.isNotification ? 
            <div  className="size-[28px] shrink-0 bg-yellow-500 text-white  rounded-full flex justify-center items-center">
                <MessageCircleIcon className="size-[16px] fill-white"/>
            </div>  :            
            <UserAvatar  src={message?.senderProfilePictureUrl ?? "" } userNameFallback={message?.senderUsername ?? "fka.breiddy"} />
}
            <div className="w-full flex flex-col gap-1">
                <div className={"w-full flex gap-3 items-start opacity-50"}>
                    {!message.isNotification ?
                     <strong className="text-[13px] font-normal ">@{message?.senderUsername}</strong>
                     :
                     <div className="dark:bg-neutral-900 bg-neutral-200 rounded-md px-2 text-[12px]">Notification</div>
                    }   
                    <label className="text-[13px] font-normal ">{(() => {
                        const date = new Date(message.createdAt);
                        return `${date.getMonth() + 1}/${date.getDate()}/${date.getFullYear()} (${getRelativeDate(date)})`;
                    })()}
                    </label>

                </div>

                {withImage && 
                    <div className="relative h-[180px] w-[180px] py-2 ">

                        {images.map((image, index)=>(

                            <MessageImage lenght={images.length} src={image} index={index} key={index}/>
                        ))}
                    </div>
                   
                }
                <p
                className={`w-full font-normal opacity-80 text-[13px] whitespace-pre-line  text-ellipsis overflow-hidden ${showMoreContent ? "" : "line-clamp-3"}`}
                >
                  {message.content}
                </p>

                {message.content.length >= 100 && (
                    <a
                    className="text-blue-500 text-xs cursor-pointer"
                    onClick={(e) => {e.stopPropagation(); setShowMoreContent(!showMoreContent);}}
                    >
                    {showMoreContent ? "Show less..." : "Show more..."}
                    </a>
                )}

                {
                    clicked && !message.isNotification &&
                
                    <div  className=" mt-3 w-full  gap-2 flex">
                        {(isOwner || isAdmin || message.senderId === userId) &&    <RemoveButton />}
                      
                        <ReplyButton/>

                        {message.senderId === userId &&   <EditButton/>}
                    
                        <ReportButton/>
                    </div>
                }

            </div>
           
            
        </motion.div>
    )
}


const RemoveButton =()=>{

    return(

        <motion.div 
        
        initial={{y: 10, opacity: 0}}
        animate={{y: 0, opacity: 1}}
        transition={{
            duration: 0.5,
            delay: 0.2    // cuánto espera antes de iniciar
        }}
        key={"delete-message-icon"}
        >
            <IconButton
            onClick={(e)=>{e.stopPropagation();}}
            withGrainyTexture={false}
                tooltipText="Delete message"
            >
                <TrashIcon size={14}/>
            </IconButton>
        </motion.div>
    )
}

const ReplyButton =()=>{

    return(

        <motion.div
         initial={{y: 10, opacity: 0}}
        animate={{y: 0, opacity: 1}}
        transition={{
            duration: 0.5,
            delay: 0.3    // cuánto espera antes de iniciar
        }}

        key={"reply-message-icon"}
        >
            <IconButton
                        onClick={(e)=>{e.stopPropagation();}}

            withGrainyTexture={false}
                tooltipText="Reply message"
            >
                <ReplyIcon size={14}/>
            </IconButton>
        </motion.div>
    )
}

const ReportButton =()=>{

    return(

        <motion.div
         initial={{y: 10, opacity: 0}}
        animate={{y: 0, opacity: 1}}
        transition={{
            duration: 0.5,
            delay: 0.5    // cuánto espera antes de iniciar
        }}

        key={"report-message-icon"}
        >
            <IconButton
                        onClick={(e)=>{e.stopPropagation();}}

            withGrainyTexture={false}
                tooltipText="Report message"
            >
                <InfoIcon size={14}/>
            </IconButton>
        </motion.div>
    )
}

const EditButton =()=>{

    return(

        <motion.div
         initial={{y: 10, opacity: 0}}
        animate={{y: 0, opacity: 1}}
        transition={{
            duration: 0.5,
            delay: 0.4    // cuánto espera antes de iniciar
        }}

        key={"edit-message-icon"}
        >
            <IconButton
                        onClick={(e)=>{e.stopPropagation();}}

            withGrainyTexture={false}
                tooltipText="Edit message"
            >
                <EditIcon size={14}/>
            </IconButton>
        </motion.div>
    )
}


interface MessageImageProps{

    src:string
    lenght: number,
    index: number
}
const MessageImage = ({src, index, lenght}:MessageImageProps) =>{

    return(
        
       <motion.div
       key={index.toString() + "img"}
       animate={{rotateZ: index === lenght - 1 ? 0 : ((7 + length) - index) * -1, x: 0 }}
       
       >
         <img src={src} className="w-[150px] absolute rounded-lg h-[150px] object-fill cursor-pointer"/>

       </motion.div>


    )
}