import { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

function Home() {
    const [posts, setPosts] = useState([]);
    const [error, setError] = useState('');
    const navigate = useNavigate();

    useEffect(() => {
        const fetchPosts = async () => {
            try {
                const res = await axios.get('/api/posts', { withCredentials: true });
                setPosts(res.data);
            } catch (err) {
                setError('Failed to load adventures');
                console.log(err);
            }
        };
        fetchPosts();
    }, []);

    return (
        <div className="min-h-screen bg-gray-100 flex flex-col">
            {/* Hero Section */}
            <section className="bg-blue-700 text-white py-16 px-4 flex flex-col items-center justify-center shadow-lg">
                <h1 className="text-4xl md:text-5xl font-extrabold mb-4 text-center drop-shadow-lg">
                    Welcome to ROam Adventures
                </h1>
                <p className="text-lg md:text-xl mb-8 text-center max-w-2xl">
                    Discover, join, and create unique adventures with explorers and guides from all over the world. Whether you crave a mountain hike, a city exploration, or a stargazing night, your next journey starts here!
                </p>
                <button
                    onClick={() => navigate('/create')}
                    className="bg-white text-blue-700 font-semibold px-6 py-3 rounded-full shadow hover:bg-blue-100 transition"
                >
                    Create Your Own Adventure
                </button>
                <div className="mt-8">
                    <img
                        src="https://undraw.co/api/illustrations/undraw_adventure_4hum.svg"
                        alt="Adventure illustration"
                        className="w-64 mx-auto rounded-lg shadow-lg"
                        loading="lazy"
                    />
                </div>
            </section>

            {/* Adventure Cards */}
            <section className="flex-1 py-12 px-4">
                <h2 className="text-3xl font-bold mb-8 text-center text-blue-700">All Adventures</h2>
                {error && <p className="text-red-500 text-center mb-4">{error}</p>}
                {posts.length === 0 ? (
                    <p className="text-center text-gray-500">No adventures yet. Be the first to create one!</p>
                ) : (
                    <div className="grid gap-8 grid-cols-1 md:grid-cols-2 lg:grid-cols-3 max-w-6xl mx-auto">
                        {posts.map(post => (
                            <div
                                key={post.id}
                                className="bg-white rounded-lg shadow-md p-6 flex flex-col cursor-pointer group relative hover:shadow-xl transition"
                                onClick={() => navigate(`/adventure/${post.id}`)}
                                tabIndex={0}
                                role="button"
                                onKeyDown={e => {
                                    if (e.key === 'Enter' || e.key === ' ') {
                                        navigate(`/adventure/${post.id}`);
                                    }
                                }}
                            >
                                {post.photo && (
                                    <img
                                        src={post.photo}
                                        alt={post.title}
                                        className="w-full h-48 object-cover rounded mb-4 group-hover:scale-105 transition"
                                        loading="lazy"
                                    />
                                )}
                                <div className="flex items-center justify-between mb-2">
                                    <h3 className="text-xl font-semibold text-blue-700 group-hover:underline">{post.title}</h3>
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
                                    {post.location && post.location.startsWith('http') ? (
                                        <a
                                            href={post.location}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="text-blue-500 underline"
                                            onClick={e => e.stopPropagation()}
                                        >
                                            Map Link
                                        </a>
                                    ) : (
                                        post.location
                                    )}
                                </div>
                                <div className="text-xs text-gray-400 mb-2">
                                    <span className="font-medium">Posted:</span>{' '}
                                    {post.created_at
                                        ? new Date(post.created_at).toLocaleString()
                                        : 'Unknown'}
                                </div>
                                <p className="mb-4 text-gray-700">{post.description}</p>
                                <span className="absolute top-3 right-3 bg-white border border-blue-200 text-blue-700 text-xs px-2 py-1 rounded shadow">
                                    {post.completed ? "Completed" : post.cancelled ? "Cancelled" : "Upcoming"}
                                </span>
                            </div>
                        ))}
                    </div>
                )}
            </section>
        </div>
    );
}

export default Home;