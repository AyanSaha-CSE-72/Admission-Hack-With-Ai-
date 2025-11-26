import { ExamInfo, Question, SubjectPerformance } from './types';

// New grouped structure for UI selector
export const SUBJECT_GROUPS: Record<string, { '1st Paper': string; '2nd Paper': string }> = {
  'Physics': {
    '1st Paper': 'পদার্থবিজ্ঞান ১ম পত্র (Physics 1st)',
    '2nd Paper': 'পদার্থবিজ্ঞান ২য় পত্র (Physics 2nd)'
  },
  'Chemistry': {
    '1st Paper': 'রসায়ন ১ম পত্র (Chemistry 1st)',
    '2nd Paper': 'রসায়ন ২য় পত্র (Chemistry 2nd)'
  },
  'Higher Math': {
    '1st Paper': 'উচ্চতর গণিত ১ম পত্র (Higher Math 1st)',
    '2nd Paper': 'উচ্চতর গণিত ২য় পত্র (Higher Math 2nd)'
  },
  'Biology': {
    '1st Paper': 'জীববিজ্ঞান ১ম পত্র (Biology 1st)',
    '2nd Paper': 'জীববিজ্ঞান ২য় পত্র (Biology 2nd)'
  }
};

// Standalone subjects that don't have paper 1/2 structure in the same way for this app
export const STANDALONE_SUBJECTS = [
  'বাংলা (Bangla)',
  'ইংরেজি (English)',
  'আইসিটি (ICT)'
];

export const SUBJECTS = [
  ...Object.values(SUBJECT_GROUPS).flatMap(g => [g['1st Paper'], g['2nd Paper']]),
  ...STANDALONE_SUBJECTS
];

