import avatar from "/avatar.png";

export default function ProfileDetails({
  isEditing,
  editedValues,
  setEditedValues,
  adminProfile,
}) {
  return (
    <div className="flex flex-col md:flex-row items-center gap-6">
      <div className="w-32 h-32 rounded-full overflow-hidden">
        <img
          src={
            isEditing
              ? editedValues.profilePic || avatar
              : adminProfile?.profilePic || avatar
          }
          alt="Profile"
          className="w-full h-full object-cover"
        />
      </div>
      <div className="flex-1 space-y-4 text-center md:text-left">
        <div className="relative">
          {isEditing ? (
            <input
              type="text"
              value={editedValues.name}
              onChange={(e) =>
                setEditedValues((prev) => ({ ...prev, name: e.target.value }))
              }
              className="text-xl font-semibold text-gray-900 p-1 border rounded"
            />
          ) : (
            <h2 className="text-xl font-semibold text-gray-900">
              {adminProfile?.name}
            </h2>
          )}
          <p className="text-sm text-gray-500">{adminProfile?.role}</p>
        </div>
        <div className="space-y-2">
          <p className="text-gray-600">
            <span className="font-medium">Email: </span>
            {adminProfile?.email}
          </p>
          <p className="text-gray-600">
            <span className="font-medium">Member since: </span>
            {new Date(adminProfile?.createdAt).toLocaleDateString()}
          </p>
        </div>
      </div>
    </div>
  );
}
