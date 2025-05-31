import React from "react";

interface DividerProps {
    text: string;
}

export default function Divider({text}: DividerProps) {
    return (
        <div className="w-[60%] max-sm:w-[80%] max-xs:w-[90%] items-center mt-7 flex gap-3">
            <hr className="w-full border rounded-full opacity-30" />
            <p className="text-xs text-nowrap opacity-30">{text}</p>
            <hr className="w-full border rounded-full opacity-30" />
        </div>
    );
}