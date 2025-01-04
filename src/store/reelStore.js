import { create } from "zustand";

const useReelStore = create((set) => ({
    reels: [],
    createReel: (reel) => set((state) => ({ reels: [reel, ...state.reels] })),
    deleteReel: (id) => set((state) => ({ reels: state.reels.filter((reel) => reel.id !== id) })),
    setReels: (reels) => set({ reels }),
    addLike: (reelId, userId) =>
        set((state) => ({
            reels: state.reels.map((reel) => {
                if (reel.id === reelId) {
                    return {
                        ...reel,
                        likes: [...reel.likes, userId],
                    };
                }
                return reel;
            }),
        })),
    removeLike: (reelId, userId) =>
        set((state) => ({
            reels: state.reels.map((reel) => {
                if (reel.id === reelId) {
                    return {
                        ...reel,
                        likes: reel.likes.filter((uid) => uid !== userId),
                    };
                }
                return reel;
            }),
        })),
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