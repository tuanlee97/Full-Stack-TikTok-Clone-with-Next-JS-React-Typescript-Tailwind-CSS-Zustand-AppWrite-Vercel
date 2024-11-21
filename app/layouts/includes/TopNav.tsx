import { useUser } from "@/app/context/user";
import useCreateBucketUrl from "@/app/hooks/useCreateBucketUrl";
import useSearchProfilesByName from "@/app/hooks/useSearchProfilesByName";
import { useGeneralStore } from "@/app/stores/general";
import { RandomUsers } from "@/app/types";
import { debounce } from "debounce";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { AiOutlinePlus } from "react-icons/ai";
import { BiSearch, BiUser } from "react-icons/bi";
import { BsThreeDotsVertical } from "react-icons/bs";
import { FiLogOut } from "react-icons/fi";

export default function TopNav() {
    const userContext = useUser()
    const router = useRouter()
    const pathname = usePathname()

    const [searchProfiles, setSearchProfiles] = useState<RandomUsers[]>([])
    let [showMenu, setShowMenu] = useState<boolean>(false)
    let { setIsLoginOpen, setIsEditProfileOpen } = useGeneralStore()

    useEffect(() => { setIsEditProfileOpen(false) }, [])

    const handleSearchName = debounce(async (event: { target: { value: string } }) => {
        if (event.target.value == "") return setSearchProfiles([])

        try {
            const result = await useSearchProfilesByName(event.target.value)
            if (result) return setSearchProfiles(result)
            setSearchProfiles([])
        } catch (error) {
            console.log(error)
            setSearchProfiles([])
            alert(error)
        }
    }, 500)

    const goTo = () => {
        if (!userContext?.user) return setIsLoginOpen(true)
        router.push('/upload')
    }

    return (
        <>
            <div id="TopNav" className="fixed bg-white z-30 flex items-center w-full border-b h-[60px]">
                <div className={`flex items-center justify-between gap-6 w-full px-4 mx-auto `}>

                    <Link href="/">
                        <div className="min-w-[115px]">
                            <svg className=" py-2" width={187} height={53} viewBox="0 0 187 53" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <g clipPath="url(#clip0_654_4130)">
                                    <path d="M28.4877 0C28.4975 0 28.5059 0 28.5156 0.00140785C29.2266 0.0394199 29.8495 0.112628 30.5562 0.266084C32.506 0.68844 34.46 1.09109 36.3608 1.80205C46.0539 5.42445 53.015 15.4343 53.1449 25.8721C53.2678 35.7341 49.1252 43.245 41.2129 48.8116C41.0048 48.9581 40.7911 49.0932 40.5747 49.2255C39.6445 49.7943 38.6835 49.9407 38.0522 48.8961C37.4545 47.905 37.8567 46.9702 38.7911 46.4028C40.6305 45.2864 42.2269 43.8954 43.713 42.3482C53.7189 31.9188 51.1658 13.8969 38.6821 6.69434C35.0452 4.59664 31.2043 3.35069 26.9849 3.44501C24.1175 3.50977 22.7627 5.14992 23.1146 8.04587C23.4554 10.8489 24.6175 13.2972 26.0714 15.6722C28.5436 19.7071 30.911 23.8068 33.33 27.8755C33.3314 27.8783 33.3328 27.8797 33.3342 27.8825C33.5647 28.2626 34.1597 28.119 34.196 27.6741C34.2225 27.3377 34.1569 27.0068 34.1513 26.6957C34.0884 22.3637 34.7686 18.1641 36.2868 14.1067C36.6807 13.055 37.2938 12.2117 38.5383 12.6664C39.8763 13.155 39.7269 14.2249 39.3358 15.3428C36.7282 22.8044 37.0885 30.2773 39.3428 37.7347C39.6654 38.8032 39.8791 39.8267 38.6891 40.3631C37.5411 40.8798 36.819 40.1548 36.2407 39.1791C31.4668 31.1206 26.6455 23.0902 21.9023 15.0133C20.5196 12.658 19.7807 10.0746 19.8115 7.28423C19.8534 3.52104 21.3073 1.59791 24.7865 0.430803C24.8479 0.409685 24.9639 0.370265 25.0267 0.353371C25.7432 0.154864 26.6092 0.0492748 27.3522 0.00563141C27.3648 0 27.3745 0 27.3857 0H28.4877Z" fill="#D3427A" />
                                    <path d="M19.6764 24.5616C19.6988 27.8053 19.6555 30.9054 19.0465 33.9689C18.696 35.7287 18.1317 37.4167 17.5674 39.1061C17.1917 40.2282 16.3914 40.8054 15.2056 40.3366C14.0045 39.8622 14.1428 38.9133 14.4891 37.9024C17.066 30.3943 16.8775 22.8792 14.4975 15.3712C14.1651 14.3237 13.9724 13.2932 15.1693 12.7314C16.4235 12.1429 17.1303 12.9567 17.7253 13.9577C22.3008 21.6628 26.8903 29.3596 31.4659 37.0662C32.8067 39.3243 33.7243 41.7642 34.1168 44.3574C34.864 49.2905 31.8709 53.027 26.9225 53.0002C17.4501 52.9481 9.94989 48.7879 4.86873 40.8209C-2.13846 29.8368 -0.342318 16.2145 8.92612 7.25066C10.2432 5.97656 11.7055 4.88125 13.2642 3.91124C14.2601 3.29178 15.1581 3.11721 15.8719 4.26179C16.6121 5.44861 15.9179 6.17506 14.9822 6.76355C11.2432 9.11747 8.3423 12.2457 6.37157 16.2285C2.06278 24.9361 3.66479 35.4556 10.2655 42.3526C14.728 47.0154 20.0899 49.6214 26.5831 49.6214C29.8052 49.6214 31.1181 48.1586 30.7857 44.9248C30.5483 42.6046 29.639 40.5168 28.4421 38.5275C25.8177 34.166 23.245 29.7749 20.6443 25.3993C20.4684 25.1036 20.3343 24.7446 19.6764 24.5616Z" fill="#D3427A" />
                                    <path d="M186.563 27.1547C186.585 31.6303 185.449 35.0697 182.409 37.5278C177.445 41.543 170.421 39.5495 167.868 33.4323C166.103 29.2046 166.242 24.9571 168.487 20.9137C170.41 17.4476 173.43 15.6835 177.37 15.9229C181.363 16.165 183.944 18.5344 185.521 22.1005C186.313 23.8913 186.722 25.7807 186.563 27.1547ZM182.216 28.8807C182.212 25.0683 181.853 23.7632 180.621 21.9147C178.692 19.0202 174.613 18.9948 172.671 21.864C170.538 25.0176 170.526 30.3168 172.643 33.4985C174.304 35.9932 177.522 36.4817 179.783 34.5178C181.847 32.7242 182.198 30.2633 182.216 28.8807Z" fill="#D3427A" />
                                    <path d="M156.524 39.5774C151.393 39.59 148.017 36.3745 147.487 31.1936C147.144 27.8331 147.317 24.6063 148.669 21.4696C151.457 14.9991 158.735 14.6865 163.135 17.7472C163.932 18.3019 163.924 18.8538 163.151 19.4226C162.063 20.225 160.861 20.515 159.565 20.1223C154.83 18.6919 152.728 20.9909 151.791 24.8921C151.699 25.275 151.442 25.7283 151.862 26.0099C152.21 26.2422 152.525 25.8564 152.808 25.6805C155.347 24.0854 157.982 24.1389 160.658 25.2229C163.545 26.3928 164.832 28.7538 164.885 31.7159C164.941 34.7752 163.41 37.0672 160.759 38.5341C159.456 39.2564 158.016 39.5633 156.524 39.5774ZM156.241 28.1808C154.616 28.0823 153.141 28.5117 152.294 30.0913C151.595 31.3935 151.666 32.7732 152.436 34.0347C153.707 36.1155 157.728 36.5195 159.471 34.7822C160.583 33.6728 161.041 31.6343 160.364 30.2616C159.538 28.5891 158.034 28.1118 156.241 28.1808Z" fill="#D3427A" />
                                    <path d="M108.101 32.9369C108.103 34.6193 108.118 36.3031 108.094 37.9855C108.083 38.7218 108.262 39.7129 107.198 39.7945C106.051 39.8832 104.569 40.4253 103.918 39.0216C103.372 37.8447 102.973 38.184 102.28 38.726C99.0368 41.2615 93.8034 40.2169 92.0911 38.1361C89.1357 34.5418 90.6916 29.4018 95.1805 28.215C97.5312 27.5941 99.8818 27.7377 102.245 28.1713C103.745 28.4473 103.988 28.1122 103.452 26.6931C102.65 24.5743 100.23 23.5522 97.3091 24.1068C96.6638 24.2293 96.0269 24.4152 95.3775 24.494C94.4682 24.6052 93.6861 24.3152 93.0827 23.5845C91.9584 22.2231 92.1483 21.4911 93.8425 20.9687C96.2197 20.2367 98.6038 19.6806 101.147 20.0902C105.709 20.8237 108.002 23.3705 108.097 28.0404C108.128 29.6735 108.1 31.3052 108.101 32.9369ZM98.7547 36.7282C101.533 36.7353 103.632 35.0825 103.734 32.8665C103.776 31.957 103.434 31.3826 102.575 31.1714C100.846 30.7491 99.1066 30.4492 97.3552 31.0771C96.527 31.3742 95.8049 31.7712 95.411 32.6455C94.3942 34.9051 95.8719 36.7212 98.7547 36.7282Z" fill="#D3427A" />
                                    <path d="M69.4044 30.0873C69.403 27.5856 69.3751 25.0838 69.4198 22.5821C69.4338 21.7796 69.0371 20.7012 70.195 20.3577C71.3584 20.0113 72.5791 20.3422 73.1951 21.3164C74.0079 22.6004 74.4646 22.316 75.4507 21.5079C77.765 19.6115 80.4187 19.313 83.1535 20.5477C85.7904 21.7374 86.7499 24.0674 86.8226 26.762C86.9259 30.5885 86.8645 34.4193 86.8449 38.2486C86.8365 39.7522 86.2611 40.1422 84.8309 39.7058C83.3099 39.2412 82.4984 38.2205 82.4649 36.5254C82.4174 34.1771 82.4328 31.8288 82.4523 29.4805C82.4607 28.443 82.2931 27.442 81.9369 26.4818C81.3713 24.9599 79.6561 23.89 78.1016 24.0279C76.1197 24.2039 74.7049 25.2922 74.3501 27.0464C73.7468 30.0282 74.1616 33.0537 74.0596 36.058C73.9856 38.2346 73.1783 39.396 71.3891 39.7804C69.9073 40.0986 69.4254 39.7367 69.4142 38.2064C69.3891 35.4991 69.4044 32.7932 69.4044 30.0873Z" fill="#D3427A" />
                                    <path d="M137.356 16.2366C139.128 16.2366 140.902 16.2155 142.675 16.2465C143.399 16.2591 144.379 15.9621 144.7 16.8561C145.064 17.8669 145.057 18.9636 144.203 19.859C142.656 21.4752 141.123 23.1041 139.595 24.7372C139.169 25.1934 138.589 25.7298 139.729 26.0099C144.36 27.1503 145.395 30.2645 145.126 33.1463C144.82 36.4125 142.232 38.9171 138.489 39.4718C136.239 39.8055 134.025 39.4957 132.007 38.3835C130.387 37.491 129.762 35.7804 130.38 34.2219C130.776 33.2195 131.23 32.7944 132.219 33.7939C133.906 35.4988 136.024 36.0747 138.364 35.6058C139.913 35.2961 141.01 33.9305 141.015 32.479C141.02 31.1007 139.999 29.7633 138.519 29.3859C137.543 29.1368 136.531 29.0143 135.526 28.9002C134.815 28.8186 134.06 28.8805 133.766 28.0189C133.455 27.1052 133.417 26.2422 134.172 25.4665C135.518 24.0826 136.828 22.662 138.141 21.2472C138.405 20.9628 138.878 20.6995 138.704 20.2532C138.522 19.7872 137.996 19.9674 137.614 19.9604C136.197 19.935 134.778 19.9364 133.359 19.9449C132.016 19.9519 131.033 19.2846 130.297 18.2358C129.481 17.0757 129.866 16.2831 131.273 16.2535C133.299 16.2099 135.325 16.2422 137.352 16.2422C137.356 16.2408 137.356 16.238 137.356 16.2366Z" fill="#D3427A" />
                                    <path d="M125.459 25.6287C125.459 29.2511 125.455 32.8721 125.463 36.4945C125.466 37.618 125.257 38.6175 124.231 39.2835C123.421 39.81 122.525 40.0916 121.642 39.7283C120.736 39.3553 121.069 38.4007 121.067 37.6827C121.044 31.0517 121.06 24.4208 121.053 17.7884C121.05 15.7076 121.881 14.135 123.772 13.2255C124.997 12.637 125.441 12.9144 125.451 14.3039C125.476 18.0798 125.459 21.8542 125.459 25.6287Z" fill="#D3427A" />
                                    <path d="M116.894 29.258C116.895 31.6542 116.855 34.0503 116.911 36.4437C116.943 37.8487 116.279 38.7723 115.168 39.4311C113.358 40.5053 112.298 39.9028 112.293 37.8163C112.286 33.5857 112.274 29.3552 112.3 25.126C112.314 22.9888 113.272 21.4529 115.275 20.5927C116.376 20.1196 116.905 20.3449 116.898 21.612C116.881 24.1602 116.893 26.7098 116.894 29.258Z" fill="#D3427A" />
                                    <path d="M116.894 14.5714C116.863 16.6142 115.486 18.3627 113.613 18.8428C112.764 19.061 112.391 18.8301 112.297 17.9446C112.084 15.9159 113.518 13.6478 115.451 13.0396C116.571 12.6877 116.916 13.0537 116.894 14.5714Z" fill="#D3427A" />
                                </g>
                                <defs>
                                    <clipPath id="clip0_654_4130">
                                        <rect width={186} height={53} fill="white" transform="translate(0.597656)" />
                                    </clipPath>
                                </defs>
                            </svg>
                        </div>
                    </Link>

                    <div className="relative hidden md:flex items-center justify-end bg-[#F1F1F2] p-1 rounded-full max-w-[430px] w-full">
                        <input
                            type="text"
                            onChange={handleSearchName}
                            className="w-full pl-3 my-2 bg-transparent placeholder-[#838383] text-[15px] focus:outline-none"
                            placeholder="Search accounts"
                        />

                        {searchProfiles.length > 0 ?
                            <div className="absolute bg-white max-w-[910px] h-auto w-full z-20 left-0 top-12 border p-1">
                                {searchProfiles.map((profile, index) => (
                                    <div className="p-1" key={index}>
                                        <Link
                                            href={`/profile/${profile?.id}`}
                                            className="flex items-center justify-between w-full cursor-pointer hover:bg-[#F12B56] p-1 px-2 hover:text-white"
                                        >
                                            <div className="flex items-center">
                                                <img className="rounded-md" width="40" src={useCreateBucketUrl(profile?.image)} />
                                                <div className="truncate ml-2">{profile?.name}</div>
                                            </div>
                                        </Link>
                                    </div>
                                ))}
                            </div>
                            : null}

                        <div className="px-3 py-1 flex items-center border-l border-l-gray-300">
                            <BiSearch color="#A1A2A7" size="22" />
                        </div>
                    </div>

                    <div className="flex items-center gap-3 ">
                        <button
                            onClick={() => goTo()}
                            className="flex items-center border rounded-sm py-[6px] hover:bg-gray-100 pl-1.5"
                        >
                            <AiOutlinePlus color="#000000" size="22" />
                            <span className="px-2 font-medium text-[15px]">Upload</span>
                        </button>

                        {!userContext?.user?.id ? (
                            <div className="flex items-center">
                                <button
                                    onClick={() => setIsLoginOpen(true)}
                                    className="flex items-center bg-[#F02C56] text-white border rounded-md px-3 py-[6px]"
                                >
                                    <span className="whitespace-nowrap mx-4 font-medium text-[15px]">Log in</span>
                                </button>
                                <BsThreeDotsVertical color="#161724" size="25" />
                            </div>
                        ) : (
                            <div className="flex items-center">

                                <div className="relative">

                                    <button
                                        onClick={() => setShowMenu(showMenu = !showMenu)}
                                        className="mt-1 border border-gray-200 rounded-full"
                                    >
                                        <img className="rounded-full w-[35px] h-[35px]" src={useCreateBucketUrl(userContext?.user?.image || '')} />
                                    </button>

                                    {showMenu ? (
                                        <div className="absolute bg-white rounded-lg py-1.5 w-[200px] shadow-xl border top-[40px] right-0">
                                            <button
                                                onClick={() => {
                                                    router.push(`/profile/${userContext?.user?.id}`)
                                                    setShowMenu(false)
                                                }}
                                                className="flex items-center w-full justify-start py-3 px-2 hover:bg-gray-100 cursor-pointer"
                                            >
                                                <BiUser size="20" />
                                                <span className="pl-2 font-semibold text-sm">Profile</span>
                                            </button>
                                            <button
                                                onClick={async () => {
                                                    await userContext?.logout()
                                                    setShowMenu(false)
                                                }}
                                                className="flex items-center justify-start w-full py-3 px-1.5 hover:bg-gray-100 border-t cursor-pointer"
                                            >
                                                <FiLogOut size={20} />
                                                <span className="pl-2 font-semibold text-sm">Log out</span>
                                            </button>
                                        </div>
                                    ) : null}
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </>
    )
}
