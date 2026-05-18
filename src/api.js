import axios from 'axios';

const clienteAxios = axios.create({
    baseURL: 'https://rd-pl-api-matia_moreno.onrender.com' 
});

export default clienteAxios;