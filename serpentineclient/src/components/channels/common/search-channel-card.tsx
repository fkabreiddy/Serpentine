import { ChannelResponse } from "@/models/responses/channel-response";
import { ChannelBanner } from "./channel-banner";
import { ChannelCover } from "./channel-cover";
import { Button, Tooltip } from "@heroui/react";
import { Info, KeyIcon, PlusIcon, User2Icon, UserIcon } from "lucide-react";
import IconButton from "@/components/common/icon-button";
import { RightPanelView } from "@/models/right-panel-view";

interface SearchChannelCardProps {
  channel: ChannelResponse;
  infoClicked: (channelId: string) => void;
}
export default function SearchChannelCard({
  channel,
  infoClicked,
}: SearchChannelCardProps) {
  return (
    <div className="flex relative  justify-between rounded-lg p-4  flex-col gap-2 w-full ">
      <div>
        <div className="flex flex-col w-full gap-2 relative  mb-2">
          <ChannelBanner pictureUrl={channel?.bannerPicture ?? ""} />
          <ChannelCover
            absolute={true}
            isSmall={false}
            pictureUrl={channel?.coverPicture ?? ""}
            channelName={channel?.name ?? ""}
          />
        </div>
        <div className="flex items-center gap-3 w-full  justify-between">
          <div className="flex items-center gap-3">
            <IconButton
              placement="right"
              onClick={() => {
                infoClicked(channel.id);
              }}
              tooltipText="About"
            >
              <Info className="size-[18px]" />
            </IconButton>
          </div>

          <div className="flex items-center gap-3">
            {channel?.myMember?.role &&
              channel?.myMember.role.name === "admin" && (
                <Tooltip
                  placement="bottom"
                  showArrow={true}
                  size="sm"
                  content="Admin"
                >
                  <KeyIcon className="size-[15px] opacity-80 cursor-pointer" />
                </Tooltip>
              )}
            <h2 className="text-[13px] font-normal justify-self-end">
              {channel ? `#${channel.name}` : "Channel"}
            </h2>
          </div>
        </div>
        <p className="text-xs my-3 opacity-70 line-clamp-3"><strong>Description: </strong>{channel.description}</p>

      </div>

      <div className=" w-full flex items-center justify-between gap-2 mt-3 ">
        {channel.myMember && (
          <Button
            isDisabled={channel.myMember}
            className={`${channel.myMember ? "bg-transparent text-blue-600 cursor-default" : "bg-blue-600 text-white"} rounde-lg w-fit`}
            size="sm"
          >
            {channel.myMember ? "Joined" : "Join"}
          </Button>
        )}
        <div className="items-center flex gap-2">
          <User2Icon size={18} />
          <label>{channel.membersCount}</label>
        </div>
      </div>
    </div>
  );
}
