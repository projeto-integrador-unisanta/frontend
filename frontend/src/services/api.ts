import axios from 'axios';

export const api = axios.create({
  baseURL: 'https://backend-de23aa.fly.dev/api',
  headers: {
    'Content-Type': 'application/json',
  },
});
