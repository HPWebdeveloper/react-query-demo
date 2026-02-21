import { useQueryClient } from "@tanstack/react-query";
import { useEffect, useState } from "react";

interface ObserverData {
  observers: number;
  exists: boolean;
}

/**
 * OBSERVER COUNT DISPLAY
 *
 * Shows the live number of mounted components (observers) watching
 * each user's query. Makes the connection between observer count,
 * cache retention, and garbage collection tangible.
 *
 * - 0 observers → GC countdown starts
 * - 1+ observers → cache is actively retained
 */
export default function ObserverCount() {
  const [data, setData] = useState<Record<number, ObserverData>>({
    1: { observers: 0, exists: false },
    2: { observers: 0, exists: false },
    3: { observers: 0, exists: false },
  });
  const queryClient = useQueryClient();

  useEffect(() => {
    const interval = setInterval(() => {
      const queries = queryClient.getQueryCache().getAll();
      const newData: Record<number, ObserverData> = {
        1: { observers: 0, exists: false },
        2: { observers: 0, exists: false },
        3: { observers: 0, exists: false },
      };

      [1, 2, 3].forEach((userId) => {
        const userQuery = queries.find((q) => {
          const key = q.queryKey;
          return Array.isArray(key) && key[0] === "user" && key[1] === userId;
        });

        if (userQuery) {
          newData[userId] = {
            observers: userQuery.getObserversCount(),
            exists: true,
          };
        }
      });

      setData(newData);
    }, 500);

    return () => clearInterval(interval);
  }, [queryClient]);

  return (
    <div className="grid grid-cols-3 gap-3">
      {[1, 2, 3].map((userId) => {
        const info = data[userId];
        const hasObservers = info.observers > 0;

        return (
          <div
            key={userId}
            className={`rounded-lg px-4 py-3 text-center flex-1 ${
              hasObservers
                ? "bg-green-900/20 border border-green-700/50"
                : info.exists
                  ? "bg-red-900/20 border border-red-700/50"
                  : "bg-gray-800/50 border border-gray-700"
            }`}
          >
            <div className="text-xs font-semibold text-gray-400 mb-1">
              👁️ Active Observers
            </div>
            <div className="text-xs text-gray-300">User {userId}</div>
            <div
              className={`text-base font-bold my-0.5 ${
                hasObservers
                  ? "text-green-400"
                  : info.exists
                    ? "text-red-400"
                    : "text-gray-400"
              }`}
            >
              {info.exists ? info.observers : "—"}
            </div>
            <div
              className={`text-[10px] ${
                hasObservers
                  ? "text-green-300"
                  : info.exists
                    ? "text-red-300"
                    : "text-gray-400"
              }`}
            >
              {hasObservers
                ? "Active"
                : info.exists
                  ? "GC eligible"
                  : "No cache"}
            </div>
          </div>
        );
      })}
    </div>
  );
}
