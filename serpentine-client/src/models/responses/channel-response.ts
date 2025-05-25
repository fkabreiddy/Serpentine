import { ChannelMemberResponse } from "./channel-member-response";

export class ChannelResponse extends BaseResponse {
  name: string = '';
  description: string = '';
  adultContent: boolean = false;
  myMember: ChannelMemberResponse = new ChannelMemberResponse();
  membersCount: number = 0;
  readonly userIsOwner: boolean = this.myMember.isOwner;

 constructor(init?: Partial<ChannelResponse>) {
    super(init); 
    Object.assign(this, init);
  }


  
}