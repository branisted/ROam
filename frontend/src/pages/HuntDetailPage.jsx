import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import axios from "axios";

function HuntDetailPage() {
    const { id } = useParams();
    const [hunt, setHunt] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

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

    if (loading) return <div>Loading...</div>;
    if (error) return <div className="text-red-500">{error}</div>;
    if (!hunt) return null;

    // explorers - see join/unjoin
    // guides - see al participants

    return (
        <div className="max-w-2xl mx-auto mt-10 p-6 bg-white rounded shadow">
            <h2 className="text-2xl font-bold mb-4">{hunt.title}</h2>
            <div className="mb-2"><strong>Location:</strong> {hunt.location}</div>
            <div className="mb-2"><strong>Type:</strong> {hunt.type}</div>
            <div className="mb-2"><strong>Difficulty:</strong> {hunt.difficulty}</div>
            <div className="mb-2"><strong>Starts on:</strong> {new Date(hunt.starts_on).toLocaleString()}</div>
            <div className="mb-2"><strong>Description:</strong> {hunt.description}</div>
            {/* Add more fields as needed */}
        </div>
    );
}

export default HuntDetailPage;