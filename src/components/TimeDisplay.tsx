interface TimeDisplayProps {
  currentTime: string;
  lastFetchedTime?: string;
}

function TimeDisplay({ currentTime, lastFetchedTime }: TimeDisplayProps) {
  return (
    <div className="mb-4 bg-gray-800 rounded-lg p-4">
      <div className="grid grid-cols-2 gap-4 text-sm">
        <div>
          <span className="text-gray-300">Current Time:</span>{" "}
          <span className="text-white font-mono">{currentTime}</span>
        </div>
        <div>
          <span className="text-gray-300">Last Fetched:</span>{" "}
          <span className="text-green-400 font-mono">
            {lastFetchedTime || "N/A"}
          </span>
        </div>
      </div>
    </div>
  );
}

export default TimeDisplay;
