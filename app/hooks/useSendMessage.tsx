import axios from 'axios';
const useSendMessage = async (data: FormData) => {

    try {
        const token = localStorage.getItem('token');
        if (!token) return console.error('Token not found in localStorage');

        const API_URL = process.env.NEXT_PUBLIC_API_URL;
        const options = {
            headers: {
                'Content-Type': 'multipart/form-data',
                'Authorization': `Bearer ${token}`
            }
        }
        const response = await axios.post(`${API_URL}/messages/add`, data, options);
        return response.data;
    } catch (error) {
        throw error
    }

};
export default useSendMessage