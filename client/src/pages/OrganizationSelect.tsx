import React, { useState } from 'react';
import { API_URL } from '../config';
import FinalsLogo from '../components/FinalsLogo';
import { Link, useNavigate } from 'react-router-dom';
import { MagnifyingGlassIcon, ArrowRightIcon } from '@heroicons/react/24/outline';

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
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div className="flex items-center">
              <FinalsLogo className="w-8 h-8 mr-2" />
              <span className="text-xl font-semibold text-black">SecureDrop.AI</span>
            </div>
            <Link to="/" className="text-blue-600 hover:text-blue-700">Back to Home</Link>
          </div>
        </div>
      </header>

      <div className="max-w-xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Find Your Organization</h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Search for your organization by name. If not found, enter your organization code manually.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Search Box */}
          <div>
            <label htmlFor="orgSearch" className="block text-sm font-medium text-gray-700 mb-2">
              Organization Name
            </label>
            <div className="relative">
              <MagnifyingGlassIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                id="orgSearch"
                type="text"
                value={search}
                onChange={handleSearchChange}
                placeholder="Type your organization name..."
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                autoComplete="off"
              />
            </div>
            {/* Results Dropdown */}
            {loading && <div className="mt-2 text-blue-600">Searching...</div>}
            {results.length > 0 && (
              <div className="mt-2 bg-white border border-gray-200 rounded-lg shadow-lg max-h-56 overflow-y-auto z-10 relative">
                {results.map((org) => (
                  <button
                    type="button"
                    key={org.orgCode}
                    onClick={() => handleSelect(org)}
                    className="w-full text-left px-4 py-2 hover:bg-blue-50 focus:bg-blue-100"
                  >
                    <span className="font-medium text-gray-900">{org.name}</span>
                    <span className="ml-2 text-xs text-gray-500">({org.orgCode})</span>
                  </button>
                ))}
              </div>
            )}
            {error && <div className="mt-2 text-red-600">{error}</div>}
          </div>

          {/* Custom Org Code */}
          <div>
            <label htmlFor="customOrgCode" className="block text-sm font-medium text-gray-700 mb-2">
              Or enter organization code
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
              placeholder="Enter organization code"
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <p className="text-sm text-gray-500 mt-1">
              If you have a specific organization code, enter it here.
            </p>
          </div>

          {/* Action Button */}
          <div className="text-center">
            <button
              type="submit"
              disabled={!(selectedOrg || customOrgCode.trim())}
              className="bg-blue-600 text-white px-8 py-3 rounded-lg text-lg font-semibold hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center mx-auto"
            >
              Continue to Submit Feedback
              <ArrowRightIcon className="w-5 h-5 ml-2" />
            </button>
          </div>
        </form>

        {/* Info Section */}
        <div className="mt-12 bg-blue-50 rounded-lg p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-3">How Organization Codes Work</h3>
          <div className="grid md:grid-cols-2 gap-4 text-sm text-gray-600">
            <div>
              <h4 className="font-medium text-gray-900 mb-2">For Users:</h4>
              <ul className="space-y-1">
                <li>• Search for your organization by name</li>
                <li>• Or enter a custom organization code</li>
                <li>• Submit feedback anonymously</li>
                <li>• Track your complaint with the provided ID</li>
              </ul>
            </div>
            <div>
              <h4 className="font-medium text-gray-900 mb-2">For Organizations:</h4>
              <ul className="space-y-1">
                <li>• Register your organization</li>
                <li>• Get a unique organization code</li>
                <li>• Share the code with your users</li>
                <li>• Manage all complaints in your admin dashboard</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OrganizationSelect; 