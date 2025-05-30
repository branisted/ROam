import { Route, Routes } from 'react-router-dom';
import Register from './pages/Register';
import Login from './pages/Login';
import AddAdventure from './pages/AddAdventure.jsx';
import PostList from './pages/PostList';
import ProfilePage from './pages/ProfilePage';
import AdventureDetailPage from './pages/AdventureDetailPage.jsx';
import SearchPage from "./pages/SearchPage.jsx";
import EditAdventurePage from "./pages/EditAdventurePage.jsx";
import { ProtectedRoute, RoleRoute } from './ProtectedRoute'; // Adjust import if separated

function AppRoutes() {
    return (
        <Routes>
            <Route path="/" element={<PostList />} />
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