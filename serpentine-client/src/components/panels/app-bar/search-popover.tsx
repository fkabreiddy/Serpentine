import React, { useEffect } from "react";

import {Popover, PopoverTrigger, PopoverContent} from "@heroui/popover";
import { CheckIcon, SearchIcon, Settings2Icon } from "lucide-react";

import IconButton from "@/components/common/icon-button";
import SearchBar from "@/components/search-channel-bar";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import {Dropdown, DropdownTrigger, DropdownMenu, DropdownItem} from "@heroui/dropdown";
import { set } from 'date-fns';
import GeneralSearcher from "@/components/common/general-searcher";
import ChannelsContainer from "@/components/channels/common/channels-container";
import { ChannelResponse } from '../../../models/responses/channel-response';
import ChannelCard from "@/components/channels/common/channel-card";
import { Spinner } from "@heroui/spinner";


interface SearchPopoverProps {
  children: React.ReactNode;   
}


export default function SearchPopover() {
  

  const [open, setOpen] = React.useState(false);
  const [filter, setFilter] = React.useState<string>("");
  const [channels, setChannels] = React.useState<ChannelResponse[]>([]);
  const [isSearching, setIsSearching] = React.useState<boolean>(false);





  return (
    <Popover placement="bottom" radius="lg" backdrop="opaque" isOpen={open} onOpenChange={setOpen} showArrow={true} >
      <PopoverTrigger>
        <button>
          <IconButton tooltipText="Search" onClick={() => setOpen(!open)} >
              <SearchIcon className="size-5"/>
          </IconButton>
        </button>
        
      </PopoverTrigger>
      <PopoverContent className="backdrop-blur-sm border-neutral-100 dark:bg-neutral-900/30  max-w-[400px] w-full  ">
        <div className="px-1 py-2 flex flex-col gap-3">
          <GeneralSearcher onSearching={(value) => setIsSearching(value)} onChannelsSearched={(value) => setChannels(value)} onFilterChanged={(value) => {setFilter(value)}} />
          
        </div>
      </PopoverContent>
    </Popover>
  );
}

interface ChannelsSectionProps {
  channels: ChannelResponse[];
}

const ChannelsSection =  ({channels} : ChannelsSectionProps) =>(
  <div className="w-full h-full flex flex-col gap-2">
    {channels.map((channel) => (
      <ChannelCard key={channel.id} channel={channel} />
    ))}
  </div>
)