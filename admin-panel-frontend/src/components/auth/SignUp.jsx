import { useEffect, useState } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import AccessDenied from "./AcessDenied";
import mainLogo from "/logos/main_logo.png";
import { addCsrfToken, fetchCsrfToken } from "../../utils/csrf";
import { validatePassword } from "../../utils/passwordValidation";

export default function SignupPage() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [inviteCode, setInviteCode] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [error, setError] = useState(null);
  const [confirmPassword, setConfirmPassword] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const [passwordValidationErrors, setPasswordValidationErrors] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const code = searchParams.get("invite");
    if (!code) {
      setInviteCode("");
    } else {
      setInviteCode(code);
    }
  }, [searchParams]);

  const handlePasswordChange = (e) => {
    const newPassword = e.target.value;
    setPassword(newPassword);
    setPasswordValidationErrors(validatePassword(newPassword));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setPasswordError(null);
    setIsLoading(true);

    const validationErrors = validatePassword(password);
    if (validationErrors.length > 0) {
      setPasswordValidationErrors(validationErrors);
      setIsLoading(false);
      return;
    }
    if (password !== confirmPassword) {
      setPasswordError("Passwords do not match");
      setIsLoading(false);
      return;
    }

    try {
      await fetchCsrfToken();
      const response = await fetch(`${import.meta.env.VITE_BASE_API_URL}/auth/signup`, {
        method: "POST",
        headers: addCsrfToken({
          "Content-Type": "application/json",
        }),
        body: JSON.stringify({
          email,
          name,
          password,
          inviteCode,
        }),
        credentials: 'include',
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Signup failed");
      }

      // Redirect to home page
      navigate('/home');
    } catch (error) {
      setError(error.message || 'Error during registration');
    } finally {
      setIsLoading(false);
    }
  };

  if (!inviteCode) {
    return <AccessDenied />;
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-100 p-4">
      <div className="w-full max-w-md bg-white p-6 rounded-2xl shadow-lg">
        <div className="flex justify-center">
          <img src={mainLogo} alt="Logo" className="w-20 h-20" />
        </div>

        <h2 className="text-2xl font-bold text-center text-gray-800 mt-4">
          Create Account
        </h2>

        <form className="mt-6" onSubmit={handleSubmit}>
          {error && (
            <div className="mb-4 p-3 bg-red-100 text-red-700 rounded-lg">
              {error}
            </div>
          )}
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
            />
          </div>

          <div className="mt-2">
            <label className="block text-gray-700">Name</label>
            <input
              type="text"
              className="mt-1 w-full p-3 border rounded-xl focus:ring-2 focus:ring-blue-500 outline-none"
              placeholder="Enter your full name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
              autoComplete="name"
            />
          </div>

          <div className="mt-2">
            <label className="block text-gray-700">Password</label>
            <input
              type="password"
              className="mt-1 w-full p-3 border rounded-xl focus:ring-2 focus:ring-blue-500 outline-none"
              placeholder="Enter your password"
              value={password}
              onChange={handlePasswordChange}
              required
              autoComplete="new-password"
            />
            {passwordValidationErrors.length > 0 && (
              <ul className="mt-1 text-sm text-red-600 list-disc list-inside">
                {passwordValidationErrors.map((error, index) => (
                  <li key={index}>{error}</li>
                ))}
              </ul>
            )}
          </div>

          <div className="mt-2">
            <label className="block text-gray-700">Confirm Password</label>
            <input
              type="password"
              className="mt-1 w-full p-3 border rounded-xl focus:ring-2 focus:ring-blue-500 outline-none"
              placeholder="Confirm your password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
              autoComplete="new-password"
            />
            {passwordError && (
              <p className="mt-1 text-sm text-red-600">{passwordError}</p>
            )}
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="w-full mt-6 bg-blue-600 text-white py-3 rounded-xl hover:bg-blue-700 transition disabled:bg-blue-400"
          >
            {isLoading ? <div className="dots-loader" /> : "Sign Up"}
          </button>
        </form>
      </div>
    </div>
  );
}