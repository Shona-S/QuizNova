import React, { useEffect, useState, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Navbar from '../../components/Navbar';
import { Clock, ChevronLeft, ChevronRight, Send, AlertTriangle } from 'lucide-react';
import { motion } from 'framer-motion';
import api from '../../services/api';
import { toast } from '../../components/Toast';

const QuizPage = () => {
  const { quizId } = useParams();
  const navigate = useNavigate();
  const [quiz, setQuiz] = useState(null);
  const [loading, setLoading] = useState(true);
  const [currentIdx, setCurrentIdx] = useState(0);
  
  // State to hold answers: questionId -> selectedOption ("A", "B", "C", "D")
  const [answers, setAnswers] = useState({});
  
  // Timer State (in seconds)
  const [timeLeft, setTimeLeft] = useState(0);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const timerRef = useRef(null);
  const submittedRef = useRef(false); // To prevent double auto-submit

  useEffect(() => {
    const fetchQuiz = async () => {
      try {
        const res = await api.get(`/api/user/quiz/${quizId}`);
        setQuiz(res.data);
        if (res.data.timeLimit) {
          setTimeLeft(res.data.timeLimit * 60);
        }
      } catch (err) {
        console.error("Failed to load quiz details", err);
        toast.error("Error loading quiz details.");
        navigate('/user/dashboard');
      } finally {
        setLoading(false);
      }
    };
    fetchQuiz();

    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [quizId]);

  // Timer Tick Down
  useEffect(() => {
    if (loading || !quiz || timeLeft <= 0) {
      if (timeLeft === 0 && quiz && !loading && !submittedRef.current) {
        handleAutoSubmit();
      }
      return;
    }

    timerRef.current = setInterval(() => {
      setTimeLeft(prev => prev - 1);
    }, 1000);

    return () => clearInterval(timerRef.current);
  }, [loading, quiz, timeLeft]);

  const handleSelectOption = (questionId, option) => {
    setAnswers(prev => ({
      ...prev,
      [questionId]: option
    }));
  };

  const handleAutoSubmit = () => {
    toast.warning("Time limit reached! Auto-submitting your quiz.");
    handleSubmit(true);
  };

  const handleSubmit = async (isAuto = false) => {
    if (isSubmitting || submittedRef.current) return;

    if (!isAuto) {
      const confirmSubmit = window.confirm("Are you sure you want to submit your quiz?");
      if (!confirmSubmit) return;
    }

    setIsSubmitting(true);
    submittedRef.current = true;
    if (timerRef.current) clearInterval(timerRef.current);

    try {
      // Build selectedAnswers list
      const selectedAnswers = quiz.questions.map(q => ({
        questionId: q.id,
        selectedAnswer: answers[q.id] || "" // Send empty if unanswered
      }));

      const payload = {
        quizId: parseInt(quizId),
        selectedAnswers
      };

      const res = await api.post('/api/user/quiz/submit', payload);
      toast.success("Quiz submitted successfully!");
      navigate(`/user/results/${res.data.attemptId}`);
    } catch (err) {
      console.error("Quiz submission failed", err);
      toast.error(err.response?.data?.message || "Quiz submission failed.");
      submittedRef.current = false;
      setIsSubmitting(false);
    }
  };

  const formatTime = (seconds) => {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m}:${s < 10 ? '0' : ''}${s}`;
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-zinc-50 dark:bg-[#040405] flex items-center justify-center">
        <div className="flex flex-col items-center gap-3">
          <div className="h-10 w-10 border-4 border-emerald-500 border-t-transparent rounded-full animate-spin" />
          <span className="text-sm font-semibold text-slate-500 dark:text-slate-400">Loading quiz environment...</span>
        </div>
      </div>
    );
  }

  if (!quiz || !quiz.questions || quiz.questions.length === 0) {
    return (
      <div className="min-h-screen bg-zinc-50 dark:bg-[#040405] flex items-center justify-center">
        <div className="p-8 text-center rounded-2xl border border-slate-200 dark:border-white/5 bg-white dark:bg-slate-900/20 max-w-md">
          <AlertTriangle className="h-12 w-12 text-rose-500 mx-auto mb-4" />
          <h3 className="font-bold text-lg text-slate-900 dark:text-white">Empty Quiz</h3>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 mb-4">This quiz doesn't have any questions configured.</p>
          <button onClick={() => navigate('/user/dashboard')} className="px-4 py-2 bg-slate-800 dark:bg-slate-950 text-white rounded-xl text-xs font-bold border border-slate-200 dark:border-white/5">
            Back to Dashboard
          </button>
        </div>
      </div>
    );
  }

  const currentQuestion = quiz.questions[currentIdx];
  const totalQuestions = quiz.questions.length;
  const answeredCount = Object.keys(answers).filter(k => answers[k] !== "").length;
  const progressPercent = Math.round((answeredCount / totalQuestions) * 100);

  return (
    <div className="min-h-screen pb-16 bg-zinc-50 dark:bg-[#040405] text-slate-800 dark:text-slate-100 transition-colors duration-300">
      <Navbar />

      <div className="pt-32 max-w-6xl mx-auto px-6 md:px-12">
        {/* Top Header Controls */}
        <div className="flex justify-between items-center mb-6">
          <div className="flex flex-col text-left">
            <span className="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest">{quiz.subjectName}</span>
            <h1 className="text-xl md:text-2xl font-extrabold text-slate-900 dark:text-white tracking-tight">{quiz.title}</h1>
          </div>

          {/* Sticky/Header Timer Card */}
          <div className={`flex items-center gap-2 px-4 py-2 rounded-2xl border font-bold text-sm shadow-sm transition-all duration-300 ${
            timeLeft < 60 
              ? 'bg-rose-500/10 text-rose-500 border-rose-500/20 animate-pulse' 
              : 'bg-white dark:bg-slate-900/30 border-slate-200 dark:border-white/5 text-slate-700 dark:text-slate-300'
          }`}>
            <Clock className="h-4 w-4" />
            <span>Time Left: {formatTime(timeLeft)}</span>
          </div>
        </div>

        {/* Progress Tracker bar */}
        <div className="w-full bg-slate-200 dark:bg-slate-950 rounded-full h-1.5 mb-8 overflow-hidden border border-slate-100 dark:border-white/5">
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: `${progressPercent}%` }}
            transition={{ duration: 0.3 }}
            className="bg-emerald-600 dark:bg-emerald-500 h-full rounded-full"
          />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Main Question Answer Area */}
          <div className="lg:col-span-3 flex flex-col gap-6 text-left">
            {/* Question Text Panel */}
            <div className="p-6 rounded-2xl border border-slate-200 dark:border-white/5 bg-white dark:bg-slate-900/10 shadow-sm">
              <div className="flex justify-between items-center mb-4">
                <span className="text-xs font-bold text-emerald-600 dark:text-emerald-400">
                  Question {currentIdx + 1} of {totalQuestions}
                </span>
                <span className="text-xs font-bold px-2 py-0.5 rounded bg-slate-100 dark:bg-slate-950 text-slate-500 dark:text-slate-400">
                  {currentQuestion.marks} {currentQuestion.marks === 1 ? 'Mark' : 'Marks'}
                </span>
              </div>
              <h2 className="text-lg font-bold text-slate-900 dark:text-white leading-relaxed">
                {currentQuestion.questionTitle}
              </h2>
            </div>

            {/* MCQ Options list */}
            <div className="flex flex-col gap-3">
              {[
                { label: 'A', value: currentQuestion.optionA },
                { label: 'B', value: currentQuestion.optionB },
                { label: 'C', value: currentQuestion.optionC },
                { label: 'D', value: currentQuestion.optionD }
              ].map(opt => {
                const isSelected = answers[currentQuestion.id] === opt.label;
                return (
                  <button
                    key={opt.label}
                    onClick={() => handleSelectOption(currentQuestion.id, opt.label)}
                    className={`p-4 rounded-xl border text-left flex items-center gap-4 transition-all duration-200 ${
                      isSelected
                        ? 'border-emerald-600 dark:border-emerald-500 bg-emerald-500/10 text-emerald-700 dark:text-emerald-300 font-bold shadow-md shadow-emerald-500/5'
                        : 'border-slate-200 dark:border-white/5 bg-white hover:bg-slate-50/50 dark:bg-slate-900/20 dark:hover:bg-slate-900/40 text-slate-700 dark:text-slate-300'
                    }`}
                  >
                    <span className={`h-8 w-8 rounded-lg flex items-center justify-center font-extrabold text-sm border transition-all ${
                      isSelected
                        ? 'bg-emerald-600 dark:bg-emerald-500 text-white border-transparent'
                        : 'bg-slate-100 dark:bg-slate-950/60 border-slate-200 dark:border-white/5 text-slate-700 dark:text-slate-300'
                    }`}>
                      {opt.label}
                    </span>
                    <span className="text-sm font-semibold">{opt.value}</span>
                  </button>
                );
              })}
            </div>

            {/* Toolbar Buttons */}
            <div className="flex justify-between items-center mt-4">
              <button
                disabled={currentIdx === 0}
                onClick={() => setCurrentIdx(prev => prev - 1)}
                className="px-4 py-2.5 text-xs font-extrabold rounded-xl border border-slate-200 dark:border-white/5 bg-white dark:bg-slate-900/30 text-slate-700 dark:text-slate-300 disabled:opacity-50 flex items-center gap-1.5 transition-all"
              >
                <ChevronLeft className="h-4 w-4" /> Previous
              </button>

              {currentIdx < totalQuestions - 1 ? (
                <button
                  onClick={() => setCurrentIdx(prev => prev + 1)}
                  className="px-4 py-2.5 text-xs font-extrabold rounded-xl bg-emerald-600 hover:bg-emerald-700 dark:bg-emerald-500 dark:hover:bg-emerald-600 text-white flex items-center gap-1.5 shadow-md shadow-emerald-500/10 transition-all"
                >
                  Next <ChevronRight className="h-4 w-4" />
                </button>
              ) : (
                <button
                  disabled={isSubmitting}
                  onClick={() => handleSubmit(false)}
                  className="px-5 py-2.5 text-xs font-extrabold rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white flex items-center gap-1.5 shadow-md shadow-emerald-500/10 transition-all hover:opacity-95"
                >
                  <Send className="h-4 w-4" /> {isSubmitting ? 'Submitting...' : 'Submit Quiz'}
                </button>
              )}
            </div>
          </div>

          {/* Sidebar Navigation */}
          <div className="flex flex-col gap-4 text-left">
            <div className="p-5 rounded-2xl border border-slate-200 dark:border-white/5 bg-white dark:bg-slate-900/10 shadow-sm flex flex-col gap-4">
              <div className="flex flex-col gap-1">
                <span className="font-extrabold text-sm text-slate-900 dark:text-white">Question Navigation</span>
                <span className="text-[10px] text-slate-400 dark:text-slate-500 font-bold uppercase tracking-wider">
                  Answered: {answeredCount} / {totalQuestions}
                </span>
              </div>

              {/* Number Buttons Grid */}
              <div className="grid grid-cols-5 gap-2">
                {quiz.questions.map((q, idx) => {
                  const isAnswered = answers[q.id] && answers[q.id] !== "";
                  const isActive = idx === currentIdx;
                  return (
                    <button
                      key={q.id}
                      onClick={() => setCurrentIdx(idx)}
                      className={`h-9 w-9 rounded-lg font-bold text-xs flex items-center justify-center transition-all ${
                        isActive
                          ? 'bg-emerald-600 dark:bg-emerald-500 text-white shadow-md shadow-emerald-500/10 ring-2 ring-emerald-600/20'
                          : isAnswered
                          ? 'bg-slate-200 dark:bg-emerald-500/20 text-slate-800 dark:text-emerald-400 border border-emerald-500/10'
                          : 'bg-slate-100 dark:bg-slate-950/60 text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-800'
                      }`}
                    >
                      {idx + 1}
                    </button>
                  );
                })}
              </div>

              {/* Legend info */}
              <div className="flex flex-col gap-1.5 pt-4 border-t border-slate-100 dark:border-white/5 text-[10px] font-bold text-slate-400 dark:text-slate-500">
                <div className="flex items-center gap-1.5">
                  <div className="h-2.5 w-2.5 rounded bg-emerald-600 dark:bg-emerald-500" />
                  <span>Current Question</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <div className="h-2.5 w-2.5 rounded bg-slate-200 dark:bg-emerald-500/20 border border-emerald-500/10" />
                  <span>Answered</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <div className="h-2.5 w-2.5 rounded bg-slate-100 dark:bg-slate-950/60" />
                  <span>Unanswered</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default QuizPage;
