export default function PasswordFields({ 
  passwordForm, 
  setPasswordForm, 
  passwordValidationErrors 
}) {
  return (
    <div className="space-y-4">
      <div>
        <input
          type="text"
          autoComplete="username"
          style={{ display: "none" }}
          aria-hidden="true"
          defaultValue={passwordForm.email} // If you have access to user's email
        />
        <label className="block text-sm font-medium text-gray-700">
          Current Password
        </label>
        <input
          type="password"
          required
          autoComplete="current-password"
          className="mt-1 px-4 h-8 border block w-full rounded-md border-gray-500 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
          value={passwordForm.currentPassword}
          onChange={(e) =>
            setPasswordForm((prev) => ({
              ...prev,
              currentPassword: e.target.value,
            }))
          }
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700">
          New Password
        </label>
        <input
          type="password"
          required
          autoComplete="new-password"
          className="mt-1 px-4 h-8 border block w-full rounded-md border-gray-500 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
          value={passwordForm.newPassword}
          onChange={(e) =>
            setPasswordForm((prev) => ({
              ...prev,
              newPassword: e.target.value,
            }))
          }
        />
        {passwordValidationErrors.length > 0 && (
          <ul className="mt-1 text-sm text-red-600 list-disc list-inside">
            {passwordValidationErrors.map((error, index) => (
              <li key={index}>{error}</li>
            ))}
          </ul>
        )}
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700">
          Confirm New Password
        </label>
        <input
          type="password"
          autoComplete="new-password"
          required
          className="mt-1 px-4 h-8 border block w-full rounded-md border-gray-500 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
          value={passwordForm.confirmPassword}
          onChange={(e) =>
            setPasswordForm((prev) => ({
              ...prev,
              confirmPassword: e.target.value,
            }))
          }
        />
      </div>
    </div>
  );
}