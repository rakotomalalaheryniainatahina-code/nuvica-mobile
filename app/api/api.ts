import axios from 'axios';

const api = axios.create({
  baseURL: 'http://10.111.124.137:3000', // Mon backend NestJS
  headers: {
    'Content-Type': 'application/json',
  },
});

export default api;