export const TOPICS: Record<string, string[]> = {
  'পদার্থবিজ্ঞান ১ম পত্র (Physics 1st)': [
    'ভৌত জগৎ ও পরিমাপ (Physical World)',
    'ভেক্টর (Vectors)',
    'গতিবিদ্যা (Dynamics)',
    'নিউটনীয় বলবিদ্যা (Newtonian Mechanics)',
    'কাজ, শক্তি ও ক্ষমতা (Work, Energy & Power)',
    'মহাকর্ষ ও অভিকর্ষ (Gravitation)',
    'পদার্থের গাঠনিক ধর্ম (Structural Properties of Matter)',
    'পর্যায়বৃত্ত গতি (Periodic Motion)',
    'আদর্শ গ্যাস ও গ্যাসের গতিতত্ত্ব (Ideal Gas)'
  ],
  'পদার্থবিজ্ঞান ২য় পত্র (Physics 2nd)': [
    'তাপগতিবিদ্যা (Thermodynamics)',
    'স্থির তড়িৎ (Static Electricity)',
    'চল তড়িৎ (Current Electricity)',
    'তড়িৎ প্রবাহের চৌম্বক ক্রিয়া ও চুম্বকত্ব',
    'তাড়িতচৌম্বক আবেশ ও পরিবর্তী প্রবাহ',
    'জ্যামিতিক আলোকবিজ্ঞান (Geometric Optics)',
    'ভৌত আলোকবিজ্ঞান (Physical Optics)',
    'আধুনিক পদার্থবিজ্ঞানের সূচনা (Modern Physics)',
    'পরমাণুর মডেল ও নিউক্লিয়ার পদার্থবিজ্ঞান',
    'সেমিকন্ডাক্টর ও ইলেকট্রনিক্স'
  ],
  'রসায়ন ১ম পত্র (Chemistry 1st)': [
    'ল্যাবরেটরির নিরাপদ ব্যবহার',
    'গুণগত রসায়ন (Qualitative Chemistry)',
    'মৌলের পর্যায়বৃত্ত ধর্ম ও রাসায়নিক বন্ধন',
    'রাসায়নিক পরিবর্তন (Chemical Changes)',
    'কর্মমুখী রসায়ন'
  ],
  'রসায়ন ২য় পত্র (Chemistry 2nd)': [
    'পরিবেশ রসায়ন (Environmental Chemistry)',
    'জৈব রসায়ন (Organic Chemistry)',
    'পরিমাণগত রসায়ন (Quantitative Chemistry)',
    'তড়িৎ রসায়ন (Electrochemistry)',
    'অর্থনৈতিক রসায়ন'
  ],
  'উচ্চতর গণিত ১ম পত্র (Higher Math 1st)': [
    'ম্যাট্রিক্স ও নির্ণায়ক (Matrices)',
    'ভেক্টর (Vectors)',
    'সরলরেখা (Straight Lines)',
    'বৃত্ত (Circle)',
    'বিন্যাস ও সমাবেশ (Permutation & Combination)',
    'ত্রিকোণমিতি (Trigonometry)',
    'ফাংশন ও ফাংশনের লেখচিত্র',
    'অন্তরীকরণ (Differentiation)',
    'যৌগজীকরণ (Integration)'
  ],
  'উচ্চতর গণিত ২য় পত্র (Higher Math 2nd)': [
    'বাস্তব সংখ্যা ও অসমতা',
    'জটিল সংখ্যা (Complex Numbers)',
    'বহুপদী ও বহুপদী সমীকরণ',
    'কনিক (Conics)',
    'বিপরীত ত্রিকোণমিতিক ফাংশন ও সমীকরণ',
    'স্থিতিবিদ্যা (Statics)',
    'সমতলে বস্তুকণার গতি (Dynamics)',
    'বিস্তার পরিমাপ ও সম্ভাবনা'
  ],
  'জীববিজ্ঞান ১ম পত্র (Biology 1st)': [
    'কোষ ও এর গঠন (Cell & Structure)',
    'কোষ বিভাজন (Cell Division)',
    'কোষ রসায়ন (Cell Chemistry)',
    'অণুজীব (Microorganisms)',
    'শৈবাল ও ছত্রাক',
    'ব্রায়োফাইটা ও টেরিডোফাইটা',
    'নগ্নবীজী ও আবৃতবীজী উদ্ভিদ',
    'টিস্যু ও টিস্যুতন্ত্র',
    'উদ্ভিদ শরীরতত্ত্ব (Plant Physiology)',
    'জীবপ্রযুক্তি (Biotechnology)'
  ],
  'জীববিজ্ঞান ২য় পত্র (Biology 2nd)': [
    'প্রাণীর বিভিন্নতা ও শ্রেণিবিন্যাস',
    'প্রাণীর পরিচিতি (হাইড্রা, ঘাসফড়িং, রুই মাছ)',
    'পরিপাক ও শোষণ',
    'রক্ত ও সঞ্চালন',
    'শ্বাসক্রিয়া ও শ্বসন',
    'বর্জ্য ও নিষ্কাশন',
    'চলন ও অঙ্গচালনা',
    'সমন্বয় ও নিয়ন্ত্রণ',
    'মানব জীবনের ধারাবাহিকতা',
    'মানবদেহের প্রতিরক্ষা (Immunity)',
    'জীনতত্ত্ব ও বিবর্তন (Genetics & Evolution)'
  ],
  'বাংলা (Bangla)': [
    'গদ্য: অপরিচিতা (Oporichita)',
    'গদ্য: বিলাসী (Bilasi)',
    'গদ্য: আমার পথ (Amar Poth)',
    'গদ্য: মানব কল্যাণ (Manob Kollan)',
    'গদ্য: মাসি-পিসি (Mashi-Pishi)',
    'গদ্য: বায়ান্নর দিনগুলো (Bayannor Dingulo)',
    'গদ্য: রেইনকোট (Raincoat)',
    'কবিতা: সোনার তরী (Sonar Tori)',
    'কবিতা: বিদ্রোহী (Bidrohi)',
    'কবিতা: প্রতিদান (Protidan)',
    'কবিতা: তাহারেই পড়ে মনে (Taharei Pore Mone)',
    'কবিতা: আঠারো বছর বয়স (18 Bochor Boyos)',
    'কবিতা: ফেব্রুয়ারী ১৯৬৯ (February 1969)',
    'উপন্যাস: লালসালু (Lalsalu)',
    'নাটক: সিরাজউদ্দৌলা (Sirajuddaula)',
    'বাংলা ব্যাকরণ (Grammar)'
  ],
  'ইংরেজি (English)': [
    'Prepositions',
    'Special Uses of Words/Phrases',
    'Completing Sentences',
    'Right Form of Verbs',
    'Narrative Style',
    'Modifiers',
    'Connectors',
    'Synonym & Antonym',
    'Punctuation',
    'Written Composition'
  ],
  'আইসিটি (ICT)': [
    'তথ্য ও যোগাযোগ প্রযুক্তি: বিশ্ব ও বাংলাদেশ প্রেক্ষিত',
    'কমিউনিকেশন সিস্টেম ও নেটওয়ার্কিং',
    'সংখ্যা পদ্ধতি ও ডিজিটাল ডিভাইস',
    'ওয়েব ডিজাইন পরিচিতি এবং HTML',
    'প্রোগ্রামিং ভাষা (C Programming)',
    'ডেটাবেজ ম্যানেজমেন্ট সিস্টেম (DBMS)'
  ]
};

