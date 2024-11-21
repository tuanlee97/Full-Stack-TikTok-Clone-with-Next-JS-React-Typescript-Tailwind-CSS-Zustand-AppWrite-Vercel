import ClientOnly from "@/app/components/ClientOnly"
import { useUser } from "@/app/context/user"
import useDeviceType from "@/app/hooks/useDeviceType"
import { useGeneralStore } from "@/app/stores/general"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { useEffect, useState } from "react"
import MenuItem from "./MenuItem"
import MenuItemFollow from "./MenuItemFollow"

export default function SideNavMain() {
    const [isMobile, setIsMobile] = useState(false);
    let { setRandomUsers, randomUsers } = useGeneralStore()

    const contextUser = useUser()
    const pathname = usePathname()
    const deviceType = useDeviceType();
    useEffect(() => {
        setRandomUsers()
        const checkMobileWidth = () => {
            if (window.innerWidth <= 768) {
                setIsMobile(true);  // Nếu độ rộng <= 768px, coi là mobile
            } else {
                setIsMobile(false); // Nếu lớn hơn 768px, không phải mobile
            }
        };
        checkMobileWidth();
        window.addEventListener('resize', checkMobileWidth);
        return () => {
            window.removeEventListener('resize', checkMobileWidth);
        };
    }, [])
    return (
        <>
            {deviceType !== 'mobile' ? (
                <div
                    id="SideNavMain"
                    className={`fixed z-20 bg-white pt-[70px] h-full lg:border-r-0 border-r w-[75px] overflow-auto lg:w-[240px]`}>

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
                                {randomUsers?.map((user, index) => (
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
                                        {randomUsers?.map((user, index) => (
                                            <MenuItemFollow key={index} user={user} />
                                        ))}
                                    </div>
                                </ClientOnly>

                                <button className="lg:block hidden text-[#F02C56] pt-1.5 pl-2 text-[13px]">See more</button>
                            </div>
                        ) : null}
                        <div className="lg:block hidden border-b lg:ml-2 mt-2" />

                        <div className="lg:block hidden text-[11px] text-gray-500">
                            <p className="pt-4 px-2">About Newsroom TikTok Shop Contact Careers ByteDance</p>
                            <p className="pt-4 px-2">TikTok for Good Advertise Developers Transparency TikTok Rewards TikTok Browse TikTok Embeds</p>
                            <p className="pt-4 px-2">Help Safety Terms Privacy Creator Portal Community Guidelines</p>
                            <p className="pt-4 px-2">© 2023 TikTok</p>
                        </div>

                        <div className="pb-14"></div>
                    </div>

                </div>
            ) :
                <div className="fixed bottom-0 w-full flex justify-between px-2 py-2 z-20 bg-black">
                    <Link className="flex-1" href="/">
                        <MenuItem
                            iconString="Home"
                            colorString={pathname == '/' ? '#FFFFFF' : ''}
                            sizeString="25"
                        />
                    </Link>
                    <Link className="flex-1" href="/">
                        <MenuItem iconString="Discover" colorString="#FFFFFF" sizeString="25" />
                    </Link>
                    <Link className="flex-1" href="/">
                        <MenuItem iconString="Inbox" colorString="#FFFFFF" sizeString="25" />
                    </Link>
                    <Link className="flex-1" href="/">
                        <MenuItem iconString="Profile" colorString="#FFFFFF" sizeString="25" />
                    </Link>

                </div>
            }
        </>
    )
}
