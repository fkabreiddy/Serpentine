import {
  Dropdown,
  DropdownTrigger,
  DropdownMenu,
  DropdownItem,
} from "@heroui/dropdown";
import { Settings2Icon, CheckIcon, SearchIcon } from "lucide-react";
import React, { useEffect } from "react";
import SearchBar from "../search-channel-bar";
import IconButton from "./icon-button";
import { ChannelResponse } from "@/models/responses/channel-response";
import { useGetManyChannelsByNameOrId } from "@/hooks/channel-hooks";
interface GeneralSearcherProps {
  onChannelsSearched: (channels: ChannelResponse[]) => void;
  onFilterChanged?: (value: string) => void;
  onSearching?: (value: boolean) => void;
}

export default function GeneralSearcher({
  onChannelsSearched,
  onSearching = () => {},
  onFilterChanged = () => {},
}: GeneralSearcherProps) {
  const [filter, setFilter] = React.useState<string>("");
  const { getManyChannelsByNameOrId, channels, loadingChannels } =
    useGetManyChannelsByNameOrId();
  const [searchById, setSearchById] = React.useState<boolean>(false);
  const [channelsSearch, setChannelsSearch] =
    React.useState<GetManyByNameOrIdRequest>({
      channelId: null,
      channelName: null,
    });

  useEffect(() => {
    onFilterChanged(filter);

    if (filter === "" || !filter) {
      onChannelsSearched([]);
      return;
    }

    const handler = setTimeout(async () => {
      await getManyChannelsByNameOrId(channelsSearch);
    }, 1000);

    return () => clearTimeout(handler);
  }, [channelsSearch.channelId, channelsSearch.channelName]);

  useEffect(() => {
    searchById
      ? setChannelsSearch((prev) => ({
          ...prev,
          channelId: filter,
          channelName: null,
        }))
      : setChannelsSearch((prev) => ({
          ...prev,
          channelId: null,
          channelName: filter,
        }));
  }, [searchById]);

  useEffect(() => {
    onSearching(loadingChannels);
    onChannelsSearched(channels);
  }, [loadingChannels]);

  return (
    <SearchBar
      searchButton={true}
      maxLength={100}
      placeholder="Search something..."
      onSearch={(value) => {
        setFilter(value);
      }}
    />
  );
}
