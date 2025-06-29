import { BaseResponse } from "./base-response";

export class ChannelMemberResponse extends BaseResponse {
    
  channelId: number = 0;
  userId: number = 0;
  isSilenced: boolean = false;
  isArchived: boolean = false;
  isOwner: boolean = false;
  lastAccess: Date = new Date();

  constructor(init?: Partial<ChannelMemberResponse>) {
    super(init); 
    Object.assign(this, init);
  }
}