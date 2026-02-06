import axios from 'axios';
import { API_URL } from './urls';

const api = axios.create({
  baseURL: API_URL,
  responseType: 'json',
  headers: {
    'Content-Type': 'application/json',
  },
});

export default api;
