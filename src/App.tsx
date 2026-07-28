import React from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import ProtectedRoute from './components/ProtectedRoute';

// Public Pages
import Home from './pages/Home';
import ProductsPage from './pages/public/ProductsPage';
import PricingPage from './pages/public/PricingPage';
import IndustriesPage from './pages/public/IndustriesPage';
import HowItWorksPage from './pages/public/HowItWorksPage';
import AboutPage from './pages/public/AboutPage';

// Auth Pages
import LoginPage from './pages/auth/LoginPage';
import RegisterPage from './pages/auth/RegisterPage';
import ResetPasswordPage from './pages/auth/ResetPasswordPage';
import VerifyEmailPage from './pages/auth/VerifyEmailPage';

// Protected Application Pages
import OnboardingPage from './pages/app/OnboardingPage';
import AppDashboard from './pages/app/AppDashboard';
import FreeCRMApp from './pages/app/FreeCRMApp';
import LeadAuditorApp from './pages/app/LeadAuditorApp';
import SalesAuditorApp from './pages/app/SalesAuditorApp';
import ConversationAnalyserApp from './pages/app/ConversationAnalyserApp';
import QuotationAssistantApp from './pages/app/QuotationAssistantApp';
import ChanakyaApp from './pages/app/ChanakyaApp';
import ReportsApp from './pages/app/ReportsApp';
import TasksApp from './pages/app/TasksApp';
import NotificationsApp from './pages/app/NotificationsApp';
import IntegrationsApp from './pages/app/IntegrationsApp';
import TeamApp from './pages/app/TeamApp';
import BillingApp from './pages/app/BillingApp';
import SettingsApp from './pages/app/SettingsApp';

// Legacy pages retained for backwards compatibility
import Solutions from './pages/Solutions';
import ChanakyaChat from './pages/ChanakyaChat';
import GrowthSystemBuilder from './pages/GrowthSystemBuilder';
import Recommendation from './pages/Recommendation';
import Packages from './pages/Packages';
import Contact from './pages/Contact';
import BookStrategyCall from './pages/BookStrategyCall';
import Dashboard from './pages/Dashboard';
import AdminDashboard from './pages/AdminDashboard';
import Legal from './pages/Legal';
import Report from './pages/Report';

import ChanakyaWidget from './components/ChanakyaWidget';

function AppRoutes() {
  const location = useLocation();
  const path = location.pathname;

  // Hide floating widget when inside logged-in app structure or auth screens
  const isAppRoute = path.startsWith('/app');
  const isAuthRoute = ['/login', '/register', '/reset-password', '/verify-email'].includes(path);

  return (
    <>
      <Routes>
        {/* Public Experience Routes */}
        <Route path="/" element={<Home />} />
        <Route path="/products" element={<ProductsPage />} />
        <Route path="/pricing" element={<PricingPage />} />
        <Route path="/industries" element={<IndustriesPage />} />
        <Route path="/how-it-works" element={<HowItWorksPage />} />
        <Route path="/about" element={<AboutPage />} />

        {/* Auth Routes */}
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/reset-password" element={<ResetPasswordPage />} />
        <Route path="/verify-email" element={<VerifyEmailPage />} />

        {/* Protected Logged-in Application Routes */}
        <Route path="/app/onboarding" element={<ProtectedRoute><OnboardingPage /></ProtectedRoute>} />
        <Route path="/app/dashboard" element={<ProtectedRoute><AppDashboard /></ProtectedRoute>} />
        <Route path="/app/crm" element={<ProtectedRoute><FreeCRMApp /></ProtectedRoute>} />
        <Route path="/app/lead-auditor" element={<ProtectedRoute><LeadAuditorApp /></ProtectedRoute>} />
        <Route path="/app/sales-auditor" element={<ProtectedRoute><SalesAuditorApp /></ProtectedRoute>} />
        <Route path="/app/conversation-analyser" element={<ProtectedRoute><ConversationAnalyserApp /></ProtectedRoute>} />
        <Route path="/app/quotation-assistant" element={<ProtectedRoute><QuotationAssistantApp /></ProtectedRoute>} />
        <Route path="/app/chanakya" element={<ProtectedRoute><ChanakyaApp /></ProtectedRoute>} />
        <Route path="/app/reports" element={<ProtectedRoute><ReportsApp /></ProtectedRoute>} />
        <Route path="/app/tasks" element={<ProtectedRoute><TasksApp /></ProtectedRoute>} />
        <Route path="/app/notifications" element={<ProtectedRoute><NotificationsApp /></ProtectedRoute>} />
        <Route path="/app/integrations" element={<ProtectedRoute><IntegrationsApp /></ProtectedRoute>} />
        <Route path="/app/team" element={<ProtectedRoute><TeamApp /></ProtectedRoute>} />
        <Route path="/app/billing" element={<ProtectedRoute><BillingApp /></ProtectedRoute>} />
        <Route path="/app/settings" element={<ProtectedRoute><SettingsApp /></ProtectedRoute>} />

        {/* Legacy & Compatibility Routes */}
        <Route path="/solutions" element={<Solutions />} />
        <Route path="/talk-to-chanakya" element={<ChanakyaChat />} />
        <Route path="/growth-system-builder" element={<GrowthSystemBuilder />} />
        <Route path="/recommendation/:id" element={<Recommendation />} />
        <Route path="/report/:id" element={<Report />} />
        <Route path="/packages" element={<Packages />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/book-strategy-call" element={<BookStrategyCall />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/admin-dashboard" element={<AdminDashboard />} />
        <Route path="/legal" element={<Legal />} />
      </Routes>

      {/* Floating Chanakya widget on public pages only */}
      {!isAppRoute && !isAuthRoute && <ChanakyaWidget inline={false} />}
    </>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <Router>
        <AppRoutes />
      </Router>
    </AuthProvider>
  );
}
