import { Input } from "@heroui/input";
import React, { useState } from "react";
import {SearchIcon} from "lucide-react"
import { InputOtpVariantProps } from "@heroui/theme";
import IconButton from "./common/icon-button";


type SearchBarProps = {
    onSearch: (text: string) => void
    onCancel?: () => void;
    searchButton?: boolean;
    width?: string;
} & InputOtpVariantProps

const SearchBar: React.FC<SearchBarProps> = ({onSearch, searchButton, width = "60%",  onCancel = () => {}, ...rest}) => {
    const [searchText, setSearchText] = useState<string>("");

    React.useEffect(() => {
            onSearch(searchText);

    }, [searchText, onSearch]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setSearchText(e.target.value);
    };

    return (
            <Input
                {...rest}
               value={searchText}
               
                labelPlacement="outside"
                autoComplete="current-password"
                style={{fontSize: "12px"}}
                endContent={searchButton && <IconButton tooltipText="Search"><SearchIcon className="size-[18px] " /></IconButton>}
                className={`w-[${width}] max-md:w-full !text-[12px] `} 
                
                onChange={handleChange}
            />
            
        
      
    )
}



export default SearchBar
