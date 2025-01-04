import { create } from "zustand";

const useReelStore = create((set) => ({
    reels: [],
    createReel: (reel) => set((state) => ({ reels: [reel, ...state.reels] })),
    deleteReel: (id) => set((state) => ({ reels: state.reels.filter((reel) => reel.id !== id) })),
    setReels: (reels) => set({ reels }),
    addComment: (reelId, comment) =>
        set((state) => ({
            reels: state.reels.map((reel) => {
                if (reel.id === reelId) {
                    return {
                        ...reel,
                        comments: [...reel.comments, comment],
                    };
                }
                return reel;
            }),
        })),
}));

export default useReelStore;