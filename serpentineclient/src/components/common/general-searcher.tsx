import {
  Dropdown,
  DropdownTrigger,
  DropdownMenu,
  DropdownItem,
} from "@heroui/dropdown";
import { Settings2Icon, CheckIcon, SearchIcon } from "lucide-react";
import React, { ChangeEvent, useEffect } from "react";
import SearchBar from "../search-channel-bar";
import IconButton from "./icon-button";
import { ChannelResponse } from "@/models/responses/channel-response";
import { useGetManyChannelsByNameOrId } from "@/hooks/channel-hooks";
import { useNavigate } from "react-router-dom";
import { Input } from "@heroui/input";


export default function GeneralSearcher() {
  const [filter, setFilter] = React.useState<string>("");
  const navigate = useNavigate();
 const handleChange = (event : React.ChangeEvent<HTMLInputElement>) => {
    setFilter(event.target.value);
  };
  
  return (
   <Input
     
      value={filter}
      labelPlacement="outside"
      autoComplete="current-password"
      style={{ fontSize: "12px" }}
      endContent={
        
          <IconButton 
            tooltipText="Search" 
            disabled={filter === "" || filter === null} 
            onClick={()=>{navigate(`/search/${filter}`)}}
          >
            <SearchIcon className="size-[18px] " />
          </IconButton>
        
      }
      className={`w-[50%] max-md:w-full !text-[12px] `}
      onChange={(e) =>{handleChange(e)} }
    />
  );
}
