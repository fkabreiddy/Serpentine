import { Button } from "@heroui/button";
import { Modal, ModalContent, ModalHeader, ModalBody, ModalFooter } from "@heroui/react";
import React, {  } from "react";

interface CustomDialogProps{
    open: boolean
    onOpenChanged?: (change:boolean) => void;
    onDismiss?: ()=> void;
    onAccept?: ()=> void;
    showDismiss?:boolean;
    acceptText?: string,
    dismissText?: string,
    children: React.ReactNode;
    title: string 
}

const CustomDialog : React.FC<CustomDialogProps> = ({open, acceptText = "Ok", title, dismissText="Cancel", showDismiss = true, children, onAccept, onDismiss, onOpenChanged}) =>{

    
    return(

        <Modal style={{zIndex: "9999999"}} isOpen={open} onOpenChange={onOpenChanged}>
        <ModalContent style={{zIndex: "9999999"}} className="dark:bg-neutral-900/50 max-w-[350px] backdrop-blur-lg">
          {(onClose) => (
            <>
              <ModalHeader className="flex flex-col gap-1">{title}</ModalHeader>
              <ModalBody className="text-[13px]">
                {children}
                
              </ModalBody>
              <ModalFooter>
                {showDismiss &&
                    <Button size="sm" variant="light" onPress={onDismiss}>
                    {dismissText}
                    </Button>
                }
                <Button
                     className="bg-blue-700 text-white" size="sm" onPress={onAccept}>
                 {acceptText}
                </Button>
              </ModalFooter>
            </>
          )}
        </ModalContent>
      </Modal>
    )
}

export default CustomDialog;