# React Query (TanStack Query) demo

This repository demonstrates data fetching patterns in React, comparing traditional fetch methods with React Query, and showcasing React Query's powerful caching capabilities.

## 📦 What's Inside

- **Traditional Fetch Component** - Manual state management with useState and fetch API
- **React Query Component** - Simplified data fetching with automatic caching
- **Cache Demo Component** - Interactive demonstration of React Query's caching system

## 🚀 Getting Started

### Install Dependencies

```bash
# Install frontend dependencies
npm install

# Install server dependencies
cd server
npm install
```

### Run the Application

**Terminal 1 - Start the Backend Server:**

```bash
cd server
npm start
```

Server runs on `http://localhost:3000`

**Terminal 2 - Start the Frontend:**

```bash
npm run dev
```

Frontend runs on `http://localhost:5173`

## 🗂️ Understanding React Query Caching

React Query's caching system is one of its most powerful features. Here's a step-by-step guide to understanding how it works:

### Step 1: The Cache Key Concept

Every query in React Query has a unique identifier called a `queryKey`:

```tsx
useQuery({
  queryKey: ["user", userId], // This is the cache key
  queryFn: () => fetchUser(userId),
});
```

**How it works:**

- The `queryKey` acts like a unique ID for your data
- Format: An array of values: `["user", 1]`, `["posts"]`, `["profile", userId, "settings"]`
- React Query uses this key to store and retrieve cached data
- Same key = same cached data, different key = different cached data

**Example:**

- `["user", 1]` - Cache entry for user 1
- `["user", 2]` - Cache entry for user 2
- `["posts"]` - Cache entry for all posts

### Step 2: How Data Gets Cached

When you first call `useQuery`:

```tsx
const { data, isLoading } = useQuery({
  queryKey: ["user", 1],
  queryFn: () => fetchUser(1),
});
```

**What happens:**

1. React Query checks: "Do I have cached data for `["user", 1]`?"
2. **First time**: No cache exists → Makes API call → Stores result in cache
3. **Second time**: Cache exists → Returns cached data immediately → No API call!

**Visual Flow:**

```
First Call:  queryKey → Cache Miss → API Call → Store in Cache → Return Data
Second Call: queryKey → Cache Hit  → Return Cached Data (No API call!)
```

### Step 3: Shared Cache Across Components

Multiple components using the same `queryKey` share the same cached data:

```tsx
// Component A
const { data } = useQuery({
  queryKey: ["user", 1],
  queryFn: () => fetchUser(1),
});

// Component B (different component, same key)
const { data } = useQuery({
  queryKey: ["user", 1], // Same key!
  queryFn: () => fetchUser(1),
});
```

**Result:** Only ONE API call is made! Both components share the cached data.

### Step 4: Cache Lifecycle - Fresh vs Stale

React Query distinguishes between "fresh" and "stale" data:

```tsx
useQuery({
  queryKey: ["user", 1],
  queryFn: () => fetchUser(1),
  staleTime: 30000, // 30 seconds
});
```

**Cache States:**

- **Fresh (0-30 seconds)**: Data is considered current, React Query won't refetch
- **Stale (after 30 seconds)**: Data might be outdated, React Query will refetch in background on certain triggers

**Timeline:**

```
0s:  Data fetched → Marked as FRESH
     └─ No refetch on remount, window focus, etc.

30s: Data becomes STALE
     └─ Will refetch on remount, window focus, network reconnect
     └─ But old data still shows while refetching (no loading state!)
```

### Step 5: Garbage Collection (gcTime)

Even unused cache stays in memory for a while:

```tsx
useQuery({
  queryKey: ["user", 1],
  queryFn: () => fetchUser(1),
  gcTime: 60000, // 60 seconds (formerly called cacheTime)
});
```

**How it works:**

- Component unmounts but cache stays for 60 seconds
- If component remounts within 60 seconds → Uses cached data (instant!)
- After 60 seconds of no usage → Cache is garbage collected

**Example Scenario:**

```
Time 0s:   Component mounts → Fetches data → Stores in cache
Time 5s:   Component unmounts
Time 10s:  Component remounts → Uses cache (no API call!)
Time 70s:  Cache is deleted (no components used it for 60+ seconds)
Time 75s:  Component remounts → Cache miss → New API call
```

