import React, { useState } from 'react';
import Layout from './components/Layout';
import HeroSection from './components/HeroSection';
import PracticePanel from './components/PracticePanel';
import AIChatTutor from './components/AIChatTutor';
import Analytics from './components/Analytics';
import { Leaderboard, ExamSchedule, ResourcesSection } from './components/OtherSections';

const App: React.FC = () => {
  const [currentView, setCurrentView] = useState('dashboard');

  const renderView = () => {
    switch (currentView) {
      case 'dashboard':
        return (
          <div className="space-y-8 animate-fade-in">
            <HeroSection />
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              <Leaderboard />
              <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700">
                <h3 className="font-bold text-lg mb-4 text-gray-800 dark:text-white">Quick Access</h3>
                <div className="space-y-3">
                  <button 
                    onClick={() => setCurrentView('practice')}
                    className="w-full text-left p-4 rounded-lg bg-primary-50 dark:bg-primary-900/20 hover:bg-primary-100 transition-colors border border-primary-100 dark:border-primary-800 text-primary-700 dark:text-primary-300 font-medium"
                  >
                    🚀 কুইক প্র্যাকটিস শুরু করুন
                  </button>
                  <button 
                    onClick={() => setCurrentView('chat')}
                    className="w-full text-left p-4 rounded-lg bg-purple-50 dark:bg-purple-900/20 hover:bg-purple-100 transition-colors border border-purple-100 dark:border-purple-800 text-purple-700 dark:text-purple-300 font-medium"
                  >
                    🤖 কনসেপ্ট বুঝতে সমস্যা? AI কে জিজ্ঞেস করো
                  </button>
                </div>
              </div>
            </div>
            <ResourcesSection />
          </div>
        );
      case 'practice':
        return <PracticePanel />;
      case 'chat':
        return <AIChatTutor />;
      case 'stats':
        return <Analytics />;
      case 'leaderboard':
        return <Leaderboard />;
      case 'schedule':
        return <ExamSchedule />;
      default:
        return <HeroSection />;
    }
  };

  return (
    <Layout currentView={currentView} setCurrentView={setCurrentView}>
      {renderView()}
    </Layout>
  );
};

export default App;