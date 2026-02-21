import { useState } from "react";

const steps = [
  {
    number: 1,
    title: "Select a User",
    element: "User 1 / User 2 / User 3 buttons",
    action: "Click one of the three user buttons at the top of the demo.",
    expectation:
      'React Query fetches data from the server for the first time. You\'ll see the status indicator show "⏳ Loading (First fetch)" briefly, then the user card appears with name, email, and the server timestamp. A stale-time countdown (30 s) starts immediately.',
    concept:
      'This triggers useQuery with queryKey ["user", userId]. Since the cache is empty for this user, React Query makes a real network request.',
  },
  {
    number: 2,
    title: "Switch to Another User",
    element: "User 1 / User 2 / User 3 buttons",
    action:
      "Click a different user button (e.g. switch from User 1 to User 2).",
    expectation:
      "A new API call is made because User 2 has never been fetched. The stale-time countdown resets for User 2. User 1's data stays in the cache — its garbage-collection countdown (60 s) begins quietly in the background.",
    concept:
      'Each user has its own cache entry keyed by ["user", userId]. Switching users doesn\'t discard the old cache.',
  },
  {
    number: 3,
    title: "Switch Back to a Previously Fetched User",
    element: "User 1 / User 2 / User 3 buttons",
    action:
      "Click back on User 1 (or any user you already fetched) within 30 seconds.",
    expectation:
      'The user card appears instantly with NO loading spinner and NO network request. Open the browser console — no new API call is logged. The status shows "✅ Cached".',
    concept:
      "The data is still within its staleTime (30 s), so React Query considers it fresh and serves it straight from the in-memory cache.",
  },
  {
    number: 4,
    title: "Wait for Data to Become Stale",
    element: "Stale-time countdown panel",
    action: "Watch the blue stale-time countdown reach 0 s.",
    expectation:
      'The countdown label turns orange and reads "STALE". The data is still displayed, but React Query now considers it outdated. No refetch happens automatically at this moment — React Query waits for a trigger.',
    concept:
      "After staleTime expires, the cached data is marked stale. It remains usable, but the next trigger (component mount, window focus, or manual refetch) will cause a background refetch.",
  },
  {
    number: 5,
    title: "Show the Child Component (Cache Sharing)",
    element: '"Show Child Component" button inside the user card',
    action: 'Click the purple "Show Child Component" button.',
    expectation:
      "A child component appears below the user card showing the same user's name and email. If the data is still fresh, no network request is made at all. If the data is stale, React Query silently refetches in the background while instantly displaying the stale cached data.",
    concept:
      'Both the parent (UserDataDisplay) and the child (ChildComponent) use the same queryKey ["user", userId]. React Query deduplicates requests and shares the same cache entry between all components that subscribe to the same key.',
  },
  {
    number: 6,
    title: "Hide the Child Component",
    element: '"Hide Child Component" button',
    action: "Click the button again to hide the child component.",
    expectation:
      "The child component disappears. The observer count for that query drops by one, but the parent still observes it, so no garbage-collection countdown starts.",
    concept:
      "React Query tracks how many components (observers) are subscribed to each query. Garbage collection only begins when the observer count reaches zero.",
  },
  {
    number: 7,
    title: "Unmount the Component",
    element: '"🔴 Unmount Component" button',
    action: 'Click the orange "Unmount Component" button.',
    expectation:
      "The user card and all child components disappear. The status indicators reset. Crucially, the garbage-collection countdown (60 s) starts ticking for the current user's cache entry. You can see it counting down in the yellow GC countdown panel.",
    concept:
      'When the component unmounts, the query has zero observers. React Query keeps the data in cache for gcTime (60 s) before permanently deleting it. This is the "grace period" that enables instant re-mounts.',
  },
  {
    number: 8,
    title: "Re-mount Before GC Expires",
    element: '"🟢 Mount Component" button',
    action:
      'Click "Mount Component" before the garbage-collection countdown reaches 0.',
    expectation:
      "The user card reappears instantly with the cached data — no loading spinner, no network request. The GC countdown stops because the query has an observer again. If the data is stale, a silent background refetch happens.",
    concept:
      "This is the power of gcTime: even after unmounting, cached data survives for 60 seconds. Re-mounting within that window gives users an instant experience.",
  },
  {
    number: 9,
    title: "Let Garbage Collection Remove the Cache",
    element: "GC countdown + Garbage Collection Monitor",
    action:
      "Unmount the component and wait for the full 60-second GC countdown to reach 0.",
    expectation:
      "When the countdown hits 0, the Garbage Collection Monitor logs an event like '[\"user\", 1] removed at 12:34:56'. The data is permanently deleted from memory.",
    concept:
      "After gcTime expires with zero observers, React Query's garbage collector removes the cache entry entirely. The next mount will trigger a fresh network request as if the data was never fetched.",
  },
  {
    number: 10,
    title: "Mount After Garbage Collection",
    element: '"🟢 Mount Component" button',
    action: 'Click "Mount Component" after the GC event has been logged.',
    expectation:
      'This time you see the "⏳ Loading" spinner again and a new API call in the console. The data is fetched from scratch because the cache was garbage collected.',
    concept:
      "With the cache entry removed, React Query treats this as a completely new query — demonstrating the full lifecycle from fetch → cache → stale → GC → re-fetch.",
  },
];

