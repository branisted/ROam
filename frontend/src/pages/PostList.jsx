import { useEffect, useState } from 'react';
import axios from 'axios';

function PostList() {
    const [posts, setPosts] = useState([]);
    const [error, setError] = useState('');

    useEffect(() => {
        const fetchPosts = async () => {
            try {
                const res = await axios.get('http://localhost:3001/api/posts');
                setPosts(res.data);
            } catch (err) {
                setError('Failed to load posts');
            }
        };
        fetchPosts();
    }, []);

    return (
        <div style={{ padding: '2rem' }}>
            <h2>All Posts</h2>
            {error && <p style={{ color: 'red' }}>{error}</p>}
            {posts.length === 0 ? (
                <p>No posts yet.</p>
            ) : (
                <ul>
                    {posts.map(post => (
                        <li key={post.id} style={{ marginBottom: '1rem' }}>
                            <strong>{post.title}</strong> <br />
                            by {post.username} <br />
                            <p>{post.description}</p>
                        </li>
                    ))}
                </ul>
            )}
        </div>
    );
}

export default PostList;