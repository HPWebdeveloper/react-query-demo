import { useQueryClient } from "@tanstack/react-query";
import { useEffect, useState } from "react";

interface NetworkEvent {
  id: number;
  type: "fetch" | "cache-hit" | "background-refetch";
  queryKey: string;
  timestamp: string;
}

/**
 * NETWORK ACTIVITY LOG
 *
 * Displays a live, in-page log of React Query network activity so users
 * don't need to open the browser console. Each event is color-coded:
 *   🌐 fetch (yellow)  — first-time network request
 *   ✨ cache-hit (green) — served from cache, no network
 *   🔄 background-refetch (blue) — stale data refreshed silently
 */
export default function NetworkActivityLog() {
  const [events, setEvents] = useState<NetworkEvent[]>([]);
  const queryClient = useQueryClient();

  useEffect(() => {
    const unsubscribe = queryClient.getQueryCache().subscribe((event) => {
      if (!event?.query) return;

      const key = JSON.stringify(event.query.queryKey);
      const time = new Date().toLocaleTimeString();

      if (event.type === "updated" && event.action?.type === "fetch") {
        // A real network fetch was triggered
        const wasCached = event.query.state.dataUpdateCount > 1;
        setEvents((prev) =>
          [
            {
              id: Date.now() + Math.random(),
              type: wasCached ? "background-refetch" : "fetch",
              queryKey: key,
              timestamp: time,
            } as NetworkEvent,
            ...prev,
          ].slice(0, 20),
        );
      }

      if (
        event.type === "observerResultsUpdated" &&
        event.query.state.fetchStatus !== "fetching" &&
        event.query.state.dataUpdateCount > 0
      ) {
        // Observer got results but no fetch happened — cache hit
        // Debounce: don't log if we just logged a fetch for same key within 500ms
        setEvents((prev) => {
          const recentFetch = prev.find(
            (e) =>
              e.queryKey === key &&
              e.type !== "cache-hit" &&
              Date.now() - e.id < 1000,
          );
          if (recentFetch) return prev;
          return [
            {
              id: Date.now() + Math.random(),
              type: "cache-hit" as const,
              queryKey: key,
              timestamp: time,
            },
            ...prev,
          ].slice(0, 20);
        });
      }
    });

    return () => unsubscribe();
  }, [queryClient]);

  const typeConfig = {
    fetch: {
      emoji: "🌐",
      label: "FETCH",
      color: "text-yellow-400",
      bg: "bg-yellow-900/20 border-yellow-800/30",
    },
    "cache-hit": {
      emoji: "✨",
      label: "CACHE HIT",
      color: "text-green-400",
      bg: "bg-green-900/20 border-green-800/30",
    },
    "background-refetch": {
      emoji: "🔄",
      label: "REFETCH",
      color: "text-blue-400",
      bg: "bg-blue-900/20 border-blue-800/30",
    },
  };

  return (
    <div className="mb-6">
      <h4 className="text-sm font-semibold text-gray-300 mb-3">
        📡 Network Activity Log
      </h4>
      <div className="bg-gray-800/50 border border-gray-700 rounded-lg p-4 max-h-48 overflow-y-auto">
        {events.length === 0 ? (
          <p className="text-xs text-gray-400 text-center py-2">
            No network activity yet. Select a user to start fetching data.
          </p>
        ) : (
          <div className="space-y-1.5">
            {events.map((event) => {
              const config = typeConfig[event.type];
              return (
                <div
                  key={event.id}
                  className={`text-xs flex items-center gap-2 rounded px-3 py-1.5 border ${config.bg}`}
                >
                  <span>{config.emoji}</span>
                  <span className={`font-bold uppercase ${config.color}`}>
                    {config.label}
                  </span>
                  <span className="text-purple-400 font-mono">
                    {event.queryKey}
                  </span>
                  <span className="text-gray-400 ml-auto">
                    {event.timestamp}
                  </span>
                </div>
              );
            })}
          </div>
        )}
      </div>
      <div className="flex gap-4 mt-2 text-xs text-gray-400">
        <span>
          <span className="text-yellow-400">●</span> Network fetch
        </span>
        <span>
          <span className="text-green-400">●</span> Served from cache
        </span>
        <span>
          <span className="text-blue-400">●</span> Background refetch
        </span>
      </div>
    </div>
  );
}
