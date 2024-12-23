import { useUser } from "@/app/context/user"

import ClientOnly from "@/app/components/ClientOnly"
import { useGeneralStore } from "@/app/stores/general"
import Link from "next/link"
import { usePathname, useRouter } from "next/navigation"
import { useEffect } from "react"
import MenuItem from "./MenuItem"
import MenuItemFollow from "./MenuItemFollow"

export default function SideNavMain({ deviceType }: { deviceType: string }) {
    const router = useRouter()
    let { setRandomUsers, randomUsers } = useGeneralStore()
    let { setIsLoginOpen } = useGeneralStore();

    const contextUser = useUser()
    const pathname = usePathname()

    useEffect(() => {
        setRandomUsers()
    }, [])
    const checkLogin = (type: string) => {
        if (!contextUser?.user?.id) {
            setIsLoginOpen(true)
            return
        }
        if (type == 'profile') return router.push(`/profile/${contextUser?.user?.id}`)
        if (type == 'inbox') return router.push(`/inbox/${contextUser?.user?.id}`)
    }

    return (
        <>
            {deviceType !== 'mobile' ? (
                <div
                    id="SideNavMain"
                    className={`fixed z-10 bg-white mt-[70px] h-full lg:border-r-0 border-r w-[75px] overflow-auto lg:w-[240px]`}>
                    <div className="lg:w-full w-[55px] mx-auto">
                        <Link href="/">
                            <MenuItem
                                iconString="For You"
                                colorString={pathname == '/' ? '#F02C56' : ''}
                                sizeString="25"
                            />
                        </Link>
                        <MenuItem iconString="Following" colorString="#000000" sizeString="25" />
                        <MenuItem iconString="LIVE" colorString="#000000" sizeString="25" />

                        <div className="border-b lg:ml-2 mt-2" />
                        <h3 className="lg:block hidden text-xs text-gray-600 font-semibold pt-4 pb-2 px-2">Suggested accounts</h3>

                        <div className="lg:hidden block pt-3" />
                        <ClientOnly>
                            <div className="cursor-pointer">
                                {randomUsers?.filter(user => user.id + "" !== contextUser?.user?.id).map((user, index) => (
                                    <MenuItemFollow key={index} user={user} />
                                ))}
                            </div>
                        </ClientOnly>

                        <button className="lg:block hidden text-[#F02C56] pt-1.5 pl-2 text-[13px]">See all</button>

                        {contextUser?.user?.id ? (
                            <div >
                                <div className="border-b lg:ml-2 mt-2" />
                                <h3 className="lg:block hidden text-xs text-gray-600 font-semibold pt-4 pb-2 px-2">Following accounts</h3>

                                <div className="lg:hidden block pt-3" />
                                <ClientOnly>
                                    <div className="cursor-pointer">
                                        {randomUsers?.filter(user => user.id + "" !== contextUser?.user?.id).map((user, index) => (
                                            <MenuItemFollow key={index} user={user} />
                                        ))}
                                    </div>
                                </ClientOnly>

                                <button className="lg:block hidden text-[#F02C56] pt-1.5 pl-2 text-[13px]">See more</button>
                            </div>
                        ) : null}
                        <div className="lg:block hidden border-b lg:ml-2 mt-2" />

                        <div className="lg:block hidden text-[11px] text-gray-500">
                            <p className="pt-4 px-2">About Newsroom ChatNail Shop Contact Careers ByteDance</p>
                            <p className="pt-4 px-2">ChatNail for Good Advertise Developers Transparency ChatNail Rewards ChatNail Browse ChatNail Embeds</p>
                            <p className="pt-4 px-2">Help Safety Terms Privacy Creator Portal Community Guidelines</p>
                            <p className="pt-4 px-2">© 2023 ChatNail</p>
                        </div>

                        <div className="pb-14"></div>
                    </div>

                </div>
            ) :
                <div className="fixed bottom-0 w-full flex justify-between px-2 py-2 z-20 bg-black">
                    <Link className="flex-1 w-full flex items-center justify-center" href="/">
                        {
                            pathname == '/' ?
                                <svg width="2.5em" height="2.5em" data-e2e viewBox="0 0 48 48" fill="#FFF" xmlns="http://www.w3.org/2000/svg"><path fillRule="evenodd" clipRule="evenodd" d="M24.9505 7.84001C24.3975 7.38666 23.6014 7.38666 23.0485 7.84003L6.94846 21.04C6.45839 21.4418 6.2737 22.1083 6.48706 22.705C6.70041 23.3017 7.26576 23.7 7.89949 23.7H10.2311L11.4232 36.7278C11.5409 38.0149 12.6203 39 13.9128 39H21.5C22.0523 39 22.5 38.5523 22.5 38V28.3153C22.5 27.763 22.9477 27.3153 23.5 27.3153H24.5C25.0523 27.3153 25.5 27.763 25.5 28.3153V38C25.5 38.5523 25.9477 39 26.5 39H34.0874C35.3798 39 36.4592 38.0149 36.577 36.7278L37.7691 23.7H40.1001C40.7338 23.7 41.2992 23.3017 41.5125 22.705C41.7259 22.1082 41.5412 21.4418 41.0511 21.04L24.9505 7.84001Z" /></svg>
                                :
                                <svg width="2.5em" height="2.5em" data-e2e viewBox="0 0 48 48" fill="#FFF" xmlns="http://www.w3.org/2000/svg"><path fillRule="evenodd" clipRule="evenodd" d="M23.0484 7.84003C23.6014 7.38666 24.3975 7.38666 24.9504 7.84001L41.051 21.04C41.5411 21.4418 41.7258 22.1082 41.5125 22.705C41.2991 23.3017 40.7338 23.7 40.1 23.7H37.769L36.5769 36.7278C36.4592 38.0149 35.3798 39 34.0873 39H13.9127C12.6202 39 11.5409 38.0149 11.4231 36.7278L10.231 23.7H7.89943C7.2657 23.7 6.70035 23.3017 6.487 22.705C6.27364 22.1083 6.45833 21.4418 6.9484 21.04L23.0484 7.84003ZM23.9995 10.9397L12.0948 20.7H12.969L14.369 36H22.4994V28.3138C22.4994 27.7616 22.9471 27.3138 23.4994 27.3138H24.4994C25.0517 27.3138 25.4994 27.7616 25.4994 28.3138V36H33.631L35.031 20.7H35.9045L23.9995 10.9397Z" /></svg>
                        }
                    </Link>
                    <Link className="flex-1 w-full flex items-center justify-center" href="/discover">
                        {
                            pathname == '/discover' ?
                                <svg width="2.5em" data-e2e height="2.5em" viewBox="0 0 36 36" fill="#fff" xmlns="http://www.w3.org/2000/svg"><path fillRule="evenodd" clipRule="evenodd" d="M18 30.375C24.8345 30.375 30.375 24.8345 30.375 18C30.375 11.1655 24.8345 5.625 18 5.625C11.1655 5.625 5.625 11.1655 5.625 18C5.625 24.8345 11.1655 30.375 18 30.375ZM21.3223 19.4671C21.2331 19.9188 20.9578 20.312 20.5638 20.5503L13.9071 24.5756C13.5424 24.7961 13.0892 24.4788 13.1717 24.0606L14.6776 16.4287C14.7667 15.977 15.042 15.5837 15.436 15.3455L22.0927 11.3202C22.4574 11.0997 22.9106 11.417 22.8281 11.8351L21.3223 19.4671Z" /><path d="M16.4392 20.1662L18.9851 18.6267L19.5611 15.7077L17.0151 17.2473L16.4392 20.1662Z" /></svg>

                                :
                                <svg width="2.5em" data-e2e height="2.5em" viewBox="0 0 36 36" fill="#fff" xmlns="http://www.w3.org/2000/svg" style={{ fillOpacity: '0.75' }}><path fillRule="evenodd" clipRule="evenodd" d="M18 28.0547C23.553 28.0547 28.0547 23.5531 28.0547 18C28.0547 12.4469 23.553 7.94531 18 7.94531C12.4469 7.94531 7.94531 12.4469 7.94531 18C7.94531 23.5531 12.4469 28.0547 18 28.0547ZM30.375 18C30.375 24.8345 24.8345 30.375 18 30.375C11.1655 30.375 5.625 24.8345 5.625 18C5.625 11.1655 11.1655 5.625 18 5.625C24.8345 5.625 30.375 11.1655 30.375 18Z" /><path fillRule="evenodd" clipRule="evenodd" d="M20.3508 20.3864C20.712 20.1679 20.9645 19.8074 21.0462 19.3932L22.427 12.3948C22.5027 12.0113 22.0871 11.7204 21.7527 11.9226L15.6486 15.6137C15.2874 15.8322 15.0349 16.1928 14.9532 16.6069L13.5724 23.6053C13.4967 23.9888 13.9123 24.2797 14.2467 24.0775L20.3508 20.3864ZM16.5684 20.0442L18.9029 18.6325L19.431 15.9559L17.0965 17.3676L16.5684 20.0442Z" /></svg>

                        }
                    </Link>
                    <div className="flex-1 w-full flex items-center justify-center cursor-pointer" onClick={() => checkLogin("inbox")}>
                        {
                            pathname.startsWith('/inbox') ?
                                <svg width="2.5em" data-e2e height="2.5em" viewBox="0 0 48 48" fill="#fff" xmlns="http://www.w3.org/2000/svg"><path fillRule="evenodd" clipRule="evenodd" d="M11.4977 9C10.1195 9 9.0013 10.1153 8.99767 11.4934L8.94239 32.4934C8.93875 33.8767 10.0591 35 11.4424 35H18.7895L22.0656 39.004C23.0659 40.2265 24.9352 40.2264 25.9354 39.0039L29.2111 35H36.5587C37.942 35 39.0623 33.8767 39.0587 32.4934L39.0029 11.4934C38.9993 10.1152 37.8811 9 36.5029 9H11.4977ZM29 21H19C18.4477 21 18 21.4477 18 22V23C18 23.5523 18.4477 24 19 24H29C29.5523 24 30 23.5523 30 23V22C30 21.4477 29.5523 21 29 21Z" /></svg>

                                :
                                <svg width="2.5em" data-e2e height="2.5em" viewBox="0 0 32 32" fill="#fff" xmlns="http://www.w3.org/2000/svg" style={{ fillOpacity: '0.75' }}><path fillRule="evenodd" clipRule="evenodd" d="M24.0362 21.3333H18.5243L15.9983 24.4208L13.4721 21.3333H7.96047L7.99557 8H24.0009L24.0362 21.3333ZM24.3705 23.3333H19.4721L17.2883 26.0026C16.6215 26.8176 15.3753 26.8176 14.7084 26.0026L12.5243 23.3333H7.62626C6.70407 23.3333 5.95717 22.5845 5.9596 21.6623L5.99646 7.66228C5.99887 6.74352 6.74435 6 7.66312 6H24.3333C25.2521 6 25.9975 6.7435 26 7.66224L26.0371 21.6622C26.0396 22.5844 25.2927 23.3333 24.3705 23.3333ZM12.6647 14C12.2965 14 11.998 14.2985 11.998 14.6667V15.3333C11.998 15.7015 12.2965 16 12.6647 16H19.3313C19.6995 16 19.998 15.7015 19.998 15.3333V14.6667C19.998 14.2985 19.6995 14 19.3313 14H12.6647Z" /></svg>

                        }
                    </div>
                    <div className="flex-1 w-full flex items-center justify-center cursor-pointer" onClick={() => checkLogin("profile")}>
                        {
                            pathname.startsWith('/profile') ?
                                <svg width="2.5em" data-e2e height="2.5em" viewBox="0 0 48 48" fill="#fff" xmlns="http://www.w3.org/2000/svg"><path fillRule="evenodd" clipRule="evenodd" d="M24.0003 8.5C19.3059 8.5 15.5003 12.3056 15.5003 17C15.5003 21.6944 19.3059 25.5 24.0003 25.5C28.6947 25.5 32.5003 21.6944 32.5003 17C32.5003 12.3056 28.6947 8.5 24.0003 8.5ZM24.0003 27.5C17.824 27.5 13.0161 31.3744 11.0087 36.877C10.5186 38.2204 11.5522 39.5363 12.88 39.5363H35.1186C36.4468 39.5363 37.4805 38.2196 36.9896 36.876C34.9805 31.3773 30.1772 27.5 24.0003 27.5Z" /></svg>

                                :
                                <svg width="2.5em" data-e2e height="2.5em" viewBox="0 0 48 48" fill="#fff" xmlns="http://www.w3.org/2000/svg" style={{ fillOpacity: '0.75' }}><path fillRule="evenodd" clipRule="evenodd" d="M24.0001 11.5C20.9625 11.5 18.5001 13.9624 18.5001 17C18.5001 20.0376 20.9625 22.5 24.0001 22.5C27.0377 22.5 29.5001 20.0376 29.5001 17C29.5001 13.9624 27.0377 11.5 24.0001 11.5ZM15.5001 17C15.5001 12.3056 19.3057 8.5 24.0001 8.5C28.6945 8.5 32.5001 12.3056 32.5001 17C32.5001 21.6944 28.6945 25.5 24.0001 25.5C19.3057 25.5 15.5001 21.6944 15.5001 17ZM24.0001 30.5C19.1458 30.5 15.0586 33.7954 13.8578 38.2712C13.7147 38.8046 13.2038 39.1741 12.6591 39.0827L11.6729 38.9173C11.1282 38.8259 10.7571 38.3085 10.8888 37.7722C12.3362 31.8748 17.6559 27.5 24.0001 27.5C30.3443 27.5 35.664 31.8748 37.1114 37.7722C37.2431 38.3085 36.872 38.8259 36.3273 38.9173L35.3411 39.0827C34.7964 39.1741 34.2855 38.8046 34.1424 38.2712C32.9416 33.7954 28.8544 30.5 24.0001 30.5Z" /></svg>


                        }
                    </div>

                </div>
            }
        </>
    )
}
