import axios from "axios";

const instance = axios.create({
  baseURL: "https://room-reserve-clean.onrender.com/api"
});

export default instance;