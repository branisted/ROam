import { BrowserRouter } from 'react-router-dom';
import AppRoutes from './routes';
import Navbar from './components/Navbar';

function App() {
    return (
        <BrowserRouter>
            <div className="flex flex-col min-h-screen">
                <Navbar />
                <main className="flex-1 overflow-y-auto">
                    <AppRoutes />
                </main>
            </div>
        </BrowserRouter>
    );
}

export default App;
