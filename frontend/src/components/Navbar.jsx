import { Link, useNavigate } from 'react-router-dom';
import { useContext } from "react";
import { AuthContext } from "../context/AuthContext.jsx";

function Navbar() {
    const { user, logout, loading } = useContext(AuthContext);
    const userRole = user ? user.role : null;
    const navigate = useNavigate();

    const handleLogout = async () => {
        await logout();
        navigate("/login");
    };

    if (loading) {
        return (
            <nav className="sticky top-0 left-0 right-0 z-50 bg-blue-600 px-6 py-3 shadow flex items-center justify-between h-14">
                <div className="text-white">Loading...</div>
            </nav>
        );
    }

    return (
        <nav className="sticky top-0 left-0 right-0 z-50 bg-blue-600 px-6 py-3 shadow h-14 flex items-center">
            {/* Left links */}
            <div className="flex items-center gap-4 flex-1">
                <Link to="/" className="text-white font-semibold hover:underline">Home</Link>
                <Link to="/adventures" className="text-white font-semibold hover:underline">Posts</Link>
                {userRole === "guide" && (
                    <Link to="/add-adventure" className="text-white font-semibold hover:underline">
                        Add Adventure
                    </Link>
                )}
                {user && user.role === "explorer" && (
                    <Link to="/search" className="text-white font-semibold hover:underline">
                        Search
                    </Link>
                )}
            </div>

            {/* Centered Logo */}
            <div className="flex-1 flex justify-center">
                <Link to="/" className="flex items-center select-none" tabIndex={-1}>
                    <span className="text-2xl md:text-3xl font-extrabold" style={{ color: "#0033A0" }}>R</span>
                    <span className="text-2xl md:text-3xl font-extrabold" style={{ color: "#ead14f" }}>O</span>
                    <span className="text-2xl md:text-3xl font-extrabold" style={{ color: "#DA291C" }}>am</span>
                </Link>
            </div>

            {/* Right links */}
            <div className="flex items-center gap-4 flex-1 justify-end">
                {!user && (
                    <>
                        <Link to="/register" className="text-white hover:underline">Register</Link>
                        <Link to="/login" className="text-white hover:underline">Login</Link>
                    </>
                )}
                {user && (
                    <>
                        <Link
                            to="/profile"
                            className="bg-white text-blue-600 font-semibold px-4 py-1 rounded hover:bg-blue-100 transition"
                        >
                            Profile
                        </Link>
                        <button
                            onClick={handleLogout}
                            className="bg-white text-blue-600 font-semibold px-4 py-1 rounded hover:bg-blue-100 transition"
                        >
                            Log out
                        </button>
                    </>
                )}
            </div>
        </nav>
    );
}

export default Navbar;