import { create } from 'zustand';
import { createJSONStorage, devtools, persist } from 'zustand/middleware';
import useGetAllPosts from '../hooks/useGetAllPosts';
import useGetAllPostsFollowing from '../hooks/useGetAllPostsFollowing';
import useGetPostById from '../hooks/useGetPostById';
import useGetPostsByUser from '../hooks/useGetPostsByUserId';
import useGetPostsLikedByUserId from '../hooks/useGetPostsLikedByUserId';
import { Post, PostWithProfile } from '../types';

interface PostStore {
    allPosts: PostWithProfile[];
    total: number,
    postsByUser: Post[];
    postsLikedByUser: Post[];
    postById: PostWithProfile | null;
    setAllPosts: () => void;
    setAllPostsFollowing: () => void;
    setPostsByUser: (userId: string) => void;
    setPostsLikedByUser: () => void;
    setPostById: (postId: string) => void;
    clearAllPosts: () => void;
}

export const usePostStore = create<PostStore>()(
    devtools(
        persist(
            (set) => ({
                allPosts: [],
                allPostsFollowing: [],
                postsByUser: [],
                postsLikedByUser: [],
                postById: null,
                total: 0,
                setAllPosts: async () => {
                    const result = await useGetAllPosts()
                    set({
                        allPosts: result.videos,
                        total: result.total
                    });

                },
                setAllPostsFollowing: async () => {
                    const result = await useGetAllPostsFollowing()
                    set({
                        allPosts: result.videos,
                        total: result.total
                    });
                },
                setPostsByUser: async (userId: string) => {
                    const result = await useGetPostsByUser(userId)
                    set({ postsByUser: result });
                },
                setPostsLikedByUser: async () => {
                    const result = await useGetPostsLikedByUserId()
                    set({ postsLikedByUser: result });
                },
                setPostById: async (postId: string) => {

                    const result = await useGetPostById(postId)
                    set({ postById: result })
                },
                clearAllPosts: () => set({ allPosts: [] }),
            }),
            {
                name: 'store',
                storage: createJSONStorage(() => localStorage)
            }
        )
    )
)
