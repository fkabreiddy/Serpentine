import { BaseResponse } from "./base-response";
import {ChannelMemberRoleResponse} from "@/models/responses/channel-member-role-response.ts";

export class ChannelMemberResponse extends BaseResponse {
    
  channelId: number = 0;
  userId: number = 0;
  isSilenced: boolean = false;
  isArchived: boolean = false;
  isOwner: boolean = false;
  lastAccess: Date = new Date();
  userProfilePictureUrl : string = "";
  userUsername : string = "";
  userName : string = "";
  isAdmin: boolean = false;

  constructor(init?: Partial<ChannelMemberResponse>) {
    super(init); 
    Object.assign(this, init);
  }
}