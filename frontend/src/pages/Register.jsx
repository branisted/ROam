import { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

function Register() {
    const navigate = useNavigate();

    const [formData, setFormData] = useState({
        username: '',
        email: '',
        password: '',
        role: 'explorer' // default value
    });

    const [error, setError] = useState('');

    const handleChange = e => {
        setFormData(prev => ({
            ...prev,
            [e.target.name]: e.target.value
        }));
    };

    const handleSubmit = async e => {
        e.preventDefault();
        try {
            await axios.post('http://localhost:3001/api/auth/register', formData, {
                withCredentials: true
            });
            navigate('/login');
        } catch (err) {
                console.error('Registration error:', err); // <== log full error
                setError(err.response?.data?.message || 'Registration failed');
            }

        };

    return (
        <div style={{ padding: '2rem' }}>
            <h2>Register</h2>
            <form onSubmit={handleSubmit}>
                <input
                    type="text"
                    name="username"
                    placeholder="Username"
                    value={formData.username}
                    onChange={handleChange}
                    required
                /><br/><br/>
                <input
                    type="email"
                    name="email"
                    placeholder="Email"
                    value={formData.email}
                    onChange={handleChange}
                    required
                /><br/><br/>
                <input
                    type="password"
                    name="password"
                    placeholder="Password"
                    value={formData.password}
                    onChange={handleChange}
                    required
                /><br/><br/>
                <select name="role" value={formData.role} onChange={handleChange}>
                    <option value="explorer">explorer</option>
                    <option value="guide">guide</option>
                </select>
                <button type="submit">Register</button>
            </form>
            {error && <p style={{ color: 'red' }}>{error}</p>}
        </div>
    );
}

export default Register;