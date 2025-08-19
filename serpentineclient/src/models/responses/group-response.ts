import {BaseResponse} from "@/models/responses/base-response.ts";
import {MessageResponse} from "@/models/responses/message-response.ts";
import {GroupAccessResponse} from "@/models/responses/group-access-response.ts";

export class GroupResponse extends BaseResponse {

    name: string = "";
    unreadMessages: number = 0;
    channelName: string = "";
    public : boolean = true;
    requiresOverage : boolean = false;
    channelId: string = "";
    myAccess: GroupAccessResponse | null = null;
    lastMessage: MessageResponse | null = null;



    constructor(init?: Partial<GroupResponse>) {
        super(init);
        Object.assign(this, init);
    }



}