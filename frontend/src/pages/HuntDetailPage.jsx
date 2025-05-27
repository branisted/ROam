import { useParams } from "react-router-dom";
import { useEffect, useState, useContext } from "react";
import axios from "axios";
import { AuthContext } from "../context/AuthContext";

function HuntDetailPage() {
    const { id } = useParams();
    const [hunt, setHunt] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [participants, setParticipants] = useState([]);
    const [isJoining, setIsJoining] = useState(false);
    const [joined, setJoined] = useState(false);

    const { user } = useContext(AuthContext);

    // Fetch hunt details
    useEffect(() => {
        axios.get(`http://localhost:3001/api/posts/${id}`)
            .then(res => {
                setHunt(res.data);
                setLoading(false);
            })
            .catch(() => {
                setError("Could not load hunt details.");
                setLoading(false);
            });
    }, [id]);

    // Fetch participants
    useEffect(() => {
        axios.get(`http://localhost:3001/api/posts/${id}/participants`)
            .then(res => setParticipants(res.data))
            .catch(() => {});
    }, [id, joined]);

    // Check if explorer has joined
    useEffect(() => {
        if (user && user.role === "explorer") {
            axios.get(`http://localhost:3001/api/posts/${id}/participants`)
                .then(res => {
                    const isUserJoined = res.data.some(p => p.id === user.id);
                    setJoined(isUserJoined);
                })
                .catch(() => {});
        }
    }, [user, id, participants.length]);

    // Join/Unjoin handlers
    const handleJoin = async () => {
        setIsJoining(true);
        try {
            await axios.post(`http://localhost:3001/api/posts/${id}/join`, { user_id: user.id });
            setJoined(true);
        } catch (err) {
            alert("Failed to join.");
        } finally {
            setIsJoining(false);
        }
    };

    const handleUnjoin = async () => {
        setIsJoining(true);
        try {
            await axios.post(`http://localhost:3001/api/posts/${id}/unjoin`, { user_id: user.id });
            setJoined(false);
        } catch (err) {
            alert("Failed to unjoin.");
        } finally {
            setIsJoining(false);
        }
    };

    if (loading) return <div>Loading...</div>;
    if (error) return <div className="text-red-500">{error}</div>;
    if (!hunt) return null;

    return (
        <div className="max-w-2xl mx-auto mt-10 p-6 bg-white rounded shadow">
            <h2 className="text-2xl font-bold mb-4">{hunt.title}</h2>
            <div className="mb-2"><strong>Location:</strong> {hunt.location}</div>
            <div className="mb-2"><strong>Type:</strong> {hunt.type}</div>
            <div className="mb-2"><strong>Difficulty:</strong> {hunt.difficulty}</div>
            <div className="mb-2"><strong>Starts on:</strong> {new Date(hunt.starts_on).toLocaleString()}</div>
            <div className="mb-2"><strong>Description:</strong> {hunt.description}</div>

            {/* Explorer: Join/Unjoin Button */}
            {user && user.role === "explorer" && (
                <div className="mt-4">
                    {joined ? (
                        <button
                            className="bg-red-500 text-white px-4 py-1 rounded hover:bg-red-600 transition"
                            onClick={handleUnjoin}
                            disabled={isJoining}
                        >
                            {isJoining ? "Leaving..." : "Unjoin"}
                        </button>
                    ) : (
                        <button
                            className="bg-green-500 text-white px-4 py-1 rounded hover:bg-green-600 transition"
                            onClick={handleJoin}
                            disabled={isJoining}
                        >
                            {isJoining ? "Joining..." : "Join"}
                        </button>
                    )}
                </div>
            )}

            {/* Guide: List of Explorers */}
            {user && user.role === "guide" && (
                <div className="mt-6">
                    <h3 className="text-lg font-semibold mb-2">Participants</h3>
                    {participants.length === 0 ? (
                        <div>No explorers have joined yet.</div>
                    ) : (
                        <ul className="space-y-1">
                            {participants.map(p => (
                                <li key={p.id} className="border-b py-1">
                                    <span className="font-medium">{p.username}</span>
                                    <span className="text-gray-500 text-sm ml-2">{p.email}</span>
                                </li>
                            ))}
                        </ul>
                    )}
                </div>
            )}
        </div>
    );
}

export default HuntDetailPage;