import React, { useState } from 'react';
import { 
  BookOpen, 
  BarChart2, 
  MessageCircle, 
  Calendar, 
  Menu, 
  X, 
  Moon, 
  Sun, 
  GraduationCap,
  Award,
  LayoutDashboard,
  AlertTriangle
} from 'lucide-react';

interface LayoutProps {
  children: React.ReactNode;
  currentView: string;
  setCurrentView: (view: string) => void;
}

const Layout: React.FC<LayoutProps> = ({ children, currentView, setCurrentView }) => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(false);

  const toggleSidebar = () => setIsSidebarOpen(!isSidebarOpen);
  
  const toggleTheme = () => {
    setIsDarkMode(!isDarkMode);
    if (!isDarkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  };

  const navItems = [
    { id: 'dashboard', label: 'নীড়পাতা (Home)', icon: LayoutDashboard },
    { id: 'practice', label: 'অনুশীলন (Practice)', icon: BookOpen },
    { id: 'chat', label: 'এআই টিউটর (AI Chat)', icon: MessageCircle },
    { id: 'stats', label: 'ফলাফল (Stats)', icon: BarChart2 },
    { id: 'leaderboard', label: 'লিডারবোর্ড', icon: Award },
    { id: 'schedule', label: 'পরীক্ষার সময়সূচি', icon: Calendar },
  ];

  // Check for API Key presence using process.env
  const hasApiKey = !!process.env.API_KEY;

  return (
    <div className={`min-h-screen flex ${isDarkMode ? 'dark' : ''} bg-gray-50 dark:bg-gray-900`}>
      {/* Mobile Sidebar Overlay */}
      {isSidebarOpen && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 z-20 lg:hidden"
          onClick={() => setIsSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside className={`
        fixed lg:static inset-y-0 left-0 z-30 w-64 transform transition-transform duration-300 ease-in-out
        bg-white dark:bg-gray-800 border-r border-gray-200 dark:border-gray-700 shadow-lg lg:shadow-none
        ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
      `}>
        <div className="h-16 flex items-center justify-center border-b border-gray-200 dark:border-gray-700">
          <GraduationCap className="h-8 w-8 text-primary-600 mr-2" />
          <span className="text-xl font-bold font-bangla text-gray-800 dark:text-white">Admission Hack with AI</span>
        </div>

        <nav className="mt-6 px-4 space-y-2">
          {navItems.map((item) => (
            <button
              key={item.id}
              onClick={() => {
                setCurrentView(item.id);
                setIsSidebarOpen(false);
              }}
              className={`
                w-full flex items-center px-4 py-3 rounded-lg transition-colors font-bangla
                ${currentView === item.id 
                  ? 'bg-primary-50 dark:bg-primary-900/30 text-primary-700 dark:text-primary-300' 
                  : 'text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700'}
              `}
            >
              <item.icon className="h-5 w-5 mr-3" />
              <span className="font-medium">{item.label}</span>
            </button>
          ))}
        </nav>

        <div className="absolute bottom-0 w-full p-4 border-t border-gray-200 dark:border-gray-700">
          <div className="flex items-center space-x-3 text-sm text-gray-500 dark:text-gray-400">
            <div className="h-8 w-8 rounded-full bg-primary-100 flex items-center justify-center text-primary-600 font-bold">
              S
            </div>
            <div>
              <p className="font-medium dark:text-gray-200">Student User</p>
              <p className="text-xs">HSC Science</p>
            </div>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Top Header */}
        <header className="h-16 bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 flex items-center justify-between px-4 lg:px-8">
          <button 
            onClick={toggleSidebar}
            className="lg:hidden p-2 rounded-md text-gray-600 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-700"
          >
            <Menu className="h-6 w-6" />
          </button>

          <h1 className="text-lg font-semibold text-gray-800 dark:text-white hidden sm:block font-bangla">
             এইচএসসি ও ভর্তি প্রস্তুতি সহায়িকা
          </h1>

          <button 
            onClick={toggleTheme}
            className="p-2 rounded-full text-gray-600 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-700 transition-colors"
          >
            {isDarkMode ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
          </button>
        </header>

        {/* API Key Missing Banner */}
        {!hasApiKey && (
          <div className="bg-amber-100 dark:bg-amber-900/30 border-b border-amber-200 dark:border-amber-800 text-amber-900 dark:text-amber-100 px-4 py-2 flex items-center justify-center text-sm">
            <AlertTriangle className="h-4 w-4 mr-2 text-amber-600 dark:text-amber-400" />
            <span>
              <strong>Demo Mode Active:</strong> Real AI features are disabled. Please configure <code className="mx-1 px-1 bg-amber-200 dark:bg-amber-800 rounded font-mono text-xs">API_KEY</code> to enable full functionality.
            </span>
          </div>
        )}

        {/* Page Content Scrollable Area */}
        <main className="flex-1 overflow-y-auto p-4 lg:p-8 flex flex-col">
          <div className="flex-1">
            {children}
          </div>
          
          {/* Footer - Built by Ayan Saha */}
          <div className="mt-12 pb-4 text-center border-t border-gray-100 dark:border-gray-800 pt-6">
            <p className="text-sm text-gray-400 dark:text-gray-600 font-medium tracking-wide">
              Built by Ayan Saha
            </p>
          </div>
        </main>
      </div>
    </div>
  );
};

export default Layout;