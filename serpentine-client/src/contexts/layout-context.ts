import { create } from 'zustand';

interface Layout {
    sideBarExpanded: boolean;
}

interface LayoutState {
    layout: Layout;
    setLayout: (updates: Partial<Layout>) => void;
}

export const useLayoutStore = create<LayoutState>((set) => ({
    layout: {
        sideBarExpanded: false
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
