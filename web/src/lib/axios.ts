import axios from 'axios';

export const api = axios.create({
  baseURL: 'https://upload-ai-server-lblwojcq8-ca-byte.vercel.app/',
});