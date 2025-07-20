import {BaseResponse} from "@/models/responses/base-response.ts";
import {UserResponse} from "@/models/responses/user-response.ts";

export class MessageResponse extends BaseResponse {
   
    content: string  = "";
    senderId: string | null = "" ;
    sender: UserResponse | null = null;
    groupId: string = "";
    parent: MessageResponse | null = null;
    parentId: string | null = "";
    isNotification: boolean = false;
    
    constructor(init?: Partial<MessageResponse>) {
        super(init);
        Object.assign(this, init);
    }



}