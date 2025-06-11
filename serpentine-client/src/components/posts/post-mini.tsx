import { Image } from "@heroui/image"
import Avatar from "boring-avatars"
import { HeartIcon } from "lucide-react"
import React from "react"

export default function PostMini(){

    return(
        <div className="w-full p-1 flex flex-col gap-2">
            <div className="flex items-center gap-2">
                <Avatar size={25} className="max-md:!w-[23px] max-md:!h-[23px]" variant="beam" name={"adam"}/>
                <p className="text-xs font-normal opacity-80">by <span className="text-blue-600 underline">@shyguy</span> on <strong>#Lana_del_Rey</strong> channel</p>
            </div>
            <p className="text-xs opacity-70 italic font-semibold line-clamp-2 underline">Did you know that there is a tunner under ocean blvd is overrated as fuck</p>
            <p className="text-xs font-normal">june 22 at 12:30 p.m. on </p>

        </div>
    )
}