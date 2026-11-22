import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import { Toaster } from 'sonner';
import { AuthProvider } from './context/AuthContext';
import { ThemeProvider } from './context/ThemeContext';
import { ErrorBoundary } from './components/ErrorBoundary';
import Layout from './components/Layout';
import Landing from './pages/Landing';
import CitizenApp from './pages/CitizenApp';
import AdminPanel from './pages/AdminPanel';
import Login from './pages/Login';
import Register from './pages/Register';
import MapView from './pages/MapView';
import WasteGuide from './pages/WasteGuide';
import CleanPoints from './pages/CleanPoints';
import Notifications from './pages/Notifications';
import Rewards from './pages/Rewards';
import Profile from './pages/Profile';
import { AlertTriangle, RefreshCw, Home } from 'lucide-react';
import { Link } from 'react-router-dom';
import './index.css';

const RouteWrapper = ({ children }) => {
  const location = useLocation();
  return (
    <ErrorBoundary key={location.pathname} fallback={(error, reset) => (
      <div className="min-h-screen flex items-center justify-center bg-eco-bg p-4">
        <div className="card p-8 max-w-md w-full text-center">
          <AlertTriangle className="w-16 h-16 text-eco-neon mx-auto mb-4 animate-pulse" aria-hidden="true" />
          <h2 className="font-display font-bold text-2xl text-white mb-3">Esta sección no cargó</h2>
          <p className="text-eco-green/60 mb-6">{error?.message || 'Error inesperado'}</p>
          <div className="flex flex-col sm:flex-row gap-3">
            <button onClick={reset} className="btn-primary flex items-center justify-center gap-2">
              <RefreshCw className="w-4 h-4" aria-hidden="true" />
              Reintentar
            </button>
            <Link to="/" className="btn-secondary flex items-center justify-center gap-2">
              <Home className="w-4 h-4" aria-hidden="true" />
              Inicio
            </Link>
          </div>
        </div>
      </div>
    )}>
      {children}
    </ErrorBoundary>
  );
};

function App() {
  return (
    <Router>
      <ThemeProvider>
        <AuthProvider>
          <div className="min-h-screen bg-ivory">
            <Routes>
            {/* Public routes without layout */}
            <Route path="/login" element={<RouteWrapper><Login /></RouteWrapper>} />
            <Route path="/register" element={<RouteWrapper><Register /></RouteWrapper>} />

            {/* Protected routes with layout */}
            <Route path="/" element={<Layout />}>
              <Route index element={<RouteWrapper><Landing /></RouteWrapper>} />
              <Route path="app" element={<RouteWrapper><CitizenApp /></RouteWrapper>} />
              <Route path="map" element={<RouteWrapper><MapView /></RouteWrapper>} />
              <Route path="waste-guide" element={<RouteWrapper><WasteGuide /></RouteWrapper>} />
              <Route path="clean-points" element={<RouteWrapper><CleanPoints /></RouteWrapper>} />
              <Route path="notifications" element={<RouteWrapper><Notifications /></RouteWrapper>} />
              <Route path="rewards" element={<RouteWrapper><Rewards /></RouteWrapper>} />
              <Route path="profile" element={<RouteWrapper><Profile /></RouteWrapper>} />
              <Route path="admin" element={<RouteWrapper><AdminPanel /></RouteWrapper>} />
            </Route>
          </Routes>
          <Toaster
            position="top-right"
            theme="light"
            className="bg-white border border-stone-200 rounded-xl shadow-lg text-charcoal-900"
            toastOptions={{
              className: 'bg-white border border-stone-200 rounded-xl shadow-lg text-charcoal-900',
              style: { background: '#FFFFFF', border: '1px solid #E2DED5' },
              success: { iconTheme: { primary: '#2D5A2D', secondary: '#F0F5F0' } },
              error: { iconTheme: { primary: '#F97316', secondary: '#FFF1F2' } },
            }}
          />
        </div>
      </AuthProvider>
      </ThemeProvider>
    </Router>
  );
}

export default App;