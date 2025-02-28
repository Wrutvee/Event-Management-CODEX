import React from 'react';
import Header from '../components/Header';

export default function Notifications() {
  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <main className="pt-4 pb-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="text-2xl font-bold text-gray-900 mb-6">Notifications</h1>
          
          <div className="bg-white rounded-lg shadow">
            {/* Sample notifications - Replace with actual notifications */}
            <div className="divide-y divide-gray-200">
              {[...Array(5)].map((_, index) => (
                <div key={index} className="p-4 hover:bg-gray-50">
                  <p className="">New event has been added</p>
                  <p className="text-xs text-gray-400 mt-1">2 hours ago</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}