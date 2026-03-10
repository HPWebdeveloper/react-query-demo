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
        <p className="text-gray-400 text-[10px] uppercase tracking-wider font-semibold mb-3">
          Visual Mental Model
        </p>

        <div className="flex gap-3">
          {/* Main flow - left column */}
          <div className="flex-1 font-mono text-xs leading-relaxed">
            {/* Fetch */}
            <div className="flex items-center gap-2 mb-1">
              <span className="inline-flex items-center justify-center w-5 h-5 rounded-full bg-cyan-500/20 text-cyan-400 text-[10px] font-bold shrink-0">1</span>
              <span className="text-cyan-400 font-semibold text-sm">Fetch</span>
            </div>
            <div className="ml-2.5 border-l-2 border-cyan-500/30 pl-4 py-1">
              <span className="text-gray-500 text-[10px]">
                fresh (<span className="text-yellow-400">staleTime</span>)
              </span>
            </div>

            {/* Stale */}
            <div className="flex items-center gap-2 mb-1">
              <span className="inline-flex items-center justify-center w-5 h-5 rounded-full bg-yellow-500/20 text-yellow-400 text-[10px] font-bold shrink-0">2</span>
              <span className="text-yellow-400 font-semibold text-sm">STALE</span>
            </div>
            <div className="ml-2.5 border-l-2 border-yellow-500/30 pl-4 py-1">
              <span className="text-gray-500 text-[10px]">component unmounts</span>
            </div>

            {/* Inactive */}
            <div className="flex items-center gap-2 mb-1">
              <span className="inline-flex items-center justify-center w-5 h-5 rounded-full bg-orange-500/20 text-orange-400 text-[10px] font-bold shrink-0">3</span>
              <span className="text-orange-400 font-semibold text-sm">INACTIVE</span>
            </div>
            <div className="ml-2.5 border-l-2 border-orange-500/30 pl-4 py-1 space-y-0.5">
              <span className="text-gray-500 text-[10px]">
                <span className="text-yellow-400">gcTime</span> countdown
              </span>
              <br />
              <span className="text-gray-400 text-[10px] italic">
                React Query returns cached data immediately and then triggers background refetch
              </span>
            </div>

            {/* Garbage Collected */}
            <div className="flex items-center gap-2">
              <span className="inline-flex items-center justify-center w-5 h-5 rounded-full bg-red-500/20 text-red-400 text-[10px] font-bold shrink-0">4</span>
              <span className="text-red-400 font-semibold text-sm">GARBAGE COLLECTED</span>
            </div>
          </div>

          {/* Right column - remount during gcTime */}
          <div className="flex-1 font-mono text-xs border-l border-dashed border-gray-600/50 pl-3">
            <p className="text-gray-400 text-[10px] uppercase tracking-wider font-semibold mb-2">
              If component mounts during gcTime
            </p>
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-green-400 shrink-0" />
                <span className="text-green-400">cached data appears instantly</span>
              </div>
              <div className="text-gray-600 ml-[3px] text-xs">↓</div>
              <div className="flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-blue-400 shrink-0" />
                <span className="text-blue-400">background fetch starts</span>
              </div>
              <div className="text-gray-600 ml-[3px] text-xs">↓</div>
              <div className="flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-purple-400 shrink-0" />
                <span className="text-purple-400">UI updates with new data</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default QueryConfiguration;
