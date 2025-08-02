import { BaseResponse } from "./base-response";

export default class ChannelBanResponse extends BaseResponse{

    channelId: string = "";
     userId: string = "";
    reason: string = "";
  constructor(init?: Partial<ChannelBanResponse>) {
    super(init); 
    Object.assign(this, init);
  }
}