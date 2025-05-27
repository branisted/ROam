import { Route, Routes } from 'react-router-dom';
import Register from './pages/Register';
import Login from './pages/Login';
import AddPost from './pages/AddPost';
import PostList from './pages/PostList';
import ProfilePage from './pages/ProfilePage';
import GuideAdventuresPage from './pages/GuideAdventuresPage';

function AppRoutes() {
    return (
        <Routes>
            <Route path="/" element={<PostList />} />
            <Route path="/register" element={<Register />} />
            <Route path="/login" element={<Login />} />
            <Route path="/add-post" element={<AddPost />} />
            <Route path="/profile" element={<ProfilePage />} />
            <Route path="/guide-adventures" element={<GuideAdventuresPage />} />
        </Routes>
    );
}

export default AppRoutes;