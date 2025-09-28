import { BaseResponse } from "./base-response";

export class ChannelMemberResponse extends BaseResponse {
    
  channelId: string = "";
  userId: string = "";
  isSilenced: boolean = false;
  isArchived: boolean = false;
  isOwner: boolean = false;
  isOverage: boolean = false;
  lastAccess: Date = new Date();
  userProfilePictureUrl : string = "";
  userUsername : string = "";
  userName : string = "";
  isAdmin: boolean = false;
  isActive: boolean = false;


  constructor(init?: Partial<ChannelMemberResponse>) {
    super(init); 
    Object.assign(this, init);
  }
}