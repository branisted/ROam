import { useEffect, useState, useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import axios from 'axios';
import { useNavigate, Link } from "react-router-dom";

function ProfilePage() {
    const { user, loading: authLoading } = useContext(AuthContext);
    const [profile, setProfile] = useState(null); // For explorer
    const [adventures, setAdventures] = useState([]); // For guide
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const navigate = useNavigate();

    // Redirect to home if logged out
    useEffect(() => {
        if (!authLoading && !user) {
            navigate('/');
        }
    }, [user, authLoading, navigate]);

    useEffect(() => {
        if (!user) return;

        setLoading(true);
        setError('');

        if (user.role === "explorer") {
            axios.get(`/api/users/${user.id}/profile`, { withCredentials: true })
                .then(res => {
                    setProfile(res.data);
                    setLoading(false);
                })
                .catch(() => {
                    setError('Could not load profile');
                    setLoading(false);
                });
        } else if (user.role === "guide") {
            // Get basic profile (optional, if needed)
            axios.get(`/api/users/${user.id}/profile`, { withCredentials: true })
                .then(res => setProfile(res.data))
                .catch(() => setProfile(null));
            // Get adventures created by the guide
            axios.get(`/api/users/${user.id}/created-adventures`, { withCredentials: true })
                .then(res => {
                    setAdventures(res.data);
                    setLoading(false);
                })
                .catch(() => {
                    setError("Could not load your adventures.");
                    setLoading(false);
                });
        } else {
            setError('Unknown user role');
            setLoading(false);
        }
    }, [user]);

    if (!user || authLoading) return null;
    if (loading) return <div>Loading...</div>;
    if (error) return <div className="text-red-500">{error}</div>;

    return (
        <div className="max-w-3xl mx-auto mt-10 p-6 bg-white rounded shadow">
            <h2 className="text-2xl font-bold mb-4">Profile</h2>
            <div className="mb-4">
                <div><strong>Username:</strong> {user.username}</div>
                <div><strong>Email:</strong> {profile?.user?.email || user.email}</div>
                <div><strong>Role:</strong> {user.role}</div>
            </div>
            {user.role === "explorer" && profile && (
                <>
                    <h3 className="text-xl font-semibold mb-2">Joined Adventures</h3>
                    {profile.joinedPosts && profile.joinedPosts.length === 0 ? (
                        <div>No adventures joined yet.</div>
                    ) : (
                        <ul className="space-y-2">
                            {profile.joinedPosts && profile.joinedPosts.map(post => (
                                <li key={post.id} className="border p-2 rounded hover:bg-gray-50 transition">
                                    <Link to={`/adventure/${post.id}`} className="block">
                                        <div className="font-medium">{post.title}</div>
                                        <div className="text-sm text-gray-600">{post.location}</div>
                                        <div className="text-xs text-gray-400">
                                            Starts on: {new Date(post.starts_on).toLocaleString()}
                                        </div>
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    )}
                </>
            )}
            {user.role === "guide" && (
                <>
                    <h3 className="text-xl font-semibold mb-2">Your Created Adventures</h3>
                    {adventures.length === 0 ? (
                        <div>No adventures created yet.</div>
                    ) : (
                        <ul className="space-y-2">
                            {adventures.map(post => (
                                <li key={post.id} className="border p-2 rounded hover:bg-gray-50 transition">
                                    <Link to={`/adventure/${post.id}`} className="block">
                                        <div className="font-medium">{post.title}</div>
                                        <div className="text-sm text-gray-600">{post.location}</div>
                                        <div className="text-xs text-gray-400">
                                            Starts on: {new Date(post.starts_on).toLocaleString()}
                                        </div>
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    )}
                </>
            )}
        </div>
    );
}

export default ProfilePage;