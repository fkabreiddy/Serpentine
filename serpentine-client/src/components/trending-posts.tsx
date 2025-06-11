import { FireIcon } from "@heroicons/react/24/solid";
import PostMini from "./posts/post-mini";

export default function TrendingPosts(){
    return(
        <div className="w-full flex flex-col gap-3 ">
            <label className="text-sm"><FireIcon className="size-[18px] inline"/> Trending on your channels </label>
            <PostMini/>
            <hr className="w-full border-t border-default-100"/>
            <PostMini/>

        </div>
    )
}