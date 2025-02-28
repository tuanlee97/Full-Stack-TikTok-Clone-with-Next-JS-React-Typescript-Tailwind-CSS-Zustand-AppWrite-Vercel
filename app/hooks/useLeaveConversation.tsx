import axios from 'axios';

const useLeaveConversation = async (id: number) => {
    try {
        const token = localStorage.getItem('token');
        if (!token) return console.error('Token not found in localStorage');

        const API_URL = process.env.NEXT_PUBLIC_API_URL;
        const options = {
            headers: {
                'Authorization': `Bearer ${token}`
            }
        }

        const response = await axios.delete(`${API_URL}/conversations/${id}/leave`, options);
        return response.data;
    } catch (error) {
        throw error
    }

};
export default useLeaveConversation