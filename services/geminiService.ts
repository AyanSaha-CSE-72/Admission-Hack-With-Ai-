import { GoogleGenAI, GenerateContentResponse, Type } from "@google/genai";
import { Question } from "../types";
import { MOCK_QUESTIONS } from "../constants";

// NOTE: Using process.env for API Key as per guidelines
// On Netlify/Vercel, set API_KEY in your deployment settings.

const API_KEY = process.env.API_KEY || '';
const USE_MOCK = !API_KEY;

// Initialize Gemini Client only if key exists to prevent immediate errors
let ai: GoogleGenAI | null = null;
if (API_KEY) {
  ai = new GoogleGenAI({ apiKey: API_KEY });
}

export const generateAIResponse = async (userMessage: string): Promise<string> => {
  if (USE_MOCK || !ai) {
    // Mock latency
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    // Simple mock logic based on keywords
    if (userMessage.includes('ভেক্টর')) {
      return "ভেক্টর (Vector) হলো এমন একটি রাশি যার মান এবং দিক উভয়ই আছে। যেমন: সরণ, বেগ, ত্বরণ, বল। পক্ষান্তরে, স্কেলার রাশির শুধু মান আছে, দিক নেই।";
    }
    if (userMessage.includes('admission') || userMessage.includes('ভর্তি')) {
      return "বিশ্ববিদ্যালয় ভর্তির জন্য মূল বই (Textbook) খুব ভালো করে পড়া উচিত। পাশাপাশি বিগত বছরের প্রশ্ন সমাধান করলে প্রশ্নের ধরণ সম্পর্কে ধারণা পাওয়া যায়।";
    }
    return "চমৎকার প্রশ্ন! আমি এটি নিয়ে ভাবছি। আসলে, ভর্তির প্রস্তুতির জন্য এই টপিকটি বেশ গুরুত্বপূর্ণ। বিস্তারিত ব্যাখ্যার জন্য আপনার পাঠ্যবইয়ের সংশ্লিষ্ট অধ্যায়টি দেখতে পারেন, অথবা আমাকে আরও সুনির্দিষ্ট প্রশ্ন করতে পারেন।";
  }

  try {
    const model = 'gemini-2.5-flash';
    const response: GenerateContentResponse = await ai.models.generateContent({
      model: model,
      contents: userMessage,
      config: {
        systemInstruction: "You are a helpful and knowledgeable university admission tutor for Bangladeshi students. Answer primarily in Bangla, but use English for technical scientific terms. Keep answers concise, encouraging, and focused on exam preparation logic.",
      }
    });
    
    return response.text || "দুঃখিত, আমি উত্তরটি খুঁজে পাইনি। আবার চেষ্টা করুন।";
  } catch (error) {
    console.error("Gemini API Error:", error);
    return "দুঃখিত, সংযোগে সমস্যা হচ্ছে। কিছুক্ষণ পর আবার চেষ্টা করুন।";
  }
};

export const generateExplanation = async (questionText: string, chosenOption: string, correctOption: string): Promise<string> => {
    if (USE_MOCK || !ai) {
        await new Promise(resolve => setTimeout(resolve, 1000));
        return `সঠিক উত্তর হলো '${correctOption}'। এটি বেছে নেয়ার কারণ হলো বৈজ্ঞানিক ব্যাখ্যা এবং গাণিতিক যুক্তি যা পাঠ্যবইয়ের ধারণার সাথে সঙ্গতিপূর্ণ।`;
    }

    try {
        const prompt = `Explain in Bangla why '${correctOption}' is the correct answer to the question: "${questionText}". The student chose '${chosenOption}'. Keep the explanation short and educational.`;
        const response: GenerateContentResponse = await ai.models.generateContent({
            model: 'gemini-2.5-flash',
            contents: prompt,
        });
        return response.text || "ব্যাখ্যা পাওয়া যায়নি।";
    } catch (error) {
        return "ব্যাখ্যা লোড করা যায়নি।";
    }
}

