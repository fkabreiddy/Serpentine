import { Image } from "@heroui/image";
import Avatar from "boring-avatars";
import { Badge } from '@heroui/badge';

export interface ChannelCoverProps {
    pictureUrl: string | null; 
    channelName: string | null;
    isSmall: boolean;
    absolute: boolean;
    unreadMessages?: number
}

export const ChannelCover: React.FC<ChannelCoverProps> = ({ pictureUrl, channelName, isSmall = false, absolute = false, unreadMessages=0 }) => (
       
    
    <Badge isInvisible={unreadMessages <= 0} content={unreadMessages} placement="bottom-right" color="success">
        {pictureUrl ? 
            <img
            src={pictureUrl}
            className={`shrink-0 ${absolute && "absolute -bottom-[10px] right-[20px] ring-2 dark:ring-black ring-white"} ${!isSmall ? "!size-[40px] min-w-[40px] min-h-[40px] max-w-[40px] max-h-[40px]" : "!size-[28px] min-w-[28px] max-h-[28px] max-w-[28px] min-h-[28px]"}  rounded-full `}
            />
         : 
            <Avatar
            size={!isSmall ? 40 : 28}
            className={`shrink-0 rounded-full ${absolute && "absolute -bottom-[10px] right-[20px] ring-2 dark:ring-black ring-white"} ${!isSmall ? "!size-[40px] min-w-[40px] min-h-[40px] max-w-[40px] max-h-[40px]" : "!size-[28px] min-w-[28px] max-h-[28px] max-w-[28px] min-h-[28px]"}`}
            variant="marble"
            name={channelName ?? "serpentine"}
            />
        }
    </Badge>
        
        
        
       
                              
)