export const MOCK_EXAMS: ExamInfo[] = [
  { id: '1', university: 'Dhaka University', unit: 'A Unit (Science)', date: '2024-05-15', notes: 'Focus on Physics & Math' },
  { id: '2', university: 'BUET', unit: 'Engineering', date: '2024-06-01', notes: 'Written Exam' },
  { id: '3', university: 'Medical Admission', unit: 'MBBS', date: '2024-04-10', notes: 'Biology is key' },
  { id: '4', university: 'HSC Final', unit: 'All Subjects', date: '2024-08-17', notes: 'Board Exam' },
];

export const MOCK_QUESTIONS: Question[] = [
  {
    id: 'q1',
    text: 'দুটি ভেক্টরের স্কেলার গুণফল শূন্য হলে, ভেক্টর দুটির মধ্যবর্তী কোণ কত?',
    options: ['0°', '90°', '180°', '45°'],
    correctIndex: 1,
    explanation: 'দুটি ভেক্টরের ডট গুণফল (Scalar Product) শূন্য হলে ভেক্টরদ্বয় পরস্পর লম্ব হয়। অর্থাৎ কোণ 90°।',
    subject: 'পদার্থবিজ্ঞান ১ম পত্র (Physics 1st)',
    topic: 'ভেক্টর (Vectors)',
    reference: 'Chapter 2: Vector'
  },
  {
    id: 'q2',
    text: 'নিচের কোনটি সন্ধিগত মৌল (Transition Element)?',
    options: ['Zn', 'Fe', 'Ca', 'Na'],
    correctIndex: 1,
    explanation: 'Iron (Fe) একটি d-ব্লক মৌল এবং এর সুস্থিত আয়নে d-অরবিটাল আংশিক পূর্ণ থাকে, তাই এটি সন্ধিগত মৌল।',
    subject: 'রসায়ন ১ম পত্র (Chemistry 1st)',
    topic: 'মৌলের পর্যায়বৃত্ত ধর্ম ও রাসায়নিক বন্ধন',
    reference: 'Chapter 3: Periodic Properties'
  },
  {
    id: 'q3',
    text: 'What is the synonym of "Magnanimous"?',
    options: ['Selfish', 'Generous', 'Small', 'Naive'],
    correctIndex: 1,
    explanation: 'Magnanimous means generous or forgiving, especially towards a rival or less powerful person.',
    subject: 'ইংরেজি (English)',
    topic: 'Synonym & Antonym',
    reference: 'Vocabulary Section'
  }
];

export const MOCK_STATS: SubjectPerformance[] = [
  { subject: 'Phy 1st', accuracy: 75 },
  { subject: 'Phy 2nd', accuracy: 65 },
  { subject: 'Chem 1st', accuracy: 60 },
  { subject: 'Math 1st', accuracy: 85 },
  { subject: 'Bio 1st', accuracy: 50 },
];

export const STUDY_TIPS = [
  { title: 'Organic Chemistry', desc: 'জৈব যৌগের বিক্রিয়াগুলো মনে রাখার জন্য ফ্লো-চার্ট (Flowchart) তৈরি করে পড়ো।' },
  { title: 'Math Formulas', desc: 'ত্রিকোণমিতি ও অন্তরীকরণের সূত্রগুলো প্রতিদিন সকালে একবার রিভাইজ করো।' },
  { title: 'Biology Diagrams', desc: 'জীববিজ্ঞানের চিত্রগুলো (যেমন হৃদপিণ্ড, নেফ্রন) আঁকা অনুশীলন করো, এতে সৃজনশীল প্রশ্নে বেশি নম্বর পাওয়া যায়।' }
];