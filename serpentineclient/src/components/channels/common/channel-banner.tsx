import Noise from "@/components/common/noise-ext";
import { Image } from "@heroui/react";
import { Skeleton } from "@heroui/skeleton";

export interface ChannelBannerProps {
  pictureUrl: string | null;
  isBlurred?: boolean
  
}

export const ChannelBanner: React.FC<ChannelBannerProps> = ({ pictureUrl, isBlurred = false }) => (
  <>
    {pictureUrl ? (
      <img
       
        className="rounded-sm w-full h-[100px]  object-cover  z-[0]"
        src={pictureUrl}
      />
    ) : (
      <Noise
          patternSize={250}
          patternScaleX={0}
          patternScaleY={0}
          patternRefreshInterval={2}
          patternAlpha={10}
        height="100px"
          
        width="100%"
      
      />
    )}
  </>
);
