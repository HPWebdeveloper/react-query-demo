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

      {/* Config values */}
      <div className="grid grid-cols-2 gap-3 text-xs mb-4">
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

      {/* Definitions */}
      <div className="text-xs space-y-1.5 mb-4 bg-gray-800/40 rounded p-3 border border-gray-700/50">
        <p>
          <span className="text-yellow-400 font-mono">staleTime</span>
          <span className="text-gray-500 mx-1.5">→</span>
          <span className="text-gray-300">
            How long data is considered{" "}
            <em className="text-green-400 not-italic font-medium">fresh</em>{" "}
            (without refetching)
          </span>
        </p>
        <p>
          <span className="text-yellow-400 font-mono">cacheTime</span>
          <span className="text-gray-500 text-[10px] ml-1">
            (now <span className="text-yellow-400 font-mono">gcTime</span> in
            v5)
          </span>
          <span className="text-gray-500 mx-1.5">→</span>
          <span className="text-gray-300">
            How long{" "}
            <em className="text-red-400 not-italic font-medium">unused</em> data
            stays in memory
          </span>
        </p>
        <p className="text-gray-400 italic pt-1 border-t border-gray-700/50">
          💡 Stale data still exists in cache — it's just eligible for a
          background refetch.
        </p>
      </div>

      {/* Lifecycle flow */}
      <div className="bg-gray-800/40 rounded p-3 border border-gray-700/50">
        <p className="text-gray-400 text-[10px] uppercase tracking-wider font-semibold mb-2">
          Visual Mental Model
        </p>
        <div className="font-mono text-xs leading-relaxed text-center">
          <p className="text-cyan-400 font-semibold">Fetch</p>
          <p className="text-gray-600">│</p>
          <p className="text-gray-500 text-[10px]">
            fresh (<span className="text-yellow-400">staleTime</span>)
          </p>
          <p className="text-gray-600">▼</p>
          <p className="text-yellow-400 font-semibold">STALE</p>
          <p className="text-gray-600">│</p>
          <p className="text-gray-500 text-[10px]">component unmounts</p>
          <p className="text-gray-600">▼</p>
          <p className="text-orange-400 font-semibold">INACTIVE</p>
          <p className="text-gray-600">│</p>
          <p className="text-gray-500 text-[10px]">
            <span className="text-yellow-400">gcTime</span> countdown
          </p>
          <p className="text-gray-600">▼</p>
          <p className="text-red-400 font-semibold">GARBAGE COLLECTED</p>
        </div>
      </div>
    </div>
  );
}

export default QueryConfiguration;
