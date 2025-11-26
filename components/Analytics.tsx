import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, AreaChart, Area } from 'recharts';
import { MOCK_STATS } from '../constants';

const Analytics: React.FC = () => {
  const studyData = [
    { day: 'Sat', minutes: 45 },
    { day: 'Sun', minutes: 90 },
    { day: 'Mon', minutes: 60 },
    { day: 'Tue', minutes: 120 },
    { day: 'Wed', minutes: 30 },
    { day: 'Thu', minutes: 75 },
    { day: 'Fri', minutes: 100 },
  ];

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold font-bangla text-gray-800 dark:text-white mb-4">আমার অগ্রগতি (My Progress)</h2>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Subject Performance */}
        <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700">
          <h3 className="text-lg font-semibold mb-4 text-gray-700 dark:text-gray-200">বিষয়ভিত্তিক দক্ষতা (Accuracy %)</h3>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={MOCK_STATS}>
                <CartesianGrid strokeDasharray="3 3" opacity={0.1} />
                <XAxis dataKey="subject" stroke="#888888" />
                <YAxis stroke="#888888" />
                <Tooltip 
                  contentStyle={{ backgroundColor: '#1f2937', color: '#fff', border: 'none', borderRadius: '8px' }}
                />
                <Bar dataKey="accuracy" fill="#0ea5e9" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Study Time */}
        <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700">
          <h3 className="text-lg font-semibold mb-4 text-gray-700 dark:text-gray-200">পড়াশোনার সময় (Study Time)</h3>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={studyData}>
                <defs>
                  <linearGradient id="colorMin" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#8b5cf6" stopOpacity={0.8}/>
                    <stop offset="95%" stopColor="#8b5cf6" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" opacity={0.1} />
                <XAxis dataKey="day" stroke="#888888" />
                <YAxis stroke="#888888" />
                <Tooltip 
                  contentStyle={{ backgroundColor: '#1f2937', color: '#fff', border: 'none', borderRadius: '8px' }}
                />
                <Area type="monotone" dataKey="minutes" stroke="#8b5cf6" fillOpacity={1} fill="url(#colorMin)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700">
        <h3 className="text-lg font-semibold mb-3 text-gray-700 dark:text-gray-200">Strengths & Weaknesses</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="p-4 bg-green-50 dark:bg-green-900/20 rounded-lg border border-green-100 dark:border-green-800">
            <h4 className="font-bold text-green-700 dark:text-green-400 mb-2">Strong Topics</h4>
            <ul className="list-disc list-inside text-sm text-green-800 dark:text-green-200">
              <li>Vector Physics</li>
              <li>English Vocabulary</li>
              <li>Organic Chemistry Basics</li>
            </ul>
          </div>
          <div className="p-4 bg-red-50 dark:bg-red-900/20 rounded-lg border border-red-100 dark:border-red-800">
            <h4 className="font-bold text-red-700 dark:text-red-400 mb-2">Need Improvement</h4>
            <ul className="list-disc list-inside text-sm text-red-800 dark:text-red-200">
              <li>Integration (Calculus)</li>
              <li>Biology Genetics</li>
              <li>Trigonometry</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Analytics;