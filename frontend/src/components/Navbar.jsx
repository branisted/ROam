import { Link } from 'react-router-dom';
import { useContext } from "react";
import { AuthContext } from "../context/AuthContext.jsx";

function Navbar() {

    const { user, logout } = useContext(AuthContext);

    return (
        <nav style={{ padding: '1rem', background: '#eee' }}>

            {/* Always show Home */}
            <Link to="/">Home</Link> |{' '}
            <Link to="/">Posts</Link> |{' '}

            {/* Show Register and Log in if NOT logged in */}
            {!user && (
                <>
                    <Link to="/register">Register</Link> |{' '}
                    <Link to="/login">Login</Link>
                </>
            )}

            {/* Show Log out if logged in */}
            {user && (
                <>
                <Link to="/add-post">Add Post</Link> |{' '}
                <button onClick={logout}>Log out</button>
                </>
            )}

        </nav>
    );
}

export default Navbar;