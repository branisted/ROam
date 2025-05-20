import { Link } from 'react-router-dom';

function Navbar() {
    return (
        <nav style={{ padding: '1rem', background: '#eee' }}>
            <Link to="/">Posts</Link> |{' '}
            <Link to="/add-post">Add Post</Link> |{' '}
            <Link to="/login">Login</Link> |{' '}
            <Link to="/register">Register</Link>
        </nav>
    );
}

export default Navbar;