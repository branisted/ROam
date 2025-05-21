import { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

function AddPost() {
    const [title, setTitle] = useState('');
    const [location, setLocation] = useState('');
    const [type, setType] = useState('hike');
    const [difficulty, setDifficulty] = useState('easy');
    const [estimated_duration, setEstimatedDuration] = useState('');
    const [photoFile, setPhotoFile] = useState(null);
    const [description, setDescription] = useState('');
    const [error, setError] = useState('');
    const navigate = useNavigate();

    const handleSubmit = async e => {
        e.preventDefault();
        try {
            const author_id = JSON.parse(localStorage.getItem('user')).id;
            const formData = new FormData();

            formData.append('title', title);
            formData.append('location', location);
            formData.append('type', type);
            formData.append('difficulty', difficulty);
            formData.append('estimated_duration', estimated_duration);
            formData.append('description', description);
            formData.append('author_id', author_id);
            if (photoFile) {
                formData.append('photo', photoFile);
            }

            await axios.post('http://localhost:3001/api/posts', formData, {
                headers: {
                    'Content-Type': 'multipart/form-data'
                }
            });

            navigate('/');
        } catch (err) {
            setError(err.response?.data?.message || 'Failed to create post');
        }
    };

    return (
        <div className="flex items-center justify-center min-h-screen bg-gray-100">
            <div className="bg-white p-8 rounded shadow-md w-full max-w-lg">
                <h2 className="text-2xl font-bold mb-6 text-center">Create New Adventure</h2>
                <form onSubmit={handleSubmit} className="flex flex-col gap-4" encType="multipart/form-data">
                    <input
                        type="text"
                        placeholder="Title"
                        value={title}
                        onChange={e => setTitle(e.target.value)}
                        required
                        className="px-4 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-400"
                    />
                    <input
                        type="text"
                        placeholder="Location (address or map link)"
                        value={location}
                        onChange={e => setLocation(e.target.value)}
                        required
                        className="px-4 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-400"
                    />
                    <div className="flex gap-4">
                        <div className="flex-1">
                            <label className="block mb-1 font-medium">Type</label>
                            <select
                                name="type"
                                value={type}
                                onChange={e => setType(e.target.value)}
                                className="w-full px-4 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-400"
                            >
                                <option value="hike">Hike</option>
                                <option value="bike ride">Bike Ride</option>
                                <option value="urban walk">Urban Walk</option>
                                <option value="nature tour">Nature Tour</option>
                                <option value="forest trail">Forest Trail</option>
                            </select>
                        </div>
                        <div className="flex-1">
                            <label className="block mb-1 font-medium">Difficulty</label>
                            <select
                                name="difficulty"
                                value={difficulty}
                                onChange={e => setDifficulty(e.target.value)}
                                className="w-full px-4 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-400"
                            >
                                <option value="easy">Easy</option>
                                <option value="moderate">Moderate</option>
                                <option value="hard">Hard</option>
                            </select>
                        </div>
                    </div>
                    <input
                        type="text"
                        placeholder="Estimated duration"
                        value={estimated_duration}
                        onChange={e => setEstimatedDuration(e.target.value)}
                        required
                        className="px-4 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-400"
                    />
                    <input
                        type="file"
                        accept="image/*"
                        onChange={e => setPhotoFile(e.target.files[0])}
                        className="px-4 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-400"
                    />
                    <textarea
                        placeholder="Description"
                        value={description}
                        onChange={e => setDescription(e.target.value)}
                        rows="5"
                        required
                        className="px-4 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-400 resize-none"
                    />
                    <button
                        type="submit"
                        className="bg-blue-500 text-white py-2 rounded hover:bg-blue-600 transition"
                    >
                        Publish
                    </button>
                </form>
                {error && <p className="text-red-500 mt-4 text-center">{error}</p>}
            </div>
        </div>
    );
}

export default AddPost;