export const generateQuestions = async (subject: string, topic: string, difficulty: string = 'Medium', count: number = 5): Promise<Question[]> => {
  if (USE_MOCK || !ai) {
      await new Promise(resolve => setTimeout(resolve, 2000));
      // In mock mode, return a mixed set or basic mock, ensuring we respect the count roughly
      const baseMocks = MOCK_QUESTIONS;
      // Repeat mocks if count is larger than available mocks
      let result: Question[] = [];
      while(result.length < count) {
        result = result.concat(baseMocks);
      }
      return result.slice(0, count).map((q, i) => ({...q, id: `mock-${Date.now()}-${i}`})); 
  }

  try {
      let specificInstructions = "";
      let fullPrompt = "";

      // Handle Full Model Test separately
      if (subject === 'FULL_ADMISSION_TEST') {
        fullPrompt = `Generate a COMPREHENSIVE University Admission Model Test with exactly ${count} Multiple Choice Questions (MCQ).
        
        Distribution:
        - Physics: ~20% (Mix of 1st & 2nd Paper)
        - Chemistry: ~20% (Mix of 1st & 2nd Paper)
        - Higher Math: ~20% (Mix of 1st & 2nd Paper)
        - Biology: ~20% (Mix of 1st & 2nd Paper)
        - Bangla & English: ~20%

        Requirements:
        - Difficulty: Mixed (Standard Admission Test Level).
        - Language: Bangla (Main text in Bangla).
        - 4 options per question.
        - One correct answer.
        - Short explanation in Bangla.
        - REFERENCE: Provide the chapter name or book section (e.g. 'Physics 1st Paper, Chapter 2').
        
        The questions should NOT be topic-specific but SUBJECT-WISE (random chapters from the full syllabus).
        `;
      } 
      // Handle Regular Topic-wise Practice
      else {
        // Specific handling for Bangla to ensure deep, content-based questions
        if (subject.includes('Bangla') || subject.includes('বাংলা')) {
            specificInstructions = `
            IMPORTANT FOR BANGLA LITERATURE:
            - Generate questions strictly based on the CONTENT of the selected story/poem/novel/drama from the NCTB HSC Textbook.
            - Ask about: specific events, character traits/quotes, significant lines, metaphors, or underlying themes.
            - DO NOT ask generic questions about the author's birth date, death date, or village unless it is highly significant.
            - Focus on critical analysis suitable for University Admission tests.
            `;
        } else {
          specificInstructions = `
            - Questions MUST be based on the NCTB HSC (Intermediate) Board Textbooks.
            - Focus on conceptual understanding, problem-solving, and book-specific examples.
            - For '2nd Paper' subjects, strictly adhere to the 2nd paper syllabus chapters.
            - Provide a 'reference' indicating the Chapter Name or Key Concept from the book (e.g., 'Chapter 3: Thermodynamics').
          `;
        }

        fullPrompt = `Generate ${count} multiple choice questions (MCQ) for university admission in Bangladesh.
        Subject: ${subject}
        Topic: ${topic === 'All' ? 'Random selection from HSC Syllabus' : topic}
        Difficulty: ${difficulty}
        Language: Bangla (Main text in Bangla).
        
        Requirements:
        - 4 options per question.
        - One correct answer.
        - Short explanation in Bangla.
        - REFERENCE: Provide the chapter name or book section (e.g. 'Chapter 4: Work, Power & Energy')
        - Difficulty should match the requested level (${difficulty}).
        ${specificInstructions}
        `;
      }

      const response = await ai.models.generateContent({
          model: 'gemini-2.5-flash',
          contents: fullPrompt,
          config: {
              responseMimeType: 'application/json',
              responseSchema: {
                  type: Type.ARRAY,
                  items: {
                      type: Type.OBJECT,
                      properties: {
                          text: { type: Type.STRING },
                          options: { type: Type.ARRAY, items: { type: Type.STRING } },
                          correctIndex: { type: Type.INTEGER },
                          explanation: { type: Type.STRING },
                          reference: { type: Type.STRING, description: "The chapter or concept name from the HSC textbook" },
                          subject: { type: Type.STRING, description: "The subject name for this specific question (e.g., Physics, Chemistry)" }
                      },
                      required: ['text', 'options', 'correctIndex', 'explanation']
                  }
              },
              systemInstruction: "You are an expert question setter for Dhaka University and BUET admission exams. You strictly follow the Bangladesh HSC curriculum and NCTB Textbooks."
          }
      });

      const rawQuestions = JSON.parse(response.text || '[]');
      
      // Map to application Question type
      return rawQuestions.map((q: any, idx: number) => ({
          id: `ai-${Date.now()}-${idx}`,
          text: q.text,
          options: q.options,
          correctIndex: q.correctIndex,
          explanation: q.explanation,
          subject: q.subject || subject, // Use AI provided subject for mixed tests, or fallback to selected subject
          topic: topic === 'All' ? 'Mixed' : topic,
          reference: q.reference // Map the new reference field
      }));

  } catch (error) {
      console.error("Error generating questions:", error);
      return [];
  }
}