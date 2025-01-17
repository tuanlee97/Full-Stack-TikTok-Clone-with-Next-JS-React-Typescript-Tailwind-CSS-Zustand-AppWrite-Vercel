import axios from 'axios';
const useUpdateSeenMessage = async (conversationId: number) => {

    try {
        const token = localStorage.getItem('token');
        if (!token) return console.error('Token not found in localStorage');

        const API_URL = process.env.NEXT_PUBLIC_API_URL;
        const options = {
            headers: {
                'Authorization': `Bearer ${token}`
            }
        }
        const data = { conversationId };
        const response = await axios.post(`${API_URL}/messages/updateSeenBy`, data, options);
        return response.data;
    } catch (error) {
        throw error
    }

};
export default useUpdateSeenMessage