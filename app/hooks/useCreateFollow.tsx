import axios from 'axios';
const useCreateFollow = async (followingId: string) => {
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
        await axios.post(`${API_URL}/follow`, data, options);

    } catch (error) {
        throw error;
    }
}
export default useCreateFollow