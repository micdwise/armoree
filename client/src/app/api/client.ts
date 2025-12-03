const API_BASE_URL = `http://${import.meta.env.VITE_API_URL}:${import.meta.env.VITE_API_PORT}/api/v1`;

async function apiClient<T>(
  endpoint: string,
  options?: RequestInit,
): Promise<T> {
  const response = await fetch(`${API_BASE_URL}${endpoint}`, {
    headers: {
      "Content-Type": "application/json",
      ...options?.headers,
    },
    ...options,
  });

  if (!response.ok) {
    let errorData: any = {};
    try {
      errorData = await response.json();
    } catch (e) {
      errorData.message = response.statusText;
    }
    throw new Error(errorData.message || "API error");
  }

  // Handle cases where the response might be empty (e.g., a 204 No Content)
  if (
    response.status === 204 ||
    response.headers.get("content-length") === "0"
  ) {
    return null as T; // Or return undefined, depending on how you want to handle no content
  }
  return response.json();
}

export const api = {
  get: <T>(endpoint: string, options?: RequestInit) =>
    apiClient<T>(endpoint, { method: "GET", ...options }),
  post: <T>(endpoint: string, data: any, options?: RequestInit) =>
    apiClient<T>(endpoint, {
      method: "POST",
      body: JSON.stringify(data),
      ...options,
    }),
  // You can add more methods like put, delete, etc. as needed
  put: <T>(endpoint: string, data: any, options?: RequestInit) =>
    apiClient<T>(endpoint, {
      method: "PUT",
      body: JSON.stringify(data),
      ...options,
    }),
  delete: <T>(endpoint: string, options?: RequestInit) =>
    apiClient<T>(endpoint, { method: "DELETE", ...options }),
};
