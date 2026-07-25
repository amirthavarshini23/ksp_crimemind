import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { AuthProvider, useAuth } from './context/AuthContext';
import { ProtectedRoute } from './components/ProtectedRoute';
import { Sidebar } from './components/Sidebar';
import { TopNav } from './components/TopNav';

// Pages
import { Dashboard } from './pages/Dashboard';
import { Chat } from './pages/Chat';
import { Cases } from './pages/Cases';
import { CaseFolderDetail } from './pages/CaseFolderDetail';
import { KnowledgeGraph } from './pages/KnowledgeGraph';
import { CrimeAnalytics } from './pages/CrimeAnalytics';
import { IntelligenceCenter } from './pages/IntelligenceCenter';
import { Settings } from './pages/Settings';
import { Login } from './pages/Login';
import { InvestigationCollaboration } from './pages/InvestigationCollaboration';
import { UserProfilePage } from './pages/UserProfilePage';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60 * 5, // 5 minutes
      retry: 1,
    },
  },
});

function AppLayout() {
  return (
    <div className="flex h-screen w-screen overflow-hidden bg-slate-950">
      {/* Left Sidebar */}
      <Sidebar />

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Top Navigation */}
        <TopNav />

        {/* Page Routes */}
        <main className="flex-1 overflow-hidden flex">
          <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route path="/chat" element={<Chat />} />
            <Route path="/cases" element={<Cases />} />
            <Route path="/cases/:id" element={<CaseFolderDetail />} />
            <Route path="/collaboration" element={
              <ProtectedRoute allowedRoles={['Investigator', 'Supervisor', 'Administrator', 'Crime Analyst', 'Analyst']}>
                <InvestigationCollaboration />
              </ProtectedRoute>
            } />
            <Route path="/graph" element={<KnowledgeGraph />} />
            <Route path="/analytics" element={<CrimeAnalytics />} />
            <Route path="/intelligence" element={<IntelligenceCenter />} />
            <Route path="/profile" element={<UserProfilePage />} />
            <Route path="/settings" element={
              <ProtectedRoute allowedRoles={['Administrator']}>
                <Settings />
              </ProtectedRoute>
            } />
            {/* Fallback redirect */}
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </main>
      </div>
    </div>
  );
}

function AppRouter() {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="flex h-screen w-screen items-center justify-center bg-slate-950 text-slate-400 select-none font-sans">
        <div className="space-y-4 text-center">
          <div className="h-10 w-10 animate-spin rounded-full border-4 border-blue-500 border-t-transparent mx-auto"></div>
          <p className="text-xs uppercase tracking-widest font-semibold text-blue-500">Initializing CrimeMind AI...</p>
        </div>
      </div>
    );
  }

  return (
    <Routes>
      <Route path="/login" element={user ? <Navigate to="/" replace /> : <Login />} />
      <Route path="/*" element={user ? <AppLayout /> : <Navigate to="/login" replace />} />
    </Routes>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <BrowserRouter>
          <AppRouter />
        </BrowserRouter>
      </AuthProvider>
    </QueryClientProvider>
  );
}

export default App;
