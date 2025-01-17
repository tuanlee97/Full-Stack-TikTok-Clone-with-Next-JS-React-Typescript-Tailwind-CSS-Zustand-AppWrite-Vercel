import axios from 'axios';
const useCreateConversation = async (members: number[]) => {
    try {
        const token = localStorage.getItem('token');
        if (!token) return console.error('Token not found in localStorage');

        const API_URL = process.env.NEXT_PUBLIC_API_URL;
        const options = {
            headers: {
                'Authorization': `Bearer ${token}`
            }
        }
        const data = { members };
        await axios.post(`${API_URL}/conversations/add`, data, options);

    } catch (error) {
        throw error;
    }
}
export default useCreateConversation