import React, { useEffect, useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import Navbar from '../../components/Navbar';
import { Download, LayoutDashboard, CheckCircle2, XCircle, ChevronLeft, HelpCircle } from 'lucide-react';
import { motion } from 'framer-motion';
import api from '../../services/api';
import { toast } from '../../components/Toast';

const ResultPage = () => {
  const { attemptId } = useParams();
  const navigate = useNavigate();
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(true);
  const [downloading, setDownloading] = useState(false);

  useEffect(() => {
    const fetchResult = async () => {
      try {
        const res = await api.get(`/api/user/results/${attemptId}`);
        setResult(res.data);
      } catch (err) {
        console.error("Failed to load quiz results", err);
        toast.error("Error loading quiz results.");
        navigate('/user/dashboard');
      } finally {
        setLoading(false);
      }
    };
    fetchResult();
  }, [attemptId]);

  const handleDownloadPdf = async () => {
    if (downloading) return;
    setDownloading(true);
    try {
      const res = await api.get(`/api/user/results/${attemptId}/download`, {
        responseType: 'blob'
      });
      const blob = new Blob([res.data], { type: 'application/pdf' });
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `QuizNova_Result_${attemptId}.pdf`);
      document.body.appendChild(link);
      link.click();
      link.parentNode.removeChild(link);
      window.URL.revokeObjectURL(url);
      toast.success("PDF downloaded successfully!");
    } catch (err) {
      console.error("PDF download failed", err);
      toast.error("Failed to download PDF.");
    } finally {
      setDownloading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-zinc-50 dark:bg-[#040405] flex items-center justify-center">
        <div className="flex flex-col items-center gap-3">
          <div className="h-10 w-10 border-4 border-emerald-500 border-t-transparent rounded-full animate-spin" />
          <span className="text-sm font-semibold text-slate-500 dark:text-slate-400">Loading results sheet...</span>
        </div>
      </div>
    );
  }

  if (!result) return null;

  return (
    <div className="min-h-screen pb-16 bg-zinc-50 dark:bg-[#040405] text-slate-800 dark:text-slate-100 transition-colors duration-300">
      <Navbar />

      <div className="pt-32 max-w-4xl mx-auto px-6 text-left">
        {/* Back Link */}
        <Link
          to="/user/dashboard"
          className="inline-flex items-center gap-1 text-sm font-semibold text-slate-500 dark:text-slate-400 hover:text-emerald-500 dark:hover:text-emerald-400 transition-colors mb-6 group"
        >
          <ChevronLeft className="h-4 w-4 group-hover:-translate-x-1 transition-transform" />
          Back to Dashboard
        </Link>

        {/* Score Header Card */}
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          className="p-8 rounded-3xl border border-slate-200 dark:border-white/5 bg-white dark:bg-slate-900/20 backdrop-blur-xl shadow-sm mb-8 flex flex-col md:flex-row justify-between items-center gap-6"
        >
          <div className="flex flex-col gap-2">
            <span className="text-xs uppercase tracking-wider font-extrabold text-emerald-500 dark:text-emerald-400">{result.subjectName}</span>
            <h1 className="text-2xl md:text-3xl font-extrabold tracking-tight text-slate-900 dark:text-white">
              {result.quizTitle}
            </h1>
            <p className="text-sm text-slate-500 dark:text-slate-400">
              Attempt completed on {new Date(result.submittedAt).toLocaleString()}
            </p>
          </div>

          <div className="flex items-center gap-4">
            <button
              onClick={handleDownloadPdf}
              disabled={downloading}
              className="px-4 py-2.5 text-xs font-bold text-white bg-emerald-600 hover:bg-emerald-700 dark:bg-emerald-500 dark:hover:bg-emerald-600 rounded-xl transition-all flex items-center gap-1.5 shadow-md shadow-emerald-500/10 active:scale-95 disabled:opacity-50"
            >
              <Download className="h-4 w-4" /> {downloading ? 'Downloading...' : 'Download PDF'}
            </button>

            <button
              onClick={() => navigate('/user/dashboard')}
              className="px-4 py-2.5 text-xs font-bold rounded-xl border border-slate-200 dark:border-white/5 bg-white hover:bg-slate-50 dark:bg-slate-900/30 dark:hover:bg-slate-900/50 text-slate-700 dark:text-slate-300 transition-all flex items-center gap-1.5 active:scale-95"
            >
              <LayoutDashboard className="h-4 w-4" /> Dashboard
            </button>
          </div>
        </motion.div>

        {/* Detailed Stats Row */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-10">
          {[
            { label: "Points Earned", value: `${result.score} / ${result.totalMarks}`, color: "text-emerald-500" },
            { label: "Final Percentage", value: `${result.percentage}%`, color: result.percentage >= 50 ? "text-emerald-500" : "text-rose-500" },
            { label: "Correct Answers", value: result.correctAnswers, color: "text-emerald-500" },
            { label: "Wrong Answers", value: result.wrongAnswers, color: "text-rose-500" }
          ].map((stat, idx) => (
            <div
              key={idx}
              className="p-5 rounded-2xl border border-slate-200 dark:border-white/5 bg-white dark:bg-slate-900/20 shadow-sm flex flex-col gap-1 text-center"
            >
              <span className="text-[10px] font-extrabold text-slate-400 dark:text-slate-500 uppercase tracking-wider">{stat.label}</span>
              <span className={`text-xl font-extrabold ${stat.color} mt-1`}>{stat.value}</span>
            </div>
          ))}
        </div>

        {/* Detailed Question Review Section */}
        <div className="mb-6">
          <h2 className="text-xl font-extrabold tracking-tight text-slate-900 dark:text-white">Question Review</h2>
          <p className="text-xs text-slate-500 dark:text-slate-400">Review your choices against the correct answers below</p>
        </div>

        <div className="flex flex-col gap-6">
          {result.detailedReview && result.detailedReview.map((review, index) => {
            const hasAnswered = review.selectedAnswer && review.selectedAnswer.trim() !== "";
            const isCorrect = review.isCorrect ?? review.correct;
            
            return (
              <motion.div
                key={review.questionId}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
                className="p-6 rounded-2xl border border-slate-200 dark:border-white/5 bg-white dark:bg-slate-900/10 shadow-sm"
              >
                {/* Header review */}
                <div className="flex justify-between items-start gap-4 mb-4">
                  <div className="flex flex-col text-left">
                    <span className="text-xs font-bold text-emerald-500 dark:text-emerald-400">Question {index + 1}</span>
                    <h3 className="font-extrabold text-slate-900 dark:text-white text-base mt-1">
                      {review.questionTitle}
                    </h3>
                  </div>
                  
                  <span className={`flex items-center gap-1.5 px-3 py-1 rounded-xl text-xs font-bold border ${
                    !hasAnswered ? 'bg-slate-100 text-slate-500 border-slate-200 dark:bg-slate-950 dark:border-white/5' :
                    isCorrect ? 'bg-emerald-500/10 text-emerald-500 border-emerald-500/20' :
                    'bg-rose-500/10 text-rose-500 border-rose-500/20'
                  }`}>
                    {!hasAnswered ? <HelpCircle className="h-3.5 w-3.5" /> : isCorrect ? <CheckCircle2 className="h-3.5 w-3.5" /> : <XCircle className="h-3.5 w-3.5" />}
                    {!hasAnswered ? 'Unanswered' : isCorrect ? 'Correct' : 'Incorrect'}
                  </span>
                </div>

                {/* Grid Choices */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mt-4">
                  {[
                    { label: 'A', value: review.optionA },
                    { label: 'B', value: review.optionB },
                    { label: 'C', value: review.optionC },
                    { label: 'D', value: review.optionD }
                  ].map(opt => {
                    const isUserSelected = review.selectedAnswer === opt.label;
                    const isCorrectAnswer = review.correctAnswer === opt.label;
                    
                    let cardBorderClass = 'border-slate-200 dark:border-white/5 bg-slate-50/50 dark:bg-slate-950/20';
                    let labelBgClass = 'bg-slate-100 dark:bg-slate-900 text-slate-500 dark:text-slate-400 border-slate-200 dark:border-white/5';
                    
                    if (isUserSelected && isCorrect) {
                      cardBorderClass = 'border-emerald-600 dark:border-emerald-500 bg-emerald-500/5 text-emerald-700 dark:text-emerald-300 font-bold';
                      labelBgClass = 'bg-emerald-600 text-white border-transparent';
                    } else if (isUserSelected && !isCorrect) {
                      cardBorderClass = 'border-rose-600 dark:border-rose-500 bg-rose-500/5 text-rose-700 dark:text-rose-300 font-bold';
                      labelBgClass = 'bg-rose-600 text-white border-transparent';
                    } else if (isCorrectAnswer) {
                      cardBorderClass = 'border-emerald-600 dark:border-emerald-500 bg-emerald-500/5 text-emerald-700 dark:text-emerald-300 font-bold';
                      labelBgClass = 'bg-emerald-600 text-white border-transparent';
                    }
                    
                    return (
                      <div
                        key={opt.label}
                        className={`p-3.5 rounded-xl border flex items-center gap-3 text-sm transition-all ${cardBorderClass}`}
                      >
                        <span className={`h-6 w-6 rounded flex items-center justify-center font-extrabold text-xs border ${labelBgClass}`}>
                          {opt.label}
                        </span>
                        <span className="font-semibold text-xs md:text-sm">{opt.value}</span>
                      </div>
                    );
                  })}
                </div>

                {/* Score indicators */}
                <div className="flex justify-between items-center text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest pt-4 border-t border-slate-100 dark:border-white/5 mt-4">
                  <span>Award: {isCorrect ? review.marks : 0} / {review.marks} Marks</span>
                  <span>Correct Answer: {review.correctAnswer}</span>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default ResultPage;
