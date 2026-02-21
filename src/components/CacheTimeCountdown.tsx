import { useQueryClient } from "@tanstack/react-query";
import { useEffect, useState } from "react";

interface CacheTimeData {
  countdown: number | null;
  queryKey: string | null;
}

function CacheTimeCountdown() {
  const [countdowns, setCountdowns] = useState<Record<number, CacheTimeData>>({
    1: { countdown: null, queryKey: null },
    2: { countdown: null, queryKey: null },
    3: { countdown: null, queryKey: null },
  });
  const queryClient = useQueryClient();

  // Monitor cache time for each user
  useEffect(() => {
    const interval = setInterval(() => {
      const queries = queryClient.getQueryCache().getAll();
      const newCountdowns: Record<number, CacheTimeData> = {
        1: { countdown: null, queryKey: null },
        2: { countdown: null, queryKey: null },
        3: { countdown: null, queryKey: null },
      };

      // Check each user query
      [1, 2, 3].forEach((userId) => {
        const userQuery = queries.find((q) => {
          const key = q.queryKey;
          return Array.isArray(key) && key[0] === "user" && key[1] === userId;
        });

        if (userQuery) {
          const state = userQuery.state;

          // Show countdown for any cached data (regardless of observers)
          if (state.dataUpdatedAt) {
            // Calculate time since data was updated (cache age)
            const timeSinceUpdate = Date.now() - state.dataUpdatedAt;
            const staleTime = 30000; // 30 seconds
            const remaining = Math.max(0, staleTime - timeSinceUpdate);
            newCountdowns[userId] = {
              countdown: Math.ceil(remaining / 1000),
              queryKey: JSON.stringify(userQuery.queryKey),
            };
          }
        }
      });

      setCountdowns(newCountdowns);
    }, 1000);

    return () => clearInterval(interval);
  }, [queryClient]);

  const renderUserCountdown = (userId: number) => {
    const data = countdowns[userId];
    const isActive = data.countdown !== null && data.countdown > 0;
    const isStale = data.countdown === 0 && data.queryKey !== null;

    return (
      <div
        key={userId}
        className={`rounded-lg p-4 ${
          isActive
            ? "bg-blue-900/20 border border-blue-700/50"
            : isStale
              ? "bg-orange-900/20 border border-orange-700/50"
              : "bg-gray-800/50 border border-gray-700"
        }`}
      >
        <h5
          className={`text-xs font-semibold mb-2 ${
            isActive
              ? "text-blue-400"
              : isStale
                ? "text-orange-400"
                : "text-gray-300"
          }`}
        >
          User {userId}
        </h5>
        <div className="text-center">
          <div className="text-xs text-gray-300 mb-1">
            <span
              className={
                isActive
                  ? "text-purple-400"
                  : isStale
                    ? "text-orange-300"
                    : "text-gray-400"
              }
            >
              {data.queryKey || "—"}
            </span>
          </div>
          <div
            className={`text-2xl font-bold mb-1 ${
              isActive
                ? "text-blue-400"
                : isStale
                  ? "text-orange-400"
                  : "text-gray-400"
            }`}
          >
            {isActive ? `${data.countdown}s` : isStale ? "STALE" : "30s"}
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="mb-6">
      <h4 className="text-sm font-semibold text-gray-300 mb-3">
        ⏱️ Cache Freshness Countdown (staleTime)
      </h4>
      <div className="grid grid-cols-3 gap-4">
        {renderUserCountdown(1)}
        {renderUserCountdown(2)}
        {renderUserCountdown(3)}
      </div>
      <p className="text-xs text-gray-400 mt-3 text-center">
        Data is fresh for 30s after fetch. At 0s, data becomes stale and will
        refetch on next access.
      </p>
    </div>
  );
}

export default CacheTimeCountdown;
