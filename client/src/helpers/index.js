import axios from 'axios';
import { EMAIL_API_URL } from '../config';

export const sendEmail = async (endpoint, payload) => {
  const response = await axios.post(`${EMAIL_API_URL}${endpoint}`, payload, {
    headers: {
      'content-type': 'application/json;charset=UTF-8'
    }
  });
  return response;
};
