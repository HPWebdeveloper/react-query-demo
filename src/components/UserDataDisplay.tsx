import { useQuery } from "@tanstack/react-query";
import { useState } from "react";
import { fetchUser } from "../api/userApi";
import ChildComponent from "./ChildComponent";

/**
 * Inner component that will actually mount/unmount per user.
 *
 * MAIN QUERY WITH CACHING:
 * staleTime: 30000 (30 seconds) - Data is considered "fresh" for 30 seconds
 * gcTime: 60000 (60 seconds) - Unused data stays in cache for 60 seconds
 * Watch the console to see when API calls are actually made!
 */

interface UserDataDisplayProps {
  userId: number;
}

export default function UserDataDisplay({ userId }: UserDataDisplayProps) {
  const { data, isLoading, isFetching, dataUpdatedAt } = useQuery({
    queryKey: ["user", userId],
    queryFn: () => fetchUser(userId),
    staleTime: 30000, // 30 seconds - data stays fresh
    gcTime: 60000, // 60 seconds
  });

  const [showChild, setShowChild] = useState(false);

  if (isLoading) {
    return (
      <div className="text-center py-4 text-gray-300 text-xs">
        ⏳ Loading user {userId} data...
      </div>
    );
  }

  const statusText = isFetching ? "🔄 Refetching (Background)" : "✅ Cached";
  const statusColor = isFetching ? "text-blue-400" : "text-green-400";

  return (
    <div className="space-y-2">
      {/* Status info grid */}
      <div className="bg-gray-900/50 rounded-md p-2 space-y-1 text-[11px]">
        <div className="flex justify-between">
          <span className="text-gray-400">Status:</span>
          <span className={statusColor}>{statusText}</span>
        </div>
        <div className="flex justify-between">
          <span className="text-gray-400">Last Fetched:</span>
          <span className="text-green-400 font-mono">
            {dataUpdatedAt ? new Date(dataUpdatedAt).toLocaleTimeString() : "—"}
          </span>
        </div>
        <div className="flex justify-between">
          <span className="text-gray-400">Server Time:</span>
          <span className="text-gray-300 font-mono">
            {data?.fetchedAt || "—"}
          </span>
        </div>
      </div>

      {/* User data */}
      {data && (
        <div className="bg-gray-900/50 rounded-md p-2 space-y-0.5 text-xs">
          <p className="text-gray-300">
            <span className="text-gray-400">Name:</span> {data.name}
          </p>
          <p className="text-gray-300">
            <span className="text-gray-400">Email:</span> {data.email}
          </p>
          <p className="text-gray-300">
            <span className="text-gray-400">ID:</span> {data.id}
          </p>
        </div>
      )}

      {/* Cache status */}
      <p className="text-[10px]">
        {isFetching ? (
          <span className="text-blue-400">
            🔄 Fetching fresh data from server...
          </span>
        ) : (
          <span className="text-green-400">
            ✨ Served from cache (no network request)
          </span>
        )}
      </p>

      {/* Child component toggle */}
      <div className="pt-1 border-t border-gray-700/50">
        <button
          onClick={() => setShowChild(!showChild)}
          className="px-2 py-1 bg-purple-600 hover:bg-purple-700 text-white rounded text-[10px] font-medium transition-colors"
        >
          {showChild ? "Hide" : "Show"} Child Component
        </button>
        <p className="text-[9px] text-gray-400 mt-1">
          Child uses the SAME cached data — no new API call!
        </p>
        {showChild && <ChildComponent userId={userId} />}
      </div>
    </div>
  );
}
