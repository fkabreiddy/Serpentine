import { ChannelMemberResponse } from "./channel-member-response";

export class ChannelResponse extends BaseResponse {
  name: string = '';
  description: string = '';
  adultContent: boolean = false;
  myMember: ChannelMemberResponse = new ChannelMemberResponse();
  membersCount: number = 0;
  channelCoverPicture: string | null = null;
  channelBannerPicture: string | null = null;
  readonly userIsOwner: boolean = false;

  
 constructor(init?: Partial<ChannelResponse>) {
    super(init); 
    Object.assign(this, init);
    this.userIsOwner = this.myMember.isOwner;
  }


  
}