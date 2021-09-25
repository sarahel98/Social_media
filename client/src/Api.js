import axios from 'axios';

export const Api = axios.create({
  baseURL: 'http://localhost:4000',
  timeout: 1000,
  withCredentials: true,
});
