import React from 'react';
import { Target, Zap, Clock, CheckCircle } from 'lucide-react';

const HeroSection: React.FC = () => {
  return (
    <div className="space-y-6">
      <div className="bg-gradient-to-r from-primary-600 to-academic-accent rounded-2xl p-8 text-white shadow-lg">
        <h2 className="text-3xl font-bold mb-2 font-bangla">স্বাগতম, ভবিষ্যৎ গ্রাজুয়েট!</h2>
        <p className="opacity-90 max-w-2xl font-bangla text-lg">
          তোমার প্রতিদিনের প্রস্তুতি তোমাকে স্বপ্নের ক্যাম্পাসে নিয়ে যাবে। চলো আজকের লক্ষ্য পূরণ করি।
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard 
          icon={<CheckCircle className="h-6 w-6 text-green-500" />}
          label="Total Solved"
          value="452"
          sub="Questions"
        />
        <StatCard 
          icon={<Target className="h-6 w-6 text-blue-500" />}
          label="Accuracy"
          value="78%"
          sub="Overall"
        />
        <StatCard 
          icon={<Clock className="h-6 w-6 text-orange-500" />}
          label="Study Time"
          value="2.5h"
          sub="Today"
        />
        <StatCard 
          icon={<Zap className="h-6 w-6 text-yellow-500" />}
          label="Streak"
          value="12"
          sub="Days"
        />
      </div>
    </div>
  );
};

const StatCard: React.FC<{ icon: React.ReactNode; label: string; value: string; sub: string }> = ({ icon, label, value, sub }) => (
  <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 hover:shadow-md transition-shadow">
    <div className="flex items-center justify-between mb-2">
      <div className="p-2 bg-gray-50 dark:bg-gray-700 rounded-lg">{icon}</div>
      <span className="text-xs text-gray-500 dark:text-gray-400 font-medium uppercase tracking-wider">{label}</span>
    </div>
    <div className="flex items-end space-x-2">
      <span className="text-3xl font-bold text-gray-900 dark:text-white">{value}</span>
      <span className="text-sm text-gray-500 dark:text-gray-400 mb-1">{sub}</span>
    </div>
  </div>
);

export default HeroSection;