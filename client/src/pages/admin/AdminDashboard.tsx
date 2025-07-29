import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { io, Socket } from 'socket.io-client';
import { 
  HomeIcon, 
  DocumentTextIcon, 
  ChartBarIcon, 
  CogIcon, 
  QuestionMarkCircleIcon,
  MagnifyingGlassIcon,
  BeakerIcon
} from '@heroicons/react/24/outline';
import FinalsLogo from '../../components/FinalsLogo';

interface Complaint {
  _id: string;
  message: string;
  category: string;
  aiAnalysis: {
    severity: string;
    urgency: string;
  };
  status: string;
  createdAt: string;
}

const AdminDashboard: React.FC = () => {
  const navigate = useNavigate();
  const [complaints, setComplaints] = useState<Complaint[]>([]);
  const [loading, setLoading] = useState(true);
  const [socket] = useState<Socket | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('');
  const [urgencyFilter, setUrgencyFilter] = useState('');
  const [dateFilter, setDateFilter] = useState('');
  const [adminData, setAdminData] = useState<any>(null);
  const [organizationName, setOrganizationName] = useState('');

  useEffect(() => {
    // Check authentication
    const token = localStorage.getItem('adminToken');
    if (!token) {
      navigate('/admin/login');
      return;
    }

    // Load admin data and organization info
    const storedAdminData = localStorage.getItem('adminData');
    if (storedAdminData) {
      try {
        const parsedAdminData = JSON.parse(storedAdminData);
        setAdminData(parsedAdminData);
        if (parsedAdminData.organization) {
          setOrganizationName(parsedAdminData.organization.name || 'Your Organization');
        }
      } catch (err) {
        console.error('Failed to parse admin data:', err);
      }
    }

    // Fetch complaints
    const fetchComplaints = async () => {
      try {
        const response = await fetch('http://localhost:5000/api/admin/complaints', {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });

        if (response.ok) {
          const data = await response.json();
          setComplaints(data.complaints || []);
        } else if (response.status === 401) {
          localStorage.removeItem('adminToken');
          navigate('/admin/login');
        }
      } catch (err) {
        console.error('Failed to fetch complaints:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchComplaints();

    // Connect to Socket.IO for real-time updates
    const newSocket = io('http://localhost:5000');
    
    // Join admin room (you'll need to get orgId from the admin data)
    newSocket.emit('join-admin', 'demo'); // Replace with actual orgId
    
    newSocket.on('new-complaint', (data) => {
      setComplaints(prev => [data, ...prev]);
    });

    newSocket.on('user-message', (data) => {
      setComplaints(prev => prev.map(complaint => 
        complaint._id === data.complaintId 
          ? { ...complaint, status: 'In Progress' }
          : complaint
      ));
    });

    // Socket is set but not used in this component

    return () => {
      newSocket.close();
    };
  }, [navigate]);

  const handleLogout = () => {
    localStorage.removeItem('adminToken');
    localStorage.removeItem('adminName');
    navigate('/admin/login');
  };



  const getUrgencyColor = (urgency: string) => {
    switch (urgency) {
      case 'Immediate': return 'bg-red-100 text-red-800';
      case '24h': return 'bg-orange-100 text-orange-800';
      case 'Normal': return 'bg-green-100 text-green-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const filteredComplaints = complaints.filter(complaint => {
    const matchesSearch = complaint.message.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = !categoryFilter || complaint.category === categoryFilter;
    const matchesUrgency = !urgencyFilter || complaint.aiAnalysis?.urgency === urgencyFilter;
    return matchesSearch && matchesCategory && matchesUrgency;
  });

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col md:flex-row">
      {/* Sidebar - collapses on mobile */}
      <div className="w-full md:w-64 bg-gray-100 shadow-sm md:block hidden">
        <div className="p-6">
          <div className="flex items-center">
            <FinalsLogo className="w-8 h-8 mr-2" />
            <span className="text-xl font-semibold text-black">SecureDrop.AI</span>
          </div>
        </div>
        <nav className="mt-8">
          <div className="px-4 space-y-2">
            <Link to="/admin/dashboard" className="flex items-center px-4 py-2 text-gray-700 bg-gray-200 rounded-lg">
              <HomeIcon className="w-5 h-5 mr-3" /> Dashboard
            </Link>
            <Link to="/admin/reports" className="flex items-center px-4 py-2 text-gray-600 hover:bg-gray-200 rounded-lg">
              <DocumentTextIcon className="w-5 h-5 mr-3" /> Reports
            </Link>
            <Link to="/admin/analytics" className="flex items-center px-4 py-2 text-gray-600 hover:bg-gray-200 rounded-lg">
              <ChartBarIcon className="w-5 h-5 mr-3" /> Analytics
            </Link>
            <Link to="/admin/settings" className="flex items-center px-4 py-2 text-gray-600 hover:bg-gray-200 rounded-lg">
              <CogIcon className="w-5 h-5 mr-3" /> Settings
            </Link>
            <Link to="/admin/help" className="flex items-center px-4 py-2 text-gray-600 hover:bg-gray-200 rounded-lg">
              <QuestionMarkCircleIcon className="w-5 h-5 mr-3" /> Help
            </Link>
            <Link to="/admin/ai-test" className="flex items-center px-4 py-2 text-gray-600 hover:bg-gray-200 rounded-lg">
              <BeakerIcon className="w-5 h-5 mr-3" /> AI Test
            </Link>
          </div>
        </nav>
      </div>
      {/* Top nav for mobile */}
      <div className="w-full bg-gray-100 shadow-sm md:hidden block">
        <div className="flex items-center justify-between p-4">
          <div className="flex items-center">
            <FinalsLogo className="w-8 h-8 mr-2" />
            <span className="text-xl font-semibold text-black">SecureDrop.AI</span>
          </div>
          <Link to="/admin/settings" className="text-gray-700 px-3 py-2 rounded-md hover:bg-gray-200">Menu</Link>
        </div>
      </div>
      {/* Main Content */}
      <div className="flex-1">
        {/* Header */}
        <header className="bg-white shadow-sm px-4 md:px-6 py-4">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-2 md:gap-0">
            <div>
              <h1 className="text-xl md:text-2xl font-bold text-gray-900">Real-time Report Feed</h1>
              {organizationName && (
                <p className="text-sm text-gray-600 mt-1">
                  <span className="font-medium">{organizationName}</span> Dashboard
                </p>
              )}
            </div>
            <div className="flex items-center space-x-4 mt-2 md:mt-0">
              <span className="text-gray-600 text-sm md:text-base">Welcome, {localStorage.getItem('adminName') || 'Admin'}</span>
              <button onClick={handleLogout} className="text-gray-600 hover:text-gray-900 text-sm md:text-base">Logout</button>
            </div>
          </div>
        </header>
        {/* Search and Filters */}
        <div className="bg-white px-4 md:px-6 py-4 border-b">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1 relative">
              <MagnifyingGlassIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="text"
                placeholder="Search reports..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm md:text-base"
              />
            </div>
            <select
              value={categoryFilter}
              onChange={(e) => setCategoryFilter(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm md:text-base"
            >
              <option value="">Category</option>
              <option value="Security">Security</option>
              <option value="Feedback">Feedback</option>
              <option value="Error">Error</option>
              <option value="Request">Request</option>
              <option value="Performance">Performance</option>
            </select>
            <select
              value={urgencyFilter}
              onChange={(e) => setUrgencyFilter(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm md:text-base"
            >
              <option value="">Urgency</option>
              <option value="Immediate">Immediate</option>
              <option value="24h">24h</option>
              <option value="Normal">Normal</option>
            </select>
            <select
              value={dateFilter}
              onChange={(e) => setDateFilter(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm md:text-base"
            >
              <option value="">Date</option>
              <option value="today">Today</option>
              <option value="week">This Week</option>
              <option value="month">This Month</option>
            </select>
          </div>
        </div>
        {/* Reports Table */}
        <div className="px-2 md:px-6 py-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Incoming Reports</h2>
          <div className="bg-white rounded-lg shadow overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200 text-sm md:text-base">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-2 md:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Title</th>
                  <th className="px-2 md:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Category</th>
                  <th className="px-2 md:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Urgency</th>
                  <th className="px-2 md:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Submitted</th>
                  <th className="px-2 md:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredComplaints.map((complaint, index) => (
                  <tr key={complaint._id} className="hover:bg-gray-50">
                    <td className="px-2 md:px-6 py-4 whitespace-normal md:whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900">
                        Report {index + 1}: {complaint.message.substring(0, 50)}...
                      </div>
                    </td>
                    <td className="px-2 md:px-6 py-4 whitespace-normal md:whitespace-nowrap">
                      <span className="inline-flex px-2 py-1 text-xs font-semibold rounded-full bg-gray-100 text-gray-800">
                        {complaint.category}
                      </span>
                    </td>
                    <td className="px-2 md:px-6 py-4 whitespace-normal md:whitespace-nowrap">
                      <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getUrgencyColor(complaint.aiAnalysis?.urgency || 'Normal')}`}>
                        {complaint.aiAnalysis?.urgency || 'Normal'}
                      </span>
                    </td>
                    <td className="px-2 md:px-6 py-4 whitespace-normal md:whitespace-nowrap text-gray-500">
                      {new Date(complaint.createdAt).toLocaleString()}
                    </td>
                    <td className="px-2 md:px-6 py-4 whitespace-normal md:whitespace-nowrap font-medium">
                      <Link to={`/admin/report/${complaint._id}`} className="text-blue-600 hover:text-blue-900 mr-4">Reply</Link>
                      <button className="text-green-600 hover:text-green-900">Mark as Resolved</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            {filteredComplaints.length === 0 && (
              <div className="text-center py-8 text-gray-500">No reports found matching your criteria.</div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;