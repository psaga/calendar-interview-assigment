import axios from "axios";

const axiosInstance = axios.create({
  baseURL: process.env.VUE_APP_URL + "api/",
  responseType: "json"
});

export default axiosInstance;