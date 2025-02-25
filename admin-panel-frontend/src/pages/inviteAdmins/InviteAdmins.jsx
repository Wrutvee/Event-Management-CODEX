import { useEffect, useState } from 'react';
import { useAdminProfile } from '../../context/AdminProfileContext';
import { addCsrfToken, fetchCsrfToken } from '../../utils/csrf';
import Navbar from '../../components/navbar/Navbar';

export default function InviteAdmins() {
  const { adminProfile } = useAdminProfile();
  const [role, setRole] = useState('admin');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [inviteLink, setInviteLink] = useState('');
  const [activeInvites, setActiveInvites] = useState([]);
  const [isCopied, setIsCopied] = useState(false);
  const [description, setDescription] = useState('');  // Add this state

  useEffect(() => {
    const loadInvites = async () => {
      try {
        await fetchActiveInvites();
      } catch (error) {
        console.error("Error loading invites:", error);
        setError("Failed to load active invites");
      }
    };

    loadInvites();
  }, []);

  const generateInvite = async () => {
    setIsLoading(true);
    setError(null);
    try {
      if (!description.trim()) {
        throw new Error('Please add a description for this invite');
      }

      if (role === 'superadmin' && adminProfile?.role !== 'superadmin') {
        throw new Error('Only superadmins can invite other superadmins');
      }

      await fetchCsrfToken();
      const response = await fetch(
        `${import.meta.env.VITE_BASE_API_URL}/invite/generate-invite`,
        {
          method: 'POST',
          headers: addCsrfToken({
            'Content-Type': 'application/json',
          }),
          credentials: 'include',
          body: JSON.stringify({ role, description }),
        }
      );

      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.message || 'Failed to generate invite');
      }

      const inviteUrl = `${window.location.origin}/signup?invite=${data.code}`;
      setInviteLink(inviteUrl);
      setDescription(''); // Reset description after successful generation
      fetchActiveInvites(); // Refresh list
    } catch (error) {
      setError(error.message);
    } finally {
      setIsLoading(false);
    }
  };

  const copyToClipboard = async () => {
    try {
      if (!inviteLink) {
        setError("No invite link to copy");
        return;
      }

      if (navigator.clipboard) {
        // Modern browsers
        await navigator.clipboard.writeText(inviteLink);
      } else {
        // Fallback for older browsers
        const textArea = document.createElement("textarea");
        textArea.value = inviteLink;
        textArea.style.position = "fixed"; // Avoid scrolling to bottom
        textArea.style.opacity = "0";
        document.body.appendChild(textArea);
        textArea.select();

        try {
          document.execCommand("copy");
          textArea.remove();
        } catch (err) {
          console.error("Fallback: Oops, unable to copy", err);
          throw new Error("Copy failed");
        }
      }

      setIsCopied(true);
      setTimeout(() => setIsCopied(false), 2000);
    } catch (error) {
      console.error("Copy error:", error);
      setError("Failed to copy to clipboard");
    }
  };

  const fetchActiveInvites = async () => {
    try {
      await fetchCsrfToken();
      const response = await fetch(
        `${import.meta.env.VITE_BASE_API_URL}/invite/active-invites`,
        {
          headers: addCsrfToken(),
          credentials: 'include',
        }
      );

      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.message);
      }

      setActiveInvites(data.invites);
    } catch (error) {
      console.error('Failed to fetch active invites:', error);
    }
  };

  const revokeInvite = async (code) => {
    try {
      await fetchCsrfToken();
      const response = await fetch(
        `${import.meta.env.VITE_BASE_API_URL}/invite/revoke-invite/${code}`,
        {
          method: 'DELETE',
          headers: addCsrfToken(),
          credentials: 'include',
        }
      );

      if (!response.ok) {
        throw new Error('Failed to revoke invite');
      }

      fetchActiveInvites(); // Refresh list
    } catch (error) {
      setError(error.message);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <main className="pt-20 pb-8 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white shadow-sm rounded-lg p-6">
          <h1 className="text-2xl font-bold text-gray-900 mb-6">
            Invite Admins
          </h1>

          {error && (
            <div className="mb-6 p-4 bg-red-100 text-red-700 rounded-lg">
              {error}
            </div>
          )}

          <div className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Role
              </label>
              <select
                value={role}
                onChange={(e) => setRole(e.target.value)}
                className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md"
                disabled={isLoading}
              >
                <option value="admin">Admin</option>
                {adminProfile?.role === "superadmin" && (
                  <option value="superadmin">Super Admin</option>
                )}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">
                Description
              </label>
              <input
                type="text"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="e.g., New marketing team member"
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                disabled={isLoading}
              />
            </div>

            <button
              onClick={generateInvite}
              disabled={isLoading}
              className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50"
            >
              {isLoading ? (
                <div className="dots-loader" />
              ) : (
                "Generate Invite Link"
              )}
            </button>

            {inviteLink && (
              <div className="mt-4 relative">
                <input
                  type="text"
                  readOnly
                  value={inviteLink}
                  className="block w-full pr-24 border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                />
                <button
                  onClick={copyToClipboard}
                  className="absolute right-2 top-1/2 -translate-y-1/2 px-3 py-1 bg-indigo-100 text-indigo-700 rounded text-sm hover:bg-indigo-200"
                >
                  {isCopied ? "Copied!" : "Copy"}
                </button>
              </div>
            )}

            {/* Active Invites Section */}
            {activeInvites.length > 0 && (
              <div className="mt-8">
                <h2 className="text-lg font-medium text-gray-900 mb-4">
                  Active Invites
                </h2>
                <div className="space-y-4">
                  {activeInvites.map((invite) => (
                    <div
                      key={invite.code}
                      className="flex items-center justify-between p-4 bg-gray-50 rounded-lg"
                    >
                      <div>
                        <p className="text-sm font-medium text-gray-900">
                          {invite.roleAssigned} Invite
                        </p>
                        <p className="text-sm text-gray-600">
                          {invite.description}
                        </p>
                        <p className="text-sm text-gray-500">
                          Expires: {new Date(invite.expiresAt).toLocaleString()}
                        </p>
                      </div>
                      <button
                        onClick={() => revokeInvite(invite.code)}
                        className="px-3 py-1 text-sm text-red-600 hover:bg-red-50 rounded"
                      >
                        Revoke
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}