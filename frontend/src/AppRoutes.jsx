import { Route, Routes } from 'react-router-dom';
import Register from './pages/Register';
import Login from './pages/Login';
import AddAdventure from './pages/AddAdventure.jsx';
import PostList from './pages/PostList';
import ProfilePage from './pages/ProfilePage';
import AdventureDetailPage from './pages/AdventureDetailPage.jsx';
import SearchPage from "./pages/SearchPage.jsx";
import EditAdventurePage from "./pages/EditAdventurePage.jsx";
import Home from './pages/Home';
import { ProtectedRoute, RoleRoute } from './ProtectedRoute';

function AppRoutes() {
    return (
        <Routes>
            <Route path="/" element={<Home />} /> {/* Home page as the new landing page */}
            <Route path="/adventures" element={<PostList />} /> {/* PostList moved to /adventures */}
            <Route path="/register" element={<Register />} />
            <Route path="/login" element={<Login />} />
            <Route
                path="/add-adventure"
                element={
                    <RoleRoute allowedRoles={["guide"]}>
                        <AddAdventure />
                    </RoleRoute>
                }
            />
            <Route
                path="/profile"
                element={
                    <ProtectedRoute>
                        <ProfilePage />
                    </ProtectedRoute>
                }
            />
            <Route path="/adventure/:id" element={<AdventureDetailPage />} />
            <Route
                path="/search"
                element={
                    <RoleRoute allowedRoles={["explorer"]}>
                        <SearchPage />
                    </RoleRoute>
                }
            />
            <Route
                path="/edit-adventure/:id"
                element={
                    <RoleRoute allowedRoles={["guide"]}>
                        <EditAdventurePage />
                    </RoleRoute>
                }
            />
        </Routes>
    );
}

export default AppRoutes;