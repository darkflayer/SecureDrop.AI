import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const AITest: React.FC = () => {
  const navigate = useNavigate();
  const [text, setText] = useState('');
  const [category, setCategory] = useState('Other');
  const [result, setResult] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setResult(null);

    try {
      const response = await fetch('http://localhost:5000/api/admin/test-ai', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ text, category }),
      });

      if (!response.ok) {
        throw new Error('Failed to test AI');
      }

      const data = await response.json();
      setResult(data);
    } catch (err) {
      console.error('AI Test Error:', err);
      setError('Failed to test AI. Please check the server logs.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-2xl font-bold text-gray-900 mb-6">AI API Test</h1>
        
        <div className="bg-white shadow-sm rounded-lg p-6 mb-6">
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label htmlFor="text" className="block text-sm font-medium text-gray-700 mb-1">
                Test Text
              </label>
              <textarea
                id="text"
                value={text}
                onChange={(e) => setText(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                rows={4}
                placeholder="Enter text to analyze with AI..."
                required
              />
            </div>
            
            <div>
              <label htmlFor="category" className="block text-sm font-medium text-gray-700 mb-1">
                Category
              </label>
              <select
                id="category"
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="Other">Other</option>
                <option value="Harassment">Harassment</option>
                <option value="Technical Issue">Technical Issue</option>
                <option value="Academic">Academic</option>
                <option value="Finance">Finance</option>
                <option value="Mental Health">Mental Health</option>
              </select>
            </div>
            
            <div>
              <button
                type="submit"
                disabled={loading}
                className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50"
              >
                {loading ? 'Testing...' : 'Test AI'}
              </button>
            </div>
          </form>
        </div>
        
        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded mb-6">
            {error}
          </div>
        )}
        
        {result && (
          <div className="bg-white shadow-sm rounded-lg p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">AI Analysis Result</h2>
            
            <div className="bg-gray-50 p-4 rounded-md overflow-auto">
              <pre className="text-sm">{JSON.stringify(result, null, 2)}</pre>
            </div>
            
            {result.aiAnalysis && (
              <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="bg-blue-50 p-4 rounded-md">
                  <h3 className="font-medium text-blue-800 mb-2">Severity</h3>
                  <p className="text-blue-900">{result.aiAnalysis.severity}</p>
                </div>
                
                <div className="bg-blue-50 p-4 rounded-md">
                  <h3 className="font-medium text-blue-800 mb-2">Urgency</h3>
                  <p className="text-blue-900">{result.aiAnalysis.urgency}</p>
                </div>
                
                <div className="bg-blue-50 p-4 rounded-md">
                  <h3 className="font-medium text-blue-800 mb-2">Sentiment</h3>
                  <p className="text-blue-900">{result.aiAnalysis.sentiment}</p>
                </div>
                
                <div className="bg-blue-50 p-4 rounded-md">
                  <h3 className="font-medium text-blue-800 mb-2">Risk Score</h3>
                  <p className="text-blue-900">{result.aiAnalysis.riskScore}</p>
                </div>
                
                {result.aiAnalysis.safetyFlags && result.aiAnalysis.safetyFlags.length > 0 && (
                  <div className="bg-red-50 p-4 rounded-md col-span-2">
                    <h3 className="font-medium text-red-800 mb-2">Safety Flags</h3>
                    <ul className="list-disc pl-5 text-red-900">
                      {result.aiAnalysis.safetyFlags.map((flag: string, index: number) => (
                        <li key={index}>{flag}</li>
                      ))}
                    </ul>
                  </div>
                )}
                
                {result.aiAnalysis.suggestedActions && (
                  <div className="bg-green-50 p-4 rounded-md col-span-2">
                    <h3 className="font-medium text-green-800 mb-2">Suggested Actions</h3>
                    <ul className="list-disc pl-5 text-green-900">
                      {result.aiAnalysis.suggestedActions.map((action: string, index: number) => (
                        <li key={index}>{action}</li>
                      ))}
                    </ul>
                  </div>
                )}
                
                {result.aiAnalysis.replyTemplates && (
                  <div className="bg-purple-50 p-4 rounded-md col-span-2">
                    <h3 className="font-medium text-purple-800 mb-2">Reply Templates</h3>
                    <ul className="space-y-2">
                      {result.aiAnalysis.replyTemplates.map((template: string, index: number) => (
                        <li key={index} className="p-2 bg-white rounded border border-purple-200">
                          {template}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            )}
          </div>
        )}
        
        <div className="mt-6">
          <button
            onClick={() => navigate('/admin/dashboard')}
            className="text-blue-600 hover:text-blue-800"
          >
            ← Back to Dashboard
          </button>
        </div>
      </div>
    </div>
  );
};

export default AITest;