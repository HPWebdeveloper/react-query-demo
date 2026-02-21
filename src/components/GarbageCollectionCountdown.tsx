import { useQueryClient } from "@tanstack/react-query";
import { useEffect, useState } from "react";

interface CountdownData {
  countdown: number | null;
  queryKey: string | null;
}

function GarbageCollectionCountdown() {
  const [countdowns, setCountdowns] = useState<Record<number, CountdownData>>({
    1: { countdown: null, queryKey: null },
    2: { countdown: null, queryKey: null },
    3: { countdown: null, queryKey: null },
  });
  const queryClient = useQueryClient();

  // Monitor query state and start countdown when no observers
  useEffect(() => {
    const interval = setInterval(() => {
      const queries = queryClient.getQueryCache().getAll();
      const newCountdowns: Record<number, CountdownData> = {
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
          const observersCount = userQuery.getObserversCount();
          const state = userQuery.state;

          if (observersCount === 0 && state.dataUpdatedAt) {
            // Calculate time since last update
            const timeSinceUpdate = Date.now() - state.dataUpdatedAt;
            const gcTime = 60000; // 60 seconds
            const remaining = Math.max(0, gcTime - timeSinceUpdate);
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

    return (
      <div
        key={userId}
        className={`rounded-lg px-4 py-3 text-center flex-1 ${
          isActive
            ? "bg-yellow-900/20 border border-yellow-700/50"
            : "bg-gray-800/50 border border-gray-700"
        }`}
      >
        <div className="text-xs font-semibold text-gray-400 mb-1">
          ⏳ GC Countdown
        </div>
        <div
          className={`text-xs ${
            isActive ? "text-yellow-400" : "text-gray-300"
          }`}
        >
          User {userId}
        </div>
        <div
          className={`text-base font-bold my-0.5 ${
            isActive ? "text-yellow-400" : "text-gray-400"
          }`}
        >
          {isActive ? `${data.countdown}s` : "60s"}
        </div>
      </div>
    );
  };

  return (
    <div className="grid grid-cols-3 gap-3">
      {renderUserCountdown(1)}
      {renderUserCountdown(2)}
      {renderUserCountdown(3)}
    </div>
  );
}

export default GarbageCollectionCountdown;
