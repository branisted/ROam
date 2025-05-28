import { useEffect, useState, useContext } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import { AuthContext } from "../context/AuthContext";

const ADVENTURE_TYPES = [
    "hike", "bike ride", "urban walk", "nature tour", "forest trail",
    "mountain climb", "city exploration", "river walk", "wildlife spotting",
    "historical tour", "food tour", "cycling", "stargazing", "camping", "other"
];
const DIFFICULTIES = ["easy", "moderate", "hard"];

function EditAdventurePage() {
    const { id } = useParams();
    const navigate = useNavigate();
    const { user, loading: authLoading } = useContext(AuthContext);

    const [form, setForm] = useState({
        title: "",
        location: "",
        type: "",
        difficulty: "",
        estimated_duration: "",
        description: "",
        max_participants: "",
        starts_on: "",
    });
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");
    const [completed, setCompleted] = useState(false);
    const [isCompleting, setIsCompleting] = useState(false);

    // Fetch existing adventure data
    useEffect(() => {
        axios.get(`/api/posts/${id}`, { withCredentials: true })
            .then(res => {
                const data = res.data;
                setForm({
                    title: data.title,
                    location: data.location,
                    type: data.type,
                    difficulty: data.difficulty,
                    estimated_duration: data.estimated_duration,
                    description: data.description,
                    max_participants: data.max_participants || "",
                    starts_on: data.starts_on ? data.starts_on.slice(0, 16).replace(" ", "T") : "",
                });
                setCompleted(Boolean(data.completed));
                setLoading(false);
            })
            .catch(() => {
                setError("Failed to load adventure data.");
                setLoading(false);
            });
    }, [id]);

    // Handle input changes
    const handleChange = e => {
        const { name, value } = e.target;
        setForm(prev => ({ ...prev, [name]: value }));
    };

    // Handle form submit
    const handleSubmit = async e => {
        e.preventDefault();
        setError("");
        setSuccess("");
        try {
            await axios.put(`/api/posts/${id}`, form, {
                withCredentials: true
            });
            setSuccess("Adventure updated successfully!");
            setTimeout(() => navigate(`/adventure/${id}`), 1000);
        } catch (err) {
            setError(err.response?.data?.message || "Failed to update adventure.");
        }
    };

    // Handle mark as completed
    const handleMarkCompleted = async () => {
        setIsCompleting(true);
        setError("");
        setSuccess("");
        try {
            await axios.put(`/api/posts/${id}/complete`, {}, { withCredentials: true });
            setCompleted(true);
            setSuccess("Adventure marked as completed!");
        } catch (err) {
            setError(err.response?.data?.message || "Failed to mark as completed.");
        } finally {
            setIsCompleting(false);
        }
    };

    const handleMarkUncompleted = async () => {
        setIsCompleting(true);
        setError("");
        setSuccess("");
        try {
            await axios.put(`/api/posts/${id}/uncomplete`, {}, { withCredentials: true });
            setCompleted(false);
            setSuccess("Adventure marked as uncompleted!");
        } catch (err) {
            setError(err.response?.data?.message || "Failed to mark as uncompleted.");
        } finally {
            setIsCompleting(false);
        }
    };

    if (authLoading || loading) return <div>Loading...</div>;
    if (!user || user.role !== "guide") return <div className="mt-8 text-center">Only guides can edit adventures.</div>;

    return (
        <div className="max-w-2xl mx-auto mt-10 p-6 bg-white rounded shadow">
            <h2 className="text-2xl font-bold mb-4">Edit Adventure</h2>
            {error && <div className="text-red-500 mb-2">{error}</div>}
            {success && <div className="text-green-600 mb-2">{success}</div>}
            <form className="flex flex-col gap-4" onSubmit={handleSubmit}>
                <input
                    type="text"
                    name="title"
                    value={form.title}
                    onChange={handleChange}
                    placeholder="Title"
                    required
                    className="border rounded px-3 py-1"
                />
                <input
                    type="text"
                    name="location"
                    value={form.location}
                    onChange={handleChange}
                    placeholder="Location"
                    required
                    className="border rounded px-3 py-1"
                />
                <select
                    name="type"
                    value={form.type}
                    onChange={handleChange}
                    required
                    className="border rounded px-3 py-1"
                >
                    <option value="">Select Type</option>
                    {ADVENTURE_TYPES.map(t => (
                        <option key={t} value={t}>{t}</option>
                    ))}
                </select>
                <select
                    name="difficulty"
                    value={form.difficulty}
                    onChange={handleChange}
                    required
                    className="border rounded px-3 py-1"
                >
                    <option value="">Select Difficulty</option>
                    {DIFFICULTIES.map(d => (
                        <option key={d} value={d}>{d}</option>
                    ))}
                </select>
                <input
                    type="text"
                    name="estimated_duration"
                    value={form.estimated_duration}
                    onChange={handleChange}
                    placeholder="Estimated Duration"
                    required
                    className="border rounded px-3 py-1"
                />
                <textarea
                    name="description"
                    value={form.description}
                    onChange={handleChange}
                    placeholder="Description"
                    required
                    className="border rounded px-3 py-1"
                />
                <input
                    type="number"
                    name="max_participants"
                    value={form.max_participants}
                    onChange={handleChange}
                    placeholder="Max Participants"
                    min="1"
                    className="border rounded px-3 py-1"
                />
                <input
                    type="datetime-local"
                    name="starts_on"
                    value={form.starts_on}
                    onChange={handleChange}
                    required
                    className="border rounded px-3 py-1"
                />
                <button
                    type="submit"
                    className="bg-blue-600 text-white px-4 py-1 rounded hover:bg-blue-700 transition"
                >
                    Save Changes
                </button>
            </form>
            <div className="mt-4">
                {completed ? (
                    <>
                        <span className="inline-block bg-green-200 text-green-800 text-xs px-2 py-1 rounded mr-2">
                            Adventure is completed
                        </span>
                        <button
                            className="bg-yellow-500 text-white px-4 py-1 rounded hover:bg-yellow-600 transition"
                            onClick={handleMarkUncompleted}
                            disabled={isCompleting}
                        >
                            {isCompleting ? "Updating..." : "Mark as Uncompleted"}
                        </button>
                    </>
                ) : (
                    <button
                        className="bg-green-600 text-white px-4 py-1 rounded hover:bg-green-700 transition"
                        onClick={handleMarkCompleted}
                        disabled={isCompleting}
                    >
                        {isCompleting ? "Marking..." : "Mark as Completed"}
                    </button>
                )}
            </div>
        </div>
    );
}

export default EditAdventurePage;