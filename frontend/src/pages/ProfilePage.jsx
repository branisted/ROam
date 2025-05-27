import { useEffect, useState, useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import axios from 'axios';

function ProfilePage() {
    const { user } = useContext(AuthContext);
    const [profile, setProfile] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        if (!user) return;
        setLoading(true);
        axios.get(`http://localhost:3001/api/users/${user.id}/profile`)
            .then(res => {
                setProfile(res.data);
                setLoading(false);
            })
            .catch(err => {
                setError('Could not load profile');
                setLoading(false);
            });
    }, [user]);

    if (loading) return <div>Loading...</div>;
    if (error) return <div className="text-red-500">{error}</div>;
    if (!profile) return null;

    return (
        <div className="max-w-3xl mx-auto mt-10 p-6 bg-white rounded shadow">
            <h2 className="text-2xl font-bold mb-4">Profile</h2>
            <div className="mb-4">
                <div><strong>Username:</strong> {profile.user.username}</div>
                <div><strong>Email:</strong> {profile.user.email}</div>
                <div><strong>Role:</strong> {profile.user.role}</div>
            </div>
            <h3 className="text-xl font-semibold mb-2">Joined Adventures</h3>
            {profile.joinedPosts.length === 0 ? (
                <div>No adventures joined yet.</div>
            ) : (
                <ul className="space-y-2">
                    {profile.joinedPosts.map(post => (
                        <li key={post.id} className="border p-2 rounded">
                            <div className="font-medium">{post.title}</div>
                            <div className="text-sm text-gray-600">{post.location}</div>
                            <div className="text-xs text-gray-400">
                                Starts on: {new Date(post.starts_on).toLocaleString()}
                            </div>
                        </li>
                    ))}
                </ul>
            )}
        </div>
    );
}

export default ProfilePage;