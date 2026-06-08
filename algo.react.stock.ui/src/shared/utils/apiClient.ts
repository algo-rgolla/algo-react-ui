// Re-export the existing apiClient from its current location
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

    // Ensure we wait briefly for Firebase to restore the current user on page reload.
    // onAuthStateChanged will fire when firebase restores the session.
    let user = auth.currentUser as any;
    if (!user) {
      user = await new Promise((resolve) => {
        const unsubscribe = auth.onAuthStateChanged((u) => {
          unsubscribe();
          resolve(u);
        });

        // Safety: if onAuthStateChanged doesn't fire within X ms, resolve null
        setTimeout(() => {
          try {
            unsubscribe();
          } catch (e) {
            // ignore
          }
          resolve(null);
        }, 3000);
      });
    }

    if (user) {
      try {
        const idToken = await user.getIdToken(true);
        if (!idToken)
          throw new Error("Failed to retrieve authentication token");
        if (!config.headers) config.headers = new axios.AxiosHeaders();
        config.headers.set("Authorization", `Bearer ${idToken}`);
      } catch (error) {
        // If token retrieval fails, allow the request to proceed without throwing so
        // callers can handle 401/403 responses instead of crashing the hook.
        console.warn("Failed to attach idToken to request:", error);
      }
    } else {
      // No user available after waiting; don't throw here to avoid breaking
      // fetches during auth restore on page reload. The backend will return 401
      // if the endpoint requires authentication and callers can handle it.
      console.warn(
        "No authenticated user available for request; continuing without Authorization header."
      );
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor for handling auth errors
apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    // ...existing error handling logic...
    return Promise.reject(error);
  }
);

export const get = apiClient.get;
export const post = apiClient.post;
export const put = apiClient.put;
export const del = apiClient.delete;
export default apiClient;
