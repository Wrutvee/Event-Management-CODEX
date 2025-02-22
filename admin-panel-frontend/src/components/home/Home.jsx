import { useNavigate } from 'react-router-dom';
import { addCsrfToken } from '../../utils/csrf';

export default function Home() {
    const navigate = useNavigate();

    const handleLogout = async () => {
        try {
            await fetch('http://localhost:3000/auth/logout', {
                method: 'POST',
                headers: addCsrfToken(),
                credentials: 'include',
            });
            navigate('/signin');
        } catch (error) {
            console.error('Logout failed:', error);
        }
    };

    return (
        <div>
            <h1>Home</h1>
            <button 
                onClick={handleLogout}
                className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700"
            >
                Logout
            </button>
        </div>
    );
}