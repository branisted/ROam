// Navbar.jsx
import { Link } from 'react-router-dom';
import { useContext } from "react";
import { AuthContext } from "../context/AuthContext.jsx";

function Navbar() {
    const { user, logout } = useContext(AuthContext);
    const userRole = user ? user.role : null;

    return (
        <nav className="sticky top-0 left-0 right-0 z-50 bg-blue-600 px-6 py-3 shadow flex items-center justify-between h-14">
            <div className="flex items-center gap-4">
                <Link to="/" className="text-white font-semibold hover:underline">Home</Link>
                <Link to="/" className="text-white font-semibold hover:underline">Posts</Link>
                {userRole === "guide" && (
                    <Link to="/add-post" className="text-white font-semibold hover:underline">
                        Add Post
                    </Link>
                )}
                {/* Show Profile link only when logged in */}
                {user && (
                    <Link to="/profile" className="text-white font-semibold hover:underline">
                        Profile
                    </Link>
                )}
            </div>
            <div className="flex items-center gap-4">
                {!user && (
                    <>
                        <Link to="/register" className="text-white hover:underline">Register</Link>
                        <Link to="/login" className="text-white hover:underline">Login</Link>
                    </>
                )}
                {user && (
                    <button
                        onClick={logout}
                        className="bg-white text-blue-600 font-semibold px-4 py-1 rounded hover:bg-blue-100 transition"
                    >
                        Log out
                    </button>
                )}
            </div>
        </nav>
    );
}

export default Navbar;
