/**
 * CHILD COMPONENT - SHARED CACHE DEMO
 *
 * This component demonstrates cache sharing between components.
 * It uses the same queryKey as the parent CacheDemo component.
 *
 * Key demonstration:
 * React Query will NOT make a new network request - it uses cached data!
 * Watch the console - you'll see only ONE API call even though
 * two components are using the same data.
 */

import { useQuery } from "@tanstack/react-query";
import { fetchUser } from "../api/userApi";

function ChildComponent({ userId }: { userId: number }) {
  const { data, isLoading } = useQuery({
    queryKey: ["user", userId],
    queryFn: () => fetchUser(userId),
  });

  if (isLoading) return <div className="text-gray-300">Loading profile...</div>;

  return (
    <div className="bg-purple-900/30 border border-purple-500/50 rounded-lg p-4 mt-4">
      <h4 className="text-purple-400 font-semibold mb-2">
        👤 Child Component (Using Same Cache)
      </h4>
      <p className="text-sm text-gray-300">Name: {data?.name}</p>
      <p className="text-sm text-gray-300">Email: {data?.email}</p>
      <p className="text-xs text-gray-300 mt-2">
        Server fetched at: {data?.fetchedAt}
      </p>
      <p className="text-xs text-green-400 mt-1">
        ✨ No network request made - used cached data!
      </p>
    </div>
  );
}

export default ChildComponent;
