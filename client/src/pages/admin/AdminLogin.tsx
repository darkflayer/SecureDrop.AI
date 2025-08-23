import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import FinalsLogo from '../../components/FinalsLogo';
import DarkModeToggle from '../../components/DarkModeToggle';
import PasswordInput from '../../components/PasswordInput';
import { API_URL } from '../../config';
import { 
  HomeIcon, 
  ShieldCheckIcon, 
  UserPlusIcon,
  EnvelopeIcon,
  ExclamationCircleIcon,
  CheckCircleIcon,
  XMarkIcon
} from '@heroicons/react/24/outline';

const AdminLogin: React.FC = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [showForgotPassword, setShowForgotPassword] = useState(false);
  const [resetEmail, setResetEmail] = useState('');
  const [resetLoading, setResetLoading] = useState(false);
  const [resetMessage, setResetMessage] = useState('');

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const response = await fetch(`${API_URL}/api/admin/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        const data = await response.json();
        localStorage.setItem('adminToken', data.token);
        localStorage.setItem('adminName', data.admin.name);
        localStorage.setItem('adminData', JSON.stringify(data.admin));
        navigate('/admin/dashboard');
      } else {
        const errorData = await response.json();
        setError(errorData.msg || 'Login failed');
      }
    } catch (err) {
      setError('Network error. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleForgotPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setResetLoading(true);
    setResetMessage('');

    try {
      const response = await fetch(`${API_URL}/api/admin/forgot-password`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email: resetEmail }),
      });

      if (response.ok) {
        setResetMessage('Password reset email sent! Check your inbox.');
        setResetEmail('');
        setTimeout(() => {
          setShowForgotPassword(false);
          setResetMessage('');
        }, 3000);
      } else {
        const errorData = await response.json();
        setResetMessage(errorData.msg || 'Failed to send reset email');
      }
    } catch (err) {
      setResetMessage('Network error. Please try again.');
    } finally {
      setResetLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Professional Header */}
      <header className="glass backdrop-blur-xl bg-white/95 dark:bg-gray-900/95 shadow-lg sticky top-0 z-50">
        <div className="container-premium">
          <div className="flex justify-between items-center py-4">
            <div className="flex items-center group">
              <div className="relative">
                <FinalsLogo className="w-8 h-8 sm:w-10 sm:h-10 mr-2 sm:mr-3 transform group-hover:scale-105 transition-transform duration-300" />
              </div>
              <span className="text-lg sm:text-xl lg:text-2xl font-bold text-gradient">SecureDrop.AI</span>
            </div>
            
            <div className="flex items-center space-x-4">
              <DarkModeToggle />
              <Link 
                to="/" 
                className="flex items-center text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 transition-colors duration-300 font-medium"
              >
                <HomeIcon className="w-4 h-4 mr-1" />
                Home
              </Link>
            </div>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative py-16 lg:py-24 overflow-hidden">
        {/* Professional Background */}
        <div className="absolute inset-0">
          <div className="absolute inset-0 bg-gradient-to-br from-blue-50 via-white to-purple-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900"></div>
          <div className="absolute inset-0 opacity-40">
            <div className="absolute top-0 left-0 w-72 h-72 bg-blue-200 dark:bg-blue-900 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse"></div>
            <div className="absolute bottom-0 right-0 w-72 h-72 bg-purple-200 dark:bg-purple-900 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse" style={{animationDelay: '2s'}}></div>
          </div>
        </div>

        <div className="relative z-10 container-premium px-4">
          <div className="max-w-md mx-auto">
            {/* Header Content */}
            <div className="text-center mb-8 animate-slide-down">
              <div className="w-16 h-16 bg-gradient-to-br from-blue-600 to-purple-600 rounded-2xl flex items-center justify-center mx-auto mb-6">
                <ShieldCheckIcon className="w-8 h-8 text-white" />
              </div>
              <h1 className="text-3xl lg:text-4xl font-bold text-gray-900 dark:text-white mb-4">
                Admin Login
              </h1>
              <p className="text-gray-600 dark:text-gray-300">
                Access your organization's complaint dashboard and manage feedback securely.
              </p>
            </div>

            {/* Login Form */}
            <div className="card-premium p-6 lg:p-8 animate-slide-up">
              <form className="space-y-6" onSubmit={handleSubmit}>
                {error && (
                  <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 text-red-700 dark:text-red-400 px-4 py-3 rounded-xl flex items-center">
                    <ExclamationCircleIcon className="w-5 h-5 mr-2 flex-shrink-0" />
                    <span className="text-sm">{error}</span>
                  </div>
                )}

                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Email Address
                  </label>
                  <div className="relative">
                    <EnvelopeIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                    <input
                      id="email"
                      name="email"
                      type="email"
                      autoComplete="email"
                      required
                      value={formData.email}
                      onChange={handleInputChange}
                      className="w-full pl-10 pr-4 py-3 border border-gray-300 dark:border-gray-600 rounded-xl bg-white/50 dark:bg-gray-800/50 backdrop-blur-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400"
                      placeholder="Enter your admin email"
                    />
                  </div>
                </div>

                <PasswordInput
                  id="password"
                  name="password"
                  value={formData.password}
                  onChange={handleInputChange}
                  placeholder="Enter your password"
                  required
                  label="Password"
                />

                <div className="flex items-center justify-between">
                  <button
                    type="button"
                    onClick={() => setShowForgotPassword(true)}
                    className="text-sm text-blue-600 dark:text-blue-400 hover:text-blue-500 dark:hover:text-blue-300 transition-colors duration-300"
                  >
                    Forgot your password?
                  </button>
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full btn-primary disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <span className="flex items-center justify-center">
                    {loading ? (
                      <>
                        <div className="animate-spin rounded-full h-5 w-5 border-2 border-white border-t-transparent mr-2"></div>
                        Signing in...
                      </>
                    ) : (
                      <>
                        <ShieldCheckIcon className="w-5 h-5 mr-2" />
                        Sign In
                      </>
                    )}
                  </span>
                </button>
              </form>

              {/* Divider */}
              <div className="relative my-8">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-gray-300 dark:border-gray-600"></div>
                </div>
                <div className="relative flex justify-center text-sm">
                  <span className="px-4 bg-white dark:bg-gray-800 text-gray-500 dark:text-gray-400 font-medium">
                    New to SecureDrop.AI?
                  </span>
                </div>
              </div>

              {/* Register Link */}
              <Link
                to="/admin/register"
                className="w-full btn-secondary group"
              >
                <span className="flex items-center justify-center">
                  <UserPlusIcon className="w-5 h-5 mr-2 group-hover:scale-110 transition-transform" />
                  Register Your Organization
                </span>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Forgot Password Modal */}
      {showForgotPassword && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm overflow-y-auto h-full w-full z-50 flex items-center justify-center p-4">
          <div className="relative w-full max-w-md">
            <div className="card-premium p-6 lg:p-8 animate-scale-in">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-xl font-bold text-gray-900 dark:text-white">Reset Password</h3>
                <button
                  onClick={() => {
                    setShowForgotPassword(false);
                    setResetMessage('');
                    setResetEmail('');
                  }}
                  className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors"
                >
                  <XMarkIcon className="w-6 h-6" />
                </button>
              </div>
              
              {resetMessage && (
                <div className={`mb-6 p-4 rounded-xl flex items-center ${
                  resetMessage.includes('sent') 
                    ? 'bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 text-green-700 dark:text-green-400'
                    : 'bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 text-red-700 dark:text-red-400'
                }`}>
                  {resetMessage.includes('sent') ? (
                    <CheckCircleIcon className="w-5 h-5 mr-2 flex-shrink-0" />
                  ) : (
                    <ExclamationCircleIcon className="w-5 h-5 mr-2 flex-shrink-0" />
                  )}
                  <span className="text-sm">{resetMessage}</span>
                </div>
              )}
              
              <form onSubmit={handleForgotPassword} className="space-y-6">
                <div>
                  <label htmlFor="resetEmail" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Enter your email address
                  </label>
                  <div className="relative">
                    <EnvelopeIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                    <input
                      type="email"
                      id="resetEmail"
                      value={resetEmail}
                      onChange={(e) => setResetEmail(e.target.value)}
                      className="w-full pl-10 pr-4 py-3 border border-gray-300 dark:border-gray-600 rounded-xl bg-white/50 dark:bg-gray-800/50 backdrop-blur-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400"
                      placeholder="admin@example.com"
                      required
                    />
                  </div>
                </div>
                
                <div className="flex space-x-3">
                  <button
                    type="button"
                    onClick={() => {
                      setShowForgotPassword(false);
                      setResetMessage('');
                      setResetEmail('');
                    }}
                    className="flex-1 btn-secondary"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={resetLoading}
                    className="flex-1 btn-primary disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {resetLoading ? (
                      <span className="flex items-center justify-center">
                        <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent mr-2"></div>
                        Sending...
                      </span>
                    ) : (
                      'Send Reset Email'
                    )}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}

      {/* Professional Footer */}
      <footer className="bg-gray-900 dark:bg-black py-8 lg:py-12">
        <div className="container-premium px-4">
          <div className="flex flex-col lg:flex-row justify-between items-center space-y-6 lg:space-y-0">
            <div className="flex items-center">
              <FinalsLogo className="w-6 h-6 lg:w-8 lg:h-8 mr-2 lg:mr-3" />
              <span className="text-lg lg:text-xl font-bold text-white">SecureDrop.AI</span>
            </div>
            
            <div className="flex flex-wrap justify-center gap-4 lg:gap-8">
              <Link to="/" className="text-gray-400 hover:text-white transition-colors duration-300 text-sm lg:text-base">Home</Link>
              <a href="/#about" className="text-gray-400 hover:text-white transition-colors duration-300 text-sm lg:text-base">About</a>
              <a href="/#contact" className="text-gray-400 hover:text-white transition-colors duration-300 text-sm lg:text-base">Contact</a>
              <Link to="/admin/register" className="text-gray-400 hover:text-white transition-colors duration-300 text-sm lg:text-base">Register</Link>
            </div>
            
            <div className="text-gray-400 text-center lg:text-right text-sm lg:text-base">
              <p>© 2024 SecureDrop.AI</p>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default AdminLogin;
