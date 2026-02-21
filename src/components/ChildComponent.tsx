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
    staleTime: 30000, // Must match parent — otherwise defaults to 0 and refetches on every mount
    gcTime: 60000,
  });

  if (isLoading) return <div className="text-gray-300">Loading profile...</div>;

  return (
    <div className="bg-purple-900/30 border border-purple-500/50 rounded-md p-2 mt-2">
      <h4 className="text-purple-400 font-semibold text-[11px] mb-1">
        👤 Child Component (Same Cache)
      </h4>
      <p className="text-[11px] text-gray-300">Name: {data?.name}</p>
      <p className="text-[11px] text-gray-300">Email: {data?.email}</p>
      <p className="text-[10px] text-gray-400 mt-1">
        Fetched at: {data?.fetchedAt}
      </p>
      <p className="text-[10px] text-green-400 mt-0.5">
        ✨ No network request – used cached data!
      </p>
    </div>
  );
}

export default ChildComponent;
