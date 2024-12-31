import axios from 'axios';
const useGetAllPostsFollowing = async () => {
    try {
        const token = localStorage.getItem('token');
        if (!token) return console.error('Token not found in localStorage');

        const API_URL = process.env.NEXT_PUBLIC_API_URL;
        const options = {
            headers: {
                'Authorization': `Bearer ${token}`
            }
        }
        const data = {};
        const response = await axios.get(`${API_URL}/videos/following`, options);
        return response.data.data;
    } catch (error) {
        throw error;
    }
};

export default useGetAllPostsFollowing

