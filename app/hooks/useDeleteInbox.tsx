import axios from 'axios';
const useDeleteInbox = async (id: string) => {
    try {
        const token = localStorage.getItem('token');
        if (!token) return console.error('Token not found in localStorage');

        const API_URL = process.env.NEXT_PUBLIC_API_URL;
        const options = {
            headers: {
                'Authorization': `Bearer ${token}`
            }
        }
        const response = await axios.delete(`${API_URL}/inbox/${id}`, options);
        return response.data.data;
    } catch (error) {
        throw error;
    }
}
export default useDeleteInbox