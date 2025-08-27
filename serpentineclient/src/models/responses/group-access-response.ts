import {BaseResponse} from "@/models/responses/base-response.ts";



export class GroupAccessResponse extends BaseResponse {
    groupId: string = "";
    userId: string = "";
    lastReadMessageDate: string = "";



    constructor(init?: Partial<GroupAccessResponse>) {
        super(init);
        Object.assign(this, init);
    }



}