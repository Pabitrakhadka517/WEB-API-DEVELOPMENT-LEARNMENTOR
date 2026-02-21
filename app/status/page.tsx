'use client';

import React, { useState, useEffect } from 'react';
import axios from 'axios';

export default function StatusPage() {
  const [backendStatus, setBackendStatus] = useState('checking...');
  const [apiStatus, setApiStatus] = useState('checking...');
  const [error, setError] = useState(null);

  const checkBackendHealth = async () => {
    try {
      const response = await axios.get('http://localhost:4000/health', { timeout: 5000 });
      setBackendStatus('✅ Backend is healthy');
      console.log('Backend health check:', response.data);
    } catch (err: any) {
      setBackendStatus('❌ Backend connection failed');
      setError(err?.message || 'Unknown error');
      console.error('Backend health check failed:', err);
    }
  };

  const checkApiRegistration = async () => {
    try {
      const testUser = {
        email: `test${Date.now()}@example.com`,
        password: 'TestPassword123!',
        fullName: 'Test User',
        role: 'STUDENT'
      };
      
      const response = await axios.post('http://localhost:4000/api/auth/register', testUser, {
        timeout: 10000,
        headers: { 'Content-Type': 'application/json' }
      });
      
      setApiStatus('✅ API registration works');
      console.log('API test successful:', response.data);
    } catch (err: any) {
      if (err?.response?.data?.message?.includes('Email already exists')) {
        setApiStatus('✅ API is working (email exists)');
      } else {
        setApiStatus('❌ API test failed');
        console.error('API test failed:', err);
      }
    }
  };

  useEffect(() => {
    checkBackendHealth();
    setTimeout(checkApiRegistration, 1000);
  }, []);

  return (
    <div className="min-h-screen bg-white flex items-center justify-center p-4">
      <div className="bg-white rounded-lg shadow-md p-8 max-w-md w-full border border-slate-200">
        <h1 className="text-2xl font-bold text-slate-900 mb-6 text-center">
          System Status Check
        </h1>
        
        <div className="space-y-4">
          <div className="border border-slate-200 rounded-lg p-4">
            <h3 className="font-semibold text-slate-700 mb-2">Backend Health</h3>
            <p className="text-sm">{backendStatus}</p>
          </div>
          
          <div className="border border-slate-200 rounded-lg p-4">
            <h3 className="font-semibold text-slate-700 mb-2">API Functionality</h3>
            <p className="text-sm">{apiStatus}</p>
          </div>
          
          {error && (
            <div className="border border-red-200 rounded-lg p-4 bg-red-50">
              <h3 className="font-semibold text-red-700 mb-2">Error Details</h3>
              <p className="text-sm text-red-600">{error}</p>
            </div>
          )}
          
          <div className="border rounded-lg p-4 bg-blue-50">
            <h3 className="font-semibold text-blue-700 mb-2">Configuration</h3>
            <p className="text-xs text-blue-600">
              API URL: {process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000/api'}
            </p>
            <p className="text-xs text-blue-600 mt-1">
              Environment: {process.env.NODE_ENV || 'development'}
            </p>
          </div>
          
          <button
            onClick={() => {
              checkBackendHealth();
              setTimeout(checkApiRegistration, 1000);
            }}
            className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 transition-colors"
          >
            Recheck Status
          </button>
        </div>
        
        <div className="mt-6 text-center">
          <a
            href="/register"
            className="text-blue-600 hover:text-blue-800 hover:underline text-sm"
          >
            Go to Registration →
          </a>
        </div>
      </div>
    </div>
  );
}