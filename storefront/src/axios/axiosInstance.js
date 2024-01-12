import axios from 'axios';
import queryString from 'query-string';

const createAxiosClient = () => {
  const newInstance = axios.create({
    baseURL: 'http://localhost:8080',
    headers: {
      'content-type': 'application/json'
    },
    paramsSerializer: (params) => queryString.stringify(params)
  });
  return newInstance;
};

export default createAxiosClient;
