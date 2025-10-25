"use client";

import { useState } from "react";
import { useUser } from "@clerk/nextjs";

export default function EmailAdminPage() {
  const { user } = useUser();
  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState(null);
  const [testType, setTestType] = useState('basic');

  const runTest = async (endpoint, data = {}) => {
    setLoading(true);
    setResults(null);
    
    try {
      const response = await fetch(endpoint, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });
      
      const result = await response.json();
      setResults({
        success: response.ok,
        status: response.status,
        data: result,
        timestamp: new Date().toISOString()
      });
    } catch (error) {
      setResults({
        success: false,
        error: error.message,
        timestamp: new Date().toISOString()
      });
    } finally {
      setLoading(false);
    }
  };

  const testButtons = [
    {
      id: 'basic',
      label: '📧 Basic Email Test',
      description: 'Test basic email sending functionality',
      endpoint: '/api/test-email',
      color: 'bg-blue-500 hover:bg-blue-600'
    },
    {
      id: 'direct',
      label: '🎯 Direct Resend Test',
      description: 'Test direct Resend API integration',
      endpoint: '/api/direct-email-test',
      color: 'bg-green-500 hover:bg-green-600'
    },
    {
      id: 'debug',
      label: '🔍 Debug Configuration',
      description: 'Check email system configuration',
      endpoint: '/api/debug-email',
      method: 'GET',
      color: 'bg-purple-500 hover:bg-purple-600'
    },
    {
      id: 'monthly',
      label: '📊 Monthly Insights',
      description: 'Send monthly spending insights',
      endpoint: '/api/send-monthly-insights',
      data: { userId: user?.id, userEmail: user?.emailAddresses?.[0]?.emailAddress },
      color: 'bg-orange-500 hover:bg-orange-600'
    },
    {
      id: 'reminders',
      label: '💰 Payment Reminders',
      description: 'Send payment reminder emails',
      endpoint: '/api/send-payment-reminders',
      data: { userId: user?.id, userEmail: user?.emailAddresses?.[0]?.emailAddress },
      color: 'bg-yellow-500 hover:bg-yellow-600'
    },
    {
      id: 'auto-all',
      label: '🤖 Run All Automated Emails',
      description: 'Force run all automated emails for all users',
      endpoint: '/api/automated-emails',
      data: { type: 'all', force: true },
      color: 'bg-red-500 hover:bg-red-600'
    },
    {
      id: 'auto-monthly',
      label: '📅 Monthly Automation Only',
      description: 'Run monthly insights for all users',
      endpoint: '/api/automated-emails',
      data: { type: 'monthly', force: true },
      color: 'bg-indigo-500 hover:bg-indigo-600'
    },
    {
      id: 'auto-daily',
      label: '⏰ Daily Reminders Only',
      description: 'Run payment reminders for all users',
      endpoint: '/api/automated-emails',
      data: { type: 'daily', force: true },
      color: 'bg-pink-500 hover:bg-pink-600'
    }
  ];

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-6xl mx-auto px-4">
        <div className="bg-white rounded-lg shadow-lg p-8 mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">📧 Email System Admin</h1>
          <p className="text-gray-600 mb-6">
            Comprehensive testing and management for Splitely's email system
          </p>
          
          {user && (
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
              <h3 className="font-semibold text-blue-900">Current User</h3>
              <p className="text-blue-700">
                {user.fullName} ({user.emailAddresses?.[0]?.emailAddress})
              </p>
            </div>
          )}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          {testButtons.map((test) => (
            <div key={test.id} className="bg-white rounded-lg shadow-md p-6">
              <h3 className="font-semibold text-gray-900 mb-2">{test.label}</h3>
              <p className="text-gray-600 text-sm mb-4">{test.description}</p>
              <button
                onClick={() => {
                  setTestType(test.id);
                  if (test.method === 'GET') {
                    runTest(test.endpoint);
                  } else {
                    runTest(test.endpoint, test.data || {});
                  }
                }}
                disabled={loading}
                className={`w-full px-4 py-2 text-white font-medium rounded-lg transition-colors ${
                  loading && testType === test.id
                    ? 'bg-gray-400 cursor-not-allowed'
                    : test.color
                }`}
              >
                {loading && testType === test.id ? 'Running...' : 'Run Test'}
              </button>
            </div>
          ))}
        </div>

        {results && (
          <div className="bg-white rounded-lg shadow-lg p-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">
              {results.success ? '✅ Test Results' : '❌ Test Failed'}
            </h2>
            
            <div className="mb-4">
              <span className={`inline-block px-3 py-1 rounded-full text-sm font-medium ${
                results.success 
                  ? 'bg-green-100 text-green-800' 
                  : 'bg-red-100 text-red-800'
              }`}>
                Status: {results.status || 'Unknown'}
              </span>
              <span className="ml-3 text-gray-500 text-sm">
                {new Date(results.timestamp).toLocaleString()}
              </span>
            </div>

            <div className="bg-gray-50 rounded-lg p-4 overflow-auto">
              <pre className="text-sm text-gray-800 whitespace-pre-wrap">
                {JSON.stringify(results.data || results.error, null, 2)}
              </pre>
            </div>

            {results.data?.summary && (
              <div className="mt-6 grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="bg-blue-50 p-4 rounded-lg text-center">
                  <div className="text-2xl font-bold text-blue-600">
                    {results.data.summary.totalUsers}
                  </div>
                  <div className="text-blue-800 text-sm">Total Users</div>
                </div>
                <div className="bg-green-50 p-4 rounded-lg text-center">
                  <div className="text-2xl font-bold text-green-600">
                    {results.data.summary.monthlyInsightsSent}
                  </div>
                  <div className="text-green-800 text-sm">Monthly Insights</div>
                </div>
                <div className="bg-yellow-50 p-4 rounded-lg text-center">
                  <div className="text-2xl font-bold text-yellow-600">
                    {results.data.summary.paymentRemindersSent}
                  </div>
                  <div className="text-yellow-800 text-sm">Payment Reminders</div>
                </div>
                <div className="bg-red-50 p-4 rounded-lg text-center">
                  <div className="text-2xl font-bold text-red-600">
                    {results.data.summary.errors}
                  </div>
                  <div className="text-red-800 text-sm">Errors</div>
                </div>
              </div>
            )}
          </div>
        )}

        <div className="bg-white rounded-lg shadow-lg p-8 mt-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">📋 System Information</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h3 className="font-semibold text-gray-900 mb-2">🔄 Automation Schedule</h3>
              <ul className="text-gray-600 space-y-1">
                <li>• Monthly insights: 1st of every month</li>
                <li>• Payment reminders: Daily (if pending payments exist)</li>
                <li>• Email provider: Resend (delivered@resend.dev)</li>
                <li>• Rate limiting: 100ms delay between emails</li>
              </ul>
            </div>
            <div>
              <h3 className="font-semibold text-gray-900 mb-2">⚙️ Configuration</h3>
              <ul className="text-gray-600 space-y-1">
                <li>• Resend API: {process.env.NEXT_PUBLIC_RESEND_CONFIGURED ? '✅ Configured' : '❌ Missing'}</li>
                <li>• Convex: {process.env.NEXT_PUBLIC_CONVEX_URL ? '✅ Connected' : '❌ Missing'}</li>
                <li>• Clerk Auth: {user ? '✅ Authenticated' : '❌ Not signed in'}</li>
                <li>• Environment: {process.env.NODE_ENV || 'development'}</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}