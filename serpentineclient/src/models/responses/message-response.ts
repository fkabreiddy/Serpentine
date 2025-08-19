import {BaseResponse} from "@/models/responses/base-response.ts";
import {UserResponse} from "@/models/responses/user-response.ts";

export class MessageResponse extends BaseResponse {

    content: string = "";
    senderId?: string= ""; 
    groupId: string= "";   
    parentId?: string= ""; 
    isNotification: boolean = false;
    senderName?: string = "";
    senderProfilePictureUrl?: string = "";
    senderUsername?: string = "";
    parentContent?: string = "";
    groupName?: string = "";
    channelName?: string = "";
    channelId?: string = "";
    
    
    //front-end-only properties
    isNewAndUnread: boolean = false;//this property is set when the message bubble gets into the viewport for the first time

 



    constructor(init?: Partial<MessageResponse>) {
        super(init);
        Object.assign(this, init);

        
    }

   



}