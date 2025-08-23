import React, { useState } from 'react';
import FinalsLogo from '../components/FinalsLogo';
import DarkModeToggle from '../components/DarkModeToggle';
import { API_URL } from '../config';
import { Link, useNavigate } from 'react-router-dom';
import { MagnifyingGlassIcon, ArrowRightIcon, HomeIcon, SparklesIcon } from '@heroicons/react/24/outline';

const OrganizationSelect: React.FC = () => {
  const navigate = useNavigate();
  const [search, setSearch] = useState('');
  const [results, setResults] = useState<{ name: string; orgCode: string }[]>([]);
  const [selectedOrg, setSelectedOrg] = useState<{ name: string; orgCode: string } | null>(null);
  const [customOrgCode, setCustomOrgCode] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // Fetch organizations as user types
  const handleSearchChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setSearch(value);
    setSelectedOrg(null);
    setCustomOrgCode('');
    setError('');
    if (value.trim().length < 2) {
      setResults([]);
      return;
    }
    setLoading(true);
    try {
      const res = await fetch(`${API_URL}/api/complaint/organizations?search=${encodeURIComponent(value)}`);
      if (res.ok) {
        const data = await res.json();
        setResults(data);
      } else {
        setResults([]);
        setError('No organizations found.');
      }
    } catch (err) {
      setResults([]);
      setError('Error searching organizations.');
    } finally {
      setLoading(false);
    }
  };

  const handleSelect = (org: { name: string; orgCode: string }) => {
    setSelectedOrg(org);
    setSearch(org.name);
    setResults([]);
    setCustomOrgCode('');
    setError('');
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const orgCode = selectedOrg?.orgCode || customOrgCode;
    if (orgCode.trim()) {
      navigate(`/submit/${orgCode.trim()}`);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Premium Header */}
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
          <div className="absolute inset-0 opacity-30">
            <div className="absolute top-20 left-20 w-64 h-64 bg-blue-200 dark:bg-blue-900 rounded-full filter blur-3xl opacity-40"></div>
            <div className="absolute bottom-20 right-20 w-80 h-80 bg-purple-200 dark:bg-purple-900 rounded-full filter blur-3xl opacity-40"></div>
          </div>
        </div>

        <div className="relative z-10 container-premium px-4">
          <div className="max-w-4xl mx-auto">
            {/* Header Content */}
            <div className="text-center mb-12 lg:mb-16 animate-slide-down">
              <h1 className="text-3xl sm:text-4xl lg:text-5xl xl:text-6xl font-bold mb-6 lg:mb-8">
                <span className="text-gray-900 dark:text-white">Find Your</span><br />
                <span className="text-gradient-accent">Organization</span>
              </h1>
              <p className="text-lg sm:text-xl lg:text-2xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto leading-relaxed">
                Search for your organization by name or enter your organization code to submit anonymous feedback.
              </p>
            </div>

            {/* Main Form */}
            <div className="max-w-2xl mx-auto">
              <form onSubmit={handleSubmit} className="space-y-8 animate-slide-up">
                {/* Search Box */}
                <div className="card-premium p-6 lg:p-8">
                  <label htmlFor="orgSearch" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
                    Organization Name
                  </label>
                  <div className="relative">
                    <MagnifyingGlassIcon className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                    <input
                      id="orgSearch"
                      type="text"
                      value={search}
                      onChange={handleSearchChange}
                      placeholder="Type your organization name..."
                      className="w-full pl-12 pr-4 py-4 border border-gray-300 dark:border-gray-600 rounded-xl bg-white/50 dark:bg-gray-800/50 backdrop-blur-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400"
                      autoComplete="off"
                    />
                  </div>
                  
                  {/* Loading State */}
                  {loading && (
                    <div className="mt-3 flex items-center text-blue-600 dark:text-blue-400">
                      <div className="animate-spin rounded-full h-4 w-4 border-2 border-blue-600 border-t-transparent mr-2"></div>
                      Searching organizations...
                    </div>
                  )}

                  {/* Results Dropdown */}
                  {results.length > 0 && (
                    <div className="mt-3 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl shadow-xl max-h-64 overflow-y-auto z-10 relative">
                      {results.map((org, index) => (
                        <button
                          type="button"
                          key={org.orgCode}
                          onClick={() => handleSelect(org)}
                          className={`w-full text-left px-4 py-3 hover:bg-blue-50 dark:hover:bg-gray-700 focus:bg-blue-100 dark:focus:bg-gray-600 transition-colors duration-200 ${
                            index !== results.length - 1 ? 'border-b border-gray-100 dark:border-gray-700' : ''
                          }`}
                        >
                          <span className="font-medium text-gray-900 dark:text-white">{org.name}</span>
                          <span className="ml-2 text-sm text-gray-500 dark:text-gray-400">({org.orgCode})</span>
                        </button>
                      ))}
                    </div>
                  )}

                  {/* Error State */}
                  {error && (
                    <div className="mt-3 text-red-600 dark:text-red-400 text-sm">{error}</div>
                  )}
                </div>

                {/* Divider */}
                <div className="relative">
                  <div className="absolute inset-0 flex items-center">
                    <div className="w-full border-t border-gray-300 dark:border-gray-600"></div>
                  </div>
                  <div className="relative flex justify-center text-sm">
                    <span className="px-4 bg-gray-50 dark:bg-gray-900 text-gray-500 dark:text-gray-400 font-medium">
                      OR
                    </span>
                  </div>
                </div>

                {/* Custom Org Code */}
                <div className="card-premium p-6 lg:p-8">
                  <label htmlFor="customOrgCode" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
                    Organization Code
                  </label>
                  <input
                    type="text"
                    id="customOrgCode"
                    value={customOrgCode}
                    onChange={(e) => {
                      setCustomOrgCode(e.target.value);
                      setSelectedOrg(null);
                      setSearch('');
                      setResults([]);
                      setError('');
                    }}
                    placeholder="Enter organization code directly"
                    className="w-full px-4 py-4 border border-gray-300 dark:border-gray-600 rounded-xl bg-white/50 dark:bg-gray-800/50 backdrop-blur-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400"
                  />
                  <p className="text-sm text-gray-500 dark:text-gray-400 mt-2">
                    If you have a specific organization code, enter it here.
                  </p>
                </div>

                {/* Action Button */}
                <div className="text-center">
                  <button
                    type="submit"
                    disabled={!(selectedOrg || customOrgCode.trim())}
                    className="btn-primary group disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none w-full sm:w-auto"
                  >
                    <span className="flex items-center justify-center">
                      <SparklesIcon className="w-5 h-5 mr-2 group-hover:animate-pulse" />
                      Continue to Submit Feedback
                      <ArrowRightIcon className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
                    </span>
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </section>

      {/* Info Section */}
      <section className="section-padding bg-white dark:bg-gray-800">
        <div className="container-premium px-4">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-12 lg:mb-16">
              <h2 className="heading-secondary">How Organization Codes Work</h2>
              <p className="text-body max-w-3xl mx-auto">
                Understanding how to find and use organization codes for anonymous feedback submission.
              </p>
            </div>

            <div className="grid lg:grid-cols-2 gap-8 lg:gap-12">
              {/* For Users */}
              <div className="card-premium p-6 lg:p-8">
                <div className="w-12 h-12 lg:w-16 lg:h-16 bg-gradient-to-br from-blue-500 to-purple-600 rounded-2xl flex items-center justify-center mb-6">
                  <span className="text-2xl lg:text-3xl">👤</span>
                </div>
                <h3 className="text-xl lg:text-2xl font-bold text-gray-900 dark:text-white mb-4">For Users</h3>
                <ul className="space-y-3 text-body">
                  <li className="flex items-start">
                    <div className="w-2 h-2 bg-blue-500 rounded-full mt-2 mr-3 flex-shrink-0"></div>
                    Search for your organization by name in the search box
                  </li>
                  <li className="flex items-start">
                    <div className="w-2 h-2 bg-purple-500 rounded-full mt-2 mr-3 flex-shrink-0"></div>
                    Or enter a custom organization code if you have one
                  </li>
                  <li className="flex items-start">
                    <div className="w-2 h-2 bg-emerald-500 rounded-full mt-2 mr-3 flex-shrink-0"></div>
                    Submit feedback completely anonymously
                  </li>
                  <li className="flex items-start">
                    <div className="w-2 h-2 bg-orange-500 rounded-full mt-2 mr-3 flex-shrink-0"></div>
                    Track your complaint with the provided unique ID
                  </li>
                </ul>
              </div>

              {/* For Organizations */}
              <div className="card-premium p-6 lg:p-8">
                <div className="w-12 h-12 lg:w-16 lg:h-16 bg-gradient-to-br from-emerald-500 to-teal-600 rounded-2xl flex items-center justify-center mb-6">
                  <span className="text-2xl lg:text-3xl">🏢</span>
                </div>
                <h3 className="text-xl lg:text-2xl font-bold text-gray-900 dark:text-white mb-4">For Organizations</h3>
                <ul className="space-y-3 text-body">
                  <li className="flex items-start">
                    <div className="w-2 h-2 bg-blue-500 rounded-full mt-2 mr-3 flex-shrink-0"></div>
                    Register your organization with SecureDrop.AI
                  </li>
                  <li className="flex items-start">
                    <div className="w-2 h-2 bg-purple-500 rounded-full mt-2 mr-3 flex-shrink-0"></div>
                    Get a unique organization code for your users
                  </li>
                  <li className="flex items-start">
                    <div className="w-2 h-2 bg-emerald-500 rounded-full mt-2 mr-3 flex-shrink-0"></div>
                    Share the code with employees or customers
                  </li>
                  <li className="flex items-start">
                    <div className="w-2 h-2 bg-orange-500 rounded-full mt-2 mr-3 flex-shrink-0"></div>
                    Manage all complaints in your admin dashboard
                  </li>
                </ul>
              </div>
            </div>

            {/* CTA */}
            <div className="text-center mt-12 lg:mt-16">
              <p className="text-body mb-6">
                Don't see your organization? Help them get started with SecureDrop.AI
              </p>
              <Link to="/admin/register" className="btn-secondary">
                Register Organization
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
              <Link to="/admin/login" className="text-gray-400 hover:text-white transition-colors duration-300 text-sm lg:text-base">Admin</Link>
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

export default OrganizationSelect;
