import axios from 'axios';
import Cookies from 'js-cookie';



const instance = axios.create({
  baseURL: 'http://ec2-15-207-221-132.ap-south-1.compute.amazonaws.com',
  withCredentials: true, 
  headers: {
    Authorization: `Bearer ${Cookies.get('access_token')}` 
  },
});




export default instance;

