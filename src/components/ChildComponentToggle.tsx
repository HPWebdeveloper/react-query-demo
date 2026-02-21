import { useState } from "react";
import ChildComponent from "./ChildComponent";

interface ChildComponentToggleProps {
  userId: number;
}

function ChildComponentToggle({ userId }: ChildComponentToggleProps) {
  const [showProfile, setShowProfile] = useState(false);

  return (
    <div className="mt-6">
      <button
        onClick={() => setShowProfile(!showProfile)}
        className="px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-lg font-medium transition-colors text-sm"
      >
        {showProfile ? "Hide" : "Show"} Child Component
      </button>
      <p className="text-xs text-gray-300 mt-2">
        Child component will use the SAME cached data, no new API call!
      </p>

      {showProfile && <ChildComponent userId={userId} />}
    </div>
  );
}

export default ChildComponentToggle;
