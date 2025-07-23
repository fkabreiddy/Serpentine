import Noise from "@/components/common/noise-ext";
import { Skeleton } from "@heroui/skeleton";

export interface ChannelBannerProps {
    pictureUrl: string | null; 
    
}

export const ChannelBanner: React.FC<ChannelBannerProps> = ({ pictureUrl }) => (
    <div className="w-full rounded-md dark:bg-neutral-950 bg-neutral-100  h-[100px] ">
        {pictureUrl ? 
            <img
    
    
            className="rounded-sm w-full h-full    object-cover flex-shrink-0 "
            src={pictureUrl}            
    
         /> :
            <Noise
                    
                patternSize={250}
                patternScaleX={0}
                patternScaleY={0}
                patternRefreshInterval={2}
                patternAlpha={10}
                height="100%"
                width="100%"
            />
        }
         
    </div>
   
       
                              
)