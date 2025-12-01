import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
/**
 * REACT QUERY IMPORTS:
 *
 * QueryClient: A class that manages all queries and their cache
 * - Think of it as the "brain" of React Query
 * - Stores all cached data, manages background refetches, and handles configuration
 *
 * QueryClientProvider: A context provider that makes QueryClient available throughout your app
 * - Must wrap your entire app (or the parts that use React Query)
 * - Similar to how Redux uses <Provider>, or React Router uses <BrowserRouter>
 * - Any component inside this provider can use useQuery, useMutation, etc.
 */
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Analytics } from "@vercel/analytics/react";
import App from "./App.tsx";
import "./index.css";

/**
 * CREATE QUERY CLIENT INSTANCE:
 *
 * This creates a new instance of QueryClient with default configuration.
 * You create this ONCE at the top level of your app.
 *
 * Default behaviors (can be customized):
 * - Queries are cached for 5 minutes after they become unused
 * - Failed queries retry 3 times with exponential backoff
 * - Stale data is refetched on window focus
 * - Network errors trigger automatic retries
 *
 * You can customize with options:
 * const queryClient = new QueryClient({
 *   defaultOptions: {
 *     queries: {
 *       staleTime: 1000 * 60 * 5,  // Data is fresh for 5 minutes, React Query won’t refetch it automatically in 5 minutes, because it assumes your data is still valid.
 *       cacheTime: 1000 * 60 * 10,  // Keep in cache for 10 minutes
 *       retry: 1,                    // Only retry once on failure
 *       refetchOnWindowFocus: false, // Don't refetch when tab regains focus
 *     },
 *   },
 * })
 */
const queryClient = new QueryClient();

// Listen to cache changes to detect garbage collection
queryClient.getQueryCache().subscribe((event) => {
  if (event?.type === "removed") {
    console.log(
      "🗑️ GARBAGE COLLECTED:",
      event.query.queryKey,
      "- Query was removed from cache after gcTime expired"
    );
  }
});

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    {/*
      QUERY CLIENT PROVIDER:

      This wraps your entire app and provides the QueryClient instance via React Context.

      Why is this needed?
      - React Query uses React Context to share the QueryClient across all components
      - Without this, useQuery hooks wouldn't have access to the cache or configuration
      - Similar pattern to: Redux Provider, Theme Provider, Auth Provider

      The 'client' prop:
      - Pass the QueryClient instance you created above
      - QueryClientProvider stores it in React Context internally
      - When you call useQuery() in any component, it automatically retrieves this client from Context
      - You never need to pass or receive the "client" manually in your components!
      - All React Query hooks (useQuery, useMutation, etc.) access it behind the scenes

      Best practices:
      - Place this as high as possible in your component tree
      - Usually in main.tsx or App.tsx
      - Only create ONE QueryClient instance for your entire app
      - Don't create new QueryClient instances in components (causes cache isolation)
    */}
    <QueryClientProvider client={queryClient}>
      <App />
      <Analytics />
    </QueryClientProvider>
  </StrictMode>
);
