/**
 * CACHE DEMO COMPONENT
 *
 * This component demonstrates React Query's powerful caching capabilities.
 * It shows how data is cached and reused without making unnecessary network requests.
 *
 * Key concepts demonstrated:
 * 1. Data is fetched once and cached
 * 2. Subsequent renders use cached data (no new network request)
 * 3. Multiple components with same queryKey share the same cache
 * 4. Cache persists even when component unmounts
 * 5. Background refetching keeps data fresh
 */

import { useEffect, useState } from "react";
import CacheTimeCountdown from "./CacheTimeCountdown";
import GarbageCollectionCountdown from "./GarbageCollectionCountdown";
import GarbageCollectionMonitor from "./GarbageCollectionMonitor";
import MountControl from "./MountControl";
import QueryConfiguration from "./QueryConfiguration";
import StatusIndicators from "./StatusIndicators";
import TimeDisplay from "./TimeDisplay";
import UserDataDisplay from "./UserDataDisplay";
import UserSelector from "./UserSelector";

function CacheDemo() {
  const [userId, setUserId] = useState(1);
  const [componentMounted, setComponentMounted] = useState(true);
  const [currentTime, setCurrentTime] = useState(
    new Date().toLocaleTimeString(),
  );
  const [fetchedAt, setFetchedAt] = useState<string | undefined>(undefined);
  const [isLoading, setIsLoading] = useState(false);
  const [isFetching, setIsFetching] = useState(false);
  const [dataUpdatedAt, setDataUpdatedAt] = useState<number | undefined>(
    undefined,
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

  // Callback to receive data from child
  const handleDataUpdate = (
    fetchedAtTime: string | undefined,
    loading: boolean,
    fetching: boolean,
    updatedAt: number | undefined,
  ) => {
    setFetchedAt(fetchedAtTime);
    setIsLoading(loading);
    setIsFetching(fetching);
    setDataUpdatedAt(updatedAt);
  };

  // Handle user selection - clear state when switching users
  const handleUserSelect = (newUserId: number) => {
    setUserId(newUserId);
  };

  // Handle mount toggle - clear state when unmounting
  const handleMountToggle = () => {
    const newMountState = !componentMounted;
    setComponentMounted(newMountState);
    if (!newMountState) {
      // Clear state when unmounting
      setFetchedAt(undefined);
      setIsLoading(false);
      setIsFetching(false);
      setDataUpdatedAt(undefined);
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-5 py-10 mt-10 border-t-2 border-purple-500">
      <h2 className="text-3xl font-semibold mb-4">
        🗂️ React Query Cache Demo — staleTime, gcTime &amp; Garbage Collection
      </h2>
      <p className="text-gray-300 mb-6 text-sm">
        Watch React Query's caching lifecycle in real time. This demo lets you
        observe how <strong>staleTime</strong>, <strong>gcTime</strong>,{" "}
        <strong>garbage collection</strong>, and{" "}
        <strong>background refetching</strong> work together. Open the browser
        console to see when actual API calls are made. Since the server is on a
        free tier, please allow about one minute for it to wake up.
      </p>

      <QueryConfiguration staleTime={staleTime} gcTime={gcTime} />

      <GarbageCollectionCountdown />

      <GarbageCollectionMonitor />

      <CacheTimeCountdown />

      <UserSelector selectedUserId={userId} onSelectUser={handleUserSelect} />

      <TimeDisplay currentTime={currentTime} lastFetchedTime={fetchedAt} />

      <StatusIndicators
        isLoading={isLoading}
        isFetching={isFetching}
        dataUpdatedAt={dataUpdatedAt}
        userId={userId}
      />

      <MountControl isMounted={componentMounted} onToggle={handleMountToggle} />

      {/* {real mounting/unmounting happens here} */}
      {componentMounted && (
        <UserDataDisplay userId={userId} onDataUpdate={handleDataUpdate} />
      )}
    </div>
  );
}

export default CacheDemo;
