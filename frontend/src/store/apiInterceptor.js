//This code will automatically referesh the expired access token when its expired using axios interceptors
import axios from "axios";
import store from "./store";
import { logout } from "./slices/userSlice";

//Step 1: Creating an Axios Instance
const api = axios.create({
  baseURL: "http://localhost:3000/api/v1",
  withCredentials: true,
});

// Step 2: Adding an Axios Interceptor to Handle Expired Tokens
// (An interceptor is a piece of code that runs automatically before or after each Axios request Here, we add an interceptor for responses to check if the server responds with a 400 error, meaning the access token is expired.)

api.interceptors.response.use(
  //1) The Success Handler
  (response) => response, //returning response as it is if access token is not expired yet
  //2) The Error Handler
  async (error) => {
    const originalRequest = error.config;
    // If the error is 400 (access token expired) and we haven't retried yet
    if (
      error.response &&
      error.response.status === 400 &&
      !originalRequest._retry
    ) {
      originalRequest._retry = true; // mark that we are retrying the request so it doesn’t keep retrying forever.

      try {
        // Call the endpoint to refresh the tokens
        await api.post("/users/refreshAcessToken");
        // Retry the original request with the new tokens in place
        return api(originalRequest);
      } catch (refreshError) {
        store.dispatch(logout());
        return Promise.reject(refreshError); // Pass on the refresh error
      }
    }
    return Promise.reject(error); // Pass on other errors as usual
  }
);

export default api;
