interface StatusIndicatorsProps {
  isLoading: boolean;
  isFetching: boolean;
  dataUpdatedAt?: number;
  userId: number;
}

function StatusIndicators({
  isLoading,
  isFetching,
  dataUpdatedAt,
  userId,
}: StatusIndicatorsProps) {
  return (
    <div className="bg-gray-800 rounded-lg p-4 mb-6">
      <div className="grid grid-cols-2 gap-4 text-sm">
        <div>
          <span className="text-gray-300">Status:</span>{" "}
          <span
            className={
              isLoading
                ? "text-yellow-400"
                : isFetching
                  ? "text-blue-400"
                  : "text-green-400"
            }
          >
            {isLoading
              ? "⏳ Loading (First fetch)"
              : isFetching
                ? "🔄 Refetching (Background)"
                : "✅ Cached"}
          </span>
        </div>
        <div>
          <span className="text-gray-300">
            {dataUpdatedAt ? "Last Fetched:" : "Fetch Status:"}
          </span>{" "}
          <span className="text-white">
            {dataUpdatedAt
              ? new Date(dataUpdatedAt).toLocaleTimeString()
              : "Awaiting initial fetch"}
          </span>
        </div>
        <div>
          <span className="text-gray-300">Selected User:</span>{" "}
          <span className="text-white">User {userId}</span>
        </div>
        <div>
          <span className="text-gray-300">Cache Key:</span>{" "}
          <span className="text-purple-400">["user", {userId}]</span>
        </div>
      </div>
    </div>
  );
}

export default StatusIndicators;
