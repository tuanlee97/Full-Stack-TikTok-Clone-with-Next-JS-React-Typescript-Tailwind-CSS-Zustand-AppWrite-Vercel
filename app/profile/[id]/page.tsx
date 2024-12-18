"use client"

import BottomMenu from "@/app/components/BottomMenu"
import ClientOnly from "@/app/components/ClientOnly"
import PostUser from "@/app/components/profile/PostUser"
import { useUser } from "@/app/context/user"
import useUploadsUrl from "@/app/hooks/useUploadsUrl"
import MainLayout from "@/app/layouts/MainLayout"
import { useGeneralStore } from "@/app/stores/general"
import { usePostStore } from "@/app/stores/post"
import { useProfileStore } from "@/app/stores/profile"
import { ProfilePageTypes, User } from "@/app/types"
import { useEffect, useState } from "react"
import { BsPencil } from "react-icons/bs"

export default function Profile({ params }: ProfilePageTypes) {
    const contextUser = useUser();
    const [activeTab, setActiveTab] = useState<number>(0)
    let { postsByUser, setPostsByUser } = usePostStore()
    let { setCurrentProfile, currentProfile } = useProfileStore()
    let { isEditProfileOpen, setIsEditProfileOpen } = useGeneralStore()

    useEffect(() => {
        setCurrentProfile(params?.id)
        setPostsByUser(params?.id)
    }, [])

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
                                    <button className="flex item-center rounded-md py-1.5 px-8 mt-3 text-[15px] text-white font-semibold bg-[#F02C56]">
                                        Follow
                                    </button>
                                </div>

                            )}
                        </div>

                    </div>

                    <div className="flex items-center justify-center sm:justify-normal pt-4">
                        <div className="flex flex-col items-center sm:block mr-4">
                            <span className="font-bold">10K</span>
                            <span className="text-white sm:text-gray-500 font-light text-[15px] pl-1.5">Following</span>
                        </div>
                        <div className="flex flex-col items-center sm:block mr-4">
                            <span className="font-bold">44K</span>
                            <span className="text-white sm:text-gray-500 font-light text-[15px] pl-1.5">Followers</span>
                        </div>
                    </div>

                    <ClientOnly>
                        <p className="pt-4 mr-4 text-gray-500 font-light text-[15px] pl-1.5 max-w-[500px]">
                            {currentProfile?.bio}
                        </p>
                    </ClientOnly>

                    <ul className="w-full flex items-center pt-4 border-b">
                        <li onClick={() => setActiveTab(0)} className={`w-60 text-center py-2 text-[17px] font-semibold ${activeTab === 0 ? "border-b-2  border-b-white sm:border-b-black" : "text-gray-500"}`}>Videos</li>
                        <li onClick={() => setActiveTab(1)} className={`w-60 text-center py-2 text-[17px] font-semibold ${activeTab === 1 ? "border-b-2  border-b-white sm:border-b-black" : "text-gray-500"}`}>Liked</li>
                    </ul>

                    <ClientOnly>
                        <div className="mt-4 grid 2xl:grid-cols-6 xl:grid-cols-5 lg:grid-cols-4 md:grid-cols-3 grid-cols-2 gap-3">
                            {
                                activeTab === 0 && (
                                    postsByUser?.map(post => (<PostUser key={post.id} post={post} />))
                                )
                            }
                            {
                                activeTab === 1 && (
                                    <p className="text-center w-full">Comming soon.....</p>
                                )
                            }
                        </div>
                    </ClientOnly>

                    <div className="pb-20" />
                </div>
            </MainLayout>
        </>
    )
}
