import axios from 'axios';
const useUnFollow = async (followingId: string) => {
    try {
        const token = localStorage.getItem('token');
        if (!token) return console.error('Token not found in localStorage');

        const API_URL = process.env.NEXT_PUBLIC_API_URL;
        const options = {
            headers: {
                'Authorization': `Bearer ${token}`
            }
        }
        const data = { followingId };
        const response = await axios.post(`${API_URL}/unfollow`, data, options);
        return response.data.data;
    } catch (error) {
        throw error;
    }
}
export default useUnFollow