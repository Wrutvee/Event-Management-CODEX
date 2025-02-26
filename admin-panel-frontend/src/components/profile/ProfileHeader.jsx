import { Pencil, X, Check } from "lucide-react";

export default function ProfileHeader({ 
  isEditing, 
  setIsEditing, 
  handleSaveChanges, 
  isLoading,
  adminProfile,
  setEditedValues 
}) {
  return (
    <div className="flex justify-between items-center mb-6 gap-6">
      <h1 className="text-2xl font-bold text-gray-900">Profile</h1>
      {!isEditing ? (
        <button
          onClick={() => setIsEditing(true)}
          className="flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
        >
          <Pencil className="w-4 h-4" />
          Edit Profile
        </button>
      ) : (
        <div className="flex gap-2">
          <button
            onClick={() => {
              setIsEditing(false);
              setEditedValues({
                name: adminProfile.name,
                profilePic: adminProfile.profilePic || "",
              });
            }}
            className="flex items-center gap-2 px-2 sm:px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
          >
            <X className="w-4 h-4" />
            Cancel
          </button>
          <button
            onClick={handleSaveChanges}
            disabled={isLoading}
            className="flex items-center gap-2 px-2 sm:px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors disabled:opacity-50"
          >
            <Check className="w-4 h-4" />
            {isLoading ? "Saving..." : "Save Changes"}
          </button>
        </div>
      )}
    </div>
  );
}
