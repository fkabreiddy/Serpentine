import { BaseResponse } from "./base-response";
import { ChannelMemberResponse } from "./channel-member-response";

export class ChannelResponse extends BaseResponse {
  name: string = '';
  description: string = '';
  adultContent: boolean = false;
  myMember: ChannelMemberResponse | null = null;
  membersCount: number = 0;
  coverPicture: string | null = null;
  bannerPicture: string | null = null;
  unreadMessages: number = 0;
  readonly userIsOwner: boolean = false;

  
 constructor(init?: Partial<ChannelResponse>) {
    super(init); 
    Object.assign(this, init);
    this.userIsOwner = this.myMember?.isOwner ?? false;
  }


  
}