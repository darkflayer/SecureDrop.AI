import React, { useState, useEffect } from 'react';
import FinalsLogo from '../components/FinalsLogo';
import { useParams } from 'react-router-dom';
import { io, Socket } from 'socket.io-client';

interface Message {
  sender: 'user' | 'admin';
  text: string;
  timestamp: string;
  mediaUrl?: string;
  mediaType?: string;
}

interface AiAnalysis {
  severity: string;
  urgency: string;
  sentiment: string;
  emotionalTone?: string;
  riskScore?: number;
  safetyFlags?: string[];
}

interface AiSuggestions {
  replyTemplates?: string[];
  priorityLevel?: string;
  suggestedActions?: string[];
  escalationNeeded?: boolean;
}

interface Complaint {
  complaintId: string;
  message: string;
  category: string;
  status: string;
  adminReply?: string;
  organization: string;
  createdAt: string;
  updatedAt: string;
  hasMedia: boolean;
  mediaUrl?: string;
  aiAnalysis?: AiAnalysis;
  aiSuggestions?: AiSuggestions;
  messages: Message[];
}

const TrackComplaint: React.FC = () => {
  const { complaintId } = useParams<{ complaintId: string }>();
  const [complaint, setComplaint] = useState<Complaint | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [newMessage, setNewMessage] = useState('');
  const [socket, setSocket] = useState<Socket | null>(null);
  const [sending, setSending] = useState(false);

  useEffect(() => {
    // Fetch complaint details
    const fetchComplaint = async () => {
      try {
        const response = await fetch(`http://localhost:5000/api/complaint/track/${complaintId}`);
        if (response.ok) {
          const data = await response.json();
          setComplaint(data);
        } else {
          setError('Complaint not found');
        }
      } catch (err) {
        setError('Failed to load complaint');
      } finally {
        setLoading(false);
      }
    };

    fetchComplaint();

    // Connect to Socket.IO for real-time updates
    const newSocket = io('http://localhost:5000');
    setSocket(newSocket);
    
    // Join complaint room for real-time updates
    newSocket.emit('join-complaint', complaintId);
    
    // Listen for admin replies (legacy support)
    newSocket.on('admin-replied', (data) => {
      setComplaint(prev => prev ? {
        ...prev,
        adminReply: data.reply,
        status: data.status,
        updatedAt: data.updatedAt
      } : null);
    });

    // Listen for admin messages in real-time
    newSocket.on('admin-message', (data) => {
      if (data.complaintId === complaintId) {
        setComplaint(prev => prev ? {
          ...prev,
          messages: [...prev.messages, data.message]
        } : null);
      }
    });

    // Listen for user messages from other sessions (if any)
    newSocket.on('user-message', (data) => {
      if (data.complaintId === complaintId) {
        setComplaint(prev => prev ? {
          ...prev,
          messages: [...prev.messages, data.message]
        } : null);
      }
    });

    return () => {
      newSocket.close();
      setSocket(null);
    };
  }, [complaintId]);

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMessage.trim() || !complaint) return;

    setSending(true);
    try {
      const response = await fetch(`http://localhost:5000/api/complaint/${complaintId}/message`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ text: newMessage }),
      });

      if (response.ok) {
        const result = await response.json();
        setComplaint(prev => prev ? {
          ...prev,
          messages: result.messages
        } : null);
        setNewMessage('');
      } else {
        throw new Error('Failed to send message');
      }
    } catch (err) {
      alert('Failed to send message. Please try again.');
    } finally {
      setSending(false);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Pending': return 'bg-yellow-100 text-yellow-800';
      case 'In Progress': return 'bg-blue-100 text-blue-800';
      case 'Resolved': return 'bg-green-100 text-green-800';
      case 'Closed': return 'bg-gray-100 text-gray-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'Critical': return 'bg-red-100 text-red-800';
      case 'High': return 'bg-orange-100 text-orange-800';
      case 'Medium': return 'bg-yellow-100 text-yellow-800';
      case 'Low': return 'bg-green-100 text-green-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading complaint details...</p>
        </div>
      </div>
    );
  }

  if (error || !complaint) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Complaint Not Found</h1>
          <p className="text-gray-600 mb-4">{error || 'The complaint you are looking for does not exist.'}</p>
          <a href="/" className="text-blue-600 hover:text-blue-700">Return to Home</a>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-2 sm:px-4 lg:px-8">
          <div className="flex flex-col xs:flex-row justify-between items-center py-4 gap-2">
            <div className="flex items-center">
              <FinalsLogo className="w-8 h-8 mr-2" />
              <span className="text-xl font-semibold text-black">SecureDrop.AI</span>
            </div>
            <a href="/" className="text-blue-600 hover:text-blue-700">Back to Home</a>
          </div>
        </div>
      </header>

      <div className="max-w-2xl sm:max-w-3xl md:max-w-4xl mx-auto px-2 sm:px-4 lg:px-8 py-4 sm:py-8">
        {/* Complaint Header */}
        <div className="bg-white rounded-lg shadow-sm p-2 sm:p-4 md:p-6 mb-6">
          <div className="flex justify-between items-start mb-4">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Complaint #{complaint.complaintId}</h1>
              <p className="text-gray-600">Submitted on {new Date(complaint.createdAt).toLocaleDateString()}</p>
            </div>
            <div className="flex space-x-2">
              <span className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(complaint.status)}`}>
                {complaint.status}
              </span>
              {complaint.aiAnalysis?.severity && (
                <span className={`px-3 py-1 rounded-full text-sm font-medium ${getSeverityColor(complaint.aiAnalysis.severity)}`}>
                  {complaint.aiAnalysis.severity} Priority
                </span>
              )}
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
            <div>
              <h3 className="font-semibold text-gray-900 mb-2">Category</h3>
              <p className="text-gray-600">{complaint.category}</p>
            </div>
            <div>
              <h3 className="font-semibold text-gray-900 mb-2">Organization</h3>
              <p className="text-gray-600">{complaint.organization}</p>
            </div>
          </div>
        </div>

        {/* Original Message */}
        <div className="bg-white rounded-lg shadow-sm p-2 sm:p-4 md:p-6 mb-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Original Submission</h2>
          <div className="bg-gray-50 rounded-lg p-4">
            <p className="text-gray-800 whitespace-pre-wrap">{complaint.message}</p>
          </div>
          {complaint.hasMedia && complaint.mediaUrl && (
            <div className="mt-4">
              <img src={complaint.mediaUrl} alt="Attached media" className="max-w-full h-auto rounded-lg" style={{ maxHeight: '300px' }} />
            </div>
          )}
        </div>

        {/* AI Analysis */}
        {complaint.aiAnalysis && (
          <div className="bg-white rounded-lg shadow-sm p-2 sm:p-4 md:p-6 mb-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">AI Analysis</h2>
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
              {complaint.aiAnalysis.riskScore !== undefined && (
                <div>
                  <span className="text-sm text-gray-500">Risk Score</span>
                  <p className="font-medium">{complaint.aiAnalysis.riskScore}</p>
                </div>
              )}
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
            </div>
            {/* Optionally show priorityLevel, suggestedActions, replyTemplates if backend sends them here */}
            {complaint.aiSuggestions?.priorityLevel && (
              <div className="mt-2">
                <span className="text-sm text-gray-500">Priority Level</span>
                <p className="font-medium">{complaint.aiSuggestions.priorityLevel}</p>
              </div>
            )}
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
                <ul className="list-disc ml-5 text-sm">
                  {complaint.aiSuggestions.replyTemplates.map((template, idx) => (
                    <li key={idx}>{template}</li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        )}

        {/* Messages Thread */}
        <div className="bg-white rounded-lg shadow-sm p-2 sm:p-4 md:p-6 mb-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Conversation</h2>
          
          <div className="space-y-4 mb-6 max-h-60 sm:max-h-96 overflow-y-auto" id="messages-container">
            {complaint.messages.map((message, index) => (
              <div key={index} className={`flex ${message.sender === 'user' ? 'justify-end' : 'justify-start'}`}>
                {/* Avatar for mobile */}
                <span className={`inline-block w-6 h-6 rounded-full mr-2 ${message.sender === 'user' ? 'bg-blue-400' : 'bg-gray-300'}`}></span>
                <div className={`max-w-[80vw] sm:max-w-xs lg:max-w-md px-3 py-2 rounded-lg text-sm ${
                  message.sender === 'user' 
                    ? 'bg-blue-600 text-white' 
                    : 'bg-gray-100 text-gray-900'
                }`}>
                  <p className="text-sm">{message.text}</p>
                  <p className={`text-xs mt-1 ${
                    message.sender === 'user' ? 'text-blue-100' : 'text-gray-500'
                  }`}>
                    {new Date(message.timestamp).toLocaleString()}
                  </p>
                </div>
              </div>
            ))}
          </div>

          {/* Send Message Form */}
          <form onSubmit={handleSendMessage} className="flex flex-col xs:flex-row gap-2">
            <input
              type="text"
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
              placeholder="Type your message..."
              className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              disabled={sending}
            />
            <button
              type="submit"
              disabled={!newMessage.trim() || sending}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {sending ? 'Sending...' : 'Send'}
            </button>
          </form>
        </div>

        {/* Admin Reply */}
        {complaint.adminReply && (
          <div className="bg-white rounded-lg shadow-sm p-2 sm:p-4 md:p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Admin Response</h2>
            <div className="bg-blue-50 rounded-lg p-4">
              <p className="text-gray-800">{complaint.adminReply}</p>
              <p className="text-sm text-gray-500 mt-2">
                Last updated: {new Date(complaint.updatedAt).toLocaleString()}
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default TrackComplaint; 