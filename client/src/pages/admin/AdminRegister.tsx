import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import FinalsLogo from '../../components/FinalsLogo';
import DarkModeToggle from '../../components/DarkModeToggle';
import PasswordInput from '../../components/PasswordInput';
import { API_URL } from '../../config';
import { 
  HomeIcon, 
  BuildingOfficeIcon, 
  UserIcon,
  EnvelopeIcon,
  ExclamationCircleIcon,
  CheckCircleIcon,
  SparklesIcon
} from '@heroicons/react/24/outline';

const AdminRegister: React.FC = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    organizationName: '',
    organizationCode: ''
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

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
    setSuccess('');

    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match');
      setLoading(false);
      return;
    }

    if (formData.password.length < 6) {
      setError('Password must be at least 6 characters long');
      setLoading(false);
      return;
    }

    try {
      const response = await fetch(`${API_URL}/api/admin/register`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: formData.name,
          email: formData.email,
          password: formData.password,
          organizationName: formData.organizationName,
          organizationCode: formData.organizationCode
        }),
      });

      if (response.ok) {
        const data = await response.json();
        setSuccess('Registration successful! Redirecting to login...');
        setTimeout(() => {
          navigate('/admin/login');
        }, 2000);
      } else {
        const errorData = await response.json();
        setError(errorData.msg || 'Registration failed');
      }
    } catch (err) {
      setError('Network error. Please try again.');
    } finally {
      setLoading(false);
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
          <div className="max-w-2xl mx-auto">
            {/* Header Content */}
            <div className="text-center mb-8 animate-slide-down">
              <div className="w-16 h-16 bg-gradient-to-br from-emerald-600 to-teal-600 rounded-2xl flex items-center justify-center mx-auto mb-6">
                <BuildingOfficeIcon className="w-8 h-8 text-white" />
              </div>
              <h1 className="text-3xl lg:text-4xl font-bold text-gray-900 dark:text-white mb-4">
                Register Your Organization
              </h1>
              <p className="text-gray-600 dark:text-gray-300">
                Join SecureDrop.AI and start receiving anonymous feedback from your community.
              </p>
            </div>

            {/* Registration Form */}
            <div className="card-premium p-6 lg:p-8 animate-slide-up">
              <form className="space-y-6" onSubmit={handleSubmit}>
                {error && (
                  <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 text-red-700 dark:text-red-400 px-4 py-3 rounded-xl flex items-center">
                    <ExclamationCircleIcon className="w-5 h-5 mr-2 flex-shrink-0" />
                    <span className="text-sm">{error}</span>
                  </div>
                )}

                {success && (
                  <div className="bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 text-green-700 dark:text-green-400 px-4 py-3 rounded-xl flex items-center">
                    <CheckCircleIcon className="w-5 h-5 mr-2 flex-shrink-0" />
                    <span className="text-sm">{success}</span>
                  </div>
                )}

                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <label htmlFor="name" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Full Name
                    </label>
                    <div className="relative">
                      <UserIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                      <input
                        id="name"
                        name="name"
                        type="text"
                        required
                        value={formData.name}
                        onChange={handleInputChange}
                        className="w-full pl-10 pr-4 py-3 border border-gray-300 dark:border-gray-600 rounded-xl bg-white/50 dark:bg-gray-800/50 backdrop-blur-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400"
                        placeholder="John Doe"
                      />
                    </div>
                  </div>

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
                        required
                        value={formData.email}
                        onChange={handleInputChange}
                        className="w-full pl-10 pr-4 py-3 border border-gray-300 dark:border-gray-600 rounded-xl bg-white/50 dark:bg-gray-800/50 backdrop-blur-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400"
                        placeholder="john@company.com"
                      />
                    </div>
                  </div>
                </div>

                <div className="grid md:grid-cols-2 gap-6">
                  <PasswordInput
                    id="password"
                    name="password"
                    value={formData.password}
                    onChange={handleInputChange}
                    placeholder="Create a password"
                    required
                    label="Password"
                  />

                  <PasswordInput
                    id="confirmPassword"
                    name="confirmPassword"
                    value={formData.confirmPassword}
                    onChange={handleInputChange}
                    placeholder="Confirm your password"
                    required
                    label="Confirm Password"
                  />
                </div>

                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <label htmlFor="organizationName" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Organization Name
                    </label>
                    <div className="relative">
                      <BuildingOfficeIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                      <input
                        id="organizationName"
                        name="organizationName"
                        type="text"
                        required
                        value={formData.organizationName}
                        onChange={handleInputChange}
                        className="w-full pl-10 pr-4 py-3 border border-gray-300 dark:border-gray-600 rounded-xl bg-white/50 dark:bg-gray-800/50 backdrop-blur-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400"
                        placeholder="ACME Corporation"
                      />
                    </div>
                  </div>

                  <div>
                    <label htmlFor="organizationCode" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Organization Code
                    </label>
                    <input
                      id="organizationCode"
                      name="organizationCode"
                      type="text"
                      required
                      value={formData.organizationCode}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-xl bg-white/50 dark:bg-gray-800/50 backdrop-blur-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400"
                      placeholder="acme-corp"
                    />
                    <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                      This will be your unique identifier for feedback submission
                    </p>
                  </div>
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
                        Creating Account...
                      </>
                    ) : (
                      <>
                        <SparklesIcon className="w-5 h-5 mr-2" />
                        Create Account
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
                    Already have an account?
                  </span>
                </div>
              </div>

              {/* Login Link */}
              <Link
                to="/admin/login"
                className="w-full btn-secondary group"
              >
                <span className="flex items-center justify-center">
                  <UserIcon className="w-5 h-5 mr-2 group-hover:scale-110 transition-transform" />
                  Sign In to Your Account
                </span>
              </Link>
            </div>
          </div>
        </div>
      </section>

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
              <Link to="/admin/login" className="text-gray-400 hover:text-white transition-colors duration-300 text-sm lg:text-base">Login</Link>
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

export default AdminRegister;
