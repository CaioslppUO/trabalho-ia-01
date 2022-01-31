import axios from "axios";

export const baseUrlServer = "https://trabalho-01-ia.herokuapp.com/";
//export const baseUrlServer = "http://localhost:3335/";

const api = axios.create({
  baseURL: baseUrlServer,
});

export default api;
