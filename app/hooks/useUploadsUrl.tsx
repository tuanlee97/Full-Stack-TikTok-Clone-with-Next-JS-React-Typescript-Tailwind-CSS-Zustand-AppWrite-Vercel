const useUploadsUrl = (fileUrl: string) => {

    const apiUrl = process.env.NEXT_PUBLIC_API_URL


    if (!apiUrl || !fileUrl) return '/images/placeholder-user.jpg'

    return `${apiUrl}${fileUrl}`
}

export default useUploadsUrl