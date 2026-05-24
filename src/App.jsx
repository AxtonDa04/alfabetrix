import { useEffect, useState } from 'react';
import { Toaster } from "@/components/ui/toaster"
import { QueryClientProvider } from '@tanstack/react-query'
import { queryClientInstance } from '@/lib/query-client'
import { BrowserRouter as Router, Route, Routes, useLocation } from 'react-router-dom';
import PageNotFound from './lib/PageNotFound';
import { AuthProvider, useAuth } from '@/lib/AuthContext';
import UserNotRegisteredError from '@/components/UserNotRegisteredError';
import AppLayout from './components/AppLayout';
import Splash from './pages/Splash';
import CreateProfile from './pages/CreateProfile';
import MainMenu from './pages/MainMenu';
import ModuleSelect from './pages/ModuleSelect';
import Activity from './pages/Activity';
import Results from './pages/Results';
import MyProgress from './pages/MyProgress';
import Games from './pages/Games';
import Help from './pages/Help';
import Settings from './pages/Settings';

const STARTUP_SPLASH_MS = 3200;

const AuthenticatedApp = () => {
  const { isLoadingAuth, isLoadingPublicSettings, authError } = useAuth();
  const location = useLocation();
  const [showStartupSplash, setShowStartupSplash] = useState(() => location.pathname !== '/');

  useEffect(() => {
    if (location.pathname === '/') {
      setShowStartupSplash(false);
      return;
    }

    setShowStartupSplash(true);

    const timer = setTimeout(() => {
      setShowStartupSplash(false);
    }, STARTUP_SPLASH_MS);

    return () => clearTimeout(timer);
    // Solo debe ejecutarse al cargar directamente una URL interna.
    // No queremos mostrar splash en cada navegación interna.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  if (isLoadingPublicSettings || isLoadingAuth) {
    return (
      <div className="fixed inset-0 flex items-center justify-center bg-beige">
        <div className="w-8 h-8 border-4 border-slate-200 border-t-slate-800 rounded-full animate-spin"></div>
      </div>
    );
  }

  if (authError) {
    if (authError.type === 'user_not_registered') {
      return <UserNotRegisteredError />;
    }
  }

  if (showStartupSplash) {
    return <Splash autoNavigate={false} minDuration={STARTUP_SPLASH_MS} />;
  }

  return (
    <Routes>
      <Route path="/" element={<Splash />} />
      <Route element={<AppLayout />}>
        <Route path="/create-profile" element={<CreateProfile />} />
        <Route path="/menu" element={<MainMenu />} />
        <Route path="/modules" element={<ModuleSelect />} />
        <Route path="/activity/:moduleId" element={<Activity />} />
        <Route path="/results" element={<Results />} />
        <Route path="/progress" element={<MyProgress />} />
        <Route path="/games" element={<Games />} />
        <Route path="/help" element={<Help />} />
        <Route path="/settings" element={<Settings />} />
      </Route>
      <Route path="*" element={<PageNotFound />} />
    </Routes>
  );
};

function App() {

  return (
    <AuthProvider>
      <QueryClientProvider client={queryClientInstance}>
        <Router>
          <AuthenticatedApp />
        </Router>
        <Toaster />
      </QueryClientProvider>
    </AuthProvider>
  )
}

export default App
