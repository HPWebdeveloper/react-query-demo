import { useQuery } from "@tanstack/react-query";
import { useEffect } from "react";
import { fetchUser } from "../api/userApi";
import UserCard from "./UserCard";

/**
 * Inner component that will actually mount/unmount
 *
 * MAIN QUERY WITH CACHING:
 * staleTime: 30000 (30 seconds) - Data is considered "fresh" for 30 seconds
 * gcTime: 60000 (60 seconds) - Unused data stays in cache for 60 seconds
 * Watch the console to see when API calls are actually made!
 */

interface UserDataDisplayProps {
  userId: number;
  onDataUpdate?: (
    fetchedAtTime: string | undefined,
    isLoading: boolean,
    isFetching: boolean,
    dataUpdatedAt: number | undefined,
  ) => void;
}

export default function UserDataDisplay({
  userId,
  onDataUpdate,
}: UserDataDisplayProps) {
  const { data, isLoading, isFetching, dataUpdatedAt } = useQuery({
    queryKey: ["user", userId],
    queryFn: () => fetchUser(userId),
    staleTime: 30000, // 30 seconds - data stays fresh
    gcTime: 60000, // 60 seconds
  });

  // Send data updates to parent
  useEffect(() => {
    if (onDataUpdate) {
      onDataUpdate(data?.fetchedAt, isLoading, isFetching, dataUpdatedAt);
    }
  }, [data, isLoading, isFetching, dataUpdatedAt, onDataUpdate]);

  return (
    <>
      {isLoading && (
        <div className="text-center py-8 text-gray-300">
          Loading user data...
        </div>
      )}

      {!isLoading && data && <UserCard user={data} isFetching={isFetching} />}
    </>
  );
}
