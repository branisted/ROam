import { useEffect, useState, useContext } from "react";
import { AuthContext } from "../context/AuthContext";
import axios from "axios";

function GuideAdventuresPage() {
    const { user } = useContext(AuthContext);
    const [adventures, setAdventures] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    useEffect(() => {
        if (!user || user.role !== "guide") return;
        setLoading(true);
        axios.get(`http://localhost:3001/api/users/${user.id}/created-adventures`)
            .then(res => {
                setAdventures(res.data);
                setLoading(false);
            })
            .catch(() => {
                setError("Could not load your adventures.");
                setLoading(false);
            });
    }, [user]);

    if (!user || user.role !== "guide") return <div className="text-center mt-8">Only guides can view this page.</div>;
    if (loading) return <div className="text-center mt-8">Loading...</div>;
    if (error) return <div className="text-center text-red-500 mt-8">{error}</div>;

    return (
        <div className="max-w-3xl mx-auto mt-10 p-6 bg-white rounded shadow">
            <h2 className="text-2xl font-bold mb-4">Your Created Adventures</h2>
            {adventures.length === 0 ? (
                <div>No adventures created yet.</div>
            ) : (
                <ul className="space-y-2">
                    {adventures.map(post => (
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

export default GuideAdventuresPage;
