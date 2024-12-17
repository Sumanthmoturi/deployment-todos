import axios from 'axios';
import Cookies from 'js-cookie';



const instance = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:3001',
  withCredentials: true, 
  headers: {
    Authorization: `Bearer ${Cookies.get('access_token')}` 
  },
});




export default instance;

