import { useState, useEffect, useContext } from "react";
import { AuthContext } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const ADVENTURE_TYPES = [
    "hike", "bike ride", "urban walk", "nature tour", "forest trail",
    "mountain climb", "city exploration", "river walk", "wildlife spotting",
    "historical tour", "food tour", "cycling", "stargazing", "camping", "other"
];
const DIFFICULTIES = ["easy", "moderate", "hard"];

function SearchPage() {
    const { user } = useContext(AuthContext);
    const navigate = useNavigate();
    const [title, setTitle] = useState("");
    const [type, setType] = useState("");
    const [difficulty, setDifficulty] = useState("");
    const [results, setResults] = useState([]);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        if (!user || user.role !== "explorer") {
            navigate("/");
        }
    }, [user, navigate]);

    const handleSearch = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            const params = new URLSearchParams();
            if (title) params.append("title", title);
            if (type) params.append("type", type);
            if (difficulty) params.append("difficulty", difficulty);

            const res = await axios.get(`http://localhost:3001/api/posts/search?${params.toString()}`);
            setResults(res.data);
        } catch (err) {
            setResults([]);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="max-w-3xl mx-auto mt-10 p-6 bg-white rounded shadow">
            <h2 className="text-2xl font-bold mb-4">Search Adventures</h2>
            <form className="mb-6 flex flex-col gap-4" onSubmit={handleSearch}>
                <input
                    type="text"
                    placeholder="Title"
                    value={title}
                    onChange={e => setTitle(e.target.value)}
                    className="border rounded px-3 py-1"
                />
                <select value={type} onChange={e => setType(e.target.value)} className="border rounded px-3 py-1">
                    <option value="">All Types</option>
                    {ADVENTURE_TYPES.map(t => (
                        <option key={t} value={t}>{t}</option>
                    ))}
                </select>
                <select value={difficulty} onChange={e => setDifficulty(e.target.value)} className="border rounded px-3 py-1">
                    <option value="">All Difficulties</option>
                    {DIFFICULTIES.map(d => (
                        <option key={d} value={d}>{d}</option>
                    ))}
                </select>
                <button
                    type="submit"
                    className="bg-blue-600 text-white px-4 py-1 rounded hover:bg-blue-700 transition"
                    disabled={loading}
                >
                    {loading ? "Searching..." : "Search"}
                </button>
            </form>
            <div>
                {results.length === 0 && !loading && <div>No adventures found.</div>}
                <ul className="space-y-2">
                    {results.map(post => (
                        <li
                            key={post.id}
                            className="border p-2 rounded hover:bg-gray-50 cursor-pointer"
                            onClick={() => navigate(`/hunts/${post.id}`)}
                        >
                            <div className="font-medium">{post.title}</div>
                            <div className="text-sm text-gray-600">{post.type} | {post.difficulty}</div>
                            <div className="text-xs text-gray-400">
                                Starts on: {new Date(post.starts_on).toLocaleString()}
                            </div>
                        </li>
                    ))}
                </ul>
            </div>
        </div>
    );
}

export default SearchPage;