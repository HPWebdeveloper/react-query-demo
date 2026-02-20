import GithubCorner from "./GithubCorner";

export default function Banner() {
  return (
    <div className="relative bg-linear-to-r from-purple-600 via-pink-600 to-red-600 py-4 px-4">
      <GithubCorner />

      <div className="max-w-6xl mx-auto text-center">
        <h1 className="text-2xl font-bold mb-3">
          React Query Demo – Interactive Cache &amp; Data-Fetching Visualizer
        </h1>
        <p className="text-sm md:text-base opacity-90 mb-1">
          An interactive visualization by{" "}
          <a
            href="https://www.linkedin.com/in/hpwebdeveloper/"
            target="_blank"
            rel="noopener noreferrer"
            className="font-semibold underline hover:text-yellow-300 transition-colors"
          >
            Hamed Panjeh
          </a>
        </p>
        <p className="text-sm md:text-base opacity-90 mb-2">
          Explore how React Query (TanStack Query) handles caching, stale time,
          gcTime, garbage collection, and background refetching — all visualized
          in real time
        </p>
        <p className="text-xs md:text-sm">
          Powered by{" "}
          <a
            href="https://tanstack.com/query"
            target="_blank"
            rel="noopener noreferrer"
            className="underline font-semibold hover:text-yellow-300 transition-colors"
          >
            TanStack Query
          </a>
        </p>
      </div>
    </div>
  );
}
