import PasswordFields from "./PasswordFields";
import ModalActions from "./ModalActions";

export default function PasswordModal({
  showPasswordModal,
  setShowPasswordModal,
  error,
  passwordForm,
  setPasswordForm,
  passwordValidationErrors,
  handlePasswordChange,
  isLoading,
}) {
  return (
    showPasswordModal && (
      <div className="fixed shadow-2xl inset-0 flex items-center justify-center p-4">
        <div
          className="fixed inset-0 bg-gray-600 bg-opacity-50 transition-opacity"
          onClick={() => setShowPasswordModal(false)}
        />

        <div className="relative z-10 bg-white rounded-lg p-6 w-full max-w-md">
          <h2 className="text-xl font-semibold mb-4">Change Password</h2>
          {error && (
            <div className="mb-4 p-3 bg-red-100 text-red-700 rounded-lg">
              {error}
            </div>
          )}
          <form onSubmit={handlePasswordChange} className="space-y-4">
            {/* Password Form Fields */}
            <PasswordFields
              passwordForm={passwordForm}
              setPasswordForm={setPasswordForm}
              passwordValidationErrors={passwordValidationErrors}
            />
            {/* Modal Actions */}
            <ModalActions
              setShowPasswordModal={setShowPasswordModal}
              isLoading={isLoading}
            />
          </form>
        </div>
      </div>
    )
  );
}
