import { Route, Routes } from 'react-router-dom';
import Register from './pages/Register';
import Login from './pages/Login';
import AddPost from './pages/AddPost';
import PostList from './pages/PostList';
import ProfilePage from './pages/ProfilePage';
import AdventureDetailPage from './pages/AdventureDetailPage.jsx';
import SearchPage from "./pages/SearchPage.jsx";
import EditAdventurePage from "./pages/EditAdventurePage.jsx";

function AppRoutes() {
    return (
        <Routes>
            <Route path="/" element={<PostList />} />
            <Route path="/register" element={<Register />} />
            <Route path="/login" element={<Login />} />
            <Route path="/add-post" element={<AddPost />} />
            <Route path="/profile" element={<ProfilePage />} />
            <Route path="/adventure/:id" element={<AdventureDetailPage />} />
            <Route path="/search" element={<SearchPage />} />
            <Route path="/edit-adventure/:id" element={<EditAdventurePage />} />
        </Routes>
    );
}

export default AppRoutes;