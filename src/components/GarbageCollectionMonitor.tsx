import { useQueryClient } from "@tanstack/react-query";
import { useEffect, useState } from "react";

interface GCEvent {
  id: number;
  queryKey: string;
  timestamp: string;
}

function GarbageCollectionMonitor() {
  const [gcEvents, setGcEvents] = useState<GCEvent[]>([]);
  const queryClient = useQueryClient();

  useEffect(() => {
    const unsubscribe = queryClient.getQueryCache().subscribe((event) => {
      if (event?.type === "removed") {
        const newEvent: GCEvent = {
          id: Date.now(),
          queryKey: JSON.stringify(event.query.queryKey),
          timestamp: new Date().toLocaleTimeString(),
        };
        setGcEvents((prev) => [newEvent, ...prev].slice(0, 5)); // Keep last 5 events
      }
    });

    return () => unsubscribe();
  }, [queryClient]);

  if (gcEvents.length === 0) {
    return (
      <div className="mb-6 bg-gray-800/50 border border-gray-700 rounded-lg p-4">
        <h4 className="text-sm font-semibold text-gray-300 mb-2">
          🗑️ Garbage Collection Monitor
        </h4>
        <p className="text-xs text-gray-400">
          No cache entries removed yet. Unmount the component and wait {60}{" "}
          seconds to see garbage collection in action.
        </p>
      </div>
    );
  }

  return (
    <div className="mb-6 bg-gray-800/50 border border-red-900/30 rounded-lg p-4">
      <h4 className="text-sm font-semibold text-red-400 mb-2">
        🗑️ Garbage Collection Events
      </h4>
      <div className="space-y-2">
        {gcEvents.map((event) => (
          <div
            key={event.id}
            className="text-xs bg-red-900/20 border border-red-800/30 rounded px-3 py-2"
          >
            <span className="text-red-400 font-mono">{event.queryKey}</span>
            <span className="text-gray-400 ml-2">
              removed at {event.timestamp}
            </span>
          </div>
        ))}
      </div>
      <p className="text-xs text-gray-400 mt-3">
        Cache entries are removed after{" "}
        <strong className="text-white">gcTime (60s)</strong> of being unused.
      </p>
    </div>
  );
}

export default GarbageCollectionMonitor;
