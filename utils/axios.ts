
import axios from 'axios';

const instance = axios.create({
  baseURL: 'https://ec2-13-127-145-5.ap-south-1.compute.amazonaws.com:443', 
  withCredentials: true, 
  headers: {
    'Content-Type': 'application/json',
  },
});




export default instance;
