"use client"

import BottomMenu from "@/app/components/BottomMenu"
import ClientOnly from "@/app/components/ClientOnly"
import PostUser from "@/app/components/profile/PostUser"
import { useUser } from "@/app/context/user"
import useCreateFollow from "@/app/hooks/useCreateFollow"
import useIsFollow from "@/app/hooks/useIsFollow"
import useUnFollow from "@/app/hooks/useUnFollow"
import useUploadsUrl from "@/app/hooks/useUploadsUrl"
import MainLayout from "@/app/layouts/MainLayout"
import { useGeneralStore } from "@/app/stores/general"
import { usePostStore } from "@/app/stores/post"
import { useProfileStore } from "@/app/stores/profile"
import { ProfilePageTypes, User } from "@/app/types"
import { useRouter } from "next/navigation"
import { useEffect, useState } from "react"
import { AiOutlinePlus } from "react-icons/ai"
import { BsPencil } from "react-icons/bs"

export default function Profile({ params }: ProfilePageTypes) {
    const contextUser = useUser();
    const router = useRouter()
    const [activeTab, setActiveTab] = useState<number>(0)
    const [isFollow, setIsFollow] = useState<boolean>(false)
    let { postsByUser, postsLikedByUser, setPostsByUser, setPostsLikedByUser } = usePostStore()
    let { setCurrentProfile, currentProfile } = useProfileStore()
    let { isEditProfileOpen, setIsEditProfileOpen } = useGeneralStore()
    const { setIsLoginOpen } = useGeneralStore();

    const handleFollow = async () => {
        if (!contextUser?.user) return setIsLoginOpen(true);
        try {
            if (isFollow) {
                await useUnFollow(params?.id);
                setIsFollow(false)
            }
            else {
                await useCreateFollow(params?.id);
                setIsFollow(true)
            }
        } catch (error: any) {
            if (error.response && error.response.status === 401) {
                console.error('Unauthorized access, logging out...');
                // Handle 401 Unauthorized error
                contextUser?.logout();  // Assuming logout method exists in the context
            } else {
                // Handle other errors
                console.error('Error:', error.message);
            }
        }

    }
    useEffect(() => {
        setCurrentProfile(params?.id)
        setPostsByUser(params?.id)
        if (contextUser?.user) {
            checkIsFollow();

            if (params?.id === contextUser?.user?.id) {
                setPostsLikedByUser();
            }
        }
    }, [isFollow])
    const goTo = () => {
        if (!contextUser?.user) return setIsLoginOpen(true)
        router.push('/upload')
    }
    const checkIsFollow = async () => {
        try {
            const isFollow = await useIsFollow(params?.id);
            setIsFollow(isFollow);
        } catch (error: any) {
            if (error.response && error.response.status === 401) {
                console.error('Unauthorized access, logging out...');
                // Handle 401 Unauthorized error
                contextUser?.logout();  // Assuming logout method exists in the context
            } else {
                // Handle other errors
                console.error('Error:', error.message);
            }
        }

    }

    return (
        <>
            <MainLayout>
                <div className="p-4 w-full sm:pt-[90px] sm:ml-[90px] 2xl:pl-[240px] lg:pl-[200px] lg:pr-0 sm:w-[calc(100%-90px)] sm:pr-3 sm:max-w-[1800px] 2xl:mx-auto">

                    <div className="flex flex-col sm:flex-row w-full sm:w-[calc(100vw-240px)]">

                        <ClientOnly>
                            <div className="w-full text-right">
                                <BottomMenu />
                            </div>
                            <div className="flex flex-col justify-center items-center">
                                {(currentProfile as User)?.name ? (
                                    <p className="block sm:hidden text-sm mb-5 font-bold truncate">{currentProfile?.name}</p>
                                ) : (
                                    <div className="block sm:hidden  h-[60px]" />
                                )}

                                {currentProfile ? (
                                    <img className="w-[100px] sm:w-[120px] sm:min-w-[120px] rounded-full" src={useUploadsUrl(currentProfile?.image)} />
                                ) : (
                                    <div className="min-w-[150px] h-[120px] bg-gray-200 rounded-full" />
                                )}
                            </div>
                        </ClientOnly>

                        <div className="text-center sm:text-left sm:ml-5 w-full">
                            <ClientOnly>
                                {(currentProfile as User)?.name ? (
                                    <div>
                                        <p className="hidden sm:block text-[30px] font-bold truncate">{currentProfile?.name}</p>
                                        <p className="text-sm font-bold mt-4 sm:mt-0 sm:font-normal sm:text-[18px] truncate lowercase">@{currentProfile?.name}</p>
                                    </div>
                                ) : (
                                    <div className="h-[60px]" />
                                )}
                            </ClientOnly>


                            {contextUser?.user?.id == params?.id ? (
                                <div className="flex justify-center sm:block  sm:text-left">
                                    <button
                                        onClick={() => setIsEditProfileOpen(isEditProfileOpen = !isEditProfileOpen)}
                                        className="flex item-center rounded-md py-1.5 px-3.5 mt-3 text-[15px] font-semibold border hover:bg-gray-100"
                                    >
                                        <BsPencil className="mt-0.5 mr-1" size="18" />
                                        <span>Edit profile</span>
                                    </button>
                                </div>
                            ) : (
                                <div className="flex item-center justify-center sm:justify-start">

                                    <button onClick={() => handleFollow()} className={`flex item-center rounded-md py-1.5 px-8 mt-3 text-[15px] text-white font-semibold ${isFollow ? "bg-gray-500" : "bg-[#F02C56]"} hover:bg-[#F02C56]`}>
                                        {isFollow ? "UnFollow" : "Follow"}
                                    </button>
                                </div>

                            )}
                        </div>

                    </div>

                    <div className="flex items-center justify-center sm:justify-normal pt-4">
                        <div className="flex flex-col items-center sm:block mr-4">
                            <span className="font-bold">{currentProfile?.followingCount}</span>
                            <span className="text-white sm:text-gray-500 font-light text-[15px] pl-1.5">Following</span>
                        </div>
                        <div className="flex flex-col items-center sm:block mr-4">
                            <span className="font-bold">{currentProfile?.followersCount}</span>
                            <span className="text-white sm:text-gray-500 font-light text-[15px] pl-1.5">Followers</span>
                        </div>
                    </div>

                    <ClientOnly>
                        <p className="pt-4 mr-4 text-white text-center font-light text-[15px] pl-1.5 max-w-[500px]">
                            {currentProfile?.bio}
                        </p>
                    </ClientOnly>

                    <ul className="w-full flex items-center pt-4 border-b">
                        <li onClick={() => setActiveTab(0)} className={`w-60 text-center py-2 text-[17px] font-semibold ${activeTab === 0 ? "border-b-2  border-b-white sm:border-b-black" : "text-gray-500"}`}>Videos</li>
                        {contextUser?.user?.id === params.id && (
                            <li onClick={() => setActiveTab(1)} className={`w-60 text-center py-2 text-[17px] font-semibold ${activeTab === 1 ? "border-b-2  border-b-white sm:border-b-black" : "text-gray-500"}`}>Liked</li>
                        )}
                    </ul>

                    <ClientOnly>
                        {/* Tab first - User Video */}
                        {
                            activeTab === 0 && (
                                postsByUser.length > 0 ? (
                                    <div className="mt-4 grid 2xl:grid-cols-6 xl:grid-cols-5 lg:grid-cols-4 md:grid-cols-3 grid-cols-2 gap-3">
                                        {postsByUser.map(post => (<PostUser key={post.id} post={post} />))}
                                    </div>
                                )
                                    :
                                    (
                                        <div className="flex flex-col justify-center sm:justify-start items-center p-5">
                                            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width={80} height={80} fill={"none"}>
                                                <path d="M2.5 12C2.5 7.52166 2.5 5.28249 3.89124 3.89124C5.28249 2.5 7.52166 2.5 12 2.5C16.4783 2.5 18.7175 2.5 20.1088 3.89124C21.5 5.28249 21.5 7.52166 21.5 12C21.5 16.4783 21.5 18.7175 20.1088 20.1088C18.7175 21.5 16.4783 21.5 12 21.5C7.52166 21.5 5.28249 21.5 3.89124 20.1088C2.5 18.7175 2.5 16.4783 2.5 12Z" stroke="currentColor" strokeWidth="1.5" />
                                                <circle cx="16.5" cy="7.5" r="1.5" stroke="currentColor" strokeWidth="1.5" />
                                                <path d="M16 22C15.3805 19.7749 13.9345 17.7821 11.8765 16.3342C9.65761 14.7729 6.87163 13.9466 4.01569 14.0027C3.67658 14.0019 3.33776 14.0127 3 14.0351" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round" />
                                                <path d="M13 18C14.7015 16.6733 16.5345 15.9928 18.3862 16.0001C19.4362 15.999 20.4812 16.2216 21.5 16.6617" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round" />
                                            </svg>
                                            Share your videos
                                            <button
                                                onClick={() => goTo()}
                                                className="flex items-center border rounded-sm py-[6px] my-5 hover:bg-gray-100 pl-1.5"
                                            >
                                                <AiOutlinePlus size="22" />
                                                <span className="px-2 font-medium text-[15px]">Upload</span>
                                            </button>
                                        </div>
                                    )
                            )
                        }
                        {/* Tab second - Liked Video */}
                        {
                            contextUser?.user?.id === params.id && activeTab === 1 && (

                                postsLikedByUser?.length > 0 ? (
                                    <div className="mt-4 grid 2xl:grid-cols-6 xl:grid-cols-5 lg:grid-cols-4 md:grid-cols-3 grid-cols-2 gap-3">
                                        {postsLikedByUser?.map(post => (<PostUser key={post.id} post={post} />))}
                                    </div>
                                )
                                    : (
                                        <div className="flex flex-col justify-center items-center  p-5">You haven't liked any videos</div>
                                    )
                            )
                        }

                    </ClientOnly>

                    <div className="pb-20" />
                </div >
            </MainLayout >
        </>
    )
}
