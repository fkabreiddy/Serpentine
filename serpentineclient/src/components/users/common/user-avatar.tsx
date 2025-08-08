import { source } from "motion/react-client"
import { Image } from "@heroui/react"
import Avatar from "boring-avatars"

interface UserAvatarProps{

    isBlurred?: boolean,
    src: string | null,
    size?: number,
    userNameFallback?: string | null,
    connectionColor?: string | null
}

export default function UserAvatar({isBlurred = false, src, size = 28, connectionColor,  userNameFallback = "adam"}:UserAvatarProps){

    return(

        <div className={` ${ connectionColor &&  connectionColor  } ${connectionColor && "ring-2"} cursor-pointer flex items-center justify-center rounded-full size-fit   transition-all text-sm font-semibold`}>
              {src ? (
                <Image
                  isBlurred = {isBlurred}
                  src={src}
                  width={size}
                  height={size}
                  className="shrink-0 rounded-full"
                />
              ) : (
                <Avatar size={size} variant="beam" name={userNameFallback ?? "adam"} />
              )}
        </div>
           
    )
}