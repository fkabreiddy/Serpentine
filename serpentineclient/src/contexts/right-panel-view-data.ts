import { ChannelResponse } from "@/models/responses/channel-response";
import { create } from "zustand"

interface RightPanelViewData{

    channelInfoId: string | null,
    channelToUpdateId: string | null,
    groupInfoId: string | null,
    createGroupChannelData: Partial<ChannelResponse> | null
    groupIdToUpdate: string | null


}

interface RightPanelViewModel{

    rightPanelData: RightPanelViewData
    setRightPanelViewData: (data: Partial<RightPanelViewData>) => void;
    resetRightPanelViewData: ()=> void;
}



export const useRightPanelViewData = create<RightPanelViewModel>((set) => ({

    rightPanelData: {
        channelInfoId: null,
        channelToUpdateId: null,
        groupInfoId: null,
        createGroupChannelData: null,
        groupIdToUpdate: null
    },
    setRightPanelViewData: (update: Partial<RightPanelViewData>) => {
        set((state) => ({
        ...state,
        rightPanelData: {
            ...state.rightPanelData,
            ...update,
        },
        }));
    },

    resetRightPanelViewData: () => {
        set((state) => ({
            ...state,
            rightPanelData: {
            channelInfoId: null,
                groupInfoId: null,
                createGroupChannelData: null,
                groupIdToUpdate: null,
                channelToUpdateId: null

            },
        }));
    },

}))