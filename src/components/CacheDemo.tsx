/**
 * CACHE DEMO COMPONENT
 *
 * This component demonstrates React Query's powerful caching capabilities.
 * Each user can be independently mounted/unmounted to observe:
 * 1. Data is fetched once and cached per query key
 * 2. Mounting adds an observer → cache stays alive
 * 3. Unmounting removes the observer → GC countdown starts
 * 4. Cache persists even when component unmounts (for gcTime)
 * 5. Background refetching keeps data fresh (after staleTime)
 */

import { useEffect, useState } from "react";
import CacheTimeCountdown from "./CacheTimeCountdown";
import GarbageCollectionCountdown from "./GarbageCollectionCountdown";
import GarbageCollectionMonitor from "./GarbageCollectionMonitor";
import NetworkActivityLog from "./NetworkActivityLog";
import ObserverCount from "./ObserverCount";
import QueryConfiguration from "./QueryConfiguration";
import QueryLifecycleFlow from "./QueryLifecycleFlow";
import UserDataDisplay from "./UserDataDisplay";

function CacheDemo() {
  const [mountedUsers, setMountedUsers] = useState<Record<number, boolean>>({
    1: false,
    2: false,
    3: false,
  });
  const [currentTime, setCurrentTime] = useState(
    new Date().toLocaleTimeString(),
  );

  const staleTime = 30000; // 30 seconds
  const gcTime = 60000; // 60 seconds

  // Update current time every second
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date().toLocaleTimeString());
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const toggleUserMount = (userId: number) => {
    setMountedUsers((prev) => ({ ...prev, [userId]: !prev[userId] }));
  };

  return (
    <div className="max-w-6xl mx-auto px-5 py-10 mt-10 border-t-2 border-purple-500">
      <h2 className="text-3xl font-semibold mb-4">
        🗂️ React Query Cache Demo — staleTime, gcTime &amp; Garbage Collection
      </h2>
      <p className="text-gray-300 mb-6 text-sm">
        Watch React Query's caching lifecycle in real time. This demo lets you
        observe how <strong>staleTime</strong>, <strong>gcTime</strong>,{" "}
        <strong>garbage collection</strong>, and{" "}
        <strong>background refetching</strong> work together. Mount and unmount
        each user independently to see how observers affect the cache lifecycle.
        Since the server is on a free tier, please allow about one minute for it
        to wake up.
      </p>

      <QueryConfiguration staleTime={staleTime} gcTime={gcTime} />

      {/* Two-column dashboard: Lifecycle (left) + Monitors (right) */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
        {/* Left column: Query Lifecycle Flow (vertical) */}
        <div>
          <QueryLifecycleFlow />
        </div>

        {/* Right column: Observers + Countdowns stacked, stretch to match left */}
        <div className="flex flex-col gap-5 justify-between">
          <ObserverCount />
          <GarbageCollectionCountdown />
          <CacheTimeCountdown />
        </div>
      </div>

      <GarbageCollectionMonitor />

      {/* Per-user mount/unmount panels */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        {[1, 2, 3].map((userId) => (
          <div
            key={userId}
            className={`rounded-lg p-4 transition-colors ${
              mountedUsers[userId]
                ? "bg-gray-800 border border-green-700/50"
                : "bg-gray-800/50 border border-gray-700"
            }`}
          >
            <div className="flex items-center justify-between mb-2">
              <div>
                <h4 className="text-sm font-semibold text-gray-200">
                  User {userId}
                </h4>
                <p className="text-[10px] text-purple-400 font-mono">
                  Cache Key: ["user", {userId}]
                </p>
              </div>
              <button
                onClick={() => toggleUserMount(userId)}
                className={`px-3 py-1.5 rounded-lg text-[11px] font-medium transition-colors ${
                  mountedUsers[userId]
                    ? "bg-red-600 hover:bg-red-700 text-white"
                    : "bg-green-600 hover:bg-green-700 text-white"
                }`}
              >
                {mountedUsers[userId] ? "🔴 Unmount" : "🟢 Mount"}
              </button>
            </div>

            {/* Per-user time + mount status */}
            <div className="flex justify-between items-center text-[10px] mb-2 bg-gray-900/40 rounded px-2 py-1">
              <span className="text-gray-400">🕐 {currentTime}</span>
              <span
                className={
                  mountedUsers[userId] ? "text-green-400" : "text-gray-500"
                }
              >
                {mountedUsers[userId] ? "● Mounted" : "○ Unmounted"}
              </span>
            </div>

            {mountedUsers[userId] ? (
              <UserDataDisplay userId={userId} />
            ) : (
              <div className="text-center py-6 text-gray-500 text-xs border border-dashed border-gray-600 rounded-lg">
                Component unmounted
                <br />
                <span className="text-[10px] text-gray-600">
                  Mount to add an observer and fetch data
                </span>
              </div>
            )}
          </div>
        ))}
      </div>

      <NetworkActivityLog />
    </div>
  );
}

export default CacheDemo;
