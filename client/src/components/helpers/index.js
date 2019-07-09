import axios from 'axios';
import { API_URL } from '../../config';

export const sendEmail = (payload, endpoint = 'email/') => {
  console.log('Sending request ....');

  axios
    .post(`${API_URL}/${endpoint}`, payload, {
      headers: {
        'content-type': 'application/json;charset=UTF-8'
      }
    })
    .then(data => {
      console.log('Email sent....');
      console.log(data);
    })
    .catch(err => console.log(err));
};
