import axios from 'axios';
const useSendMessage = async (receiverId: string, groupId: string | null, message: string) => {

    try {
        const token = localStorage.getItem('token');
        if (!token) return console.error('Token not found in localStorage');

        const API_URL = process.env.NEXT_PUBLIC_API_URL;
        const options = {
            headers: {
                'Authorization': `Bearer ${token}`
            }
        }
        const data = { receiver_id: receiverId, group_id: groupId, message };
        const response = await axios.post(`${API_URL}/inbox/add`, data, options);
        return response.data;
    } catch (error) {
        throw error
    }

};
export default useSendMessage