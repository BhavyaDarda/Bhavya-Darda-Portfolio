import { QueryClient } from "@tanstack/react-query";

// Create a query client instance
export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60 * 5, // 5 minutes
    },
  },
});

// Default fetcher function for API requests
async function fetcher(url: string, options?: RequestInit) {
  const response = await fetch(url, {
    headers: {
      "Content-Type": "application/json",
      ...options?.headers,
    },
    ...options,
  });

  if (!response.ok) {
    throw new Error(`HTTP error! status: ${response.status}`);
  }

  return response.json();
}

// API request helper for mutations
export async function apiRequest(url: string, options?: RequestInit) {
  return fetcher(url, options);
}

// Set default query function
queryClient.setQueryDefaults(["api"], { queryFn: ({ queryKey }) => fetcher(queryKey[1] as string) });