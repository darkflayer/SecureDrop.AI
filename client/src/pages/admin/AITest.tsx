import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { io, Socket } from 'socket.io-client';
import { API_URL } from '../../config';
import { 
  HomeIcon, 
  DocumentTextIcon, 
  ChartBarIcon, 
  CogIcon, 
  QuestionMarkCircleIcon,
  BeakerIcon,
  WifiIcon,
  XMarkIcon
} from '@heroicons/react/24/outline';
import FinalsLogo from '../../components/FinalsLogo';

const AITest: React.FC = () => {
  const navigate = useNavigate();
  const [socket, setSocket] = useState<Socket | null>(null);
  const [connectionStatus, setConnectionStatus] = useState<'disconnected' | 'connecting' | 'connected' | 'error'>('disconnected');
  const [logs, setLogs] = useState<string[]>([]);
  const [testMessage, setTestMessage] = useState('');
  const [aiTestText, setAiTestText] = useState('');
  const [aiResult, setAiResult] = useState<any>(null);
  const [testing, setTesting] = useState(false);

  const addLog = (message: string) => {
    setLogs(prev => [...prev, `${new Date().toLocaleTimeString()}: ${message}`]);
  };

  useEffect(() => {
    // Check authentication
    const token = localStorage.getItem('adminToken');
    if (!token) {
      navigate('/admin/login');
      return;
    }

    // Initialize Socket.IO connection
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

    // Connection events
    newSocket.on('connect', () => {
      setConnectionStatus('connected');
      addLog('✅ Connected to Socket.IO server');
      addLog(`🔌 Socket ID: ${newSocket.id}`);
      addLog(`🌐 Server URL: ${API_URL}`);
    });

    newSocket.on('connect_error', (error) => {
      setConnectionStatus('error');
      addLog(`❌ Connection error: ${error.message}`);
    });

    newSocket.on('disconnect', (reason) => {
      setConnectionStatus('disconnected');
      addLog(`🔌 Disconnected: ${reason}`);
    });

    newSocket.on('reconnect', (attemptNumber) => {
      setConnectionStatus('connected');
      addLog(`✅ Reconnected after ${attemptNumber} attempts`);
    });

    newSocket.on('reconnect_attempt', (attemptNumber) => {
      setConnectionStatus('connecting');
      addLog(`🔄 Reconnection attempt ${attemptNumber}`);
    });

    newSocket.on('reconnect_failed', () => {
      setConnectionStatus('error');
      addLog('❌ Reconnection failed');
    });

    // Test room join
    newSocket.on('admin-joined', (data) => {
      if (data.success) {
        addLog(`✅ Admin joined room: ${data.room}`);
      } else {
        addLog(`❌ Failed to join admin room: ${data.error}`);
      }
    });

    newSocket.on('complaint-joined', (data) => {
      if (data.success) {
        addLog(`✅ Joined complaint room: ${data.room}`);
      } else {
        addLog(`❌ Failed to join complaint room: ${data.error}`);
      }
    });

    // Test ping-pong
    newSocket.on('pong', () => {
      addLog('🏓 Received pong from server');
    });

    return () => {
      newSocket.disconnect();
      setSocket(null);
    };
  }, [navigate]);

  const testSocketConnection = () => {
    if (!socket) return;

    addLog('🧪 Testing Socket.IO connection...');
    
    // Test room joins
    socket.emit('join-admin', 'test-org');
    socket.emit('join-complaint', 'test-complaint');
    
    // Test ping
    socket.emit('ping');
    
    // Test custom event
    socket.emit('test-event', { message: 'Hello from client', timestamp: Date.now() });
  };

  const testAI = async () => {
    if (!aiTestText.trim()) return;

    setTesting(true);
    addLog('🤖 Testing AI analysis...');

    try {
      const token = localStorage.getItem('adminToken');
      const response = await fetch(`${API_URL}/api/admin/ai-test`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ text: aiTestText }),
      });

      if (response.ok) {
        const result = await response.json();
        setAiResult(result);
        addLog('✅ AI test successful');
        addLog(`📊 Severity: ${result.aiAnalysis?.severity}`);
        addLog(`⏰ Urgency: ${result.aiAnalysis?.urgency}`);
        addLog(`😊 Sentiment: ${result.aiAnalysis?.sentiment}`);
      } else {
        const error = await response.text();
        addLog(`❌ AI test failed: ${error}`);
      }
    } catch (err) {
      addLog(`❌ AI test error: ${err}`);
    } finally {
      setTesting(false);
    }
  };

  const clearLogs = () => {
    setLogs([]);
  };

  const getConnectionStatusColor = () => {
    switch (connectionStatus) {
      case 'connected': return 'text-green-600';
      case 'connecting': return 'text-yellow-600';
      case 'error': return 'text-red-600';
      default: return 'text-gray-600';
    }
  };

  const getConnectionStatusIcon = () => {
    switch (connectionStatus) {
      case 'connected': return <WifiIcon className="w-5 h-5" />;
      case 'connecting': return <WifiIcon className="w-5 h-5 animate-pulse" />;
      case 'error': return <XMarkIcon className="w-5 h-5" />;
      default: return <XMarkIcon className="w-5 h-5" />;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col md:flex-row">
      {/* Sidebar */}
      <div className="w-full md:w-64 bg-gray-100 shadow-sm flex-shrink-0">
        <div className="p-6">
          <div className="flex items-center">
            <FinalsLogo className="w-8 h-8 mr-2" />
            <span className="text-xl font-semibold text-black">SecureDrop.AI</span>
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
              className="flex items-center px-4 py-2 text-gray-600 hover:bg-gray-200 rounded-lg"
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
            <Link
              to="/admin/ai-test"
              className="flex items-center px-4 py-2 text-gray-700 bg-gray-200 rounded-lg"
            >
              <BeakerIcon className="w-5 h-5 mr-3" />
              AI Test
            </Link>
          </div>
        </nav>
      </div>

      {/* Main Content */}
      <div className="flex-1 min-w-0">
        {/* Header */}
        <header className="bg-white shadow-sm px-4 sm:px-6 py-4">
          <div className="flex justify-between items-center">
            <h1 className="text-2xl font-bold text-gray-900">AI & Socket.IO Test</h1>
            <div className="flex items-center space-x-4">
              <span className="text-gray-600">Welcome, {localStorage.getItem('adminName') || 'Admin'}</span>
              <button
                onClick={() => navigate('/admin/dashboard')}
                className="text-gray-600 hover:text-gray-900"
              >
                Back to Dashboard
              </button>
            </div>
          </div>
        </header>

        <div className="p-4 sm:p-6">
          {/* Connection Status */}
          <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Socket.IO Connection Status</h2>
            <div className="flex items-center space-x-3 mb-4">
              <span className={`${getConnectionStatusColor()}`}>
                {getConnectionStatusIcon()}
              </span>
              <span className={`font-medium ${getConnectionStatusColor()}`}>
                {connectionStatus.charAt(0).toUpperCase() + connectionStatus.slice(1)}
              </span>
            </div>
            <div className="space-y-2">
              <p className="text-sm text-gray-600">Server URL: {API_URL}</p>
              <p className="text-sm text-gray-600">Socket ID: {socket?.id || 'N/A'}</p>
              <p className="text-sm text-gray-600">Transport: {socket?.io?.engine?.transport?.name || 'N/A'}</p>
            </div>
            <div className="mt-4 space-x-2">
              <button
                onClick={testSocketConnection}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
              >
                Test Connection
              </button>
              <button
                onClick={clearLogs}
                className="px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700"
              >
                Clear Logs
              </button>
            </div>
          </div>

          {/* AI Test */}
          <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">AI Analysis Test</h2>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Test Text
                </label>
                <textarea
                  value={aiTestText}
                  onChange={(e) => setAiTestText(e.target.value)}
                  placeholder="Enter text to test AI analysis..."
                  rows={4}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <button
                onClick={testAI}
                disabled={!aiTestText.trim() || testing}
                className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50"
              >
                {testing ? 'Testing...' : 'Test AI'}
              </button>
            </div>
            {aiResult && (
              <div className="mt-4 p-4 bg-gray-50 rounded-lg">
                <h3 className="font-medium text-gray-900 mb-2">AI Result:</h3>
                <pre className="text-sm text-gray-700 overflow-x-auto">
                  {JSON.stringify(aiResult, null, 2)}
                </pre>
              </div>
            )}
          </div>

          {/* Connection Logs */}
          <div className="bg-white rounded-lg shadow-sm p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Connection Logs</h2>
            <div className="bg-gray-900 text-green-400 p-4 rounded-lg font-mono text-sm max-h-96 overflow-y-auto">
              {logs.length === 0 ? (
                <p className="text-gray-500">No logs yet. Test the connection to see logs.</p>
              ) : (
                logs.map((log, index) => (
                  <div key={index} className="mb-1">{log}</div>
                ))
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AITest;