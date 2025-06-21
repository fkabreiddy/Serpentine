import axios from "axios";

const api = axios.create({
  baseURL: "http://localhost:5000/api", 
  timeout: 10000,
  validateStatus: function (status) {
    return status < 500;
  }
 
});

export default api;