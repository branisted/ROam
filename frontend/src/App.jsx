import { BrowserRouter } from 'react-router-dom';
import AppRoutes from './AppRoutes.jsx';
import Navbar from './components/Navbar';
import { AuthProvider } from './context/AuthContext';

function App() {
    return (
        <BrowserRouter>
            <AuthProvider>
                <div className="flex flex-col min-h-screen">
                    <Navbar />
                    <main className="flex-1 overflow-y-auto">
                        <AppRoutes />
                    </main>
                </div>
            </AuthProvider>
        </BrowserRouter>
    );
}

export default App;