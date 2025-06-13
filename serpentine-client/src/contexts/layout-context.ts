import { ChannelResponse } from '@/models/responses/channel-response';
import { create } from 'zustand';

interface Layout {
    sideBarExpanded: boolean;
    primaryColorBg: string
    primaryColorText: string

}

export enum CurrentRightBarViews{

    CrateChannelForm,
    TrendingPosts
}

interface LayoutState {
    layout: Layout;
    setLayout: (updates: Partial<Layout>) => void;
    currentRightBarView : CurrentRightBarViews | CurrentRightBarViews.TrendingPosts
    setCurrentRightBarView: (view : CurrentRightBarViews) => void;
    setNewChannel: (channel: ChannelResponse | null) => void;
    newChannel: ChannelResponse | null
    
}

export const useLayoutStore = create<LayoutState>((set) => ({
    layout: {
        primaryColorBg: "bg-green-700 dark:bg-green-800",
        primaryColorText: "text-green-700 dark:text-green-800",
        sideBarExpanded: false
    },
    newChannel: null,
    setNewChannel: (channel : ChannelResponse | null) => {

        set((state)=>({
            ...state,
            newChannel: channel
            }
        ))
    },
    
    currentRightBarView: CurrentRightBarViews.TrendingPosts,
    setCurrentRightBarView: (view: CurrentRightBarViews = CurrentRightBarViews.TrendingPosts) => {
        set((state) => ({
            ...state,
            currentRightBarView: view

        }));
    },
    
    setLayout: (updates: Partial<Layout>) => {
        set((state) => ({
            layout: {
                ...state.layout,
                ...updates
            }
        }));
    }
}));
