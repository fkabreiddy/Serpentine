import axios from "axios";

const api = axios.create({
  baseURL: "http://localhost:5000/api/v1",
  timeout: 30000,
  validateStatus: function (status) {
    return status < 500;
  },
});

export default api;