export default function InteractiveGuide() {
  const [expandedStep, setExpandedStep] = useState<number | null>(null);

  return (
    <section
      className="max-w-4xl mx-auto px-5 py-10 border-t-2 border-purple-500"
      aria-labelledby="guide-heading"
    >
      <h2 id="guide-heading" className="text-3xl font-semibold mb-2">
        📖 How to Use This React Query Demo
      </h2>
      <p className="text-gray-300 mb-8 text-base">
        Follow these 10 steps to explore React Query's complete caching
        lifecycle — from the first fetch, through stale time and cache sharing,
        all the way to garbage collection. Each step explains{" "}
        <strong className="text-white">what to click</strong>,{" "}
        <strong className="text-white">what to expect</strong>, and{" "}
        <strong className="text-white">which React Query concept</strong> is
        being demonstrated.
      </p>

      <ol className="space-y-3" role="list">
        {steps.map((step) => {
          const isOpen = expandedStep === step.number;
          return (
            <li key={step.number}>
              <button
                onClick={() => setExpandedStep(isOpen ? null : step.number)}
                className={`w-full text-left rounded-lg p-4 transition-colors ${
                  isOpen
                    ? "bg-purple-900/30 border border-purple-500/50"
                    : "bg-gray-800/50 border border-gray-700 hover:border-gray-500"
                }`}
                aria-expanded={isOpen}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <span
                      className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold ${
                        isOpen
                          ? "bg-purple-600 text-white"
                          : "bg-gray-700 text-gray-300"
                      }`}
                    >
                      {step.number}
                    </span>
                    <h3
                      className={`font-semibold text-base md:text-lg ${
                        isOpen ? "text-purple-300" : "text-gray-200"
                      }`}
                    >
                      {step.title}
                    </h3>
                  </div>
                  <span
                    className={`text-gray-300 transition-transform ${
                      isOpen ? "rotate-180" : ""
                    }`}
                  >
                    ▾
                  </span>
                </div>
              </button>

              {isOpen && (
                <div className="mt-1 ml-11 space-y-4 p-4 text-base">
                  <div>
                    <span className="text-sm font-semibold uppercase tracking-wider text-yellow-400">
                      🖱️ UI Element
                    </span>
                    <p className="text-purple-300 mt-1">{step.element}</p>
                  </div>
                  <div>
                    <span className="text-sm font-semibold uppercase tracking-wider text-yellow-400">
                      ⚡ Action
                    </span>
                    <p className="text-gray-300 mt-1">{step.action}</p>
                  </div>
                  <div>
                    <span className="text-sm font-semibold uppercase tracking-wider text-yellow-400">
                      👀 What to Expect
                    </span>
                    <p className="text-green-300 mt-1">{step.expectation}</p>
                  </div>
                  <div className="bg-blue-900/20 border border-blue-800/30 rounded-lg p-3">
                    <span className="text-sm font-semibold uppercase tracking-wider text-yellow-400">
                      🧠 React Query Concept
                    </span>
                    <p className="text-blue-200 mt-1">{step.concept}</p>
                  </div>
                </div>
              )}
            </li>
          );
        })}
      </ol>

      <div className="mt-8 bg-gray-800/50 border border-gray-700 rounded-lg p-5">
        <h3 className="font-semibold text-gray-200 mb-3">
          💡 Tips for Getting the Most Out of This Demo
        </h3>
        <ul className="space-y-2 text-base text-gray-300">
          <li>
            <strong className="text-white">Open the browser console</strong>{" "}
            (F12 → Console) to see exactly when real API calls happen versus
            when data is served from cache.
          </li>
          <li>
            <strong className="text-white">Watch the countdown timers</strong> —
            the blue stale-time countdown shows freshness, and the yellow GC
            countdown shows how long until cache removal.
          </li>
          <li>
            <strong className="text-white">Try rapid switching</strong> between
            users to see how React Query prevents duplicate network requests.
          </li>
          <li>
            <strong className="text-white">Unmount → wait → re-mount</strong> at
            different intervals to feel the difference between instant cache
            hits and fresh fetches.
          </li>
        </ul>
      </div>
    </section>
  );
}
