import React, { useEffect, useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import Navbar from '../../components/Navbar';
import { ChevronLeft, HelpCircle, Clock, Play } from 'lucide-react';
import { motion } from 'framer-motion';
import api from '../../services/api';

const SubjectDetails = () => {
  const { subjectId } = useParams();
  const navigate = useNavigate();
  const [quizzes, setQuizzes] = useState([]);
  const [subject, setSubject] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchQuizzes = async () => {
      try {
        const [quizRes, subRes] = await Promise.all([
          api.get(`/api/user/subjects/${subjectId}/quizzes`),
          api.get(`/api/user/subjects`)
        ]);
        setQuizzes(quizRes.data);
        
        // Find subject info in the subjects list to display its name/desc
        const currentSub = subRes.data.find(s => s.id.toString() === subjectId);
        setSubject(currentSub);
      } catch (err) {
        console.error("Error loading subject details", err);
      } finally {
        setLoading(false);
      }
    };
    fetchQuizzes();
  }, [subjectId]);

  return (
    <div className="min-h-screen pb-16 bg-zinc-50 dark:bg-[#040405] text-slate-800 dark:text-slate-100 transition-colors duration-300">
      <Navbar />
      
      <div className="pt-32 max-w-6xl mx-auto px-6 md:px-12 text-left">
        {/* Back Link */}
        <Link
          to="/user/dashboard"
          className="inline-flex items-center gap-1 text-sm font-semibold text-slate-500 dark:text-slate-400 hover:text-emerald-500 dark:hover:text-emerald-400 transition-colors mb-6 group"
        >
          <ChevronLeft className="h-4 w-4 group-hover:-translate-x-1 transition-transform" />
          Back to Subjects
        </Link>

        {loading ? (
          <div className="flex flex-col items-center justify-center py-20 gap-3">
            <div className="h-10 w-10 border-4 border-emerald-500 border-t-transparent rounded-full animate-spin" />
            <span className="text-sm text-slate-500 dark:text-slate-400 font-medium">Fetching subject details...</span>
          </div>
        ) : (
          <>
            {/* Header info */}
            <div className="mb-10 flex flex-col gap-2">
              <h1 className="text-3xl md:text-4xl font-extrabold tracking-tight text-slate-900 dark:text-white">
                {subject?.name || "Subject Quizzes"}
              </h1>
              {subject?.description && (
                <p className="text-sm md:text-base text-slate-500 dark:text-slate-400 max-w-2xl leading-relaxed">
                  {subject.description}
                </p>
              )}
            </div>

            {/* Quizzes List */}
            <div className="mb-6">
              <h2 className="text-xl font-extrabold tracking-tight text-slate-900 dark:text-white">Available Quizzes</h2>
            </div>

            {quizzes.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {quizzes.map((quiz, index) => (
                  <motion.div
                    key={quiz.id}
                    initial={{ opacity: 0, y: 15 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.05 }}
                    className="p-6 rounded-2xl border border-slate-200 dark:border-white/5 bg-white dark:bg-slate-900/20 shadow-sm flex flex-col justify-between"
                  >
                    <div className="flex flex-col gap-2">
                      <div className="flex justify-between items-center">
                        <span className={`text-[10px] uppercase font-bold px-2 py-0.5 rounded ${
                          quiz.difficultyLevel === 'Easy' ? 'bg-emerald-500/10 text-emerald-500 border border-emerald-500/10' :
                          quiz.difficultyLevel === 'Medium' ? 'bg-amber-500/10 text-amber-500 border border-amber-500/10' :
                          'bg-rose-500/10 text-rose-500 border border-rose-500/10'
                        }`}>
                          {quiz.difficultyLevel}
                        </span>
                        <div className="flex items-center gap-3 text-xs font-semibold text-slate-500 dark:text-slate-400">
                          <span className="flex items-center gap-1">
                            <Clock className="h-3.5 w-3.5" /> {quiz.timeLimit} mins
                          </span>
                          <span className="flex items-center gap-1">
                            <HelpCircle className="h-3.5 w-3.5" /> {quiz.questionCount || 0} Questions
                          </span>
                        </div>
                      </div>
                      <h3 className="font-extrabold text-lg text-slate-900 dark:text-white mt-2">
                        {quiz.title}
                      </h3>
                      <p className="text-xs text-slate-500 dark:text-slate-400 line-clamp-2 leading-relaxed">
                        {quiz.description || "No description provided for this quiz topic."}
                      </p>
                    </div>

                    <div className="pt-4 border-t border-slate-100 dark:border-white/5 mt-6 flex justify-end">
                      <button
                        onClick={() => navigate(`/user/quiz/${quiz.id}`)}
                        className="px-4 py-2 text-xs font-bold text-white bg-emerald-600 hover:bg-emerald-700 dark:bg-emerald-500 dark:hover:bg-emerald-600 rounded-xl transition-all flex items-center gap-1.5 shadow-md shadow-emerald-500/10 active:scale-95"
                      >
                        <Play className="h-3 w-3 fill-current" /> Start Quiz
                      </button>
                    </div>
                  </motion.div>
                ))}
              </div>
            ) : (
              <div className="p-12 text-center rounded-2xl border border-dashed border-slate-300 dark:border-white/10 bg-white/20 dark:bg-slate-900/10">
                <h3 className="font-bold text-lg">No Quizzes Created</h3>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">There are currently no quizzes registered for this subject. Try again later.</p>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default SubjectDetails;
