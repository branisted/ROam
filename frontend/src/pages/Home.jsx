import { useEffect, useState, useContext } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from "../context/AuthContext.jsx";

// Manually list images in /uploads for demo (replace with API call for production)
const demoImages = [
    'http://localhost:3001/uploads/adventure1.jpg',
    'http://localhost:3001/uploads/adventure2.jpg',
    'http://localhost:3001/uploads/adventure3.jpg'
    // Add more as needed
];

function Home() {
    const [posts, setPosts] = useState([]);
    const [error, setError] = useState('');
    const [currentImage, setCurrentImage] = useState(0);
    const navigate = useNavigate();
    const { user } = useContext(AuthContext);

    // Cycle through images every 3 seconds
    useEffect(() => {
        if (demoImages.length > 1) {
            const interval = setInterval(() => {
                setCurrentImage(prev => (prev + 1) % demoImages.length);
            }, 3000);
            return () => clearInterval(interval);
        }
    }, []);

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

    // Main button logic
    let mainButtonText = "Register";
    let mainButtonAction = () => navigate("/register");
    if (user?.role === "guide") {
        mainButtonText = "Create Your Own Adventure";
        mainButtonAction = () => navigate("/add-adventure");
    } else if (user?.role === "explorer") {
        mainButtonText = "Join an Adventure";
        mainButtonAction = () => navigate("/adventures");
    }

    return (
        <div className="min-h-screen bg-gray-100 flex flex-col">
            {/* Hero Section */}
            <section className="relative w-full h-[28rem] md:h-[32rem] flex items-center justify-center overflow-hidden">
                {/* Background Image */}
                <img
                    src={demoImages[currentImage]}
                    alt=""
                    className="absolute inset-0 w-full h-full object-cover object-center transition-all duration-500 z-0"
                    loading="lazy"
                    style={{ minHeight: '100%', minWidth: '100%' }}
                />
                {/* Gradient Overlay */}
                <div className="absolute inset-0 bg-gradient-to-b from-blue-800/80 via-blue-700/60 to-blue-600/60 z-10"></div>
                {/* Hero Content */}
                <div className="relative z-20 flex flex-col items-center justify-center w-full h-full text-white text-center px-4">
                    <h1 className="text-4xl md:text-5xl font-extrabold mb-4 drop-shadow-lg">
                        Welcome to ROam - a Local Adventure Planner
                    </h1>
                    <p className="text-lg md:text-xl mb-8 max-w-2xl mx-auto">
                        Discover, join, and create unique adventures with explorers and guides from all over the world. Whether you crave a mountain hike, a city exploration, or a stargazing night, your next journey starts here!
                    </p>
                    <button
                        onClick={mainButtonAction}
                        className="bg-white text-blue-700 font-semibold px-6 py-3 rounded-full shadow hover:bg-blue-100 transition"
                    >
                        {mainButtonText}
                    </button>
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
                                {/*<div className="absolute top-3 right-3 flex flex-col items-end gap-2">*/}
                                {/*    <span className="bg-white border border-blue-200 text-blue-700 text-xs px-2 py-1 rounded shadow">*/}
                                {/*        {post.completed ? "Completed" : post.cancelled ? "Cancelled" : "Upcoming"}*/}
                                {/*    </span>*/}
                                {/*    <span className="bg-blue-100 text-blue-700 text-xs px-2 py-1 rounded shadow">*/}
                                {/*        {post.type}*/}
                                {/*    </span>*/}
                                {/*</div>*/}
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