import { useEffect, useState } from 'react';
import axios from 'axios';

function PostList() {
    const [posts, setPosts] = useState([]);
    const [error, setError] = useState('');

    useEffect(() => {
        const fetchPosts = async () => {
            try {
                const res = await axios.get('http://localhost:3001/api/posts');
                setPosts(res.data);
            } catch (err) {
                setError('Failed to load posts');
            }
        };
        fetchPosts();
    }, []);

    // Helper to check if sign-ups are closed
    const isSignUpClosed = (post) => {
        if (!post.starts_on) return false;
        return new Date(post.starts_on) <= new Date();
    };

    return (
        <div className="min-h-screen bg-gray-100 py-10 px-4">
            <h2 className="text-3xl font-bold mb-8 text-center text-blue-700">All Adventures</h2>
            {error && <p className="text-red-500 text-center mb-4">{error}</p>}
            {posts.length === 0 ? (
                <p className="text-center text-gray-500">No posts yet.</p>
            ) : (
                <div className="grid gap-6 grid-cols-1 md:grid-cols-2 lg:grid-cols-3 max-w-6xl mx-auto">
                    {posts.map(post => (
                        <div
                            key={post.id}
                            className="bg-white rounded-lg shadow-md p-6 flex flex-col"
                        >
                            {/* Optional photo */}
                            {post.photo && (
                                <img
                                    src={post.photo}
                                    alt={post.title}
                                    className="w-full h-48 object-cover rounded mb-4"
                                />
                            )}
                            <div className="flex items-center justify-between mb-2">
                                <h3 className="text-xl font-semibold text-blue-700">{post.title}</h3>
                                <span className="bg-blue-100 text-blue-700 text-xs px-2 py-1 rounded">
                                    {post.type}
                                </span>
                            </div>
                            <div className="flex flex-wrap gap-2 text-sm text-gray-600 mb-2">
                                <span>
                                    <span className="font-medium">By:</span> {post.username || "Unknown"}
                                </span>
                                <span>
                                    <span className="font-medium">Difficulty:</span> {post.difficulty}
                                </span>
                                <span>
                                    <span className="font-medium">Duration:</span> {post.estimated_duration}
                                </span>
                            </div>
                            <div className="text-sm text-gray-500 mb-2">
                                <span className="font-medium">Location:</span>{' '}
                                {post.location.startsWith('http') ? (
                                    <a
                                        href={post.location}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="text-blue-500 underline"
                                    >
                                        Map Link
                                    </a>
                                ) : (
                                    post.location
                                )}
                            </div>
                            {/* New: Joinable info */}
                            {post.is_joinable ? (
                                <div className="mb-2">
                                    <span className="inline-block bg-green-100 text-green-700 text-xs px-2 py-1 rounded mr-2">
                                        Joinable
                                    </span>
                                    <span className="text-xs text-gray-700">
                                        {post.max_participants
                                            ? `Max participants: ${post.max_participants}`
                                            : 'No participant limit'}
                                    </span>
                                    <br />
                                    <span className="text-xs text-gray-700">
                                        <span className="font-medium">Starts on:</span>{' '}
                                        {post.starts_on
                                            ? new Date(post.starts_on).toLocaleString()
                                            : 'Not set'}
                                    </span>
                                    {isSignUpClosed(post) && (
                                        <span className="ml-2 text-red-600 font-semibold">
                                            Sign-ups closed
                                        </span>
                                    )}
                                </div>
                            ) : (
                                <div className="mb-2">
                                    <span className="inline-block bg-gray-200 text-gray-500 text-xs px-2 py-1 rounded">
                                        Not joinable
                                    </span>
                                </div>
                            )}
                            <div className="text-xs text-gray-400 mb-2">
                                <span className="font-medium">Posted:</span>{' '}
                                {post.created_at
                                    ? new Date(post.created_at).toLocaleString()
                                    : 'Unknown'}
                            </div>
                            <p className="mb-4 text-gray-700">{post.description}</p>

                            {/*<div className="flex items-center gap-2 mt-auto">
                                <span className="text-pink-500">♥</span>
                                <span className="text-gray-600 text-sm">{post.likes} likes</span>
                            </div>*/}

                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}

export default PostList;