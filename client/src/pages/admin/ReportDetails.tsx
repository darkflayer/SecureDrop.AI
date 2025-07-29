import React, { useState, useEffect } from 'react';
import FinalsLogo from '../../components/FinalsLogo';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { io, Socket } from 'socket.io-client';
import { 
  HomeIcon, 
  DocumentTextIcon, 
  ChartBarIcon, 
  CogIcon, 
  QuestionMarkCircleIcon,
  ArrowDownTrayIcon
} from '@heroicons/react/24/outline';

interface Complaint {
  _id: string;
  message: string;
  category: string;
  status: string;
  adminReply?: string;
  organization: string;
  createdAt: string;
  updatedAt: string;
  hasMedia: boolean;
  mediaUrl?: string;
  mediaType?: string;
  aiAnalysis?: {
    severity: string;
    urgency: string;
    sentiment: string;
    safetyFlags: string[];
    riskScore: number;
    emotionalTone?: string;
  };
  aiSuggestions?: {
    replyTemplates: string[];
    priorityLevel: string;
    suggestedActions: string[];
    escalationNeeded: boolean;
  };
  messages: Array<{
    sender: 'user' | 'admin';
    text: string;
    timestamp: string;
  }>;
}

const ReportDetails: React.FC = () => {
  const { complaintId } = useParams<{ complaintId: string }>();
  const navigate = useNavigate();
  const [complaint, setComplaint] = useState<Complaint | null>(null);
  const [loading, setLoading] = useState(true);
  const [adminReply, setAdminReply] = useState('');
  const [status, setStatus] = useState('');
  const [sending, setSending] = useState(false);
  const [socket, setSocket] = useState<Socket | null>(null);

  useEffect(() => {
    const token = localStorage.getItem('adminToken');
    if (!token) {
      navigate('/admin/login');
      return;
    }

    const fetchComplaint = async () => {
      try {
        const response = await fetch(`http://localhost:5000/api/admin/complaints/${complaintId}/insights`, {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });

        if (response.ok) {
          const data = await response.json();
          setComplaint(data.complaint);
          setStatus(data.complaint.status);
        } else if (response.status === 401) {
          localStorage.removeItem('adminToken');
          navigate('/admin/login');
        }
      } catch (err) {
        console.error('Failed to fetch complaint:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchComplaint();

    // Setup Socket.IO for real-time updates
    const newSocket = io('http://localhost:5000');
    setSocket(newSocket);
    
    // Join admin room for this organization
    const adminData = JSON.parse(localStorage.getItem('adminData') || '{}');
    const orgId = adminData?.organization?._id || 'demo';
    newSocket.emit('join-admin', orgId);
    
    // Also join the specific complaint room for direct user messages
    newSocket.emit('join-complaint', complaintId);
    
    // Listen for user messages
    newSocket.on('user-message', (data) => {
      if (data.complaintId === complaintId) {
        setComplaint(prev => {
          if (!prev) return prev;
          return {
            ...prev,
            messages: [...prev.messages, data.message]
          };
        });
        // Auto-scroll to bottom
        setTimeout(() => {
          const container = document.getElementById('messages-container');
          if (container) {
            container.scrollTop = container.scrollHeight;
          }
        }, 100);
      }
    });

    // Listen for admin messages (from other admin sessions)
    newSocket.on('admin-message', (data) => {
      if (data.complaintId === complaintId) {
        setComplaint(prev => {
          if (!prev) return prev;
          return {
            ...prev,
            messages: [...prev.messages, data.message]
          };
        });
        // Auto-scroll to bottom
        setTimeout(() => {
          const container = document.getElementById('messages-container');
          if (container) {
            container.scrollTop = container.scrollHeight;
          }
        }, 100);
      }
    });

    return () => {
      newSocket.disconnect();
      setSocket(null);
    };
  }, [complaintId, navigate]);

  const handleStatusUpdate = async () => {
    const token = localStorage.getItem('adminToken');
    if (!token || !complaint) return;

    try {
      const response = await fetch(`http://localhost:5000/api/admin/complaints/${complaintId}/status`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ status }),
      });

      if (response.ok) {
        setComplaint(prev => prev ? { ...prev, status } : null);
      }
    } catch (err) {
      console.error('Failed to update status:', err);
    }
  };

  const handleSendReply = async () => {
    const token = localStorage.getItem('adminToken');
    if (!token || !complaint || !adminReply.trim()) return;

    setSending(true);
    try {
      const response = await fetch(`http://localhost:5000/api/admin/complaints/${complaintId}/message`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ text: adminReply }),
      });

      if (response.ok) {
        const data = await response.json();
        // Update the complaint with the new messages array
        setComplaint(prev => prev ? {
          ...prev,
          messages: data.messages
        } : null);
        setAdminReply('');
        
        // Auto-scroll to bottom after sending message
        setTimeout(() => {
          const container = document.getElementById('messages-container');
          if (container) {
            container.scrollTop = container.scrollHeight;
          }
        }, 100);
      } else {
        throw new Error('Failed to send message');
      }
    } catch (err) {
      console.error('Failed to send message:', err);
      alert('Failed to send message. Please try again.');
    } finally {
      setSending(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('adminToken');
    localStorage.removeItem('adminName');
    navigate('/admin/login');
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading report details...</p>
        </div>
      </div>
    );
  }

  if (!complaint) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Report Not Found</h1>
          <p className="text-gray-600 mb-4">The report you are looking for does not exist.</p>
          <button
            onClick={() => navigate('/admin/dashboard')}
            className="text-blue-600 hover:text-blue-700"
          >
            Back to Dashboard
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col md:flex-row">
      {/* Sidebar */}
      <div className="w-full md:w-64 bg-gray-100 shadow-sm flex-shrink-0">
        <div className="p-6">
          <div className="flex items-center">
            <FinalsLogo className="w-8 h-8 mr-2" />            <span className="text-xl font-semibold text-black">SecureDrop.AI</span>
          </div>
        </div>
        
        <nav className="mt-8">
          <div className="px-4 space-y-2">
            <Link
              to="/admin/dashboard"
              className="flex items-center px-4 py-2 text-gray-600 hover:bg-gray-200 rounded-lg"
            >
              <HomeIcon className="w-5 h-5 mr-3" />
              Dashboard
            </Link>
            <Link
              to="/admin/reports"
              className="flex items-center px-4 py-2 text-gray-700 bg-gray-200 rounded-lg"
            >
              <DocumentTextIcon className="w-5 h-5 mr-3" />
              Reports
            </Link>
            <Link
              to="/admin/analytics"
              className="flex items-center px-4 py-2 text-gray-600 hover:bg-gray-200 rounded-lg"
            >
              <ChartBarIcon className="w-5 h-5 mr-3" />
              Analytics
            </Link>
            <Link
              to="/admin/settings"
              className="flex items-center px-4 py-2 text-gray-600 hover:bg-gray-200 rounded-lg"
            >
              <CogIcon className="w-5 h-5 mr-3" />
              Settings
            </Link>
            <Link
              to="/admin/help"
              className="flex items-center px-4 py-2 text-gray-600 hover:bg-gray-200 rounded-lg"
            >
              <QuestionMarkCircleIcon className="w-5 h-5 mr-3" />
              Help
            </Link>
          </div>
        </nav>
      </div>

      {/* Main Content */}
      <div className="flex-1 min-w-0">
        {/* Header */}
        <header className="bg-white shadow-sm px-4 sm:px-6 py-4">
          <div className="flex justify-between items-center">
            <h1 className="text-2xl font-bold text-gray-900">Report Details</h1>
            <div className="flex items-center space-x-4">
              <span className="text-gray-600">Welcome, {localStorage.getItem('adminName') || 'Admin'}</span>
              <button
                onClick={handleLogout}
                className="text-gray-600 hover:text-gray-900"
              >
                Logout
              </button>
            </div>
          </div>
        </header>

        <div className="flex flex-col lg:flex-row">
          {/* Left Panel */}
          <div className="flex-1 p-2 sm:p-4 md:p-6">
            <div className="mb-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-2">Report Details</h2>
              <p className="text-gray-600">View and manage the details of this report.</p>
            </div>

            {/* Report Information */}
            <div className="bg-white rounded-lg shadow-sm p-2 sm:p-4 md:p-6 mb-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Report Information</h3>
              <div className="space-y-3">
                <div className="border-b border-gray-200 pb-2">
                  <span className="font-medium">Report ID:</span> #{complaint._id}
                </div>
                <div className="border-b border-gray-200 pb-2">
                  <span className="font-medium">Submitted On:</span> {new Date(complaint.createdAt).toLocaleString()}
                </div>
                <div className="border-b border-gray-200 pb-2">
                  <span className="font-medium">Category:</span> {complaint.category}
                </div>
                <div className="pb-2">
                  <span className="font-medium">Urgency:</span> {complaint.aiAnalysis?.urgency || 'Normal'}
                </div>
              </div>
            </div>

            {/* User Submission */}
            <div className="bg-white rounded-lg shadow-sm p-2 sm:p-4 md:p-6 mb-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">User Submission</h3>
              <h4 className="font-medium text-gray-800 mb-2">{complaint.message.split('\n')[0]}</h4>
              <div className="bg-gray-50 rounded-lg p-4">
                <p className="text-gray-800 whitespace-pre-wrap">{complaint.message}</p>
              </div>
              {complaint.mediaUrl && (
                <div className="mt-4">
                  <h4 className="font-medium text-gray-800 mb-2">Attached Media:</h4>
                  {complaint.mediaType === 'video' ? (
                    <video 
                      src={complaint.mediaUrl} 
                      controls 
                      className="max-w-full h-auto rounded-lg"
                      style={{ maxHeight: '400px' }}
                    >
                      Your browser does not support the video tag.
                    </video>
                  ) : (
                    <img 
                      src={complaint.mediaUrl} 
                      alt="Attached media" 
                      className="max-w-full h-auto rounded-lg"
                      style={{ maxHeight: '400px' }}
                    />
                  )}
                </div>
              )}
            </div>

            {/* AI Analysis */}
            {complaint.aiAnalysis && (
  <div className="bg-white rounded-lg shadow-sm p-2 sm:p-4 md:p-6 mb-6">
    <h3 className="text-lg font-semibold text-gray-900 mb-4">AI Analysis</h3>
    <div className="grid md:grid-cols-2 gap-4">
      <div>
        <span className="text-sm text-gray-500">Severity</span>
        <p className="font-medium">{complaint.aiAnalysis.severity}</p>
      </div>
      <div>
        <span className="text-sm text-gray-500">Urgency</span>
        <p className="font-medium">{complaint.aiAnalysis.urgency}</p>
      </div>
      <div>
        <span className="text-sm text-gray-500">Sentiment</span>
        <p className="font-medium">{complaint.aiAnalysis.sentiment}</p>
      </div>
      <div>
        <span className="text-sm text-gray-500">AI Risk Score</span>
        <p className="font-medium">{complaint.aiAnalysis.riskScore}</p>
      </div>
      {complaint.aiAnalysis.emotionalTone && (
        <div>
          <span className="text-sm text-gray-500">Emotional Tone</span>
          <p className="font-medium">{complaint.aiAnalysis.emotionalTone}</p>
        </div>
      )}
      {complaint.aiAnalysis.safetyFlags && complaint.aiAnalysis.safetyFlags.length > 0 && (
        <div>
          <span className="text-sm text-gray-500">Safety Flags</span>
          <ul className="list-disc ml-5 text-sm">
            {complaint.aiAnalysis.safetyFlags.map((flag, idx) => (
              <li key={idx}>{flag}</li>
            ))}
          </ul>
        </div>
      )}
      {complaint.aiSuggestions?.priorityLevel && (
        <div>
          <span className="text-sm text-gray-500">Priority Level</span>
          <p className="font-medium">{complaint.aiSuggestions.priorityLevel}</p>
        </div>
      )}
      {typeof complaint.aiSuggestions?.escalationNeeded === 'boolean' && (
        <div>
          <span className="text-sm text-gray-500">Escalation Needed</span>
          <p className="font-medium">{complaint.aiSuggestions.escalationNeeded ? 'Yes' : 'No'}</p>
        </div>
      )}
    </div>
    {complaint.aiSuggestions?.suggestedActions && complaint.aiSuggestions.suggestedActions.length > 0 && (
      <div className="mt-4">
        <span className="text-sm text-gray-500">Suggested Actions</span>
        <ul className="list-disc ml-5 text-sm">
          {complaint.aiSuggestions.suggestedActions.map((action, idx) => (
            <li key={idx}>{action}</li>
          ))}
        </ul>
      </div>
    )}
    {complaint.aiSuggestions?.replyTemplates && complaint.aiSuggestions.replyTemplates.length > 0 && (
      <div className="mt-4">
        <span className="text-sm text-gray-500 mb-2 block">Reply Templates</span>
        <div className="flex flex-wrap gap-2">
          {complaint.aiSuggestions.replyTemplates.map((template, idx) => (
            <button
              key={idx}
              type="button"
              className="px-3 py-1 bg-blue-100 text-blue-800 rounded-lg text-xs hover:bg-blue-200 border border-blue-200"
              onClick={() => setAdminReply(template)}
            >
              {template}
            </button>
          ))}
        </div>
      </div>
    )}
  </div>
)}

            {/* Conversation */}
            <div className="bg-white rounded-lg shadow-sm p-2 sm:p-4 md:p-6 mb-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Live Conversation</h3>
              
              {/* Messages */}
              <div className="space-y-4 max-h-60 sm:max-h-96 overflow-y-auto mb-4" id="messages-container">
                {complaint.messages && complaint.messages.length > 0 ? (
                  complaint.messages.map((message, index) => (
                    <div key={index} className={`flex ${message.sender === 'admin' ? 'justify-end' : 'justify-start'}`}>
                      <div className={`max-w-xs lg:max-w-md px-4 py-2 rounded-lg shadow-sm ${
                        message.sender === 'admin' 
                          ? 'bg-blue-500 text-white' 
                          : 'bg-gray-100 text-gray-800 border'
                      }`}>
                        <div className="flex items-center mb-1">
                          {/* Show avatar on mobile for user/admin */}
                          <span className={`inline-block w-6 h-6 rounded-full mr-2 ${message.sender === 'admin' ? 'bg-blue-400' : 'bg-gray-300'}`}></span>
                          <span className={`text-xs font-medium ${
                            message.sender === 'admin' ? 'text-blue-100' : 'text-gray-600'
                          }`}>
                            {message.sender === 'admin' ? 'Admin' : 'User'}
                          </span>
                        </div>
                        <p className="text-sm">{message.text}</p>
                        <p className={`text-xs mt-1 ${
                          message.sender === 'admin' ? 'text-blue-100' : 'text-gray-500'
                        }`}>
                          {new Date(message.timestamp).toLocaleString()}
                        </p>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="text-center text-gray-500 py-8">
                    <p>No conversation messages yet.</p>
                    <p className="text-sm">Start the conversation by sending a message below.</p>
                  </div>
                )}
              </div>
              
              {/* Quick Message Input */}
              <div className="border-t pt-4">
                {/* On mobile, stack input and button vertically */}
                <div className="flex flex-col xs:flex-row gap-2">
                  <input
                    type="text"
                    value={adminReply}
                    onChange={(e) => setAdminReply(e.target.value)}
                    placeholder="Type a message..."
                    className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    onKeyPress={(e) => {
                      if (e.key === 'Enter' && !e.shiftKey) {
                        e.preventDefault();
                        handleSendReply();
                      }
                    }}
                    disabled={sending}
                  />
                  <button
                    onClick={handleSendReply}
                    disabled={!adminReply.trim() || sending}
                    className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {sending ? 'Sending...' : 'Send'}
                  </button>
                </div>
                <p className="text-xs text-gray-500 mt-1">Press Enter to send, Shift+Enter for new line</p>
              </div>
            </div>

            {/* Admin Response */}
            <div className="bg-white rounded-lg shadow-sm p-2 sm:p-4 md:p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Admin Response</h3>
              <textarea
                value={adminReply}
                onChange={(e) => setAdminReply(e.target.value)}
                placeholder="Type your response here..."
                rows={6}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>

          {/* Right Sidebar */}
          {/* Right Sidebar: move to bottom on mobile */}
          <div className="w-full md:w-80 p-2 sm:p-4 md:p-6 mt-4 md:mt-0">
            {/* Report Status */}
            <div className="bg-white rounded-lg shadow-sm p-2 sm:p-4 md:p-6 mb-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Report Status</h3>
              <div className="space-y-2 mb-4">
                {['Open', 'In Progress', 'Resolved'].map((statusOption) => (
                  <button
                    key={statusOption}
                    onClick={() => setStatus(statusOption)}
                    className={`w-full text-left px-3 py-2 rounded-lg border ${
                      status === statusOption
                        ? 'bg-green-100 border-green-300 text-green-800'
                        : 'bg-gray-50 border-gray-200 text-gray-700 hover:bg-gray-100'
                    }`}
                  >
                    {statusOption}
                  </button>
                ))}
              </div>
              <button
                onClick={handleStatusUpdate}
                className="w-full bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
              >
                Update Status
              </button>
            </div>

            {/* Actions */}
            <div className="bg-white rounded-lg shadow-sm p-2 sm:p-4 md:p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Actions</h3>
              <button className="flex items-center w-full px-3 py-2 text-gray-700 hover:bg-gray-50 rounded-lg">
                <ArrowDownTrayIcon className="w-5 h-5 mr-2" />
                Download Attachments
              </button>
            </div>
          </div>
        </div>

        {/* Bottom Action Buttons */}
        <div className="bg-white border-t px-2 sm:px-6 py-4">
          <div className="flex flex-col xs:flex-row gap-2 sm:gap-4 justify-end">
            <button
              onClick={() => navigate('/admin/dashboard')}
              className="px-4 py-2 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200"
            >
              Cancel
            </button>
            <button
              onClick={handleSendReply}
              disabled={!adminReply.trim() || sending}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {sending ? 'Sending...' : 'Send Reply'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ReportDetails; 