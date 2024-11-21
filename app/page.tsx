"use client"

import { usePostStore } from "@/app/stores/post"
import { useEffect } from "react"
import ClientOnly from "./components/ClientOnly"
import PostMain from "./components/PostMain"
import MainLayout from "./layouts/MainLayout"

export default function Home() {
  let { allPosts, setAllPosts } = usePostStore();
  useEffect(() => { setAllPosts() }, [])
  return (
    <>
      <MainLayout>
        <div className="sm:mt-[80px] w-full sm:max-w-[calc(100vw-80px)] lg:max-w-[calc(100vw-250px)]  ml-auto sm:px-12 ">
          <ClientOnly>
            <div className="w-full mx-auto scroll-container h-screen overflow-y-scroll scroll-snap-y">
              {allPosts.map((post, index) => (
                <PostMain post={post} key={index} />
              ))}
            </div>
          </ClientOnly>
        </div>
      </MainLayout>
    </>
  )
}

