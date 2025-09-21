import { X } from "lucide-react";
import IconButton from "./icon-button";

export default function CloseRightViewButton({ onClick }: { onClick: () => void }) {
  return (
    <div className="absolute top-2 right-2">
      <IconButton tooltipText="Close" onClick={onClick}>
        <X className="size-[16px]" />
      </IconButton>
    </div>
  );
}