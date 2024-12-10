import axios from 'axios';

const instance = axios.create({
  baseURL: 'http://ec2-15-207-221-132.ap-south-1.compute.amazonaws.com', 
  withCredentials: true, 
  headers: {
    'Content-Type': 'application/json',
  },
});

export default instance;

