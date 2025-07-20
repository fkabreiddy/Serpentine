import {BaseResponse} from "@/models/responses/base-response.ts";



export class GroupAccessResponse extends BaseResponse {
    groupId: string = "";
    userId: string = "";
    lastAccess: Date = new Date();



    constructor(init?: Partial<GroupAccessResponse>) {
        super(init);
        Object.assign(this, init);
    }



}