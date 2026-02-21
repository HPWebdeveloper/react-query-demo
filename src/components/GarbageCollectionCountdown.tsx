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
        className={`rounded-lg p-4 ${
          isActive
            ? "bg-yellow-900/20 border border-yellow-700/50"
            : "bg-gray-800/50 border border-gray-700"
        }`}
      >
        <h5
          className={`text-xs font-semibold mb-2 ${
            isActive ? "text-yellow-400" : "text-gray-300"
          }`}
        >
          User {userId}
        </h5>
        <div className="text-center">
          <div className="text-xs text-gray-300 mb-1">
            <span className={isActive ? "text-purple-400" : "text-gray-400"}>
              {data.queryKey || "—"}
            </span>
          </div>
          <div
            className={`text-2xl font-bold mb-1 ${
              isActive ? "text-yellow-400" : "text-gray-400"
            }`}
          >
            {isActive ? `${data.countdown}s` : "60s"}
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="mb-6">
      <h4 className="text-sm font-semibold text-gray-300 mb-3">
        ⏳ Garbage Collection Countdown for queryKey (cache key) = ["user",
        userId]
      </h4>
      <div className="grid grid-cols-3 gap-4">
        {renderUserCountdown(1)}
        {renderUserCountdown(2)}
        {renderUserCountdown(3)}
      </div>
      <p className="text-xs text-gray-400 mt-3 text-center">
        Countdown starts when component is unmounted. Cache removed at 0s.
      </p>
    </div>
  );
}

export default GarbageCollectionCountdown;
