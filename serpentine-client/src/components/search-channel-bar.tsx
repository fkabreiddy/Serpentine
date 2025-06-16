import { Button } from "@heroui/button";
import { Input } from "@heroui/input";
import React, { ReactNode, useState } from "react";
import {X} from "lucide-react"


interface SearchChannelBarProps {
    onSearch: (text: string) => void
    onCancel?: () => void;
}

const SearchChannelBar: React.FC<SearchChannelBarProps> = ({onSearch, onCancel = () => {}}) => {
    const [searchText, setSearchText] = useState<string>("");

    React.useEffect(() => {
            onSearch(searchText);

    }, [searchText, onSearch]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setSearchText(e.target.value);
    };

    return (
            <Input
                
                placeholder="Search something...."
               value={searchText}
                labelPlacement="outside"
                autoComplete="current-password"
                endContent={ <SearchIcon /> }
                className="w-[60%] max-md:w-full"
                
                onChange={handleChange}
            />
            
        
      
    )
}

const SearchIcon  = () =>  (

    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor" className="size-5 opacity-65">
     <path strokeLinecap="round" strokeLinejoin="round" d="m21 21-5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 5.196a7.5 7.5 0 0 0 10.607 10.607Z" />
    </svg>

)

export default SearchChannelBar
