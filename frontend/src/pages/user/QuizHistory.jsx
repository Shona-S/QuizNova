import React, { useEffect, useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import Navbar from '../../components/Navbar';
import { ChevronLeft, Calendar, FileText, Download, Award, Search } from 'lucide-react';
import { motion } from 'framer-motion';
import api from '../../services/api';
import { toast } from '../../components/Toast';

const QuizHistory = () => {
  const navigate = useNavigate();
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [downloadingId, setDownloadingId] = useState(null);

  useEffect(() => {
    const fetchHistory = async () => {
      try {
        const res = await api.get('/api/user/history');
        setHistory(res.data);
      } catch (err) {
        console.error("Failed to load attempt history", err);
        toast.error("Error loading quiz history.");
      } finally {
        setLoading(false);
      }
    };
    fetchHistory();
  }, []);

  const handleDownloadPdf = async (attemptId, e) => {
    e.preventDefault();
    e.stopPropagation();
    
    setDownloadingId(attemptId);
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
      toast.success("PDF result sheet downloaded!");
    } catch (err) {
      console.error("PDF download failed", err);
      toast.error("Failed to download PDF.");
    } finally {
      setDownloadingId(null);
    }
  };

  const filteredHistory = history.filter(item => 
    item.quizTitle.toLowerCase().includes(searchTerm.toLowerCase()) ||
    item.subjectName.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="min-h-screen pb-16 bg-zinc-50 dark:bg-[#040405] text-slate-800 dark:text-slate-100 transition-colors duration-300">
      <Navbar />

      <div className="pt-32 max-w-5xl mx-auto px-6 text-left">
        {/* Back link */}
        <Link
          to="/user/dashboard"
          className="inline-flex items-center gap-1 text-sm font-semibold text-slate-500 dark:text-slate-400 hover:text-emerald-500 dark:hover:text-emerald-400 transition-colors mb-6 group"
        >
          <ChevronLeft className="h-4 w-4 group-hover:-translate-x-1 transition-transform" />
          Back to Dashboard
        </Link>

        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
          <div className="flex flex-col gap-1">
            <h1 className="text-3xl font-extrabold tracking-tight text-slate-900 dark:text-white">Attempt History</h1>
            <p className="text-xs text-slate-500 dark:text-slate-400">Review all your previous quiz results and download answer sheets</p>
          </div>

          {/* Search bar */}
          <div className="relative w-full md:w-72">
            <Search className="absolute left-3.5 top-2.5 h-4 w-4 text-slate-400" />
            <input
              type="text"
              placeholder="Search by quiz or subject..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 text-xs font-semibold rounded-xl border border-slate-200 dark:border-white/5 bg-white dark:bg-slate-900/30 text-slate-800 dark:text-slate-200 placeholder-slate-400 dark:placeholder-slate-500 focus:outline-none focus:border-emerald-500 transition-all"
            />
          </div>
        </div>

        {/* History Records Container */}
        {loading ? (
          <div className="flex flex-col items-center justify-center py-20 gap-3">
            <div className="h-10 w-10 border-4 border-emerald-500 border-t-transparent rounded-full animate-spin" />
            <span className="text-sm text-slate-500 dark:text-slate-400 font-medium">Fetching history records...</span>
          </div>
        ) : filteredHistory.length > 0 ? (
          <div className="flex flex-col gap-4">
            {filteredHistory.map((item, index) => (
              <motion.div
                key={item.attemptId}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.03 }}
                onClick={() => navigate(`/user/results/${item.attemptId}`)}
                className="group cursor-pointer p-5 rounded-2xl border border-slate-200 dark:border-white/5 bg-white hover:bg-slate-50/50 dark:bg-slate-900/10 dark:hover:bg-slate-900/20 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4 transition-all duration-300"
              >
                <div className="flex items-start gap-4">
                  <div className="h-10 w-10 rounded-xl bg-emerald-500/10 flex items-center justify-center text-emerald-600 dark:text-emerald-400 shrink-0">
                    <Award className="h-5 w-5" />
                  </div>
                  <div className="flex flex-col text-left">
                    <h3 className="font-extrabold text-slate-900 dark:text-white group-hover:text-emerald-500 dark:group-hover:text-emerald-400 transition-colors text-base">
                      {item.quizTitle}
                    </h3>
                    <div className="flex items-center flex-wrap gap-x-4 gap-y-1 text-xs text-slate-400 dark:text-slate-500 mt-1 font-semibold">
                      <span>{item.subjectName}</span>
                      <span className="flex items-center gap-1">
                        <Calendar className="h-3.5 w-3.5" />
                        {new Date(item.submittedAt).toLocaleDateString(undefined, { year: 'numeric', month: 'short', day: 'numeric' })}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="flex items-center justify-between md:justify-end gap-6 border-t md:border-t-0 pt-3 md:pt-0 border-slate-100 dark:border-white/5">
                  {/* Score details */}
                  <div className="flex flex-col items-start md:items-end gap-0.5 text-left">
                    <span className="text-xs text-slate-400 dark:text-slate-500 font-bold uppercase tracking-wider">Score</span>
                    <div className="flex items-baseline gap-1.5 mt-0.5">
                      <span className="text-lg font-extrabold text-slate-800 dark:text-slate-100">
                        {item.score} / {item.totalMarks}
                      </span>
                      <span className={`text-xs font-bold px-2 py-0.2 rounded-full ${
                        item.percentage >= 80 ? 'bg-emerald-500/10 text-emerald-500' :
                        item.percentage >= 50 ? 'bg-amber-500/10 text-amber-500' :
                        'bg-rose-500/10 text-rose-500'
                      }`}>
                        {item.percentage}%
                      </span>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex items-center gap-2.5">
                    <button
                      onClick={(e) => handleDownloadPdf(item.attemptId, e)}
                      disabled={downloadingId === item.attemptId}
                      className="p-2.5 rounded-xl border border-slate-200 dark:border-white/5 bg-slate-50 hover:bg-slate-100 dark:bg-slate-950/40 dark:hover:bg-slate-950/80 text-slate-600 hover:text-emerald-500 dark:text-slate-400 dark:hover:text-emerald-400 disabled:opacity-50 transition-all"
                      title="Download PDF Result Sheet"
                    >
                      <Download className="h-4 w-4" />
                    </button>
                    <button
                      onClick={() => navigate(`/user/results/${item.attemptId}`)}
                      className="p-2.5 rounded-xl border border-slate-200 dark:border-white/5 bg-slate-50 hover:bg-slate-100 dark:bg-slate-950/40 dark:hover:bg-slate-950/80 text-slate-600 hover:text-emerald-500 dark:text-slate-400 dark:hover:text-emerald-400 transition-all"
                      title="Review Answers"
                    >
                      <FileText className="h-4 w-4" />
                    </button>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        ) : (
          <div className="p-12 text-center rounded-2xl border border-dashed border-slate-300 dark:border-white/10 bg-white/20 dark:bg-slate-900/10">
            <h3 className="font-bold text-lg">No Attempts Found</h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
              {searchTerm ? "No attempts match your search keyword." : "You haven't attempted any quizzes yet."}
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default QuizHistory;
