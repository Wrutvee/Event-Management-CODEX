export default function ModalActions({ setShowPasswordModal, isLoading }) {
  return (
    <div className="flex justify-end gap-3">
      <button
        type="button"
        onClick={() => setShowPasswordModal(false)}
        className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50"
      >
        Cancel
      </button>
      <button
        type="submit"
        disabled={isLoading}
        className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 disabled:opacity-50"
      >
        {isLoading ? "Changing..." : "Change Password"}
      </button>
    </div>
  );
}