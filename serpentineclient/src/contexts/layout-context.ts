import { ChannelResponse } from "@/models/responses/channel-response";
import { RightPanelView } from "@/models/right-panel-view";
import { create } from "zustand";

interface Layout {
  sideBarExpanded: boolean;
  currentRightPanelView: RightPanelView | RightPanelView.DefaultView;
}

interface LayoutState {
  layout: Layout;
  setLayout: (updates: Partial<Layout>) => void;
}

export const useLayoutStore = create<LayoutState>((set) => ({
  layout: {
    sideBarExpanded: false,
    currentRightPanelView: RightPanelView.DefaultView,
  },

  setLayout: (updates: Partial<Layout>) => {
    set((state) => ({
      layout: {
        ...state.layout,
        ...updates,
      },
    }));
  },
}));
