import React, { useState, useEffect } from 'react';
import FinalsLogo from '../components/FinalsLogo';
import DarkModeToggle from '../components/DarkModeToggle';
import { API_URL } from '../config';
import { useParams, Link } from 'react-router-dom';
import { io, Socket } from 'socket.io-client';
import { 
  HomeIcon, 
  PaperAirplaneIcon,
  ChatBubbleLeftEllipsisIcon,
  DocumentTextIcon,
  ShieldCheckIcon,
  ClockIcon,
  UserIcon,
  ComputerDesktopIcon,
  ExclamationTriangleIcon,
  CheckCircleIcon
} from '@heroicons/react/24/outline';

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
  const messagesContainerRef = React.useRef<HTMLDivElement | null>(null);
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
        const response = await fetch(`${API_URL}/api/complaint/track/${complaintId}`);
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
    const newSocket = io(API_URL, {
      transports: ['websocket', 'polling'],
      timeout: 20000,
      forceNew: true,
      reconnection: true,
      reconnectionAttempts: 5,
      reconnectionDelay: 1000,
      reconnectionDelayMax: 5000,
      autoConnect: true
    });
    setSocket(newSocket);
    
    // Wait for connection before joining rooms
    newSocket.on('connect', () => {
      console.log('🔌 Connected to Socket.IO server');
      
      // Join complaint room for real-time updates
      newSocket.emit('join-complaint', complaintId);
    });
    
    // Handle connection errors
    newSocket.on('connect_error', (error) => {
      console.error('🔌 Socket.IO connection error:', error);
    });
    
    // Handle successful room joins
    newSocket.on('complaint-joined', (data) => {
      if (data.success) {
        console.log('✅ Joined complaint room:', data.room);
      } else {
        console.error('❌ Failed to join complaint room:', data.error);
      }
    });
    
    // Listen for real-time status updates from admin
    newSocket.on('status-updated', (data) => {
      console.log('📊 Status updated:', data);
      if (data.complaintId === complaintId) {
        setComplaint(prev => prev ? { ...prev, status: data.status, updatedAt: data.updatedAt } : null);
        setTimeout(() => {
          if (messagesContainerRef.current) {
            messagesContainerRef.current.scrollTop = messagesContainerRef.current.scrollHeight;
          }
        }, 100);
      }
    });

    // Listen for admin replies (legacy support)
    newSocket.on('admin-replied', (data: any) => {
      console.log('📨 Admin replied:', data);
      setComplaint(prev => {
        if (!prev) return prev;
        if (data.complaintId !== prev.complaintId) return prev;
        return {
          ...prev,
          adminReply: data.reply,
          status: data.status,
          updatedAt: data.updatedAt
        };
      });
    });

    // Listen for admin messages in real-time
    newSocket.on('admin-message', (data: any) => {
      console.log('📨 Admin message received:', data);
      setComplaint(prev => {
        if (!prev) return prev;
        if (data.complaintId !== prev.complaintId) return prev;
        return {
          ...prev,
          messages: [...prev.messages, data.message]
        };
      });
      setTimeout(() => {
        if (messagesContainerRef.current) {
          messagesContainerRef.current.scrollTop = messagesContainerRef.current.scrollHeight;
        }
      }, 100);
    });

    // Listen for user messages from other sessions (if any)
    newSocket.on('user-message', (data: any) => {
      console.log('📨 User message received:', data);
      setComplaint(prev => {
        if (!prev) return prev;
        if (data.complaintId !== prev.complaintId) return prev;
        return {
          ...prev,
          messages: [...prev.messages, data.message]
        };
      });
      setTimeout(() => {
        if (messagesContainerRef.current) {
          messagesContainerRef.current.scrollTop = messagesContainerRef.current.scrollHeight;
        }
      }, 100);
    });

    // Handle reconnection
    newSocket.on('reconnect', (attemptNumber) => {
      console.log('✅ Reconnected to Socket.IO server after', attemptNumber, 'attempts');
      // Rejoin complaint room after reconnection
      newSocket.emit('join-complaint', complaintId);
    });

    // Handle disconnection
    newSocket.on('disconnect', (reason) => {
      console.log('🔌 Disconnected from Socket.IO server:', reason);
    });

    // Test connection health
    const pingInterval = setInterval(() => {
      if (newSocket.connected) {
        newSocket.emit('ping');
      }
    }, 30000); // Ping every 30 seconds

    return () => {
      clearInterval(pingInterval);
      newSocket.close();
      setSocket(null);
    };
  }, [complaintId]);

  const handleSendMessage = async (e: React.FormEvent) => {
    // After sending, scroll to bottom
    setTimeout(() => {
      if (messagesContainerRef.current) {
        messagesContainerRef.current.scrollTop = messagesContainerRef.current.scrollHeight;
      }
    }, 100);
    e.preventDefault();
    if (!newMessage.trim() || !complaint) return;

    setSending(true);
    try {
      const response = await fetch(`${API_URL}/api/complaint/${complaintId}/message`, {
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
      case 'Pending': return 'from-yellow-500 to-orange-500';
      case 'In Progress': return 'from-blue-500 to-purple-600';
      case 'Resolved': return 'from-green-500 to-emerald-600';
      case 'Closed': return 'from-gray-500 to-gray-600';
      default: return 'from-gray-400 to-gray-500';
    }
  };

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'Critical': return 'from-red-500 to-pink-600';
      case 'High': return 'from-orange-500 to-red-500';
      case 'Medium': return 'from-yellow-500 to-orange-500';
      case 'Low': return 'from-green-500 to-emerald-600';
      default: return 'from-gray-400 to-gray-500';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'Pending': return ClockIcon;
      case 'In Progress': return UserIcon;
      case 'Resolved': return CheckCircleIcon;
      case 'Closed': return DocumentTextIcon;
      default: return ClockIcon;
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
        <div className="text-center animate-pulse">
          <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-purple-600 rounded-2xl flex items-center justify-center mx-auto mb-6">
            <div className="animate-spin rounded-full h-8 w-8 border-2 border-white border-t-transparent"></div>
          </div>
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">Loading Complaint</h2>
          <p className="text-gray-600 dark:text-gray-400">Fetching your complaint details...</p>
        </div>
      </div>
    );
  }

  if (error || !complaint) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
        <div className="text-center max-w-md mx-auto px-4">
          <div className="w-16 h-16 bg-gradient-to-br from-red-500 to-pink-600 rounded-2xl flex items-center justify-center mx-auto mb-6">
            <ExclamationTriangleIcon className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-2xl lg:text-3xl font-bold text-gray-900 dark:text-white mb-4">Complaint Not Found</h1>
          <p className="text-gray-600 dark:text-gray-400 mb-6">
            {error || 'The complaint you are looking for does not exist or has been removed.'}
          </p>
          <Link to="/" className="btn-primary">
            <HomeIcon className="w-5 h-5 mr-2" />
            Return to Home
          </Link>
        </div>
      </div>
    );
  }

  const StatusIcon = getStatusIcon(complaint.status);

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

      <div className="container-premium px-4 py-8">
        <div className="max-w-5xl mx-auto space-y-8">
          {/* Complaint Header */}
          <div className="card-premium p-6 lg:p-8 animate-slide-down">
            <div className="flex flex-col lg:flex-row lg:justify-between lg:items-start gap-6">
              <div className="flex-1">
                <h1 className="text-2xl lg:text-3xl font-bold text-gray-900 dark:text-white mb-2">
                  Complaint #{complaint.complaintId}
                </h1>
                <p className="text-gray-600 dark:text-gray-400 mb-4">
                  Submitted on {new Date(complaint.createdAt).toLocaleDateString('en-US', {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric',
                    hour: '2-digit',
                    minute: '2-digit'
                  })}
                </p>
                
                <div className="grid sm:grid-cols-2 gap-4">
                  <div>
                    <span className="text-sm font-medium text-gray-500 dark:text-gray-400">Category</span>
                    <p className="text-gray-900 dark:text-white font-medium">{complaint.category}</p>
                  </div>
                  <div>
                    <span className="text-sm font-medium text-gray-500 dark:text-gray-400">Organization</span>
                    <p className="text-gray-900 dark:text-white font-medium">{complaint.organization}</p>
                  </div>
                </div>
              </div>
              
              <div className="flex flex-col sm:flex-row gap-3">
                <div className={`bg-gradient-to-r ${getStatusColor(complaint.status)} text-white px-4 py-2 rounded-xl flex items-center space-x-2 shadow-lg`}>
                  <StatusIcon className="w-5 h-5" />
                  <span className="font-medium">{complaint.status}</span>
                </div>
                {complaint.aiAnalysis?.severity && (
                  <div className={`bg-gradient-to-r ${getSeverityColor(complaint.aiAnalysis.severity)} text-white px-4 py-2 rounded-xl flex items-center space-x-2 shadow-lg`}>
                    <ExclamationTriangleIcon className="w-5 h-5" />
                    <span className="font-medium">{complaint.aiAnalysis.severity}</span>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Original Message */}
          <div className="card-premium p-6 lg:p-8 animate-slide-up">
            <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4 flex items-center">
              <DocumentTextIcon className="w-6 h-6 mr-2 text-blue-600 dark:text-blue-400" />
              Original Submission
            </h2>
            <div className="bg-gray-50 dark:bg-gray-800 rounded-xl p-6">
              <p className="text-gray-800 dark:text-gray-200 whitespace-pre-wrap leading-relaxed">
                {complaint.message}
              </p>
            </div>
            {complaint.hasMedia && complaint.mediaUrl && (
              <div className="mt-6">
                <h3 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">Attached Media:</h3>
                <div className="rounded-xl overflow-hidden shadow-lg max-w-md">
                  <img 
                    src={complaint.mediaUrl} 
                    alt="Attached media" 
                    className="w-full h-auto"
                  />
                </div>
              </div>
            )}
          </div>

          {/* AI Analysis */}
          {complaint.aiAnalysis && (
            <div className="card-premium p-6 lg:p-8 animate-fade-in">
              <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-6 flex items-center">
                <ComputerDesktopIcon className="w-6 h-6 mr-2 text-purple-600 dark:text-purple-400" />
                AI Analysis
              </h2>
              <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {[
                  { label: 'Severity', value: complaint.aiAnalysis.severity, icon: '🔥' },
                  { label: 'Urgency', value: complaint.aiAnalysis.urgency, icon: '⚡' },
                  { label: 'Sentiment', value: complaint.aiAnalysis.sentiment, icon: '😊' },
                  ...(complaint.aiAnalysis.emotionalTone ? [{ label: 'Emotional Tone', value: complaint.aiAnalysis.emotionalTone, icon: '🎭' }] : []),
                  ...(complaint.aiAnalysis.riskScore !== undefined ? [{ label: 'Risk Score', value: complaint.aiAnalysis.riskScore.toString(), icon: '📊' }] : [])
                ].map((item, index) => (
                  <div key={index} className="bg-gray-50 dark:bg-gray-800 rounded-xl p-4">
                    <div className="flex items-center mb-2">
                      <span className="text-lg mr-2">{item.icon}</span>
                      <span className="text-sm font-medium text-gray-500 dark:text-gray-400">{item.label}</span>
                    </div>
                    <p className="font-semibold text-gray-900 dark:text-white">{item.value}</p>
                  </div>
                ))}
              </div>
              
              {complaint.aiAnalysis.safetyFlags && complaint.aiAnalysis.safetyFlags.length > 0 && (
                <div className="mt-6 bg-orange-50 dark:bg-orange-900/20 rounded-xl p-4">
                  <h4 className="font-medium text-orange-800 dark:text-orange-300 mb-2">Safety Flags:</h4>
                  <ul className="space-y-1">
                    {complaint.aiAnalysis.safetyFlags.map((flag, idx) => (
                      <li key={idx} className="text-orange-700 dark:text-orange-400 text-sm flex items-center">
                        <span className="w-2 h-2 bg-orange-500 rounded-full mr-2"></span>
                        {flag}
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          )}

          {/* Messages Thread */}
          <div className="card-premium p-6 lg:p-8 animate-scale-in">
            <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-6 flex items-center">
              <ChatBubbleLeftEllipsisIcon className="w-6 h-6 mr-2 text-green-600 dark:text-green-400" />
              Live Conversation
              {socket?.connected && (
                <span className="ml-3 flex items-center text-sm text-green-600 dark:text-green-400">
                  <span className="w-2 h-2 bg-green-500 rounded-full mr-1 animate-pulse"></span>
                  Connected
                </span>
              )}
            </h2>
            
            <div 
              className="space-y-4 mb-6 max-h-96 overflow-y-auto border border-gray-200 dark:border-gray-700 rounded-xl p-4 bg-gray-50 dark:bg-gray-800/50" 
              ref={messagesContainerRef}
            >
              {complaint.messages.length === 0 ? (
                <div className="text-center py-8 text-gray-500 dark:text-gray-400">
                  <ChatBubbleLeftEllipsisIcon className="w-8 h-8 mx-auto mb-2 opacity-50" />
                  <p>No messages yet. Start a conversation!</p>
                </div>
              ) : (
                complaint.messages.map((message, index) => (
                  <div key={index} className={`flex ${message.sender === 'user' ? 'justify-end' : 'justify-start'}`}>
                    <div className={`max-w-xs lg:max-w-md px-4 py-3 rounded-2xl shadow-sm ${
                      message.sender === 'user' 
                        ? 'bg-gradient-to-r from-blue-600 to-purple-600 text-white' 
                        : 'bg-white dark:bg-gray-700 text-gray-900 dark:text-white border border-gray-200 dark:border-gray-600'
                    }`}>
                      <p className="text-sm leading-relaxed">{message.text}</p>
                      <p className={`text-xs mt-2 ${
                        message.sender === 'user' ? 'text-blue-100' : 'text-gray-500 dark:text-gray-400'
                      }`}>
                        {new Date(message.timestamp).toLocaleString()}
                      </p>
                    </div>
                  </div>
                ))
              )}
            </div>

            {/* Send Message Form */}
            <form onSubmit={handleSendMessage} className="flex gap-3">
              <input
                type="text"
                value={newMessage}
                onChange={(e) => setNewMessage(e.target.value)}
                placeholder="Type your message..."
                className="flex-1 px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-xl bg-white/50 dark:bg-gray-800/50 backdrop-blur-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400"
                disabled={sending}
              />
              <button
                type="submit"
                disabled={!newMessage.trim() || sending}
                className="btn-primary disabled:opacity-50 disabled:cursor-not-allowed group"
              >
                {sending ? (
                  <div className="animate-spin rounded-full h-5 w-5 border-2 border-white border-t-transparent"></div>
                ) : (
                  <PaperAirplaneIcon className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                )}
              </button>
            </form>
          </div>

          {/* Admin Reply (Legacy) */}
          {complaint.adminReply && (
            <div className="card-premium p-6 lg:p-8 animate-fade-in">
              <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4 flex items-center">
                <ShieldCheckIcon className="w-6 h-6 mr-2 text-blue-600 dark:text-blue-400" />
                Admin Response
              </h2>
              <div className="bg-blue-50 dark:bg-blue-900/20 rounded-xl p-6">
                <p className="text-gray-800 dark:text-gray-200 leading-relaxed mb-3">
                  {complaint.adminReply}
                </p>
                <p className="text-sm text-blue-600 dark:text-blue-400">
                  Last updated: {new Date(complaint.updatedAt).toLocaleString()}
                </p>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Professional Footer */}
      <footer className="bg-gray-900 dark:bg-black py-8 lg:py-12 mt-16">
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

export default TrackComplaint;
