import { useNavigate } from 'react-router-dom';
import mainLogo from '/logos/main_logo.png'

export default function AccessDenied() {
    const navigate = useNavigate();
    return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 px-6 text-center">
      <div className="max-w-md bg-white p-8 rounded-2xl shadow-lg">
        <img
          src={mainLogo}
          alt="No Access"
          className="w-24 h-24 mx-auto mb-4"
        />
        <h2 className="text-2xl font-bold text-gray-800">Access Denied</h2>
        <p className="text-gray-600 mt-2">
          This is an invite-only platform.<br></br> If you believe you should have
          access, please contact the administrator.
        </p>
        <button
          onClick={() => (navigate("/signin"))}
          className="mt-4 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition"
        >
          Go to Login
        </button>
      </div>
    </div>
  );
}
