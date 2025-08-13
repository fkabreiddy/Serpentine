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
      <Skeleton
        isLoaded={false}
          className="h-[100px] w-full  rounded-sm"
      
      />
    )}
  </>
);
