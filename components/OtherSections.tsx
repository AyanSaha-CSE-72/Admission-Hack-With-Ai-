import React from 'react';
import { MOCK_EXAMS, STUDY_TIPS } from '../constants';
import { Calendar, Trophy, Lightbulb, ExternalLink } from 'lucide-react';

export const Leaderboard: React.FC = () => {
  const users = [
    { rank: 1, name: 'Tanvir Ahmed', score: 980, streak: 45 },
    { rank: 2, name: 'Sadia Islam', score: 945, streak: 32 },
    { rank: 3, name: 'Rahim Uddin', score: 910, streak: 28 },
    { rank: 4, name: 'You', score: 850, streak: 12 },
    { rank: 5, name: 'Karim Hasan', score: 820, streak: 20 },
  ];

  return (
    <div className="space-y-6">
       <h2 className="text-2xl font-bold font-bangla text-gray-800 dark:text-white">শীর্ষ মেধাতালিকা (Leaderboard)</h2>
       <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm overflow-hidden border border-gray-200 dark:border-gray-700">
         <table className="w-full">
            <thead className="bg-gray-50 dark:bg-gray-700/50">
              <tr>
                <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Rank</th>
                <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Name</th>
                <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Points</th>
                <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Streak</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
              {users.map((user) => (
                <tr key={user.rank} className={user.rank === 4 ? "bg-primary-50 dark:bg-primary-900/20" : ""}>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {user.rank === 1 ? <Trophy className="h-5 w-5 text-yellow-500" /> : <span className="text-gray-900 dark:text-white font-medium">#{user.rank}</span>}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-white">{user.name}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">{user.score}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">🔥 {user.streak}</td>
                </tr>
              ))}
            </tbody>
         </table>
       </div>
    </div>
  );
};

export const ExamSchedule: React.FC = () => {
  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold font-bangla text-gray-800 dark:text-white">আসন্ন পরীক্ষা (Upcoming Exams)</h2>
      <div className="grid gap-4">
        {MOCK_EXAMS.map((exam) => (
          <div key={exam.id} className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 flex flex-col md:flex-row md:items-center justify-between hover:border-primary-300 transition-colors">
            <div className="flex items-start space-x-4">
              <div className="p-3 bg-indigo-50 dark:bg-indigo-900/30 rounded-lg text-indigo-600 dark:text-indigo-400">
                <Calendar className="h-6 w-6" />
              </div>
              <div>
                <h3 className="text-lg font-bold text-gray-900 dark:text-white">{exam.university}</h3>
                <p className="text-primary-600 dark:text-primary-400 font-medium">{exam.unit}</p>
                <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">{exam.notes}</p>
              </div>
            </div>
            <div className="mt-4 md:mt-0 flex items-center">
               <div className="text-right mr-4">
                 <p className="text-xs text-gray-500 uppercase">Date</p>
                 <p className="font-bold text-gray-800 dark:text-gray-200">{exam.date}</p>
               </div>
               <button className="p-2 text-gray-400 hover:text-primary-600">
                 <ExternalLink className="h-5 w-5" />
               </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export const ResourcesSection: React.FC = () => {
  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold font-bangla text-gray-800 dark:text-white">প্রস্তুতি টিপস (Study Tips)</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {STUDY_TIPS.map((tip, idx) => (
          <div key={idx} className="bg-gradient-to-br from-white to-gray-50 dark:from-gray-800 dark:to-gray-800 p-6 rounded-xl border border-gray-200 dark:border-gray-700 shadow-sm">
            <div className="flex items-center space-x-2 mb-3 text-yellow-600 dark:text-yellow-500">
              <Lightbulb className="h-5 w-5" />
              <h3 className="font-bold">{tip.title}</h3>
            </div>
            <p className="text-gray-600 dark:text-gray-300 font-bangla leading-relaxed">
              {tip.desc}
            </p>
          </div>
        ))}
      </div>
      
      <div className="mt-8 p-6 bg-blue-50 dark:bg-blue-900/20 rounded-xl border border-blue-100 dark:border-blue-800 text-center">
        <h3 className="text-xl font-bold text-blue-800 dark:text-blue-300 mb-2">Need more help?</h3>
        <p className="text-blue-900 dark:text-blue-100 mb-4">আমাদের AI টিউটরের সাথে চ্যাট করে তোমার কনফিউশন দূর করো।</p>
      </div>
    </div>
  );
};