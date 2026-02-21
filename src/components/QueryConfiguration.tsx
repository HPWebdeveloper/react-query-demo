/**
 * QUERY CONFIGURATION DISPLAY COMPONENT
 *
 * Shows the React Query configuration values used in the cache demo.
 */

interface QueryConfigurationProps {
  staleTime: number;
  gcTime: number;
}

function QueryConfiguration({ staleTime, gcTime }: QueryConfigurationProps) {
  return (
    <div className="mb-4 bg-blue-900/20 border border-blue-500/30 rounded-lg p-4">
      <h3 className="text-blue-400 font-semibold mb-3 text-sm">
        ⚙️ React Query Configuration
      </h3>
      <div className="grid grid-cols-2 gap-3 text-xs">
        <div className="bg-gray-800/50 rounded p-2">
          <span className="text-gray-300">staleTime:</span>{" "}
          <span className="text-yellow-400 font-mono">
            {staleTime}ms ({staleTime / 1000}s)
          </span>
          <p className="text-gray-400 mt-1 text-xs">
            Data stays fresh for {staleTime / 1000}s
          </p>
        </div>
        <div className="bg-gray-800/50 rounded p-2">
          <span className="text-gray-300">gcTime:</span>{" "}
          <span className="text-yellow-400 font-mono">
            {gcTime}ms ({gcTime / 1000}s)
          </span>
          <p className="text-gray-400 mt-1 text-xs">Cache retention time</p>
        </div>
      </div>
    </div>
  );
}

export default QueryConfiguration;
