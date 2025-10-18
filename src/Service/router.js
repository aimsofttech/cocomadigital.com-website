import axios from "axios";

const instance = axios.create({
  baseURL: "https://admin.cocomadigital.com/public/api",
});
export default instance;
