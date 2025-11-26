export enum UnitType {
  SCIENCE = 'Science (Unit A)',
  ARTS = 'Arts (Unit B)',
  COMMERCE = 'Commerce (Unit C)'
}

export interface Question {
  id: string;
  text: string;
  options: string[];
  correctIndex: number;
  explanation: string;
  subject: string;
  topic: string;
  reference?: string; // New field for Textbook/Chapter reference
}

export interface ExamInfo {
  id: string;
  university: string;
  unit: string;
  date: string;
  notes: string;
}

export interface ChatMessage {
  id: string;
  role: 'user' | 'model';
  text: string;
  timestamp: Date;
}

export interface UserStats {
  totalQuestions: number;
  accuracy: number;
  streakDays: number;
  studyTimeMinutes: number;
}

export interface SubjectPerformance {
  subject: string;
  accuracy: number;
}