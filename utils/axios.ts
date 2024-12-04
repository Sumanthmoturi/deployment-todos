import axios from 'axios';

const instance = axios.create({


  baseURL: 'http://ec2-3-109-56-238.ap-south-1.compute.amazonaws.com:10000', 
  withCredentials: true, 
  headers: {
    'Content-Type': 'application/json',
  },
});

export default instance;
