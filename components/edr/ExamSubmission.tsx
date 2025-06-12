import { useState, useEffect } from 'react';
import { FiClock, FiAlertCircle, FiCheckCircle } from 'react-icons/fi';

interface ExamSubmissionProps {
  onViewChange: (view: string) => void;
}

interface Question {
  id: string;
  type: 'mcq' | 'text' | 'media';
  question: string;
  options?: string[];
  mediaUrl?: string;
  answer?: string;
}

interface Exam {
  id: string;
  title: string;
  duration: number; // in minutes
  questions: Question[];
  totalMarks: number;
}

export default function ExamSubmission({ onViewChange }: ExamSubmissionProps) {
  const [exam, setExam] = useState<Exam | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [timeLeft, setTimeLeft] = useState<number>(0);
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    // TODO: Replace with actual API call
    const fetchExam = async () => {
      try {
        // Mock exam data
        const mockExam: Exam = {
          id: '1',
          title: 'Medical Practitioner Certification',
          duration: 120,
          totalMarks: 100,
          questions: [
            {
              id: '1',
              type: 'mcq',
              question: 'What is the primary function of the heart?',
              options: [
                'Pumping blood throughout the body',
                'Filtering blood',
                'Producing blood cells',
                'Storing blood',
              ],
            },
            {
              id: '2',
              type: 'text',
              question: 'Explain the process of blood circulation in the human body.',
            },
            {
              id: '3',
              type: 'media',
              question: 'Identify the medical condition shown in the image below.',
              mediaUrl: '/sample-medical-image.jpg',
            },
          ],
        };

        setExam(mockExam);
        setTimeLeft(mockExam.duration * 60); // Convert minutes to seconds
        setLoading(false);
      } catch (err) {
        setError('Failed to load exam. Please try again.');
        console.error('Error loading exam:', err);
        setLoading(false);
      }
    };

    fetchExam();
  }, []);

  useEffect(() => {
    if (timeLeft > 0) {
      const timer = setInterval(() => {
        setTimeLeft(prev => prev - 1);
      }, 1000);

      return () => clearInterval(timer);
    } else {
      // Auto-submit when time runs out
      handleSubmit();
    }
  }, [timeLeft]);

  const handleAnswerChange = (questionId: string, answer: string) => {
    setAnswers(prev => ({
      ...prev,
      [questionId]: answer,
    }));
  };

  const handleSubmit = async () => {
    if (!exam) return;

    setSubmitting(true);
    try {
      // TODO: Replace with actual API call
      await new Promise(resolve => setTimeout(resolve, 1500));

      // Check if all questions are answered
      const unansweredQuestions = exam.questions.filter(q => !answers[q.id]);
      if (unansweredQuestions.length > 0) {
        if (!window.confirm('You have unanswered questions. Are you sure you want to submit?')) {
          setSubmitting(false);
          return;
        }
      }

      // Redirect to results page
      onViewChange('result');
    } catch (err) {
      setError('Failed to submit exam. Please try again.');
      console.error('Submission error:', err);
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-500"></div>
      </div>
    );
  }

  if (!exam) {
    return (
      <div className="text-center py-12">
        <FiAlertCircle className="mx-auto h-12 w-12 text-red-500" />
        <h3 className="mt-2 text-sm font-medium text-gray-900">No exam found</h3>
        <p className="mt-1 text-sm text-gray-500">
          The exam you're looking for doesn't exist or you don't have access to it.
        </p>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto">
      {/* Exam Header */}
      <div className="bg-white shadow sm:rounded-lg mb-6">
        <div className="px-4 py-5 sm:p-6">
          <div className="flex justify-between items-center">
            <h3 className="text-lg leading-6 font-medium text-gray-900">{exam.title}</h3>
            <div className="flex items-center text-sm font-medium text-gray-500">
              <FiClock className="mr-2 h-5 w-5" />
              Time Left: {Math.floor(timeLeft / 60)}:{(timeLeft % 60).toString().padStart(2, '0')}
            </div>
          </div>
          <div className="mt-2 max-w-xl text-sm text-gray-500">
            <p>Total Marks: {exam.totalMarks}</p>
          </div>
        </div>
      </div>

      {error && (
        <div className="mb-6 rounded-md bg-red-50 p-4">
          <div className="flex">
            <div className="flex-shrink-0">
              <FiAlertCircle className="h-5 w-5 text-red-400" />
            </div>
            <div className="ml-3">
              <h3 className="text-sm font-medium text-red-800">{error}</h3>
            </div>
          </div>
        </div>
      )}

      {/* Questions */}
      <div className="space-y-8">
        {exam.questions.map((question, index) => (
          <div key={question.id} className="bg-white shadow sm:rounded-lg">
            <div className="px-4 py-5 sm:p-6">
              <h4 className="text-base font-medium text-gray-900">Question {index + 1}</h4>
              <p className="mt-1 text-sm text-gray-500">{question.question}</p>

              {question.type === 'mcq' && question.options && (
                <div className="mt-4 space-y-4">
                  {question.options.map((option, optionIndex) => (
                    <div key={optionIndex} className="flex items-center">
                      <input
                        type="radio"
                        name={`question-${question.id}`}
                        value={option}
                        checked={answers[question.id] === option}
                        onChange={e => handleAnswerChange(question.id, e.target.value)}
                        className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300"
                      />
                      <label className="ml-3 block text-sm font-medium text-gray-700">
                        {option}
                      </label>
                    </div>
                  ))}
                </div>
              )}

              {question.type === 'text' && (
                <div className="mt-4">
                  <textarea
                    rows={4}
                    className="shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm border-gray-300 rounded-md"
                    value={answers[question.id] || ''}
                    onChange={e => handleAnswerChange(question.id, e.target.value)}
                    placeholder="Type your answer here..."
                  />
                </div>
              )}

              {question.type === 'media' && question.mediaUrl && (
                <div className="mt-4">
                  <img
                    src={question.mediaUrl}
                    alt="Question media"
                    className="max-w-full h-auto rounded-lg"
                  />
                  <div className="mt-4">
                    <textarea
                      rows={4}
                      className="shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm border-gray-300 rounded-md"
                      value={answers[question.id] || ''}
                      onChange={e => handleAnswerChange(question.id, e.target.value)}
                      placeholder="Describe what you see..."
                    />
                  </div>
                </div>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* Submit Button */}
      <div className="mt-8 flex justify-end">
        <button
          type="button"
          onClick={handleSubmit}
          disabled={submitting}
          className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
        >
          {submitting ? (
            <>
              <div className="animate-spin rounded-full h-4 w-4 border-t-2 border-b-2 border-white mr-2"></div>
              Submitting...
            </>
          ) : (
            <>
              <FiCheckCircle className="mr-2 h-5 w-5" />
              Submit Exam
            </>
          )}
        </button>
      </div>
    </div>
  );
}
