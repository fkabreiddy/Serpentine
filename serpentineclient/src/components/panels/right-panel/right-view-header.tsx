import { X } from "lucide-react";
import IconButton from "../../common/icon-button";

export default function RightViewHeader({title, description, onClose}:{title: string, description: string, onClose: ()=> void}){

    return(
        <div className="flex w-full justify-between items-start gap-2">

            <div className="">
              <h2 className="text-md font-semibold ">
                {title}
              </h2>
              <p className="text-xs opacity-45 ">
                {description}
              </p>
            </div>

              <IconButton tooltipText="Close" onClick={onClose}>
                <X className="size-[16px]" />
              </IconButton>
          </div>
          

    )
}