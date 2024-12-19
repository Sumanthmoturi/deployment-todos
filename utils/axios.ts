import axios from 'axios';

const instance = axios.create({
  baseURL: process.env.NODE_ENV === 'development' ? 'http://localhost:3001' : 'http://ec2-15-207-221-132.ap-south-1.compute.amazonaws.com',
  withCredentials: true,
});



export default instance;

