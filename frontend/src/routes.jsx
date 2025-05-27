import { Route, Routes } from 'react-router-dom';
import Register from './pages/Register';
import Login from './pages/Login';
import AddPost from './pages/AddPost';
import PostList from './pages/PostList';
import ProfilePage from './pages/ProfilePage';
import HuntDetailPage from './pages/HuntDetailPage';
import SearchPage from "./pages/SearchPage.jsx";

function AppRoutes() {
    return (
        <Routes>
            <Route path="/" element={<PostList />} />
            <Route path="/register" element={<Register />} />
            <Route path="/login" element={<Login />} />
            <Route path="/add-post" element={<AddPost />} />
            <Route path="/profile" element={<ProfilePage />} />
            <Route path="/hunts/:id" element={<HuntDetailPage />} />
            <Route path="/search" element={<SearchPage />} />
        </Routes>
    );
}

export default AppRoutes;