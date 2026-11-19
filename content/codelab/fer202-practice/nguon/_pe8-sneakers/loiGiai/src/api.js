import axios from 'axios';

// Read the API URL from .env — never hard-code it (0 points otherwise).
// CRA: REACT_APP_API_URL + process.env  ·  Vite: VITE_API_URL + import.meta.env
const API_URL = process.env.REACT_APP_API_URL;

export const getSneakers = () => axios.get(API_URL).then((res) => res.data);
export const getSneaker = (id) => axios.get(`${API_URL}/${id}`).then((res) => res.data);
export const createSneaker = (data) => axios.post(API_URL, data).then((res) => res.data);
export const updateSneaker = (id, data) => axios.put(`${API_URL}/${id}`, data).then((res) => res.data);
export const deleteSneaker = (id) => axios.delete(`${API_URL}/${id}`);