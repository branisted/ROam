import { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

function AddPost() {
    const [title, setTitle] = useState('');
    const [location, setLocation] = useState('');
    const [type, setType] = useState('');
    const [difficulty, setDifficulty] = useState('');
    const [estimated_duration, setEstimatedDuration] = useState('');
    const [photo, setPhoto] = useState('');
    const [description, setDescription] = useState('');
    const [error, setError] = useState('');
    const navigate = useNavigate();

    const handleSubmit = async e => {
        e.preventDefault();
        try {
            const author_id = JSON.parse(localStorage.getItem('user')).id; // 🔐 Replace this with the actual user ID (from context or login)
            await axios.post('http://localhost:3001/api/posts', {
                title,
                location,
                type,
                difficulty,
                estimated_duration,
                photo,
                description,
                author_id
            });
            navigate('/');
        } catch (err) {
            setError(err.response?.data?.message || 'Failed to create post');
        }
    };

    return (
        <div style={{ padding: '2rem' }}>
            <h2>Create New Post</h2>
            <form onSubmit={handleSubmit}>
                <input
                    type="text"
                    placeholder="Title"
                    value={title}
                    onChange={e => setTitle(e.target.value)}
                    required
                /><br/><br/>
                <input
                    type="text"
                    placeholder="Location"
                    value={location}
                    onChange={e => setLocation(e.target.value)}
                    required
                />
                <p>Type:</p>
                <select name="type"
                        value={type}
                        onChange={e => setType(e.target.value)}>
                    'hike', 'bike ride', 'urban walk', 'nature tour', 'forest trail'
                    <option value="hike">Hike</option>
                    <option value="bike ride">Bike Ride</option>
                    <option value="urban walk">Urban Walk</option>
                    <option value="nature tour">Nature Tour</option>
                    <option value="forest trail">Forest Trail</option>
                </select>
                <p>Difficulty:</p>
                <select name="difficulty"
                        value={difficulty}
                        onChange={e => setDifficulty(e.target.value)}>
                    <option value="easy">Easy</option>
                    <option value="moderate">Moderate</option>
                    <option value="hard">Hard</option>
                </select>
                <br/><br/>
                <input
                    type="text"
                    placeholder="Estimated duration"
                    value={estimated_duration}
                    onChange={e => setEstimatedDuration(e.target.value)}
                    required
                /><br/><br/>
                <input
                    type="upload"
                    placeholder="Photo"
                    value={photo}
                    onChange={e => setPhoto(e.target.value)}
                    required
                /><br/><br/>
                <textarea
                    placeholder="Content"
                    value={description}
                    onChange={e => setDescription(e.target.value)}
                    rows="6"
                    style={{ width: '300px' }}
                    required
                /><br/><br/>
                <button type="submit">Publish</button>
            </form>
            {error && <p style={{ color: 'red' }}>{error}</p>}
        </div>
    );
}

export default AddPost;