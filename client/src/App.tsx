import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import LandingPage from './pages/LandingPage';
import OrganizationSelect from './pages/OrganizationSelect';
import SubmitFeedback from './pages/SubmitFeedback';
import TrackComplaint from './pages/TrackComplaint';
import AdminLogin from './pages/admin/AdminLogin';
import AdminDashboard from './pages/admin/AdminDashboard';
import ReportDetails from './pages/admin/ReportDetails';
import AdminRegister from './pages/admin/AdminRegister';
import AdminReports from './pages/admin/AdminReports';
import AdminAnalytics from './pages/admin/AdminAnalytics';
import AdminSettings from './pages/admin/AdminSettings';
import AdminHelp from './pages/admin/AdminHelp';
import AITest from './pages/admin/AITest';
import ResetPassword from './pages/admin/ResetPassword';

function App() {
  return (
    <Router>
    <div className="App">
        <Routes>
          {/* Public Routes */}
          <Route path="/" element={<LandingPage />} />
          <Route path="/organizations" element={<OrganizationSelect />} />
          <Route path="/submit/:orgCode" element={<SubmitFeedback />} />
          <Route path="/track/:complaintId" element={<TrackComplaint />} />
          
          {/* Admin Routes */}
          <Route path="/admin/login" element={<AdminLogin />} />
          <Route path="/admin/register" element={<AdminRegister />} />
          <Route path="/admin/reset-password" element={<ResetPassword />} />
          <Route path="/admin/dashboard" element={<AdminDashboard />} />
          <Route path="/admin/reports" element={<AdminReports />} />
          <Route path="/admin/analytics" element={<AdminAnalytics />} />
          <Route path="/admin/settings" element={<AdminSettings />} />
          <Route path="/admin/help" element={<AdminHelp />} />
          <Route path="/admin/report/:complaintId" element={<ReportDetails />} />
          <Route path="/admin/ai-test" element={<AITest />} />
        </Routes>
    </div>
    </Router>
  );
}

export default App;
