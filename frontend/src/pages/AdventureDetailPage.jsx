import { useParams, useNavigate } from "react-router-dom";
import { useEffect, useState, useContext } from "react";
import axios from "axios";
import { AuthContext } from "../context/AuthContext";

function AdventureDetailPage() {
    const { id } = useParams();
    const [adventure, setAdventure] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [participants, setParticipants] = useState([]);
    const [isJoining, setIsJoining] = useState(false);
    const [joined, setJoined] = useState(false);
    const navigate = useNavigate();

    const { user, loading: authLoading } = useContext(AuthContext);

    // Fetch adventure details
    useEffect(() => {
        axios.get(`/api/posts/${id}`, { withCredentials: true })
            .then(res => {
                setAdventure(res.data);
                setLoading(false);
            })
            .catch(() => {
                setError("Could not load adventure details.");
                setLoading(false);
            });
    }, [id]);

    // Fetch participants
    useEffect(() => {
        axios.get(`/api/posts/${id}/participants`, { withCredentials: true })
            .then(res => setParticipants(res.data))
            .catch(() => {});
    }, [id, joined]);

    // Check if explorer has joined
    useEffect(() => {
        if (user && user.role === "explorer") {
            setJoined(participants.some(p => p.id === user.id));
        }
    }, [user, participants]);

    // Join/Unjoin handlers
    const handleJoin = async () => {
        setIsJoining(true);
        try {
            await axios.post(`/api/posts/${id}/join`, {}, { withCredentials: true });
            setJoined(true);
        } catch (err) {
            alert(err.response?.data?.message || "Failed to join.");
        } finally {
            setIsJoining(false);
        }
    };

    const handleUnjoin = async () => {
        setIsJoining(true);
        try {
            await axios.post(`/api/posts/${id}/unjoin`, {}, { withCredentials: true });
            setJoined(false);
        } catch (err) {
            alert(err.response?.data?.message || "Failed to unjoin.");
        } finally {
            setIsJoining(false);
        }
    };

    const handleDelete = async () => {
        if (window.confirm("Are you sure you want to delete this adventure?")) {
            try {
                await axios.delete(`/api/posts/${id}`, { withCredentials: true });
                navigate('/'); // Redirect after deletion
            } catch (err) {
                alert(err.response?.data?.message || "Failed to delete adventure");
            }
        }
    };

    if (loading || authLoading) return <div>Loading...</div>;
    if (error) return <div className="text-red-500">{error}</div>;
    if (!adventure) return null;

    return (
        <div className="max-w-2xl mx-auto mt-10 p-6 bg-white rounded shadow">
            {/* Adventure Image */}
            {adventure.photo && (
                <img
                    src={adventure.photo}
                    alt={adventure.title}
                    className="w-full h-64 object-cover rounded mb-6"
                    loading="lazy"
                />
            )}
            <h2 className="text-2xl font-bold mb-4">{adventure.title}</h2>
            <div className="mb-2"><strong>Location:</strong> {adventure.location}</div>
            <div className="mb-2"><strong>Type:</strong> {adventure.type}</div>
            <div className="mb-2"><strong>Difficulty:</strong> {adventure.difficulty}</div>
            <div className="mb-2"><strong>Starts on:</strong> {new Date(adventure.starts_on).toLocaleString()}</div>
            <div className="mb-2"><strong>Description:</strong> {adventure.description}</div>

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
            {user && user.role === "guide" && (
                <div className="mt-4 flex gap-2">
                    <button
                        className="bg-blue-500 text-white px-4 py-1 rounded hover:bg-blue-600 transition"
                        onClick={() => navigate(`/edit-adventure/${id}`)}
                    >
                        Edit
                    </button>
                    <button
                        className="bg-red-500 text-white px-4 py-1 rounded hover:bg-red-600 transition"
                        onClick={handleDelete}
                    >
                        Delete
                    </button>
                </div>
            )}
        </div>
    );
}

export default AdventureDetailPage;