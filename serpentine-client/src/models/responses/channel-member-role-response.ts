import {BaseResponse} from "@/models/responses/base-response.ts";
import {ChannelMemberResponse} from "@/models/responses/channel-member-response.ts";

export class ChannelMemberRoleResponse extends BaseResponse {
    name: string = "default";
    

    constructor(init?: Partial<ChannelMemberRoleResponse>) {
        super(init);
        Object.assign(this, init);
    }



}