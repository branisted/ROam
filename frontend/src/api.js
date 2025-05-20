import axios from 'axios';

const api = axios.create({
    baseURL: 'http://localhost:3001/api',
    withCredentials: true, // allows sending/receiving cookies (for sessions)
});

export default api;
