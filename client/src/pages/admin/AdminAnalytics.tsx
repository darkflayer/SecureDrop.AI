import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { API_URL } from '../../config';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  ArcElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';
import { Line, Bar, Pie } from 'react-chartjs-2';

// Register ChartJS components
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  ArcElement,
  Title,
  Tooltip,
  Legend
);

interface Complaint {
  _id: string;
  title: string;
  message: string;
  category: string;
  status: string;
  aiAnalysis: {
    severity: number;
    urgency: number;
    riskScore: number;
    suggestedActions?: string[];
  };
  createdAt: string;
}

interface CategoryCount {
  category: string;
  count: number;
}

interface SeverityData {
  severity: number;
  count: number;
}

interface TimelineData {
  date: string;
  count: number;
}

const AdminAnalytics: React.FC = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [complaints, setComplaints] = useState<Complaint[]>([]);
  const [categoryData, setCategoryData] = useState<CategoryCount[]>([]);
  const [severityData, setSeverityData] = useState<SeverityData[]>([]);
  const [timelineData, setTimelineData] = useState<TimelineData[]>([]);
  const [aiInsights, setAiInsights] = useState<string[]>([]);
  const [selectedTimeRange, setSelectedTimeRange] = useState('week');

  useEffect(() => {
    // Check authentication
    const token = localStorage.getItem('adminToken');
    if (!token) {
      navigate('/admin/login');
      return;
    }

    // Fetch complaints
    const fetchComplaints = async () => {
      try {
        setLoading(true);
        const response = await fetch(`${API_URL}/api/admin/complaints`, {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });

        if (!response.ok) {
          throw new Error('Failed to fetch complaints');
        }

        const data = await response.json();
        setComplaints(data.complaints);
        
        // Process data for visualizations
        processData(data.complaints);
        generateAiInsights(data.complaints);
      } catch (err) {
        console.error('Error fetching complaints:', err);
        setError('Failed to load analytics data. Please try again.');
      } finally {
        setLoading(false);
      }
    };

    fetchComplaints();
  }, [navigate]);

  // Process complaint data for visualizations
  const processData = (complaints: Complaint[]) => {
    // Process category data
    const categoryMap = new Map<string, number>();
    complaints.forEach(complaint => {
      const category = complaint.category || 'Uncategorized';
      categoryMap.set(category, (categoryMap.get(category) || 0) + 1);
    });
    
    const categoryDataArray = Array.from(categoryMap.entries()).map(([category, count]) => ({
      category,
      count
    }));
    setCategoryData(categoryDataArray);

    // Process severity data
    const severityMap = new Map<number, number>();
    complaints.forEach(complaint => {
      const severity = complaint.aiAnalysis?.severity || 0;
      const roundedSeverity = Math.round(severity);
      severityMap.set(roundedSeverity, (severityMap.get(roundedSeverity) || 0) + 1);
    });
    
    const severityDataArray = Array.from(severityMap.entries()).map(([severity, count]) => ({
      severity,
      count
    }));
    setSeverityData(severityDataArray);

    // Process timeline data based on selected time range
    processTimelineData(complaints, selectedTimeRange);
  };

  // Process timeline data based on selected time range
  const processTimelineData = (complaints: Complaint[], timeRange: string) => {
    const now = new Date();
    let startDate: Date;
    let dateFormat: Intl.DateTimeFormatOptions;
    
    // Set start date and date format based on time range
    switch (timeRange) {
      case 'week':
        startDate = new Date(now);
        startDate.setDate(now.getDate() - 7);
        dateFormat = { month: 'short', day: 'numeric' };
        break;
      case 'month':
        startDate = new Date(now);
        startDate.setMonth(now.getMonth() - 1);
        dateFormat = { month: 'short', day: 'numeric' };
        break;
      case 'year':
        startDate = new Date(now);
        startDate.setFullYear(now.getFullYear() - 1);
        dateFormat = { month: 'short', year: 'numeric' };
        break;
      default:
        startDate = new Date(now);
        startDate.setDate(now.getDate() - 7);
        dateFormat = { month: 'short', day: 'numeric' };
    }

    // Filter complaints by date range
    const filteredComplaints = complaints.filter(complaint => {
      const complaintDate = new Date(complaint.createdAt);
      return complaintDate >= startDate && complaintDate <= now;
    });

    // Group complaints by date
    const dateMap = new Map<string, number>();
    
    // Initialize all dates in the range
    const dateArray: Date[] = [];
    const currentDate = new Date(startDate);
    
    while (currentDate <= now) {
      dateArray.push(new Date(currentDate));
      
      if (timeRange === 'year') {
        currentDate.setMonth(currentDate.getMonth() + 1);
      } else {
        currentDate.setDate(currentDate.getDate() + 1);
      }
    }
    
    // Initialize the map with all dates in range
    dateArray.forEach(date => {
      const dateStr = date.toLocaleDateString('en-US', dateFormat);
      dateMap.set(dateStr, 0);
    });
    
    // Count complaints by date
    filteredComplaints.forEach(complaint => {
      const complaintDate = new Date(complaint.createdAt);
      const dateStr = complaintDate.toLocaleDateString('en-US', dateFormat);
      dateMap.set(dateStr, (dateMap.get(dateStr) || 0) + 1);
    });
    
    // Convert map to array
    const timelineDataArray = Array.from(dateMap.entries())
      .map(([date, count]) => ({
        date,
        count
      }))
      .sort((a, b) => {
        // Sort by date
        const dateA = new Date(a.date);
        const dateB = new Date(b.date);
        return dateA.getTime() - dateB.getTime();
      });
    
    setTimelineData(timelineDataArray);
  };

  // Generate AI insights based on complaint data
  const generateAiInsights = (complaints: Complaint[]) => {
    // This would ideally call an API endpoint to generate insights
    // For now, we'll generate some mock insights based on the data
    
    const insights: string[] = [];
    
    // Get total number of complaints
    const totalComplaints = complaints.length;
    
    if (totalComplaints === 0) {
      setAiInsights(['No complaints data available for analysis.']);
      return;
    }
    
    // Get most common category
    const categoryMap = new Map<string, number>();
    complaints.forEach(complaint => {
      const category = complaint.category || 'Uncategorized';
      categoryMap.set(category, (categoryMap.get(category) || 0) + 1);
    });
    
    const sortedCategories = Array.from(categoryMap.entries())
      .sort((a, b) => b[1] - a[1]);
    
    if (sortedCategories.length > 0) {
      const [topCategory, topCount] = sortedCategories[0];
      const percentage = Math.round((topCount / totalComplaints) * 100);
      insights.push(`${topCategory} is the most common complaint category (${percentage}% of all complaints).`);
    }
    
    // Get average severity
    const totalSeverity = complaints.reduce((sum, complaint) => {
      return sum + (complaint.aiAnalysis?.severity || 0);
    }, 0);
    
    const avgSeverity = totalSeverity / totalComplaints;
    insights.push(`Average complaint severity is ${avgSeverity.toFixed(1)} out of 10.`);
    
    // Get high urgency complaints
    const highUrgencyComplaints = complaints.filter(complaint => 
      (complaint.aiAnalysis?.urgency || 0) >= 8
    );
    
    if (highUrgencyComplaints.length > 0) {
      const percentage = Math.round((highUrgencyComplaints.length / totalComplaints) * 100);
      insights.push(`${highUrgencyComplaints.length} complaints (${percentage}%) are marked as high urgency and require immediate attention.`);
    }
    
    // Get trend insight
    const last30Days = new Date();
    last30Days.setDate(last30Days.getDate() - 30);
    
    const last30DaysComplaints = complaints.filter(complaint => 
      new Date(complaint.createdAt) >= last30Days
    );
    
    const last60Days = new Date();
    last60Days.setDate(last60Days.getDate() - 60);
    
    const previous30DaysComplaints = complaints.filter(complaint => 
      new Date(complaint.createdAt) >= last60Days && new Date(complaint.createdAt) < last30Days
    );
    
    if (last30DaysComplaints.length > 0 && previous30DaysComplaints.length > 0) {
      const percentageChange = Math.round(
        ((last30DaysComplaints.length - previous30DaysComplaints.length) / previous30DaysComplaints.length) * 100
      );
      
      if (percentageChange > 0) {
        insights.push(`Complaints have increased by ${percentageChange}% in the last 30 days compared to the previous period.`);
      } else if (percentageChange < 0) {
        insights.push(`Complaints have decreased by ${Math.abs(percentageChange)}% in the last 30 days compared to the previous period.`);
      } else {
        insights.push(`Complaint volume has remained stable over the last 60 days.`);
      }
    }
    
    // Add recommendation based on data
    if (sortedCategories.length > 0) {
      const [topCategory] = sortedCategories[0];
      insights.push(`Recommendation: Focus on addressing ${topCategory} issues to improve overall satisfaction.`);
    }
    
    setAiInsights(insights);
  };

  // Handle time range change
  const handleTimeRangeChange = (range: string) => {
    setSelectedTimeRange(range);
    processTimelineData(complaints, range);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading analytics data...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="bg-red-100 text-red-700 p-4 rounded-md">{error}</div>
          <button
            onClick={() => window.location.reload()}
            className="mt-4 inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm px-6 py-4">
        <h1 className="text-2xl font-bold text-gray-900">Analytics Dashboard</h1>
      </header>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        {/* AI Insights Section */}
        <div className="bg-white shadow rounded-lg mb-6">
          <div className="px-4 py-5 sm:p-6">
            <h2 className="text-lg font-medium text-gray-900 mb-4">AI-Powered Insights</h2>
            <div className="bg-blue-50 p-4 rounded-md">
              <ul className="space-y-2">
                {aiInsights.map((insight, index) => (
                  <li key={index} className="flex">
                    <svg className="h-6 w-6 text-blue-600 mr-2" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    <span>{insight}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>

        {/* Time Range Selector */}
        <div className="bg-white shadow rounded-lg mb-6">
          <div className="px-4 py-5 sm:p-6">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-medium text-gray-900">Complaint Timeline</h2>
              <div className="flex space-x-2">
                <button
                  onClick={() => handleTimeRangeChange('week')}
                  className={`px-3 py-1 text-sm rounded-md ${selectedTimeRange === 'week' ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-700 hover:bg-gray-300'}`}
                >
                  Week
                </button>
                <button
                  onClick={() => handleTimeRangeChange('month')}
                  className={`px-3 py-1 text-sm rounded-md ${selectedTimeRange === 'month' ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-700 hover:bg-gray-300'}`}
                >
                  Month
                </button>
                <button
                  onClick={() => handleTimeRangeChange('year')}
                  className={`px-3 py-1 text-sm rounded-md ${selectedTimeRange === 'year' ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-700 hover:bg-gray-300'}`}
                >
                  Year
                </button>
              </div>
            </div>
            <div className="mt-4 h-64">
              {timelineData.length > 0 ? (
                <Line
                  data={{
                    labels: timelineData.map(item => item.date),
                    datasets: [
                      {
                        label: 'Complaints',
                        data: timelineData.map(item => item.count),
                        borderColor: 'rgb(59, 130, 246)',
                        backgroundColor: 'rgba(59, 130, 246, 0.5)',
                        tension: 0.2,
                      },
                    ],
                  }}
                  options={{
                    responsive: true,
                    maintainAspectRatio: false,
                    scales: {
                      y: {
                        beginAtZero: true,
                        ticks: {
                          precision: 0,
                        },
                      },
                    },
                  }}
                />
              ) : (
                <div className="h-full flex items-center justify-center">
                  <p className="text-gray-500">No timeline data available</p>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Charts Grid */}
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
          {/* Category Distribution */}
          <div className="bg-white shadow rounded-lg">
            <div className="px-4 py-5 sm:p-6">
              <h2 className="text-lg font-medium text-gray-900 mb-4">Complaint Categories</h2>
              <div className="h-64">
                {categoryData.length > 0 ? (
                  <Bar
                    data={{
                      labels: categoryData.map(item => item.category),
                      datasets: [
                        {
                          label: 'Number of Complaints',
                          data: categoryData.map(item => item.count),
                          backgroundColor: 'rgba(59, 130, 246, 0.5)',
                          borderColor: 'rgb(59, 130, 246)',
                          borderWidth: 1,
                        },
                      ],
                    }}
                    options={{
                      responsive: true,
                      maintainAspectRatio: false,
                      scales: {
                        y: {
                          beginAtZero: true,
                          ticks: {
                            precision: 0,
                          },
                        },
                      },
                    }}
                  />
                ) : (
                  <div className="h-full flex items-center justify-center">
                    <p className="text-gray-500">No category data available</p>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Severity Distribution */}
          <div className="bg-white shadow rounded-lg">
            <div className="px-4 py-5 sm:p-6">
              <h2 className="text-lg font-medium text-gray-900 mb-4">Complaint Severity</h2>
              <div className="h-64">
                {severityData.length > 0 ? (
                  <Pie
                    data={{
                      labels: severityData.map(item => `Level ${item.severity}`),
                      datasets: [
                        {
                          data: severityData.map(item => item.count),
                          backgroundColor: [
                            'rgba(54, 162, 235, 0.5)',
                            'rgba(75, 192, 192, 0.5)',
                            'rgba(255, 206, 86, 0.5)',
                            'rgba(255, 159, 64, 0.5)',
                            'rgba(255, 99, 132, 0.5)',
                            'rgba(153, 102, 255, 0.5)',
                            'rgba(201, 203, 207, 0.5)',
                            'rgba(255, 99, 71, 0.5)',
                            'rgba(50, 205, 50, 0.5)',
                            'rgba(138, 43, 226, 0.5)',
                          ],
                          borderColor: [
                            'rgb(54, 162, 235)',
                            'rgb(75, 192, 192)',
                            'rgb(255, 206, 86)',
                            'rgb(255, 159, 64)',
                            'rgb(255, 99, 132)',
                            'rgb(153, 102, 255)',
                            'rgb(201, 203, 207)',
                            'rgb(255, 99, 71)',
                            'rgb(50, 205, 50)',
                            'rgb(138, 43, 226)',
                          ],
                          borderWidth: 1,
                        },
                      ],
                    }}
                    options={{
                      responsive: true,
                      maintainAspectRatio: false,
                    }}
                  />
                ) : (
                  <div className="h-full flex items-center justify-center">
                    <p className="text-gray-500">No severity data available</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Summary Stats */}
        <div className="mt-6 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {/* Total Complaints */}
          <div className="bg-white overflow-hidden shadow rounded-lg">
            <div className="px-4 py-5 sm:p-6">
              <div className="flex items-center">
                <div className="flex-shrink-0 bg-blue-500 rounded-md p-3">
                  <svg className="h-6 w-6 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                  </svg>
                </div>
                <div className="ml-5 w-0 flex-1">
                  <dl>
                    <dt className="text-sm font-medium text-gray-500 truncate">Total Complaints</dt>
                    <dd className="flex items-baseline">
                      <div className="text-2xl font-semibold text-gray-900">{complaints.length}</div>
                    </dd>
                  </dl>
                </div>
              </div>
            </div>
          </div>

          {/* Open Complaints */}
          <div className="bg-white overflow-hidden shadow rounded-lg">
            <div className="px-4 py-5 sm:p-6">
              <div className="flex items-center">
                <div className="flex-shrink-0 bg-yellow-500 rounded-md p-3">
                  <svg className="h-6 w-6 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <div className="ml-5 w-0 flex-1">
                  <dl>
                    <dt className="text-sm font-medium text-gray-500 truncate">Open Complaints</dt>
                    <dd className="flex items-baseline">
                      <div className="text-2xl font-semibold text-gray-900">
                        {complaints.filter(c => c.status === 'open' || c.status === 'in-progress').length}
                      </div>
                    </dd>
                  </dl>
                </div>
              </div>
            </div>
          </div>

          {/* Resolved Complaints */}
          <div className="bg-white overflow-hidden shadow rounded-lg">
            <div className="px-4 py-5 sm:p-6">
              <div className="flex items-center">
                <div className="flex-shrink-0 bg-green-500 rounded-md p-3">
                  <svg className="h-6 w-6 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                </div>
                <div className="ml-5 w-0 flex-1">
                  <dl>
                    <dt className="text-sm font-medium text-gray-500 truncate">Resolved Complaints</dt>
                    <dd className="flex items-baseline">
                      <div className="text-2xl font-semibold text-gray-900">
                        {complaints.filter(c => c.status === 'resolved').length}
                      </div>
                    </dd>
                  </dl>
                </div>
              </div>
            </div>
          </div>

          {/* Average Severity */}
          <div className="bg-white overflow-hidden shadow rounded-lg">
            <div className="px-4 py-5 sm:p-6">
              <div className="flex items-center">
                <div className="flex-shrink-0 bg-red-500 rounded-md p-3">
                  <svg className="h-6 w-6 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                  </svg>
                </div>
                <div className="ml-5 w-0 flex-1">
                  <dl>
                    <dt className="text-sm font-medium text-gray-500 truncate">Average Severity</dt>
                    <dd className="flex items-baseline">
                      <div className="text-2xl font-semibold text-gray-900">
                        {complaints.length > 0
                          ? (complaints.reduce((sum, c) => sum + (c.aiAnalysis?.severity || 0), 0) / complaints.length).toFixed(1)
                          : '0.0'}
                      </div>
                    </dd>
                  </dl>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminAnalytics;