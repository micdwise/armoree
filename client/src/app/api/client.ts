const API_BASE_URL = `http://${import.meta.env.VITE_API_URL}:${import.meta.env.VITE_API_PORT}/api/v1`;

async function apiClient<T>(
  endpoint: string,
  options?: RequestInit
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

  const contentType = response.headers.get("content-type");
  if (contentType && contentType.includes("application/json")) {
    return response.json();
  }

  // For successful responses that are not JSON (e.g., 201 Created or 204 No Content with an empty body),
  // we can resolve the promise with `null`. This prevents a JSON parsing error and allows
  // the `.then()` block in the calling code to execute.
  return null as T;
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
