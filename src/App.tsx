import React from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import { ThemeProvider } from './context/ThemeContext';
import { AuthProvider } from './context/AuthContext';
import { QueueProvider } from './context/QueueContext';

// Components
import { Navbar } from './components/Navbar';
import { Footer } from './components/Footer';
import { DemoBanner } from './components/DemoBanner';
import { ProtectedRoute } from './components/ProtectedRoute';
import { AiAssistantModal } from './components/AiAssistantModal';

// Pages
import { LandingPage } from './pages/LandingPage';
import { LoginPage } from './pages/auth/LoginPage';
import { RegisterPage } from './pages/auth/RegisterPage';
import { CustomerDashboard } from './pages/customer/CustomerDashboard';
import { JoinQueuePage } from './pages/customer/JoinQueuePage';
import { StaffDashboard } from './pages/staff/StaffDashboard';
import { AdminDashboard } from './pages/admin/AdminDashboard';
import { PublicQueueDisplayPage } from './pages/display/PublicQueueDisplayPage';
import { KioskPage } from './pages/kiosk/KioskPage';
import { DemoShowcasePage } from './pages/demo/DemoShowcasePage';

const AppLayout: React.FC = () => {
  const location = useLocation();

  // Fullscreen standalone views that should not display standard app navigation/footer
  const isStandaloneView = location.pathname === '/display' || location.pathname === '/kiosk';

  return (
    <div className="min-h-screen flex flex-col bg-surface-light dark:bg-surface-dark text-text-mainLight dark:text-text-mainDark transition-colors">
      {!isStandaloneView && <DemoBanner />}
      {!isStandaloneView && <Navbar />}

      <main className="flex-1">
        <Routes>
          {/* Public Routes */}
          <Route path="/" element={<LandingPage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route path="/display" element={<PublicQueueDisplayPage />} />
          <Route path="/kiosk" element={<KioskPage />} />
          <Route path="/demo" element={<DemoShowcasePage />} />

          {/* Customer Routes */}
          <Route
            path="/customer"
            element={
              <ProtectedRoute allowedRoles={['customer', 'staff', 'org_admin', 'platform_admin']}>
                <CustomerDashboard />
              </ProtectedRoute>
            }
          />
          <Route
            path="/customer/join"
            element={
              <ProtectedRoute allowedRoles={['customer', 'staff', 'org_admin', 'platform_admin']}>
                <JoinQueuePage />
              </ProtectedRoute>
            }
          />

          {/* Staff Counter Routes */}
          <Route
            path="/staff"
            element={
              <ProtectedRoute allowedRoles={['staff', 'org_admin', 'platform_admin']}>
                <StaffDashboard />
              </ProtectedRoute>
            }
          />

          {/* Administrator Routes */}
          <Route
            path="/admin"
            element={
              <ProtectedRoute allowedRoles={['org_admin', 'platform_admin']}>
                <AdminDashboard />
              </ProtectedRoute>
            }
          />
        </Routes>
      </main>

      {!isStandaloneView && <AiAssistantModal />}
      {!isStandaloneView && <Footer />}
    </div>
  );
};

export function App() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <QueueProvider>
          <Router>
            <AppLayout />
          </Router>
        </QueueProvider>
      </AuthProvider>
    </ThemeProvider>
  );
}

export default App;
