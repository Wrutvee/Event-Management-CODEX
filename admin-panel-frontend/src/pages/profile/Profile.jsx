import { useState, useEffect } from 'react';
import { useAdminProfile } from '../../context/AdminProfileContext';
import { addCsrfToken, fetchCsrfToken } from '../../utils/csrf';
import { validatePassword } from '../../utils/passwordValidation';
import Navbar from '../../components/navbar/Navbar';
import ProfileHeader from '../../components/profile/ProfileHeader';
import ProfileDetails from '../../components/profile/ProfileDetails';
import PasswordModal from '../../components/profile/PasswordModal';

export default function Profile() {
  // State declarations
  const { adminProfile, updateProfile } = useAdminProfile();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [showPasswordModal, setShowPasswordModal] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editedValues, setEditedValues] = useState({
    name: '',
    profilePic: ''
  });
  const [passwordValidationErrors, setPasswordValidationErrors] = useState([]);
  const [passwordForm, setPasswordForm] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });

  // Initialize edited values
  useEffect(() => {
    if (adminProfile) {
      setEditedValues({
        name: adminProfile.name,
        profilePic: adminProfile.profilePic || ''
      });
    }
  }, [adminProfile]);

  // Handlers
  const handleSaveChanges = async () => {
    setError(null);
    setIsLoading(true);

    try {
      await fetchCsrfToken();
      const response = await fetch(`${import.meta.env.VITE_BASE_API_URL}/profile`, {
        method: 'PUT',
        headers: addCsrfToken({
          'Content-Type': 'application/json'
        }),
        credentials: 'include',
        body: JSON.stringify(editedValues)
      });

      const data = await response.json();
      if (!response.ok) throw new Error(data.message);

      updateProfile(data.admin);
      setIsEditing(false);
    } catch (err) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  const handlePasswordChange = async (e) => {
    e.preventDefault();
    setError(null);
    setPasswordValidationErrors([]);

    // Validate password strength
    const validationErrors = validatePassword(passwordForm.newPassword);
    if (validationErrors.length > 0) {
      setPasswordValidationErrors(validationErrors);
      return;
    }

    // Check if passwords match
    if (passwordForm.newPassword !== passwordForm.confirmPassword) {
      setError("New passwords don't match");
      return;
    }

    setIsLoading(true);

    try {
      await fetchCsrfToken();
      const response = await fetch(`${import.meta.env.VITE_BASE_API_URL}/profile/change-password`, {
        method: 'PUT',
        headers: addCsrfToken({
          'Content-Type': 'application/json'
        }),
        credentials: 'include',
        body: JSON.stringify({
          currentPassword: passwordForm.currentPassword,
          newPassword: passwordForm.newPassword
        })
      });

      const data = await response.json();
      if (!response.ok) throw new Error(data.message);

      setShowPasswordModal(false);
      setPasswordForm({
        currentPassword: '',
        newPassword: '',
        confirmPassword: ''
      });
    } catch (err) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  const handleNewPasswordChange = (e) => {
    const newPass = e.target.value;
    setPasswordForm(prev => ({
      ...prev,
      newPassword: newPass
    }));
    setPasswordValidationErrors(validatePassword(newPass));
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <main className="pt-20 pb-8 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white shadow-sm rounded-lg p-6 md:p-8">
          <ProfileHeader 
            isEditing={isEditing}
            setIsEditing={setIsEditing}
            handleSaveChanges={handleSaveChanges}
            isLoading={isLoading}
            adminProfile={adminProfile}
            setEditedValues={setEditedValues}
          />

          {error && (
            <div className="mb-6 p-4 bg-red-100 text-red-700 rounded-lg">
              {error}
            </div>
          )}
          
          <div className="space-y-6">
            <ProfileDetails 
              isEditing={isEditing}
              editedValues={editedValues}
              setEditedValues={setEditedValues}
              adminProfile={adminProfile}
            />

            <div className="pt-6 border-t">
              <button
                onClick={() => setShowPasswordModal(true)}
                className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
              >
                Change Password
              </button>
            </div>
          </div>
        </div>
      </main>

      <PasswordModal 
        showPasswordModal={showPasswordModal}
        setShowPasswordModal={setShowPasswordModal}
        error={error}
        passwordForm={passwordForm}
        setPasswordForm={setPasswordForm}
        passwordValidationErrors={passwordValidationErrors}
        handlePasswordChange={handlePasswordChange}
        isLoading={isLoading}
      />
    </div>
  );
}