import Noise from "@/components/common/noise-ext";
import { Image } from "@heroui/react";
import { Skeleton } from "@heroui/skeleton";

export const ChannelBanner: React.FC<{ pictureUrl: string | null }> = ({
  pictureUrl,
}) => (
  <>
    {pictureUrl ? (
      <img
        className="rounded-md  aspect-video   object-cover  z-[0]"
        src={pictureUrl}
      />
    ) : (
      <div  className=" bg-neutral-300 dark:bg-neutral-950 !aspect-video   rounded-md" />
    )}
  </>
);
