import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { CogIcon, KeyIcon, UserIcon, ShieldCheckIcon } from '@heroicons/react/24/outline';
import { API_URL } from '../../config';
import axios from 'axios';


interface AdminProfile {
  name: string;
  email: string;
  organization: {
    name: string;
    orgCode: string;
  };
}

const AdminSettings: React.FC = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('profile');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState({ text: '', type: '' });
  const [profile, setProfile] = useState<AdminProfile | null>(null);
  
  // Profile form state
  const [profileForm, setProfileForm] = useState({
    name: '',
  });
  
  // Password form state
  const [passwordForm, setPasswordForm] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });

  // Organization form state
  const [orgForm, setOrgForm] = useState({
    name: '',
    orgCode: ''
  });

  useEffect(() => {
    // Check authentication
    const token = localStorage.getItem('adminToken');
    if (!token) {
      navigate('/admin/login');
      return;
    }

    // Load admin profile
    const loadProfile = async () => {
      try {
        setLoading(true);
        // Get admin info from login response stored in localStorage
        let adminName = 'Admin';
        let adminEmail = 'admin@example.com';
        let orgName = 'Organization';
        let orgCode = '';
        const adminDataRaw = localStorage.getItem('adminData');
        if (adminDataRaw) {
          try {
            const adminData = JSON.parse(adminDataRaw);
            adminName = adminData.name || adminName;
            adminEmail = adminData.email || adminEmail;
            if (adminData.organization) {
              orgName = adminData.organization.name || orgName;
              orgCode = adminData.organization.orgCode || orgCode;
            }
          } catch (e) {
            // fallback to defaults
          }
        }

        const profileData = {
          name: adminName,
          email: adminEmail,
          organization: {
            name: orgName,
            orgCode: orgCode
          }
        };
        
        setProfile(profileData);
        setProfileForm({
          name: profileData.name,
        });
        setOrgForm({
          name: profileData.organization.name,
          orgCode: profileData.organization.orgCode
        });
      } catch (error) {
        console.error('Failed to load profile:', error);
        setMessage({
          text: 'Failed to load profile. Please try again.',
          type: 'error'
        });
      } finally {
        setLoading(false);
      }
    };

    loadProfile();
  }, [navigate]);

  const handleProfileSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMessage({ text: '', type: '' });

    try {
      const token = localStorage.getItem('adminToken');
      if (!token) {
        throw new Error('Authentication token not found');
      }
      
      const response = await fetch(`${API_URL}/api/admin/profile`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          name: profileForm.name
        })
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.msg || 'Failed to update profile');
      }
      
      const data = await response.json();
      
      // Update local storage with new name
      localStorage.setItem('adminName', profileForm.name);
      
      setProfile(prev => prev ? {
        ...prev,
        name: profileForm.name
      } : null);
      
      setMessage({
        text: data.msg || 'Profile updated successfully!',
        type: 'success'
      });
    } catch (error: any) {
      console.error('Failed to update profile:', error);
      setMessage({
        text: error.message || 'Failed to update profile. Please try again.',
        type: 'error'
      });
    } finally {
      setLoading(false);
    }
  };

  const handlePasswordSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMessage({ text: '', type: '' });

    // Validate passwords
    if (passwordForm.newPassword !== passwordForm.confirmPassword) {
      setMessage({
        text: 'New passwords do not match.',
        type: 'error'
      });
      setLoading(false);
      return;
    }

    try {
      const token = localStorage.getItem('adminToken');
      if (!token) {
        throw new Error('Authentication token not found');
      }
      
      const response = await fetch(`${API_URL}/api/admin/password`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          currentPassword: passwordForm.currentPassword,
          newPassword: passwordForm.newPassword
        })
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.msg || 'Failed to update password');
      }
      
      const data = await response.json();
      
      setPasswordForm({
        currentPassword: '',
        newPassword: '',
        confirmPassword: ''
      });
      
      setMessage({
        text: data.msg || 'Password updated successfully!',
        type: 'success'
      });
    } catch (error: any) {
      console.error('Failed to update password:', error);
      setMessage({
        text: error.message || 'Failed to update password. Please try again.',
        type: 'error'
      });
    } finally {
      setLoading(false);
    }
  };

  const handleProfileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setProfileForm({
      ...profileForm,
      [e.target.name]: e.target.value
    });
  };

  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setPasswordForm({
      ...passwordForm,
      [e.target.name]: e.target.value
    });
  };

  const handleOrgChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setOrgForm({
      ...orgForm,
      [e.target.name]: e.target.value
    });
  };

  const handleOrganizationSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMessage({ text: '', type: '' });

    try {
      const token = localStorage.getItem('token');
      if (!token) {
        throw new Error('Authentication token not found');
      }
      
      const response = await axios.put(
        `${API_URL}/admin/organization`,
        orgForm,
        {
          headers: {
            'Content-Type': 'application/json',
            'x-auth-token': token
          }
        }
      );
      
      // Update local storage with new organization data
      const adminData = JSON.parse(localStorage.getItem('adminData') || '{}');
      const updatedAdminData = {
        ...adminData,
        organization: response.data.organization
      };
      localStorage.setItem('adminData', JSON.stringify(updatedAdminData));
      
      setProfile(prev => prev ? {
        ...prev,
        organization: response.data.organization
      } : null);
      
      setMessage({
        text: response.data.msg || 'Organization updated successfully!',
        type: 'success'
      });
    } catch (error: any) {
      console.error('Failed to update organization:', error);
      setMessage({
        text: error.response?.data?.msg || 'Failed to update organization. Please try again.',
        type: 'error'
      });
    } finally {
      setLoading(false);
    }
  };

  if (loading && !profile) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading settings...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm px-4 sm:px-6 py-4">
        <h1 className="text-xl sm:text-2xl font-bold text-gray-900">Settings</h1>
      </header>

      {/* Main Content */}
      <div className="max-w-3xl md:max-w-7xl mx-auto py-6 px-2 sm:px-6 lg:px-8">
        <div className="flex flex-col md:grid md:grid-cols-4 md:gap-6">
          {/* Sidebar */}
          <div className="md:col-span-1 mb-6 md:mb-0">
            <div className="px-2 sm:px-0">
              <h3 className="text-base sm:text-lg font-medium leading-6 text-gray-900">Settings</h3>
              <p className="mt-1 text-xs sm:text-sm text-gray-600">
                Manage your account and organization settings.  
              </p>
              <nav className="mt-5 space-y-1 flex flex-row md:flex-col gap-2 md:gap-0">
                <button
                  onClick={() => setActiveTab('profile')}
                  className={`flex items-center px-2 sm:px-3 py-2 text-xs sm:text-sm font-medium rounded-md w-full ${activeTab === 'profile' ? 'bg-blue-100 text-blue-700' : 'text-gray-600 hover:bg-gray-50'}`}
                >
                  <UserIcon className="mr-2 sm:mr-3 h-5 w-5" />
                  Profile
                </button>
                <button
                  onClick={() => setActiveTab('security')}
                  className={`flex items-center px-2 sm:px-3 py-2 text-xs sm:text-sm font-medium rounded-md w-full ${activeTab === 'security' ? 'bg-blue-100 text-blue-700' : 'text-gray-600 hover:bg-gray-50'}`}
                >
                  <KeyIcon className="mr-2 sm:mr-3 h-5 w-5" />
                  Security
                </button>
                <button
                  onClick={() => setActiveTab('organization')}
                  className={`flex items-center px-2 sm:px-3 py-2 text-xs sm:text-sm font-medium rounded-md w-full ${activeTab === 'organization' ? 'bg-blue-100 text-blue-700' : 'text-gray-600 hover:bg-gray-50'}`}
                >
                  <ShieldCheckIcon className="mr-2 sm:mr-3 h-5 w-5" />
                  Organization
                </button>
              </nav>
            </div>
          </div>
          {/* Content */}
          <div className="md:mt-0 md:col-span-3">
            <div className="shadow sm:rounded-md sm:overflow-hidden">
              <div className="px-2 sm:px-4 py-5 bg-white space-y-6 sm:p-6">
                {message.text && (
                  <div className={`p-4 rounded-md ${message.type === 'success' ? 'bg-green-50 text-green-700' : 'bg-red-50 text-red-700'}`}>
                    {message.text}
                  </div>
                )}
                {activeTab === 'profile' && (
                  <div>
                    <h3 className="text-lg font-medium leading-6 text-gray-900">Profile Information</h3>
                    <p className="mt-1 text-sm text-gray-500">Update your personal information.</p>
                    
                    <form onSubmit={handleProfileSubmit} className="mt-6 space-y-6">
                      <div>
                        <label htmlFor="name" className="block text-sm font-medium text-gray-700">Name</label>
                        <input
                          type="text"
                          name="name"
                          id="name"
                          value={profileForm.name}
                          onChange={handleProfileChange}
                          className="mt-1 focus:ring-blue-500 focus:border-blue-500 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md"
                          required
                        />
                      </div>
                      
                      <div>
                        <label htmlFor="email" className="block text-sm font-medium text-gray-700">Email</label>
                        <input
                          type="email"
                          name="email"
                          id="email"
                          value={profile?.email}
                          disabled
                          className="mt-1 bg-gray-100 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md"
                        />
                        <p className="mt-1 text-sm text-gray-500">Email cannot be changed.</p>
                      </div>
                      
                      <div className="flex justify-end">
                        <button
                          type="submit"
                          disabled={loading}
                          className="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50"
                        >
                          {loading ? 'Saving...' : 'Save'}
                        </button>
                      </div>
                    </form>
                  </div>
                )}
                
                {activeTab === 'security' && (
                  <div>
                    <h3 className="text-lg font-medium leading-6 text-gray-900">Change Password</h3>
                    <p className="mt-1 text-sm text-gray-500">Ensure your account is using a secure password.</p>
                    
                    <form onSubmit={handlePasswordSubmit} className="mt-6 space-y-6">
                      <div>
                        <label htmlFor="currentPassword" className="block text-sm font-medium text-gray-700">Current Password</label>
                        <input
                          type="password"
                          name="currentPassword"
                          id="currentPassword"
                          value={passwordForm.currentPassword}
                          onChange={handlePasswordChange}
                          className="mt-1 focus:ring-blue-500 focus:border-blue-500 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md"
                          required
                        />
                      </div>
                      
                      <div>
                        <label htmlFor="newPassword" className="block text-sm font-medium text-gray-700">New Password</label>
                        <input
                          type="password"
                          name="newPassword"
                          id="newPassword"
                          value={passwordForm.newPassword}
                          onChange={handlePasswordChange}
                          className="mt-1 focus:ring-blue-500 focus:border-blue-500 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md"
                          required
                        />
                      </div>
                      
                      <div>
                        <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700">Confirm New Password</label>
                        <input
                          type="password"
                          name="confirmPassword"
                          id="confirmPassword"
                          value={passwordForm.confirmPassword}
                          onChange={handlePasswordChange}
                          className="mt-1 focus:ring-blue-500 focus:border-blue-500 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md"
                          required
                        />
                      </div>
                      
                      <div className="flex justify-end">
                        <button
                          type="submit"
                          disabled={loading}
                          className="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50"
                        >
                          {loading ? 'Updating...' : 'Update Password'}
                        </button>
                      </div>
                    </form>
                  </div>
                )}
                
                {activeTab === 'organization' && (
                  <div>
                    <h3 className="text-lg font-medium leading-6 text-gray-900">Organization Information</h3>
                    <p className="mt-1 text-sm text-gray-500">Your organization details.</p>
                    
                    <form onSubmit={handleOrganizationSubmit} className="mt-6 space-y-6">
                      <div>
                        <label htmlFor="orgName" className="block text-sm font-medium text-gray-700">Organization Name</label>
                        <input
                          type="text"
                          name="name"
                          id="orgName"
                          value={orgForm.name}
                          onChange={handleOrgChange}
                          className="mt-1 focus:ring-blue-500 focus:border-blue-500 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md"
                          required
                        />
                      </div>
                      
                      <div>
                        <label htmlFor="orgCode" className="block text-sm font-medium text-gray-700">Organization Code</label>
                        <input
                          type="text"
                          name="orgCode"
                          id="orgCode"
                          value={orgForm.orgCode}
                          onChange={handleOrgChange}
                          className="mt-1 focus:ring-blue-500 focus:border-blue-500 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md"
                          required
                        />
                        <p className="mt-1 text-sm text-gray-500">This code is used by users to submit complaints to your organization.</p>
                      </div>

                      <div className="flex justify-end">
                        <button
                          type="submit"
                          disabled={loading}
                          className="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50"
                        >
                          {loading ? 'Saving...' : 'Save'}
                        </button>
                      </div>
                    </form>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminSettings;