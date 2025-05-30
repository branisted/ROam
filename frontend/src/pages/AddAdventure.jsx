import { useState, useContext } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from "../context/AuthContext.jsx";

function AddAdventure() {
    const [title, setTitle] = useState('');
    const [location, setLocation] = useState('');
    const [type, setType] = useState('hike');
    const [difficulty, setDifficulty] = useState('easy');
    const [estimated_duration, setEstimatedDuration] = useState('');
    const [photoFile, setPhotoFile] = useState(null);
    const [description, setDescription] = useState('');
    const [startsOn, setStartsOn] = useState('');
    const [error, setError] = useState('');
    const navigate = useNavigate();
    const { user, loading } = useContext(AuthContext);

    // Prevent unauthorized access
    if (!loading && (!user || user.role !== "guide")) {
        return <div className="text-center mt-8 text-lg">Only guides can add posts.</div>;
    }

    const handleSubmit = async e => {
        e.preventDefault();
        setError('');
        try {
            const formData = new FormData();
            formData.append('title', title);
            formData.append('location', location);
            formData.append('type', type);
            formData.append('difficulty', difficulty);
            formData.append('estimated_duration', estimated_duration);
            formData.append('description', description);
            formData.append('starts_on', startsOn);

            if (photoFile) {
                formData.append('photo', photoFile);
            }

            await axios.post('/api/posts', formData, {
                headers: {
                    'Content-Type': 'multipart/form-data'
                },
                withCredentials: true // <-- Important for session cookie!
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
                                <option value="hike">hike</option>
                                <option value="bike ride">bike ride</option>
                                <option value="urban walk">urban walk</option>
                                <option value="nature tour">nature tour</option>
                                <option value="forest trail">forest trail</option>
                                <option value='mountain climb'>mountain climb</option>
                                <option value='city exploration'>city exploration</option>
                                <option value='river walk'>river walk</option>
                                <option value='wildlife spotting'>wildlife spotting</option>
                                <option value='historical tour'>historical tour</option>
                                <option value='food tour'>food tour</option>
                                <option value='cycling'>cycling</option>
                                <option value='stargazing'>stargazing</option>
                                <option value='camping'>camping</option>
                                <option value='other'>other</option>
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
                                <option value="easy">easy</option>
                                <option value="moderate">moderate</option>
                                <option value="hard">hard</option>
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
                    {/*Removed is joinable field nr*/}
                    {/* New fields for joinable adventure */}
                    {/*<div className="flex items-center gap-2">*/}
                    {/*    <input*/}
                    {/*        type="checkbox"*/}
                    {/*        id="isJoinable"*/}
                    {/*        checked={isJoinable}*/}
                    {/*        onChange={e => {*/}
                    {/*            setIsJoinable(e.target.checked);*/}
                    {/*            if (!e.target.checked) setMaxParticipants('');*/}
                    {/*        }}*/}
                    {/*        className="w-4 h-4"*/}
                    {/*    />*/}
                    {/*    <label htmlFor="isJoinable" className="font-medium">Make this adventure joinable</label>*/}
                    {/*</div>*/}

                    {/*Removed max participants nr*/}
                    {/*<input*/}
                    {/*    type="number"*/}
                    {/*    min="1"*/}
                    {/*    placeholder="Max participants (leave blank for unlimited)"*/}
                    {/*    value={maxParticipants}*/}
                    {/*    onChange={e => setMaxParticipants(e.target.value.replace(/^0+/, ''))}*/}
                    {/*    disabled={!isJoinable}*/}
                    {/*    className="px-4 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-400"*/}
                    {/*/>*/}
                    {/* New starts_on field */}
                    <label className="block font-medium">Start Date & Time</label>
                    <input
                        type="datetime-local"
                        value={startsOn}
                        onChange={e => setStartsOn(e.target.value)}
                        required
                        className="px-4 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-400"
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

export default AddAdventure;