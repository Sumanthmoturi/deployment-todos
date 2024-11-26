
import axios from 'axios';

const instance = axios.create({
  baseURL: 'http://ec2-13-127-145-5.ap-south-1.compute.amazonaws.com', 
  withCredentials: true, 
  headers: {
    'Content-Type': 'application/json',
  },
});




export default instance;
