interface MountControlProps {
  isMounted: boolean;
  onToggle: () => void;
}

function MountControl({ isMounted, onToggle }: MountControlProps) {
  return (
    <div className="mb-6">
      <button
        onClick={onToggle}
        className="px-4 py-2 bg-orange-600 hover:bg-orange-700 text-white rounded-lg font-medium transition-colors"
      >
        {isMounted ? "🔴 Unmount Component" : "🟢 Mount Component"}
      </button>
      <p className="text-xs text-gray-300 mt-2">
        Toggle to ACTUALLY mount/unmount! Cache persists across mount cycles.
      </p>
    </div>
  );
}

export default MountControl;
