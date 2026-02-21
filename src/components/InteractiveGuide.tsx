import { useState } from "react";

const steps = [
  {
    number: 1,
    title: "Mount Your First User",
    element: "🟢 Mount button on any user card (User 1, 2, or 3)",
    action: 'Click the green "🟢 Mount" button on the User 1 panel.',
    expectation:
      "React Query fetches data from the server for the first time. You'll see \"⏳ Loading\" briefly, then the user's name, email, status, and server timestamp appear inside the card. The Observer count for User 1 changes to 1 (green), and the stale-time countdown (30 s) starts.",
    concept:
      'Mounting the component triggers useQuery with queryKey ["user", 1]. Since no cache exists yet, React Query makes a real network request. The component becomes an "observer" of this query.',
  },
  {
    number: 2,
    title: "Mount a Second User",
    element: "🟢 Mount button on a different user card",
    action:
      'While User 1 is still mounted, click "🟢 Mount" on the User 2 panel.',
    expectation:
      "A new API call is made because User 2 has never been fetched. Both User 1 and User 2 are now mounted simultaneously — each with their own data, their own status, and their own countdowns. The Observer panel shows 1 for each.",
    concept:
      'Each user has its own cache entry keyed by ["user", userId]. Mounting User 2 does NOT affect User 1\'s cache or state. This is the power of independent query keys.',
  },
  {
    number: 3,
    title: "Unmount and Re-mount While Fresh",
    element: "🔴 Unmount and 🟢 Mount buttons on the same user card",
    action:
      'Click "🔴 Unmount" on User 1, then immediately click "🟢 Mount" again (within 30 seconds of the original fetch).',
    expectation:
      'The user card disappears on unmount, then reappears instantly on re-mount with NO loading spinner and NO network request. The status shows "✅ Cached". Check the console — no new API call was logged.',
    concept:
      "The data is still within its staleTime (30 s) and within gcTime (60 s), so React Query considers it fresh and serves it straight from the in-memory cache. This is why users experience instant page loads.",
  },
  {
    number: 4,
    title: "Watch Data Become Stale",
    element: "⏱️ Freshness countdown panel in the right column",
    action:
      "Keep a user mounted and watch its blue freshness countdown reach 0 s.",
    expectation:
      'The countdown label turns orange and reads "STALE". The data is still displayed, but React Query now considers it outdated. No refetch happens automatically — React Query waits for a trigger like a remount or window focus.',
    concept:
      "After staleTime (30 s) expires, the cached data is marked stale. It remains usable and displayed, but the next trigger (component remount, window focus, or manual refetch) will cause a background refetch.",
  },
  {
    number: 5,
    title: "Show the Child Component (Cache Sharing)",
    element: '"Show Child Component" button inside a mounted user card',
    action:
      'Click the purple "Show Child Component" button inside any mounted user\'s card.',
    expectation:
      "A child component appears below the user data showing the same user's name and email. If the data is still fresh, no network request is made at all. If stale, React Query silently refetches in the background while instantly displaying the stale cached data. The Observer count for that user increases to 2.",
    concept:
      'Both the parent (UserDataDisplay) and the child (ChildComponent) use the same queryKey ["user", userId]. React Query deduplicates requests and shares the same cache entry. The observer count increases because two components now watch this query.',
  },
  {
    number: 6,
    title: "Hide the Child Component",
    element: '"Hide Child Component" button',
    action: "Click the button again to hide the child component.",
    expectation:
      "The child component disappears. The observer count for that user's query drops back to 1 (the parent still observes it), so no garbage-collection countdown starts. The cache remains active.",
    concept:
      "React Query tracks how many components (observers) are subscribed to each query. Garbage collection only begins when the observer count reaches zero — which means the parent must also unmount.",
  },
  {
    number: 7,
    title: "Unmount a User",
    element: '"🔴 Unmount" button on a specific user card',
    action: 'Click the "🔴 Unmount" button on User 1\'s panel.',
    expectation:
      'User 1\'s data card disappears and the status changes to "○ Unmounted". The Observer count for User 1 drops to 0 (red, "GC eligible"). The GC countdown (60 s) begins ticking in the yellow ⏳ GC Countdown panel. Other mounted users are NOT affected.',
    concept:
      'When the component unmounts, the query has zero observers. React Query keeps the data in cache for gcTime (60 s) before permanently deleting it. This is the "grace period" that enables instant re-mounts.',
  },
  {
    number: 8,
    title: "Re-mount Before GC Expires",
    element: '"🟢 Mount" button on the same user card',
    action: 'Click "🟢 Mount" on User 1 before the GC countdown reaches 0.',
    expectation:
      "User 1's card reappears instantly with the cached data — no loading spinner, no network request. The GC countdown stops because the query has an observer again. If the data is stale (staleTime already expired), a silent background refetch happens automatically.",
    concept:
      "This is the power of gcTime: even after unmounting, cached data survives for 60 seconds. Re-mounting within that window gives users an instant experience while keeping data fresh through background refetching.",
  },
  {
    number: 9,
    title: "Let Garbage Collection Remove the Cache",
    element: "⏳ GC Countdown + 🗑️ Garbage Collection Events monitor",
    action:
      "Unmount a user and wait for the full 60-second GC countdown to reach 0.",
    expectation:
      'When the countdown hits 0, the Garbage Collection Events panel logs an event like \'["user", 1] removed at 12:34:56\'. The lifecycle flow for that user moves to the "Collected" stage. The data is permanently deleted from memory.',
    concept:
      "After gcTime expires with zero observers, React Query's garbage collector removes the cache entry entirely. The next mount will trigger a fresh network request as if the data was never fetched.",
  },
  {
    number: 10,
    title: "Mount After Garbage Collection",
    element: '"🟢 Mount" button on the garbage-collected user card',
    action: 'Click "🟢 Mount" on the user whose cache was just collected.',
    expectation:
      'This time you see the "⏳ Loading" state again and a new API call appears in the Network Activity Log and browser console. The data is fetched from scratch because the cache was garbage collected.',
    concept:
      "With the cache entry removed, React Query treats this as a completely new query — demonstrating the full lifecycle from fetch → cache → stale → GC → re-fetch. Try mounting multiple users to see this cycle independently for each one.",
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
            the blue freshness countdown shows staleTime, and the yellow GC
            countdown shows how long until cache removal.
          </li>
          <li>
            <strong className="text-white">Mount multiple users at once</strong>{" "}
            to see how each user's cache lifecycle runs independently —
            different stale times, different GC countdowns.
          </li>
          <li>
            <strong className="text-white">Unmount → wait → re-mount</strong> at
            different intervals to feel the difference between instant cache
            hits and fresh fetches.
          </li>
          <li>
            <strong className="text-white">Show child components</strong> on
            different users to see observer counts increase — this proves cache
            sharing between parent and child with no extra network requests.
          </li>
        </ul>
      </div>
    </section>
  );
}
