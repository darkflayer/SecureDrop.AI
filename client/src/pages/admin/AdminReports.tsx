import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { API_URL } from '../../config';
import { FaExclamationTriangle, FaCheckCircle, FaSpinner, FaChartBar, FaListAlt } from 'react-icons/fa/';

console.log(FaCheckCircle); // If this logs undefined, the import is wrong.

interface AIAnalysis {
  severity: 'Low' | 'Medium' | 'High' | 'Critical' | string;
}

interface Complaint {
  _id: string;
  subject: string;
  status: 'Open' | 'In Progress' | 'Resolved' | 'Closed' | string;
  aiAnalysis?: AIAnalysis;
  createdAt: string;
}

interface AIInsights {
  topIssues: string[];
  recommendations: string[];
}

interface ReportsData {
  totalComplaints: number;
  urgentCount: number;
  aiInsights?: AIInsights;
  complaints: Complaint[];
}

export default function AdminReports() {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [reports, setReports] = useState<ReportsData | null>(null);
  const [orgInfo, setOrgInfo] = useState({ name: '', orgCode: '' });

  useEffect(() => {
    // Get organization info from localStorage
    const adminData = JSON.parse(localStorage.getItem('adminData') || '{}');
    if (adminData?.organization) {
      setOrgInfo({
        name: adminData.organization.name || 'Your Organization',
        orgCode: adminData.organization.orgCode || 'ORG123'
      });
    }

    // Fetch reports data
    const fetchReports = async () => {
      try {
        const token = localStorage.getItem('adminToken');
        if (!token) {
          throw new Error('Authentication token not found');
        }

        const response = await axios.get(`${API_URL}/api/admin/complaints`, {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });

        setReports(response.data);
        setLoading(false);
      } catch (err) {
        console.error('Error fetching reports:', err);
        setError('Failed to load reports. Please try again later.');
        setLoading(false);
      }
    };

    fetchReports();
  }, []);

  if (loading) {
    return (
      <div className="p-8 flex flex-col items-center justify-center h-64">
        <FaSpinner className="animate-spin text-blue-500 text-4xl mb-4" />
        <p>Loading reports...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-8">
        <div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 mb-6" role="alert">
          <p>{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className='p-8'>
      <div className="mb-8">
        <h1 className='text-2xl font-bold mb-2'>Reports & Analytics</h1>
        <p className="text-gray-600">Analytics and insights for {orgInfo.name} ({orgInfo.orgCode})</p>
      </div>

      {reports ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold">Total Complaints</h2>
              <FaListAlt className="text-blue-500 text-xl" />
            </div>
            <p className="text-3xl font-bold">{reports.totalComplaints || 0}</p>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold">Urgent Complaints</h2>
              <FaExclamationTriangle className="text-orange-500 text-xl" />
            </div>
            <p className="text-3xl font-bold">{reports.urgentCount || 0}</p>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold">AI Insights</h2>
              <FaChartBar className="text-purple-500 text-xl" />
            </div>
            <div>
              {reports.aiInsights?.topIssues && reports.aiInsights.topIssues.length > 0 ? (
                <div>
                  <p className="font-medium mb-2">Top Issues:</p>
                  <ul className="list-disc pl-5">
                    {reports.aiInsights?.topIssues?.slice(0, 3).map((issue: string, index: number) => (
                      <li key={index} className="text-sm">{issue}</li>
                    ))}
                  </ul>
                </div>
              ) : (
                <p className="text-gray-500 italic">No AI insights available yet</p>
              )}
            </div>
          </div>
        </div>
      ) : (
        <div className="bg-gray-100 rounded-lg p-8 text-center">
          <p className="text-gray-600 mb-4">No reports available yet for {orgInfo.name}</p>
          <p className="text-sm">Reports will appear here once you receive complaints</p>
        </div>
      )}

      {reports?.aiInsights?.recommendations && reports.aiInsights.recommendations.length > 0 && (
        <div className="bg-white rounded-lg shadow p-6 mb-8">
          <h2 className="text-lg font-semibold mb-4">AI Recommendations</h2>
          <ul className="space-y-2">
            {reports.aiInsights.recommendations.map((rec: string, index: number) => (
              <li key={index} className="flex items-start">
                <FaCheckCircle className="text-green-500 mt-1 mr-2 flex-shrink-0" />
                <span>{rec}</span>
              </li>
            ))}
          </ul>
        </div>
      )}

      {reports?.complaints && reports.complaints.length > 0 && (
        <div className="bg-white rounded-lg shadow overflow-hidden">
          <h2 className="text-lg font-semibold p-6 border-b">Recent Complaints</h2>
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">ID</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Subject</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Severity</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {reports?.complaints?.slice(0, 5).map((complaint: Complaint) => (
                  <tr key={complaint._id}>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{complaint._id.substring(0, 8)}...</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{complaint.subject}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm">
                      <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full 
                        ${complaint.status === 'Open' ? 'bg-yellow-100 text-yellow-800' : ''}
                        ${complaint.status === 'In Progress' ? 'bg-blue-100 text-blue-800' : ''}
                        ${complaint.status === 'Resolved' ? 'bg-green-100 text-green-800' : ''}
                        ${complaint.status === 'Closed' ? 'bg-gray-100 text-gray-800' : ''}
                      `}>
                        {complaint.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm">
                      <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full 
                        ${complaint.aiAnalysis?.severity === 'Low' ? 'bg-green-100 text-green-800' : ''}
                        ${complaint.aiAnalysis?.severity === 'Medium' ? 'bg-yellow-100 text-yellow-800' : ''}
                        ${complaint.aiAnalysis?.severity === 'High' ? 'bg-orange-100 text-orange-800' : ''}
                        ${complaint.aiAnalysis?.severity === 'Critical' ? 'bg-red-100 text-red-800' : ''}
                      `}>
                        {complaint.aiAnalysis?.severity || 'Unknown'}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {new Date(complaint.createdAt).toLocaleDateString()}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}