### Step 6: Background Refetching

React Query keeps your data fresh automatically:

```tsx
useQuery({
  queryKey: ["user", 1],
  queryFn: () => fetchUser(1),
  refetchOnWindowFocus: true, // Default behavior
});
```

**Triggers for background refetch:**

- Window regains focus (user returns to tab)
- Network reconnects
- Configurable intervals
- Manual refetch via `refetch()`

**Important:** During background refetch, old data stays visible (no loading spinner!), then updates when new data arrives.

### Step 7: Cache Invalidation

You can manually invalidate cache to force refetch:

```tsx
import { useQueryClient } from "@tanstack/react-query";

const queryClient = useQueryClient();

// Invalidate specific query
queryClient.invalidateQueries({ queryKey: ["user", 1] });

// Invalidate all user queries
queryClient.invalidateQueries({ queryKey: ["user"] });
```

**Use cases:**

- After mutation (create, update, delete)
- User logs out
- Data becomes outdated

## 🧪 Experimenting with the Cache Demo

The `CacheDemo` component provides an interactive playground:

### Experiment 1: Basic Caching

1. Open browser console (to see API logs)
2. Click "User 1" button
   - ✅ Console shows: `🌐 Making API call for user 1...`
   - ✅ Server logs: `📡 API Request: GET /api/user/1`
3. Click "User 2" button
   - ✅ New API call for different data
4. Click "User 1" button again
   - ❌ NO console log! Data served from cache
   - ❌ NO server request!

**What you learned:** Same queryKey = cached data reused

### Experiment 2: Cache Persistence

1. Click "User 1" to load data (API call happens)
2. Click "🔴 Unmount Component" (component disappears)
3. Click "🟢 Mount Component" (component appears)
4. Data shows INSTANTLY without loading state
   - ❌ NO API call! Cache persisted during unmount

**What you learned:** Cache exists independent of component lifecycle

### Experiment 3: Shared Cache

1. Click "User 1" to load data (API call happens)
2. Click "Show Child Component" button
3. Child component shows same data INSTANTLY
   - ❌ NO API call! Parent and child share cache

**What you learned:** Multiple components with same queryKey share data

### Experiment 4: Stale Data & Background Refetch

1. Click "User 1" to load data
2. Wait 30+ seconds (staleTime expires)
3. Click "User 2" then back to "User 1"
4. Notice "🔄 Refetching (Background)" status
   - ✅ Old data shows immediately (no loading state)
   - ✅ Background API call fetches fresh data
   - ✅ UI updates when new data arrives

**What you learned:** Stale data = instant display + background refresh

### Experiment 5: Different Cache Keys

1. Click "User 1" (cache entry: `["user", 1]`)
2. Click "User 2" (cache entry: `["user", 2]`)
3. Click "User 3" (cache entry: `["user", 3]`)
4. Each creates separate cache entries
5. Switching between them uses their respective caches

**What you learned:** Each unique queryKey maintains separate cache

## 📊 Cache Configuration Options

| Option                 | Default   | Description                             |
| ---------------------- | --------- | --------------------------------------- |
| `staleTime`            | 0ms       | How long data is considered fresh       |
| `gcTime`               | 5 minutes | How long unused cache is kept in memory |
| `refetchOnMount`       | true      | Refetch when component mounts           |
| `refetchOnWindowFocus` | true      | Refetch when window regains focus       |
| `refetchOnReconnect`   | true      | Refetch when network reconnects         |
| `retry`                | 3         | Number of retry attempts on error       |
| `enabled`              | true      | Whether query runs automatically        |

## 🎯 Key Takeaways

1. **Cache Key is Everything**: Same key = shared cache, different key = separate cache
2. **Automatic Cache Management**: React Query handles storage, retrieval, and cleanup
3. **Smart Background Updates**: Stale data shows instantly while fresh data loads
4. **Zero Boilerplate**: No useState, useEffect, or manual cache management needed
5. **Performance Win**: Eliminated unnecessary network requests = faster app

## 📚 Resources

- [TanStack Query Docs](https://tanstack.com/query/latest)
- [Caching Examples](https://tanstack.com/query/latest/docs/react/guides/caching)
- [Query Keys Guide](https://tanstack.com/query/latest/docs/react/guides/query-keys)
