import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { AuthProvider } from './context/AuthContext';
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
            <Route path="/graph" element={<KnowledgeGraph />} />
            <Route path="/analytics" element={<CrimeAnalytics />} />
            <Route path="/intelligence" element={<IntelligenceCenter />} />
            <Route path="/settings" element={<Settings />} />
            {/* Fallback redirect */}
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </main>
      </div>
    </div>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <BrowserRouter>
          <AppLayout />
        </BrowserRouter>
      </AuthProvider>
    </QueryClientProvider>
  );
}

export default App;
