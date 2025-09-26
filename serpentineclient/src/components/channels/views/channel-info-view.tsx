import { useGlobalDataStore } from "@/contexts/global-data-context";
import { useDeleteChannel, useGetChannelById } from "@/hooks/channel-hooks";
import { useEffect, useState, useRef, useCallback, EventHandler } from "react";
import { Spinner } from "@heroui/spinner";
import { ChannelBanner } from "../common/channel-banner";
import ChannelCover from "../common/channel-cover";
import InfiniteScroll from "react-infinite-scroll-component";
import {
  Activity,
  ArrowLeft,
  CakeIcon,
  CopyIcon,
  Edit3Icon,
  InfoIcon,
  MessageCircleWarningIcon,
  MoreVertical,
  PlusCircle,
  TrashIcon,
  UserIcon,
  X,
} from "lucide-react";
import { useActiveChannelsHubStore } from "@/contexts/active-channels-hub-context";
import { HubResult } from "@/models/hub-result";

import IconButton from "@/components/common/icon-button";
import {
  Dropdown,
  DropdownTrigger,
  DropdownMenu,
  DropdownItem,
  Button,
  Input,
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
  DropdownSection,
} from "@heroui/react";
import { ChannelResponse } from "@/models/responses/channel-response";
import { useLayoutStore } from "@/contexts/layout-context";
import { RightPanelView } from "@/models/right-panel-view";
import { showToast } from "@/helpers/sonner-helper";
import {
  useCreateChannelMember,
  useDeleteChannelMember,
  useGetChannelMembersByChannelId,
} from "@/hooks/channel-member-hooks";
import { useUiSound } from "@/helpers/sound-helper";
import UserCard from "@/components/users/common/user-hor-card";
import { ChannelMemberResponse } from "@/models/responses/channel-member-response";
import { useDateHelper } from "@/helpers/relative-date-helper";
import { FormView } from "@/models/utils";
import { useActiveChannelsHubActions } from "@/client-hubs/active-channels-hub";
import ChannelCard from "../common/channel-card";
import FormHeader from "@/components/panels/right-panel/right-view-header";
import RightViewHeader from "@/components/panels/right-panel/right-view-header";

export default function ChannelInfoView({onDone}:FormView) {
  const { channelInfoId, setChannelInfoId } = useGlobalDataStore();
  const { getChannelById, channel, loadingChannel } = useGetChannelById();
  const { getRelativeDate } = useDateHelper();
  const [showMoreDescription, setShowMoreDescription] = useState(false);
  const { activeUsersCount, getChannelActiveMembersCount } =
    useActiveChannelsHubActions();

  const fetchChannel = async () => {
    if (!channelInfoId) return;
    await getChannelById({ channelId: channelInfoId });
    await getChannelActiveMembersCount(channelInfoId);
  };

  useEffect(() => {
    fetchChannel();

    
  }, [channelInfoId]);

  if (loadingChannel)
    return (
      <div className="flex items-center flex-col gap-2 justify-center h-full w-full">
        <Spinner className="" size="sm" variant="spinner" />
        <p className="text-xs ">Loading Channel</p>
      </div>
    );

  if (!channel)
    return (
      <div className="flex items-center flex-col gap-2 justify-center h-full w-full">
        <p className="text-xs ">Channel not found. Try again later.</p>
      </div>
    );

  if (channel) {
    return (
      <>
        <div className="flex flex-col gap-2 w-full max-sm:w-[80%]  max-md:pb-1">
          
          <RightViewHeader title="About channel" description={`Information about #${channel.name}`} onClose={onDone}/>

          <ChannelCard showOptions={true} allowFecthActiveUsers={false} channel={channel}/>
         
          <div className="w-full" id={"channel-description-container"}>
            <p
              className={`w-full font-normal opacity-80 text-[13px] whitespace-pre-line  text-ellipsis overflow-hidden ${showMoreDescription ? "" : "line-clamp-3"}`}
            >
              {channel.description}
            </p>
          </div>

          {channel.description.length >= 100 && (
            <a
              className="text-blue-500 text-xs cursor-pointer"
              onClick={() => setShowMoreDescription(!showMoreDescription)}
            >
              {showMoreDescription ? "Show less..." : "Show more..."}
            </a>
          )}
          <hr className="w-full border-t border-neutral-200 dark:border-neutral-800 my-2" />
          <div className="flex flex-col gap-4">
            <p className="opacity-80 mt-1 text-xs font-normal flex gap-2 items-center">
              <CakeIcon className="size-[18px]" />{" "}
              {(() => {
                const date = new Date(channel.createdAt);
                return `${date.getMonth() + 1}/${date.getDate()}/${date.getFullYear()} (${getRelativeDate(date)})`;
              })()}
            </p>
            <div className="flex items-center gap-2">
              <UserIcon size={18} />
              <p className="opacity-90 mt-1 text-xs font-normal">
                {channel.membersCount} Member(s){" "}
              </p>
            </div>
            <div className="flex items-center gap-2">
              <Activity size={18} />
              <div className="size-2 bg-green-600 rounded-full" />
              <p
                style={{ fontSize: "12px" }}
                className="opacity-90 font-normal"
              >
                {activeUsersCount} Active user(s)
              </p>
            </div>

          </div>
          <hr className="w-full border-t border-neutral-200 dark:border-neutral-800 my-2" />
          <UsersContainer myMember={channel.myMember} channelId={channel.id} />
        </div>
      </>
    );
  }
}



