import React, { ReactNode } from "react"
import { createPortal } from "react-dom"
import IconButton from "./icon-button"
import { X } from "lucide-react"
import {Kbd} from "@heroui/kbd"

type ModalProps = {

    onClose: ()=>void
    children: ReactNode
} & React.HtmlHTMLAttributes<HTMLDivElement>


export default function Modal({onClose, children, ...rest}:ModalProps){

    React.useEffect(()=>{
        const handleEsc = (e : KeyboardEvent) =>{
            if(e.key === "Escape") onClose();
        }

        document.addEventListener('keydown', handleEsc);
    },[onClose])
    return createPortal(
        <div {...rest} onClick={(e) => {
            if (e.target === e.currentTarget) {
                e.stopPropagation();
                onClose();
            }
        }} className="fixed inset-0 z-[50] w-screen  h-screen dark:bg-black/60  bg-white/60 flex items-center justify-center">
            <div className="p-3 z-[60] py-4 w-[40vw] flex flex-col items-center animate-appearance-in  border-default-50/50 border rounded-xl bg-neutral-900/40 backdrop-blur-md">
                <div className="absolute right-0 m-2 top-0">
                    <IconButton onClick={onClose} tootltipText="close">
                        <X className="size-[14px]"/>
                    </IconButton>
                </div>
               
                {children}
                <p className="text-xs opacity-50 mt-3">Press return   return <Kbd keys={[]}>esc</Kbd> to close</p>
            </div>
        </div>,
        document.getElementById("modal-root") ?? document.body
    )
}