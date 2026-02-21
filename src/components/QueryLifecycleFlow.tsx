import { useQueryClient } from "@tanstack/react-query";
import { useEffect, useState } from "react";

type LifecycleStage =
  | "inactive"
  | "fetching"
  | "fresh"
  | "stale"
  | "gc-pending"
  | "collected";

interface QueryLifecycle {
  stage: LifecycleStage;
  queryKey: string | null;
}

const stageConfig: Record<
  LifecycleStage,
  { label: string; emoji: string; color: string; dotColor: string }
> = {
  inactive: {
    label: "No Data",
    emoji: "⚪",
    color: "text-gray-400",
    dotColor: "bg-gray-500",
  },
  fetching: {
    label: "Fetching",
    emoji: "🔄",
    color: "text-yellow-400",
    dotColor: "bg-yellow-400",
  },
  fresh: {
    label: "Fresh",
    emoji: "🟢",
    color: "text-green-400",
    dotColor: "bg-green-400",
  },
  stale: {
    label: "Stale",
    emoji: "🟠",
    color: "text-orange-400",
    dotColor: "bg-orange-400",
  },
  "gc-pending": {
    label: "GC Pending",
    emoji: "⏳",
    color: "text-red-400",
    dotColor: "bg-red-400",
  },
  collected: {
    label: "Collected",
    emoji: "💀",
    color: "text-gray-400",
    dotColor: "bg-gray-600",
  },
};

const stageOrder: LifecycleStage[] = [
  "inactive",
  "fetching",
  "fresh",
  "stale",
  "gc-pending",
  "collected",
];

/**
 * QUERY LIFECYCLE FLOW
 *
 * A visual pipeline diagram showing where each user query currently sits
 * in the React Query lifecycle: inactive → fetching → fresh → stale → gc-pending → collected.
 * The active stage is highlighted, giving users an at-a-glance understanding
 * of the data's current state.
 */
export default function QueryLifecycleFlow() {
  const [lifecycles, setLifecycles] = useState<Record<number, QueryLifecycle>>({
    1: { stage: "inactive", queryKey: null },
    2: { stage: "inactive", queryKey: null },
    3: { stage: "inactive", queryKey: null },
  });
  const [collectedKeys, setCollectedKeys] = useState<Set<string>>(new Set());
  const queryClient = useQueryClient();

  // Track GC events to show "collected" stage
  useEffect(() => {
    const unsubscribe = queryClient.getQueryCache().subscribe((event) => {
      if (event?.type === "removed") {
        const key = JSON.stringify(event.query.queryKey);
        setCollectedKeys((prev) => new Set(prev).add(key));
        // Clear collected state after 5 seconds
        setTimeout(() => {
          setCollectedKeys((prev) => {
            const next = new Set(prev);
            next.delete(key);
            return next;
          });
        }, 5000);
      }
    });
    return () => unsubscribe();
  }, [queryClient]);

  useEffect(() => {
    const interval = setInterval(() => {
      const queries = queryClient.getQueryCache().getAll();
      const newLifecycles: Record<number, QueryLifecycle> = {
        1: { stage: "inactive", queryKey: null },
        2: { stage: "inactive", queryKey: null },
        3: { stage: "inactive", queryKey: null },
      };

      [1, 2, 3].forEach((userId) => {
        const userQuery = queries.find((q) => {
          const key = q.queryKey;
          return Array.isArray(key) && key[0] === "user" && key[1] === userId;
        });

        const key = `["user",${userId}]`;

        if (!userQuery) {
          // Check if it was just collected
          if (collectedKeys.has(key)) {
            newLifecycles[userId] = { stage: "collected", queryKey: key };
          }
          return;
        }

        const qKey = JSON.stringify(userQuery.queryKey);
        const state = userQuery.state;
        const observers = userQuery.getObserversCount();
        const staleTime = 30000;

        if (state.fetchStatus === "fetching") {
          newLifecycles[userId] = { stage: "fetching", queryKey: qKey };
        } else if (state.dataUpdatedAt) {
          const age = Date.now() - state.dataUpdatedAt;
          const isFresh = age < staleTime;

          if (observers === 0) {
            newLifecycles[userId] = { stage: "gc-pending", queryKey: qKey };
          } else if (isFresh) {
            newLifecycles[userId] = { stage: "fresh", queryKey: qKey };
          } else {
            newLifecycles[userId] = { stage: "stale", queryKey: qKey };
          }
        }
      });

      setLifecycles(newLifecycles);
    }, 500);

    return () => clearInterval(interval);
  }, [queryClient, collectedKeys]);

  const renderPipeline = (userId: number) => {
    const lifecycle = lifecycles[userId];

    return (
      <div key={userId} className="mb-4">
        <div className="text-xs font-semibold text-gray-300 mb-2">
          User {userId}
          {lifecycle.queryKey && (
            <span className="text-purple-400 font-mono ml-2">
              {lifecycle.queryKey}
            </span>
          )}
        </div>
        <div className="flex items-center gap-0.5">
          {stageOrder.map((stage, i) => {
            const config = stageConfig[stage];
            const isActive = lifecycle.stage === stage;

            return (
              <div key={stage} className="flex items-center">
                {/* Stage node */}
                <div
                  className={`relative flex flex-col items-center transition-all duration-300 ${
                    isActive ? "scale-110" : "opacity-50"
                  }`}
                >
                  <div
                    className={`w-7 h-7 md:w-8 md:h-8 rounded-full flex items-center justify-center text-xs border-2 transition-all duration-300 ${
                      isActive
                        ? `${config.dotColor} border-white/50 shadow-lg`
                        : "bg-gray-700 border-gray-600"
                    }`}
                  >
                    {isActive ? config.emoji : ""}
                  </div>
                  <span
                    className={`text-[10px] mt-1 whitespace-nowrap ${
                      isActive ? config.color + " font-bold" : "text-gray-500"
                    }`}
                  >
                    {config.label}
                  </span>
                </div>
                {/* Connector line */}
                {i < stageOrder.length - 1 && (
                  <div
                    className={`w-3 md:w-5 h-0.5 mx-0.5 transition-colors duration-300 ${
                      isActive ? config.dotColor : "bg-gray-600"
                    }`}
                  />
                )}
              </div>
            );
          })}
        </div>
      </div>
    );
  };

  return (
    <div className="mb-6">
      <h4 className="text-sm font-semibold text-gray-300 mb-3">
        🔀 Query Lifecycle Flow
      </h4>
      <div className="bg-gray-800/50 border border-gray-700 rounded-lg p-4">
        {renderPipeline(1)}
        {renderPipeline(2)}
        {renderPipeline(3)}
      </div>
      <p className="text-xs text-gray-400 mt-2 text-center">
        Each query moves through the lifecycle: No Data → Fetching → Fresh →
        Stale → GC Pending → Collected.
      </p>
    </div>
  );
}