interface UserContainerProps {
  myMember: ChannelMemberResponse | null;
  channelId: string;
}

const UsersContainer: React.FC<UserContainerProps> = ({
  myMember,
  channelId,
}) => {
  const {
    getChannelMembersByChannelId,
    setChannelMembers,
    hasMore,
    channelMembers,
    loadingChannelMembers,
  } = useGetChannelMembersByChannelId();
  const firstRender = useRef(false);

  const observerRef = useRef<IntersectionObserver | null>(null);
  const lastElementRef = useRef<HTMLDivElement | null>(null);

  const fetchChannelMembers = async () => {
    await getChannelMembersByChannelId({
      channelId: channelId,
      skip: channelMembers.length,
      take: 5,
    });
  };

  function handleOnUserKickedOut(channelMemberId: string) {
    setChannelMembers((prev) =>
      channelMembers.filter((cm) => cm.id !== channelMemberId)
    );
  }
  const observeLastElement = useCallback(
    (node: HTMLDivElement | null) => {
      if (loadingChannelMembers) return;
      if (observerRef.current) observerRef.current.disconnect();

      observerRef.current = new IntersectionObserver((entries) => {
        if (entries[0].isIntersecting && hasMore) {
          fetchChannelMembers();
        }
      });

      if (node) observerRef.current.observe(node);
      lastElementRef.current = node;
    },
    [loadingChannelMembers, hasMore, fetchChannelMembers]
  );

  useEffect(() => {
    if (firstRender.current) return;

    firstRender.current = true;
    fetchChannelMembers();
  }, [channelId]);

  function handleUserUpdated(channelMember: ChannelMemberResponse) {
    setChannelMembers((prev) =>
      prev.map((cm) => (cm.id === channelMember.id ? channelMember : cm))
    );
  }

  return (
    <div className="flex flex-col gap-3">
      <p className="text-xs ">Members of this channel</p>

      {channelMembers.map((cm, idx) => {
        const isLast = idx === channelMembers.length - 1;

        return (
          <div
            ref={isLast ? observeLastElement : null}
            className="w-full flex flex-col gap-2"
            key={cm.id}
          >
            <UserCard
              onKickedOut={handleOnUserKickedOut}
              onUpdated={handleUserUpdated}
              myChannelMember={myMember}
              channelMember={cm}
            />

            <hr className="ml-auto w-[80%] dark:border-neutral-950 border-neutral-100 border-t " />
          </div>
        );
      })}

      {loadingChannelMembers && <Spinner size="sm" variant="spinner" />}
    </div>
  );
};

