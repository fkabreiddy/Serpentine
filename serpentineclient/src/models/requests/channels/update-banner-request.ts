import z from "zod";

export interface UpdateChannelBannerRequest{

    channelId: string,
    bannerPictureFile: File | null
}