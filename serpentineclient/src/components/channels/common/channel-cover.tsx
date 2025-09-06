import Avatar from "boring-avatars";
import { Badge } from "@heroui/badge";
import React, { useRef } from "react";
import { Edit3Icon } from "lucide-react";
import { motion } from "motion/react";
import { ChannelResponse } from "@/models/responses/channel-response.ts";
import { useUpdateChannelBanner } from "@/hooks/channel-hooks.ts";
import { showToast } from "@/helpers/sonner-helper.ts";
import {
  Dropdown,
  DropdownItem,
  DropdownMenu,
  DropdownSection,
  DropdownTrigger,
} from "@heroui/react";
import { Spinner } from "@heroui/spinner";
import { UpdateChannelBannerRequest } from "@/models/requests/channels/update-banner-request";
type FileType = File;

const sizeMd =
  "!size-[60px] min-w-[60px] min-h-[60px] max-w-[60px] max-h-[60px]";
const sizeSm =
  "!size-[28px] min-w-[28px] max-h-[28px] max-w-[28px] min-h-[28px]";

export default function ChannelCover({
  pictureUrl,
  channelName,
  isSmall = false,
  absolute = false,
  unreadMessages = 0,
  isEditable = false,
  channel = null,
}: {
  pictureUrl: string | null;
  channelName: string | null;
  isSmall: boolean;
  absolute: boolean;
  unreadMessages?: number;
  isEditable?: boolean;
  channel?: ChannelResponse | null;
}) {
  return (
    <Badge
      shape={"circle"}
      isInvisible={unreadMessages <= 0}
      content={unreadMessages}
      placement="bottom-right"
      className={"bg-blue-600 text-white text-[10px]"}
    >
      <>
        <div className={"group cursor-pointer"}>
          {pictureUrl ? (
            <img
              src={pictureUrl}
              style={{ objectFit: "cover" }}
              className={`shrink-0    ${absolute && "absolute  -bottom-[2px] right-[20px] ring-[3px] dark:ring-black  ring-white"} ${isSmall ? sizeSm : sizeMd}  rounded-full `}
            />
          ) : (
            <Avatar
              size={!isSmall ? 50 : 28}
              className={`shrink-0 rounded-full ${absolute && "absolute -bottom-[10px] right-[20px] ring-[3px] dark:ring-black  ring-white"} ${isSmall ? sizeSm : sizeMd}`}
              variant="pixel"
              name={channelName ?? "serpentine"}
            />
          )}
          {absolute &&
            isEditable &&
            channel?.myMember &&
            (channel?.myMember.isOwner || channel?.myMember.isAdmin) && (
              <motion.div
                whileHover={{ opacity: 1 }}
                animate={{ opacity: 0 }}
                exit={{ opacity: 0 }}
                className={`shrink-0 z-[32] invisible group-hover:visible flex items-center justify-center  backdrop-blur-md backdrop-opacity-90 ${absolute && "absolute -bottom-[2px] right-[20px] ring-[3px] dark:ring-black  ring-white"} ${!isSmall ? "!size-[60px] min-w-[60px] min-h-[60px] max-w-[60px] max-h-[60px]" : "!size-[28px] min-w-[28px] max-h-[28px] max-w-[28px] min-h-[28px]"}  rounded-full `}
              >
                <EditCoverDropdown channel={channel} />
              </motion.div>
            )}
        </div>
      </>
    </Badge>
  );
}


const EditCoverDropdown: React.FC<{ channel: ChannelResponse }> = ({
  channel,
}) => {


  //constants
  const {updatingChannelBanner, updateChannelBanner } = useUpdateChannelBanner();
  const channelBannerInputRef = useRef<HTMLInputElement | null>(null);



  //functions
  const handleBannerFileChanged = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = event.target.files?.[0];
    const image = proccessImage(file);
    fetchUpdateBanner({ channelId: channel.id, bannerPictureFile: image });
  };

  function proccessImage(file: File | undefined): File | null {
    if (file) {
      const allowedExtensions = ["jpg", "png", "webp", "img", "jpeg"];
      const maxSizeInBytes = 5 * 1024 * 1024; // 5 MB

      const fileExtension = file.name.split(".").pop()?.toLowerCase();

      if (!fileExtension || !allowedExtensions.includes(fileExtension)) {
        showToast({
          title: "Invalid file type",
          description:
            "Please select a valid image file (jpg, png, jpeg, webp).",
        });
        return null;
      }
      if (file.size > maxSizeInBytes) {
        showToast({
          title: "Image too large",
          description: "Please select an image smaller than 5MB.",
        });
        return null;
      }

      return file;
    }

    return null;
  }

  const fetchUpdateBanner = async (data: UpdateChannelBannerRequest) => {
    const formData = new FormData();
    Object.entries(data).forEach(([key, value]) => {
      if (value instanceof File || value === null) {
        if (value) formData.append(key, value);
      } else {
        formData.append(key, value as string);
      }
    });

    await updateChannelBanner(formData as any);
  };

  const handleUpdateBannerInputClicked = () => {
    channelBannerInputRef.current?.click();
  };

  return (
    <>
      <input
        onChange={handleBannerFileChanged}
        type="file"
        ref={channelBannerInputRef}
        accept="image/png, image/jpeg, image/webp, image/jpg"
        multiple={false}
        max={1}
        className="hidden"
      />
      <Dropdown
        placement="bottom-end"
        offset={25}
        showArrow={true}
        className="bg-neutral-100/50 backdrop-blur-3xl dark:bg-neutral-950/50  "
      >
        <DropdownTrigger className={"border-0 outlined-none"}>
          <Edit3Icon size={24} />
        </DropdownTrigger>
        <DropdownMenu aria-label="Edit Channels Actions" variant="flat">
          <DropdownSection showDivider={false} title={"Cover Actions"}>
            <DropdownItem key="editCover">
              <p className="font-normal text-[13px]">Edit Cover</p>
            </DropdownItem>

            <>
              {channel.coverPicture !== "" && channel.coverPicture && (
                <DropdownItem key="removeCover" color={"danger"}>
                  <p className="font-normal text-[13px]">Remove Cover</p>
                </DropdownItem>
              )}
            </>
          </DropdownSection>
          <DropdownSection showDivider={false} title={"Banner Actions"}>
            <>
              <DropdownItem
                endContent={
                  updatingChannelBanner && (
                    <Spinner size={"sm"} variant={"spinner"} />
                  )
                }
                onClick={handleUpdateBannerInputClicked}
                key="updateBanner"
              >
                <p className="font-normal text-[13px]">Edit Banner</p>
              </DropdownItem>

              {channel.bannerPicture !== "" && channel.bannerPicture && (
                <DropdownItem
                  onClick={() =>
                    fetchUpdateBanner({
                      channelId: channel.id,
                      bannerPictureFile: null,
                    })
                  }
                  key="removeBanner"
                  color={"danger"}
                >
                  <p className="font-normal text-[13px]">Remove Banner</p>
                </DropdownItem>
              )}
            </>
          </DropdownSection>
        </DropdownMenu>
      </Dropdown>
    </>
  );
};
