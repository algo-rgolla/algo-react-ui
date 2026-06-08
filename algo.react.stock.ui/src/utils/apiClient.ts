import axios from "axios";
import { getAuth } from "firebase/auth";

const apiClient = axios.create({
  baseURL: import.meta.env.VITE_APP_API_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

// Prevent multiple redirects
let isRedirecting = false;

apiClient.interceptors.request.use(
  async (config) => {
    const auth = getAuth();
    const user = auth.currentUser;

    if (user) {
      try {
        const idToken = await user.getIdToken(true);
        if (!idToken)
          throw new Error("Failed to retrieve authentication token");
        if (!config.headers) config.headers = new axios.AxiosHeaders();
        config.headers.set("Authorization", `Bearer ${idToken}`);
      } catch (error) {
        throw new Error("Authentication token is required for this request.");
      }
    } else {
      throw new Error("User is not authenticated.");
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor for handling auth errors
apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    // Only redirect if not already redirecting and not on login page
    if (
      !isRedirecting &&
      (error.message === "User is not authenticated." ||
        error.message === "Authentication token is required for this request.")
    ) {
      if (!window.location.pathname.startsWith("/login")) {
        isRedirecting = true;
        window.location.href = "/login";
      }
    }
    return Promise.reject(error);
  }
);

export const get = async (url: string, params?: any) => {
  const response = await apiClient.get(url, { params });
  return response.data;
};

export const post = async (url: string, data: any) => {
  const response = await apiClient.post(url, data);
  return response.data;
};

export const del = async (url: string) => {
  const response = await apiClient.delete(url);
  return response.data;
};

export default apiClient;
