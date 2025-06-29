import { Button } from "@heroui/button";
import { Input } from "@heroui/input";
import React, { ReactNode, useState } from "react";
import {SearchIcon, X} from "lucide-react"
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
                
                endContent={searchButton && <IconButton tooltipText="Search"><SearchIcon className="size-[18px] " /></IconButton>}
                className={`w-[${width}] max-md:w-full `} 
                
                onChange={handleChange}
            />
            
        
      
    )
}



export default SearchBar
