import React, { useState, useEffect } from 'react';
import { SUBJECT_GROUPS, STANDALONE_SUBJECTS, MOCK_QUESTIONS, TOPICS } from '../constants';
import { Question } from '../types';
import { ArrowRight, RefreshCw, Check, X, BookOpen, Loader2, Sparkles, Settings2, Clock, AlertCircle, Layers } from 'lucide-react';
import { generateQuestions } from '../services/geminiService';

const PracticePanel: React.FC = () => {
  // New State Logic for Subject Groups
  const [selectedMainSubject, setSelectedMainSubject] = useState<string>('Physics');
  const [selectedPaper, setSelectedPaper] = useState<string>('1st Paper');
  
  // Fallback for standalone (Bangla, English, etc.)
  const [isStandalone, setIsStandalone] = useState(false);
  const [standaloneSubject, setStandaloneSubject] = useState<string>('');

  const [selectedTopic, setSelectedTopic] = useState<string>('All');
  const [difficulty, setDifficulty] = useState<string>('Medium');
  const [questionCount, setQuestionCount] = useState<number>(5);
  
  // Exam Mode States
  const [mode, setMode] = useState<'practice' | 'model_test'>('practice');
  const [timeLeft, setTimeLeft] = useState<number>(0);
  const [userAnswers, setUserAnswers] = useState<Record<number, number>>({});

  const [isPlaying, setIsPlaying] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  
  const [questions, setQuestions] = useState<Question[]>(MOCK_QUESTIONS);
  const [currentQIndex, setCurrentQIndex] = useState(0);
  
  // Practice Mode specific
  const [score, setScore] = useState(0);
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [explanation, setExplanation] = useState<string | null>(null);
  
  const [showResult, setShowResult] = useState(false);

  // Derive the actual subject key string (e.g., 'পদার্থবিজ্ঞান ২য় পত্র (Physics 2nd)') based on selection
  const getFullSubjectKey = () => {
    if (mode === 'model_test') return 'FULL_ADMISSION_TEST'; // Special flag for combined test
    if (isStandalone) return standaloneSubject;
    // @ts-ignore
    return SUBJECT_GROUPS[selectedMainSubject]?.[selectedPaper] || '';
  };

  const currentFullSubject = getFullSubjectKey();
  const availableTopics = mode === 'practice' ? (TOPICS[currentFullSubject] || []) : [];

  // Reset topic when subject/paper changes
  useEffect(() => {
    setSelectedTopic('All');
  }, [selectedMainSubject, selectedPaper, standaloneSubject, isStandalone]);

  // Set default question count based on mode
  useEffect(() => {
    if (mode === 'model_test') {
      setQuestionCount(50); // Default for Model Test
    } else {
      setQuestionCount(5); // Default for Practice
    }
  }, [mode]);

  // Timer Effect
  useEffect(() => {
    let timer: ReturnType<typeof setInterval>;
    if (isPlaying && mode === 'model_test' && !showResult && timeLeft > 0) {
      timer = setInterval(() => {
        setTimeLeft((prev) => {
          if (prev <= 1) {
            setShowResult(true);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }
    return () => clearInterval(timer);
  }, [isPlaying, mode, showResult, timeLeft]);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const startPractice = async () => {
    setIsLoading(true);
    setQuestions([]); 
    
    // For Model Test: Subject is 'Combined', Topic is 'All', Difficulty is 'Hard/Standard'
    const subjectToFetch = mode === 'model_test' ? 'FULL_ADMISSION_TEST' : currentFullSubject;
    const topicToFetch = mode === 'model_test' ? 'All' : selectedTopic;
    
    try {
      const generatedQuestions = await generateQuestions(subjectToFetch, topicToFetch, difficulty, questionCount);
      if (generatedQuestions && generatedQuestions.length > 0) {
        setQuestions(generatedQuestions);
      } else {
        setQuestions(MOCK_QUESTIONS);
      }
    } catch (error) {
      console.error("Failed to fetch questions", error);
      setQuestions(MOCK_QUESTIONS);
    } finally {
      setIsLoading(false);
      setIsPlaying(true);
      setCurrentQIndex(0);
      setScore(0);
      setShowResult(false);
      
      // Reset Practice specific
      setSelectedOption(null);
      setExplanation(null);
      
      // Reset Model Test specific
      setUserAnswers({});
      if (mode === 'model_test') {
        // 1 minute per question rule
        setTimeLeft(questionCount * 60); 
      }
    }
  };

  const handleOptionClick = (index: number) => {
    if (mode === 'practice') {
      if (selectedOption !== null) return;
      
      setSelectedOption(index);
      const currentQ = questions[currentQIndex % questions.length];
      
      if (index === currentQ.correctIndex) {
        setScore(s => s + 1);
      }
      setExplanation(currentQ.explanation);
    } else {
      setUserAnswers(prev => ({
        ...prev,
        [currentQIndex]: index
      }));
    }
  };

  const nextQuestion = () => {
    const totalQuestions = questions.length > 0 ? questions.length : questionCount;
    if (currentQIndex >= totalQuestions - 1) { 
      setShowResult(true);
    } else {
      setCurrentQIndex(prev => prev + 1);
      if (mode === 'practice') {
        setSelectedOption(null);
        setExplanation(null);
      }
    }
  };

  const getFinalScore = () => {
    if (mode === 'practice') return score;
    return questions.reduce((acc, q, idx) => {
      return acc + (userAnswers[idx] === q.correctIndex ? 1 : 0);
    }, 0);
  };

  // Result View
  if (showResult) {
    const finalScore = getFinalScore();
    const totalQuestions = questions.length;
    const percentage = Math.round((finalScore / totalQuestions) * 100);

    return (
      <div className="max-w-3xl mx-auto bg-white dark:bg-gray-800 rounded-2xl p-8 shadow-lg animate-fade-in">
        <div className="text-center mb-8">
          <h2 className="text-3xl font-bold font-bangla mb-4 text-gray-800 dark:text-white">
            {mode === 'model_test' ? 'পরীক্ষা সম্পন্ন! (Exam Finished)' : 'অভিনন্দন! (Good Job)'}
          </h2>
          <div className="text-6xl font-bold text-primary-600 mb-2">{finalScore} / {totalQuestions}</div>
          <p className="text-lg text-gray-500 font-medium">{percentage}% Accuracy</p>
        </div>

        <div className="flex justify-center mb-8">
          <button 
            onClick={() => setIsPlaying(false)}
            className="inline-flex items-center px-6 py-3 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors font-semibold shadow-lg shadow-primary-500/30"
          >
            <RefreshCw className="mr-2 h-5 w-5" />
            আবার অনুশীলন করুন (Restart)
          </button>
        </div>

        {mode === 'model_test' && (
          <div className="mt-8 border-t pt-8 border-gray-100 dark:border-gray-700">
            <h3 className="text-xl font-bold mb-6 text-gray-800 dark:text-white flex items-center">
              <BookOpen className="mr-2 h-5 w-5" /> উত্তরপত্র পর্যালোচনা (Review Answers)
            </h3>
            <div className="space-y-6">
              {questions.map((q, idx) => {
                const userAnswer = userAnswers[idx];
                const isCorrect = userAnswer === q.correctIndex;
                const skipped = userAnswer === undefined;
                
                return (
                  <div key={q.id} className={`p-5 rounded-xl border ${isCorrect ? 'border-green-200 bg-green-50 dark:bg-green-900/10' : 'border-red-200 bg-red-50 dark:bg-red-900/10'}`}>
                    <div className="flex items-start justify-between mb-3">
                      <p className="font-semibold text-gray-900 dark:text-white text-lg">
                        <span className="text-gray-400 mr-2">Q{idx + 1}.</span> {q.text}
                      </p>
                      {isCorrect ? (
                        <span className="bg-green-100 text-green-800 text-xs px-2 py-1 rounded-full font-bold flex items-center">
                          <Check className="w-3 h-3 mr-1"/> Correct
                        </span>
                      ) : (
                        <span className="bg-red-100 text-red-800 text-xs px-2 py-1 rounded-full font-bold flex items-center">
                          <X className="w-3 h-3 mr-1"/> {skipped ? 'Skipped' : 'Wrong'}
                        </span>
                      )}
                    </div>
                    <div className="text-sm space-y-2">
                       <p className="text-gray-700 dark:text-gray-300">
                         <span className="font-semibold">Your Answer:</span> {skipped ? <span className="text-gray-400 italic">None</span> : q.options[userAnswer]}
                       </p>
                       {!isCorrect && (
                         <p className="text-green-700 dark:text-green-400 font-medium">
                           <span className="font-semibold">Correct Answer:</span> {q.options[q.correctIndex]}
                         </p>
                       )}
                       <div className="mt-3 text-gray-600 dark:text-gray-400 text-sm bg-white dark:bg-gray-800 p-3 rounded-lg border border-gray-100 dark:border-gray-700">
                         <div className="flex justify-between items-start">
                             <span className="font-bold text-primary-600 block mb-1">ব্যাখ্যা (Explanation):</span>
                             <span className="text-xs bg-gray-100 dark:bg-gray-700 px-2 py-1 rounded text-gray-500">{q.subject}</span>
                         </div>
                         {q.explanation}
                         {q.reference && (
                           <span className="block mt-2 text-xs text-gray-500 italic border-t pt-1 border-gray-200 dark:border-gray-600">
                             Ref: {q.reference}
                           </span>
                         )}
                       </div>
                    </div>
                  </div>
                )
              })}
            </div>
          </div>
        )}
      </div>
    );
  }

  // Setup View
  if (!isPlaying) {
    return (
      <div className="space-y-6">
        <h2 className="text-2xl font-bold font-bangla text-gray-800 dark:text-white">অনুশীলন সেটআপ (Practice Setup)</h2>
        
        <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700">
          
          {/* Mode Selection */}
          <div className="flex flex-col md:flex-row gap-4 mb-8">
            <button 
              onClick={() => setMode('practice')}
              className={`flex-1 p-4 rounded-xl border-2 transition-all flex flex-col items-center justify-center text-center ${mode === 'practice' ? 'border-primary-500 bg-primary-50 dark:bg-primary-900/20 text-primary-700 dark:text-primary-300 ring-2 ring-primary-200 dark:ring-primary-900' : 'border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600 text-gray-600 dark:text-gray-400'}`}
            >
              <Sparkles className={`w-8 h-8 mb-2 ${mode === 'practice' ? 'text-primary-600' : 'text-gray-400'}`}/>
              <span className="font-bold text-lg">কুইক প্র্যাকটিস (Topic-wise)</span>
              <span className="text-sm opacity-80">বিষয়ভিত্তিক ছোট অনুশীলন</span>
            </button>
            <button 
              onClick={() => setMode('model_test')}
              className={`flex-1 p-4 rounded-xl border-2 transition-all flex flex-col items-center justify-center text-center ${mode === 'model_test' ? 'border-primary-500 bg-primary-50 dark:bg-primary-900/20 text-primary-700 dark:text-primary-300 ring-2 ring-primary-200 dark:ring-primary-900' : 'border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600 text-gray-600 dark:text-gray-400'}`}
            >
              <Layers className={`w-8 h-8 mb-2 ${mode === 'model_test' ? 'text-primary-600' : 'text-gray-400'}`}/>
              <span className="font-bold text-lg">পূর্ণাঙ্গ মডেল টেস্ট (Combined)</span>
              <span className="text-sm opacity-80">সব বিষয়ে একত্রে পরীক্ষা</span>
            </button>
          </div>

          <div className="space-y-6">
            
            {/* Conditional UI based on Mode */}
            {mode === 'practice' ? (
              <>
                {/* Subject Groups Selection */}
                <div>
                   <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">বিষয় (Subject)</label>
                   <div className="flex flex-wrap gap-2 mb-4">
                      {Object.keys(SUBJECT_GROUPS).map(subj => (
                        <button
                          key={subj}
                          onClick={() => { setSelectedMainSubject(subj); setIsStandalone(false); }}
                          className={`px-4 py-2 rounded-lg text-sm font-bold transition-colors border ${
                            !isStandalone && selectedMainSubject === subj
                            ? 'bg-blue-600 border-blue-600 text-white shadow-md' 
                            : 'bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700 text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700'
                          }`}
                        >
                          {subj}
                        </button>
                      ))}
                      {STANDALONE_SUBJECTS.map(subj => (
                        <button
                          key={subj}
                          onClick={() => { setStandaloneSubject(subj); setIsStandalone(true); }}
                          className={`px-4 py-2 rounded-lg text-sm font-bold transition-colors border ${
                            isStandalone && standaloneSubject === subj
                            ? 'bg-purple-600 border-purple-600 text-white shadow-md' 
                            : 'bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700 text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700'
                          }`}
                        >
                          {subj.split('(')[0]} {/* Show Bangla Name */}
                        </button>
                      ))}
                   </div>
                </div>

                {/* Paper Selection (Only for Grouped Subjects) */}
                {!isStandalone && (
                  <div className="p-4 bg-gray-50 dark:bg-gray-900/50 rounded-lg border border-gray-200 dark:border-gray-700">
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">পত্র নির্বাচন (Select Paper)</label>
                    <div className="flex gap-4">
                       {['1st Paper', '2nd Paper'].map(paper => (
                         <button
                           key={paper}
                           onClick={() => setSelectedPaper(paper)}
                           className={`flex-1 py-3 px-4 rounded-lg font-semibold text-sm transition-all border-2 ${
                             selectedPaper === paper
                             ? 'border-primary-500 bg-white dark:bg-gray-800 text-primary-600 shadow-sm'
                             : 'border-transparent bg-gray-200 dark:bg-gray-700 text-gray-500 dark:text-gray-400'
                           }`}
                         >
                           {paper === '1st Paper' ? '১ম পত্র (1st Paper)' : '২য় পত্র (2nd Paper)'}
                         </button>
                       ))}
                    </div>
                  </div>
                )}

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  {/* Topic Selection */}
                  <div className="col-span-1 md:col-span-1">
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">অধ্যায়/টপিক (Topic)</label>
                    <select 
                      value={selectedTopic}
                      onChange={(e) => setSelectedTopic(e.target.value)}
                      className="w-full p-2.5 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-primary-500"
                    >
                      <option value="All">সম্পূর্ণ সিলেবাস / সব অধ্যায়</option>
                      {availableTopics.map(t => <option key={t} value={t}>{t}</option>)}
                    </select>
                  </div>

                  {/* Difficulty Selection */}
                  <div className="col-span-1 md:col-span-1">
                     <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">কঠিন্য (Difficulty)</label>
                     <select 
                        value={difficulty}
                        onChange={(e) => setDifficulty(e.target.value)}
                        className="w-full p-2.5 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-primary-500"
                      >
                        <option value="Medium">মাঝারি (Medium)</option>
                        <option value="Hard">কঠিন (Hard)</option>
                        <option value="Easy">সহজ (Easy)</option>
                      </select>
                  </div>

                  {/* Question Count Selection (Practice Mode) */}
                  <div className="col-span-1 md:col-span-1">
                     <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">প্রশ্নের সংখ্যা (Count)</label>
                     <select 
                        value={questionCount}
                        onChange={(e) => setQuestionCount(Number(e.target.value))}
                        className="w-full p-2.5 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-primary-500"
                      >
                        <option value={5}>5 টি</option>
                        <option value={10}>10 টি</option>
                        <option value={15}>15 টি</option>
                        <option value={25}>25 টি</option>
                        <option value={50}>50 টি</option>
                        <option value={100}>100 টি</option>
                      </select>
                  </div>
                </div>
              </>
            ) : (
              // MODEL TEST UI
              <div className="p-6 bg-blue-50 dark:bg-blue-900/20 rounded-xl border border-blue-100 dark:border-blue-800 animate-fade-in">
                <div className="flex items-start mb-6">
                   <AlertCircle className="w-6 h-6 text-blue-600 dark:text-blue-400 mr-3 mt-1 flex-shrink-0" />
                   <div>
                     <h3 className="font-bold text-lg text-gray-900 dark:text-white mb-1">পূর্ণাঙ্গ ভর্তি পরীক্ষার সিমুলেশন</h3>
                     <p className="text-gray-600 dark:text-gray-300 text-sm">
                       এই পরীক্ষায় পদার্থ, রসায়ন, গণিত, জীববিজ্ঞান, বাংলা এবং ইংরেজি সব বিষয় থেকে প্রশ্ন থাকবে। প্রশ্নগুলো অধ্যায়ভিত্তিক নয়, বরং পুরো সিলেবাস থেকে আসবে (Subject-wise).
                     </p>
                   </div>
                </div>

                <div className="max-w-md mx-auto">
                   <label className="block text-lg font-bold text-gray-800 dark:text-white mb-3 text-center">
                     পরীক্ষার আকার (Exam Size)
                   </label>
                   <div className="grid grid-cols-2 gap-4">
                      <button 
                        onClick={() => setQuestionCount(50)}
                        className={`p-4 rounded-xl border-2 text-center transition-all ${
                          questionCount === 50
                          ? 'border-blue-500 bg-white dark:bg-gray-800 text-blue-600 shadow-md ring-2 ring-blue-200 dark:ring-blue-900'
                          : 'border-transparent bg-gray-200 dark:bg-gray-700 text-gray-600 dark:text-gray-300 hover:bg-gray-300 dark:hover:bg-gray-600'
                        }`}
                      >
                        <span className="block text-2xl font-bold">50</span>
                        <span className="text-sm">Questions</span>
                        <span className="block text-xs mt-1 font-medium bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 rounded px-2 py-0.5 mx-auto w-fit">50 Mins</span>
                      </button>
                      
                      <button 
                        onClick={() => setQuestionCount(100)}
                        className={`p-4 rounded-xl border-2 text-center transition-all ${
                          questionCount === 100
                          ? 'border-blue-500 bg-white dark:bg-gray-800 text-blue-600 shadow-md ring-2 ring-blue-200 dark:ring-blue-900'
                          : 'border-transparent bg-gray-200 dark:bg-gray-700 text-gray-600 dark:text-gray-300 hover:bg-gray-300 dark:hover:bg-gray-600'
                        }`}
                      >
                        <span className="block text-2xl font-bold">100</span>
                        <span className="text-sm">Questions</span>
                        <span className="block text-xs mt-1 font-medium bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 rounded px-2 py-0.5 mx-auto w-fit">100 Mins</span>
                      </button>
                   </div>
                </div>
              </div>
            )}

            <div className="pt-4 border-t border-gray-100 dark:border-gray-700">
              <button 
                onClick={startPractice}
                disabled={isLoading}
                className="w-full md:w-auto px-8 py-3 bg-primary-600 text-white rounded-lg hover:bg-primary-700 disabled:opacity-70 transition-colors font-bold flex items-center justify-center shadow-lg shadow-primary-500/30 mx-auto md:mx-0"
              >
                {isLoading ? (
                  <>
                    <Loader2 className="mr-2 h-5 w-5 animate-spin" /> 
                    {mode === 'model_test' ? 'প্রশ্নপত্র তৈরি হচ্ছে...' : 'প্রশ্ন তৈরি হচ্ছে...'}
                  </>
                ) : (
                  <>
                    {mode === 'practice' ? <Sparkles className="mr-2 h-5 w-5" /> : <Clock className="mr-2 h-5 w-5" />}
                    {mode === 'practice' ? 'শুরু করুন (Start Practice)' : 'পরীক্ষা শুরু করুন (Start Exam)'}
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Question View
  if (questions.length === 0) return <div>No questions available.</div>;

  const currentQuestion = questions[currentQIndex % questions.length];
  const totalQuestions = questions.length;
  const showFeedback = mode === 'practice' && selectedOption !== null;

  // Timer Styles
  const totalExamTime = questionCount * 60;
  const timeProgress = (timeLeft / totalExamTime) * 100;
  
  const getTimerStyles = () => {
    if (timeProgress <= 15) return {
      container: "bg-red-100 dark:bg-red-900/40 border-red-300 dark:border-red-700 text-red-800 dark:text-red-300",
      bar: "bg-red-600",
      icon: "animate-pulse text-red-600"
    };
    if (timeProgress <= 40) return {
      container: "bg-amber-100 dark:bg-amber-900/40 border-amber-300 dark:border-amber-700 text-amber-800 dark:text-amber-300",
      bar: "bg-amber-500",
      icon: "text-amber-600"
    };
    return {
      container: "bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700 text-gray-800 dark:text-gray-200",
      bar: "bg-primary-600",
      icon: "text-primary-600"
    };
  };

  const timerStyles = getTimerStyles();

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      
      {/* Prominent Timer for Model Test */}
      {mode === 'model_test' && (
         <div className={`sticky top-0 z-20 rounded-xl border-2 p-4 shadow-lg transition-all duration-500 backdrop-blur-md ${timerStyles.container}`}>
            <div className="flex items-center justify-between mb-2">
               <div className="flex items-center space-x-2">
                  <Clock className={`w-7 h-7 ${timerStyles.icon}`} />
                  <span className="text-3xl font-bold font-mono tracking-wider">{formatTime(timeLeft)}</span>
               </div>
               <span className="text-sm font-semibold uppercase tracking-wide opacity-80 flex items-center">
                 <AlertCircle className="w-4 h-4 mr-1" /> Time Remaining
               </span>
            </div>
             <div className="w-full bg-gray-300 dark:bg-gray-700 rounded-full h-3 overflow-hidden border border-gray-400/20">
                <div 
                  className={`h-full transition-all duration-1000 ease-linear ${timerStyles.bar}`} 
                  style={{ width: `${timeProgress}%` }}
                />
            </div>
         </div>
      )}

      <div className="flex justify-between items-center text-sm font-medium">
        <span className="flex items-center text-gray-500 dark:text-gray-400">
          <Settings2 className="w-4 h-4 mr-1"/> {mode === 'model_test' ? 'Full Exam' : difficulty}
        </span>
        <span className="text-primary-600">Question {currentQIndex + 1} of {totalQuestions}</span>
      </div>

      <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
        <div 
          className="bg-primary-600 h-2 rounded-full transition-all duration-300" 
          style={{ width: `${((currentQIndex + 1) / totalQuestions) * 100}%` }}
        />
      </div>

      <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-md border border-gray-200 dark:border-gray-700">
        <div className="mb-4">
           <span className="inline-block px-2 py-1 text-xs font-semibold rounded bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 mb-2">
             {currentQuestion.subject} &bull; {currentQuestion.topic}
           </span>
           <h3 className="text-xl font-semibold text-gray-900 dark:text-white font-bangla leading-relaxed">
             {currentQuestion.text}
           </h3>
        </div>

        <div className="space-y-3">
          {currentQuestion.options.map((option, idx) => {
            let btnClass = "w-full text-left p-4 rounded-lg border-2 transition-all font-medium relative ";
            const isSelected = mode === 'practice' ? (selectedOption === idx) : (userAnswers[currentQIndex] === idx);
            
            if (showFeedback) {
              if (idx === currentQuestion.correctIndex) {
                btnClass += "border-green-500 bg-green-50 dark:bg-green-900/20 text-green-700 dark:text-green-300";
              } else if (isSelected) {
                btnClass += "border-red-500 bg-red-50 dark:bg-red-900/20 text-red-700 dark:text-red-300";
              } else {
                btnClass += "border-gray-200 dark:border-gray-700 opacity-50";
              }
            } else {
              if (isSelected) {
                btnClass += "border-primary-500 bg-primary-50 dark:bg-primary-900/20 text-primary-700 dark:text-primary-300";
              } else {
                btnClass += "border-gray-200 dark:border-gray-700 hover:border-primary-400 hover:bg-gray-50 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-300";
              }
            }

            return (
              <button
                key={idx}
                disabled={mode === 'practice' && selectedOption !== null}
                onClick={() => handleOptionClick(idx)}
                className={btnClass}
              >
                <span className="mr-3">{String.fromCharCode(65 + idx)}.</span>
                {option}
                {showFeedback && idx === currentQuestion.correctIndex && (
                  <Check className="absolute right-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-green-600" />
                )}
                {showFeedback && isSelected && idx !== currentQuestion.correctIndex && (
                  <X className="absolute right-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-red-600" />
                )}
              </button>
            );
          })}
        </div>

        {showFeedback && (
          <div className="mt-6 p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg border border-blue-100 dark:border-blue-800 animate-fade-in">
            <h4 className="font-bold text-blue-800 dark:text-blue-300 mb-1 flex items-center">
              <BookOpen className="h-4 w-4 mr-2" /> ব্যাখ্যা (Explanation):
            </h4>
            <p className="text-blue-900 dark:text-blue-100 text-sm font-bangla mb-2">
              {explanation || "No explanation provided."}
            </p>
            {currentQuestion.reference && (
              <p className="text-xs text-blue-600 dark:text-blue-400 font-mono border-t border-blue-200 dark:border-blue-700 pt-2 mt-2">
                📖 Source: {currentQuestion.reference}
              </p>
            )}
          </div>
        )}
      </div>

      <div className="flex justify-between items-center">
        {mode === 'model_test' ? (
           <p className="text-xs text-gray-500">
             <AlertCircle className="inline h-3 w-3 mr-1"/>
             সময় শেষ হলে অটো-সাবমিট হবে
           </p>
        ) : (<div></div>)}
        
        {(mode === 'model_test' || selectedOption !== null) && (
          <button
            onClick={nextQuestion}
            className="px-6 py-3 bg-gray-900 dark:bg-white text-white dark:text-gray-900 rounded-lg font-bold hover:opacity-90 transition-opacity flex items-center shadow-lg"
          >
            {currentQIndex >= totalQuestions - 1 ? 'ফলাফল দেখুন (Finish)' : 'পরবর্তী (Next)'} <ArrowRight className="ml-2 h-5 w-5" />
          </button>
        )}
      </div>
    </div>
  );
};

export default PracticePanel;