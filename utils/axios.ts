
import axios from 'axios';

const instance = axios.create({
  baseURL: 'https://deployment-todo-backend.onrender.com', 
  withCredentials: true,
});

export default instance;
