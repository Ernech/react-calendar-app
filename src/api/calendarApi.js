import axios from 'axios';
import { getEnvVariables } from '../helpers';
const { VITE_API_URL } = getEnvVariables()


const calendarAPI = axios.create({
    baseURL:VITE_API_URL
});

//TODO: Configure interceptors

export default calendarAPI;