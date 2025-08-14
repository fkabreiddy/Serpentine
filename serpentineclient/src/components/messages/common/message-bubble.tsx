import IconButton from "@/components/common/icon-button";
import UserAvatar from "@/components/users/common/user-avatar";
import { useDateHelper } from "@/helpers/relative-date-helper";
import { MessageResponse } from "@/models/responses/message-response";
import { motion } from "framer-motion";
import { EditIcon, InfoIcon, ReplyIcon, TrashIcon } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import Stack from "./message-image-stack";

interface MessageBubbleProps
{
    message?: MessageResponse
    withImage?: boolean
}

export default function MessageBubble({message, withImage}:MessageBubbleProps)
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
    const content = "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Ut eget dolor sapien. Integer diam dolor, consequat quis massa ac, commodo consectetur metus. Duis sem massa, consectetur eget sodales ac, pellentesque luctus erat. Sed pretium accumsan odio sit amet commodo. Quisque tempor cursus vulputate. Etiam ornare consectetur ex. Etiam sapien nibh, vestibulum eget libero et, posuere rhoncus ipsum. Ut et justo vitae dolor tincidunt consequat. Vestibulum vitae viverra ligula, ac gravida ex. Suspendisse semper ex libero. Nullam at feugiat nisi, vitae laoreet urna. Aenean posuere eros vitae feugiat lobortis. Sed feugiat iaculis elit eu cursus. Donec hendrerit enim sed congue tempor.";
    const messageBubbleDivRef = useRef<HTMLDivElement>(null);

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
    return(

        <motion.div
        ref={messageBubbleDivRef}
        initial={{opacity: 0, y: -10}}
        animate={{opacity: 1, y: 0}}
        onClick={(e)=>{ e.stopPropagation(); setClicked(false) } }
        onContextMenu={(e)=>{ e.stopPropagation(); e.preventDefault(); setClicked(true) } }
        className={`w-full transition-all flex gap-3 items-start group  ${clicked ? "bg-neutral-100 dark:bg-neutral-950" : "hover:bg-neutral-100/50 hover:dark:bg-neutral-950/50"} p-3 rounded-lg`}
        >
            <UserAvatar  src={message?.sender?.profilePictureUrl ?? "" } userNameFallback={message?.sender?.username ?? "fka.breiddy"} />
            <div className="w-full flex flex-col gap-1">
                <div className={"w-full flex gap-3 items-start opacity-50"}>
                    <strong className="text-[13px] font-normal ">@fka.breiddy</strong>
                    <label className="text-[13px] font-normal ">(8 hrs ago)</label>

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
                  {content}
                </p>

                {content.length >= 100 && (
                    <a
                    className="text-blue-500 text-xs cursor-pointer"
                    onClick={(e) => {e.stopPropagation(); setShowMoreContent(!showMoreContent);}}
                    >
                    {showMoreContent ? "Show less..." : "Show more..."}
                    </a>
                )}

                {
                    clicked &&
                
                    <div  className=" mt-3 w-full  gap-2 flex">
                    <RemoveButton />
                    <ReplyButton/>
                    <EditButton/>
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