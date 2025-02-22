import { useState } from "react";
import { useNavigate } from "react-router-dom";
import mainLogo from '/logos/main_logo.png';
import { addCsrfToken, fetchCsrfToken } from "../../utils/csrf";
import { validatePassword } from "../../utils/passwordValidation";

export default function PasswordReset() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [error, setError] = useState(null);
  const [otpSent, setOtpSent] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [passwordValidationErrors, setPasswordValidationErrors] = useState([]);

  const handleGetOtp = async (e) => {
    e.preventDefault();
    setError(null);
    setIsLoading(true);
    
    try {
      await fetchCsrfToken();
      const response = await fetch('http://localhost:3000/auth/reset-password', {
        method: 'POST',
        headers: addCsrfToken({
          'Content-Type': 'application/json',
        }),
        body: JSON.stringify({ email }),
        credentials: 'include',
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Failed to send OTP');
      }

      setOtpSent(true);
    } catch (error) {
      setError(error.message);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setIsLoading(true);

    if (!email || !otp || !newPassword) {
      setError('All fields are required');
      setIsLoading(false);
      return;
    }

    const validationErrors = validatePassword(newPassword);
    if (validationErrors.length > 0) {
      setPasswordValidationErrors(validationErrors);
      setIsLoading(false);
      return;
    }

    try {
      await fetchCsrfToken();
      const response = await fetch('http://localhost:3000/auth/new-password', {
        method: 'POST',
        headers: addCsrfToken({
          'Content-Type': 'application/json',
        }),
        body: JSON.stringify({ email, otp, newPassword }),
        credentials: 'include',
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Failed to reset password');
      }

      navigate("/signin", {
        state: { message: "Password reset successful! Please login with your new password." },
      });
    } catch (error) {
      setError(error.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-100 p-4">
      <div className="w-full max-w-md bg-white p-6 rounded-2xl shadow-lg">
        <div className="flex justify-center">
          <img src={mainLogo} alt="Logo" className="w-20 h-20" />
        </div>

        <h2 className="text-2xl font-bold text-center text-gray-800 mt-4">
          Reset Password
        </h2>

        {error && (
          <div className="mt-4 p-3 bg-red-100 text-red-700 rounded-lg">
            {error}
          </div>
        )}

        <form className="mt-6" onSubmit={handleSubmit}>
          <div>
            <label className="block text-gray-700">Email</label>
            <input
              type="email"
              className="mt-1 w-full p-3 border rounded-xl focus:ring-2 focus:ring-blue-500 outline-none"
              placeholder="Enter your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              autoComplete="email"
              disabled={otpSent}
            />
          </div>

          <div className="mt-4">
            <label className="block text-gray-700">OTP</label>
            <div className="flex gap-2">
              <input
                type="text"
                maxLength="6"
                className="mt-1 flex-1 p-3 border rounded-xl focus:ring-2 focus:ring-blue-500 outline-none"
                placeholder="Enter 6-digit OTP"
                value={otp}
                onChange={(e) => setOtp(e.target.value.replace(/\D/g, "").slice(0, 6))}
                required
                disabled={!otpSent}
              />
              <button
                type="button"
                onClick={handleGetOtp}
                disabled={isLoading || !email || otpSent}
                className={`mt-1 px-4 py-2 rounded-xl text-white transition
                  ${isLoading || !email || otpSent 
                    ? 'bg-gray-400' 
                    : 'bg-blue-600 hover:bg-blue-700'}`}
              >
                Get OTP
              </button>
            </div>
          </div>

          <div className="mt-4">
            <label className="block text-gray-700">New Password</label>
            <input
              type="password"
              className="mt-1 w-full p-3 border rounded-xl focus:ring-2 focus:ring-blue-500 outline-none"
              placeholder="Enter new password"
              value={newPassword}
              onChange={(e) => {
                const newPass = e.target.value;
                setNewPassword(newPass);
                setPasswordValidationErrors(validatePassword(newPass));
              }}
              required
              autoComplete="new-password"
              disabled={!otpSent}
            />
            {passwordValidationErrors.length > 0 && (
              <ul className="mt-1 text-sm text-red-600 list-disc list-inside">
                {passwordValidationErrors.map((error, index) => (
                  <li key={index}>{error}</li>
                ))}
              </ul>
            )}
          </div>

          <button
            type="submit"
            disabled={isLoading || !otpSent}
            className={`w-full mt-6 py-3 rounded-xl text-white transition
              ${isLoading || !otpSent 
                ? 'bg-gray-400' 
                : 'bg-blue-600 hover:bg-blue-700'}`}
          >
            {isLoading ? 'Processing...' : 'Reset Password'}
          </button>
        </form>
      </div>
    </div>
  );
}