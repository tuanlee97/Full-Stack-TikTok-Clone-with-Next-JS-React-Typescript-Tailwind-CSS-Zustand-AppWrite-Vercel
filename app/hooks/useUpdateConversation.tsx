import axios from 'axios';
type UpdateConversations = {
    id: number,
    conversation_name: string
}
const useUpdateConversation = async ({ id, conversation_name }: UpdateConversations) => {

    try {
        const token = localStorage.getItem('token');
        if (!token) return console.error('Token not found in localStorage');

        const API_URL = process.env.NEXT_PUBLIC_API_URL;
        const options = {
            headers: {
                'Authorization': `Bearer ${token}`
            }
        }
        const data = { id, conversation_name };
        const response = await axios.put(`${API_URL}/conversations`, data, options);
        return response.data.data;
    } catch (error) {
        throw error
    }

};
export default useUpdateConversation