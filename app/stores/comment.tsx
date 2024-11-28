import { create } from 'zustand';
import { createJSONStorage, devtools, persist } from 'zustand/middleware';
import useGetCommentsByPostId from '../hooks/useGetCommentsByPostId';
import { CommentWithProfile } from '../types';

interface CommentStore {
    commentsByPost: CommentWithProfile[];
    loading: boolean;  // Thêm loading state
    error: string | null;  // Thêm error state
    setCommentsByPost: (postId: string) => void;
    clearComments: () => void;
}

export const useCommentStore = create<CommentStore>()(
    devtools(
        persist(
            (set) => ({
                commentsByPost: [],
                loading: false,
                error: null,
                setCommentsByPost: async (postId: string) => {
                    console.log("setCommentsByPost")
                    set({ loading: true, error: null }); // Bắt đầu tải dữ liệu

                    try {
                        const result = await useGetCommentsByPostId(postId);
                        set({ commentsByPost: result, loading: false }); // Cập nhật khi tải xong
                    } catch (error) {
                        set({ error: "Không thể tải bình luận. Vui lòng thử lại.", loading: false });
                    }
                },
                clearComments: () => set({ commentsByPost: [], loading: false, error: null }), // Clear state khi clear comments
            }),
            {
                name: 'store',
                storage: createJSONStorage(() => localStorage),
            }
        )
    )
);
