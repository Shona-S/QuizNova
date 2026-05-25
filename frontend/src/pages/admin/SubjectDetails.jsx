import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import PageContainer from '../../components/admin/PageContainer';
import SectionCard from '../../components/admin/SectionCard';
import GradientButton from '../../components/admin/GradientButton';
import api from '../../services/api';
import { toast } from '../../components/Toast';
import Spinner from '../../components/Spinner';
import { ArrowLeft, PlusCircle, Edit2, Trash2, Calendar, FileText, AlertCircle, X, HelpCircle } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const SubjectDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [subject, setSubject] = useState(null);
  const [quizzes, setQuizzes] = useState([]);
  const [loading, setLoading] = useState(true);

  // Delete modal state
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [quizToDelete, setQuizToDelete] = useState(null);
  const [isDeleting, setIsDeleting] = useState(false);

  const fetchDetails = async () => {
    try {
      const [subjectRes, quizzesRes] = await Promise.all([
        api.get(`/api/admin/subjects/${id}`),
        api.get(`/api/admin/topics/subject/${id}`)
      ]);
      setSubject(subjectRes.data);
      setQuizzes(quizzesRes.data);
    } catch (error) {
      console.error("Failed to load subject details:", error);
      toast.error("Could not fetch subject details");
      navigate('/admin/dashboard');
    } finally {
      loading && setLoading(false);
    }
  };

  useEffect(() => {
    fetchDetails();
  }, [id]);

  const handleDeleteClick = (quiz) => {
    setQuizToDelete(quiz);
    setShowDeleteModal(true);
  };

  const confirmDelete = async () => {
    if (!quizToDelete) return;
    setIsDeleting(true);
    try {
      await api.delete(`/api/admin/topics/${quizToDelete.id}`);
      toast.success(`Quiz "${quizToDelete.title}" deleted successfully`);
      setQuizzes(quizzes.filter((q) => q.id !== quizToDelete.id));
      setShowDeleteModal(false);
    } catch (error) {
      console.error("Failed to delete quiz:", error);
      toast.error(error.response?.data?.message || "Failed to delete quiz");
    } finally {
      setIsDeleting(false);
      setQuizToDelete(null);
    }
  };

  const getDifficultyBadge = (difficulty) => {
    const badges = {
      EASY: 'bg-emerald-500/10 border-emerald-500/20 text-emerald-400',
      MEDIUM: 'bg-amber-500/10 border-amber-500/20 text-amber-400',
      HARD: 'bg-rose-500/10 border-rose-500/20 text-rose-400'
    };
    return badges[difficulty] || 'bg-slate-500/10 border-slate-500/20 text-slate-500';
  };

  const breadcrumbs = subject ? [{ label: subject.name }] : [];

  return (
    <PageContainer breadcrumbs={breadcrumbs} backUrl="/admin/dashboard">
      {loading ? (
        <div className="flex-grow flex items-center justify-center min-h-[300px]">
          <Spinner size="lg" />
        </div>
      ) : (
        <>
          {/* Subject Overview Card using SectionCard */}
          <SectionCard className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 bg-gradient-to-r from-emerald-500/5 to-green-500/5 border border-emerald-500/10 shadow-sm">
            <div className="flex flex-col gap-3.5 max-w-2xl">
              <h1 className="text-4xl font-bold text-white leading-tight">
                {subject.name}
              </h1>
              <p className="text-base text-slate-400 leading-relaxed font-medium">
                {subject.description || "No description provided."}
              </p>
            </div>

            {/* Substats counters */}
            <div className="flex gap-4">
              <div className="px-5 py-3 rounded-2xl bg-slate-550/5 border border-white/5 text-center min-w-[90px]">
                <span className="text-[10px] uppercase font-bold text-slate-400 block mb-1 tracking-wider">Quizzes</span>
                <span className="text-2xl font-black text-white">{quizzes.length}</span>
              </div>
              <div className="px-5 py-3 rounded-2xl bg-slate-550/5 border border-white/5 text-center min-w-[90px]">
                <span className="text-[10px] uppercase font-bold text-slate-400 block mb-1 tracking-wider">Questions</span>
                <span className="text-2xl font-black text-white">
                  {quizzes.reduce((acc, q) => acc + (q.questionCount ?? 0), 0)}
                </span>
              </div>
            </div>
          </SectionCard>

          {/* Quiz Section Header */}
          <div className="flex items-center justify-between border-b border-slate-800/40 pb-4 mt-2">
            <h2 className="text-2xl font-semibold text-left">
              Subject <span className="text-gradient">Quizzes</span>
            </h2>
            <Link to={`/admin/topics/create?subjectId=${id}`}>
              <GradientButton className="h-12 px-5 text-sm">
                <PlusCircle className="h-4.5 w-4.5" />
                <span>Create Quiz</span>
              </GradientButton>
            </Link>
          </div>

          {quizzes.length === 0 ? (
            <SectionCard className="max-w-sm mx-auto w-full text-center py-16 flex flex-col items-center gap-4">
              <div className="h-14 w-14 bg-emerald-500/10 rounded-2xl flex items-center justify-center text-emerald-500">
                <FileText className="h-8 w-8" />
              </div>
              <h3 className="font-bold text-xl text-white">No Quizzes Found</h3>
              <p className="text-base text-slate-400 leading-relaxed font-medium">
                There are no quiz evaluation modules configured for this subject.
              </p>
              <Link to={`/admin/topics/create?subjectId=${id}`}>
                <GradientButton className="h-12">
                  Create Quiz
                </GradientButton>
              </Link>
            </SectionCard>
          ) : (
            /* Quizzes Grid: 3 cards per row on desktop, 2 on tablet, 1 on mobile */
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6 md:gap-8">
              {quizzes.map((quiz, idx) => (
                <SectionCard
                  key={quiz.id}
                  interactive
                  onClick={() => navigate(`/admin/questions?quizId=${quiz.id}`)}
                  className="flex flex-col gap-6 justify-between h-full"
                >
                  <div className="flex flex-col gap-3.5">
                    <div className="flex justify-between items-start">
                      <span className={`text-[10px] uppercase font-black px-2.5 py-0.5 border rounded-md ${getDifficultyBadge(quiz.difficultyLevel)}`}>
                        {quiz.difficultyLevel}
                      </span>
                      <span className="text-xs font-black uppercase text-emerald-500">
                        {quiz.timeLimit} Mins
                      </span>
                    </div>

                    <h3 className="font-bold text-2xl text-white mt-1 leading-snug">
                      {quiz.title}
                    </h3>
                    <p className="text-base text-slate-400 line-clamp-3 font-medium font-sans leading-relaxed">
                      {quiz.description || "No description provided."}
                    </p>
                  </div>

                  <div className="flex flex-col gap-5">
                    {/* Stats spacing */}
                    <div className="flex items-center gap-2 text-xs text-slate-400 font-bold bg-slate-500/5 px-3.5 py-2 rounded-2xl w-fit border border-white/5">
                      <HelpCircle className="h-4.5 w-4.5 text-emerald-500" />
                      <span>{quiz.questionCount ?? 0} {quiz.questionCount === 1 ? 'Question' : 'Questions'}</span>
                    </div>

                    {/* Actions Row - Footer Aligned Horizontally */}
                    <div className="flex items-center justify-between border-t border-slate-800/40 pt-4" onClick={(e) => e.stopPropagation()}>
                      <Link
                        to={`/admin/questions?quizId=${quiz.id}`}
                        className="px-4 py-2 rounded-2xl bg-emerald-600/10 hover:bg-emerald-600 text-emerald-400 hover:text-white font-bold text-xs transition-all duration-200 border border-emerald-500/10"
                      >
                        Open Questions
                      </Link>

                      <div className="flex items-center gap-1.5">
                        <Link
                          to={`/admin/questions/create?quizId=${quiz.id}`}
                          className="p-2 rounded-xl bg-emerald-500/10 hover:bg-emerald-500 hover:text-white text-emerald-400 transition-colors border border-transparent"
                          title="Add Question"
                        >
                          <PlusCircle className="h-4.5 w-4.5" />
                        </Link>
                        <Link
                          to={`/admin/topics/edit/${quiz.id}`}
                          className="p-2 rounded-xl bg-[#0f172a] hover:bg-[#1e293b] border border-white/10 text-slate-400 hover:text-white transition-colors"
                          title="Edit Quiz"
                        >
                          <Edit2 className="h-4.5 w-4.5" />
                        </Link>
                        <button
                          onClick={() => handleDeleteClick(quiz)}
                          className="p-2 rounded-xl bg-rose-500/10 hover:bg-rose-500/20 text-rose-500 transition-colors border border-transparent"
                          title="Delete Quiz"
                        >
                          <Trash2 className="h-4.5 w-4.5" />
                        </button>
                      </div>
                    </div>
                  </div>
                </SectionCard>
              ))}
            </div>
          )}
        </>
      )}

      {/* Delete Quiz Modal */}
      <AnimatePresence>
        {showDeleteModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowDeleteModal(false)}
              className="absolute inset-0 bg-black/60 backdrop-blur-sm"
            />
            
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 15 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 15 }}
              className="glass max-w-sm w-full rounded-2xl p-6 border border-white/10 shadow-2xl relative z-10 flex flex-col gap-4 text-left"
            >
              <div className="flex justify-between items-center">
                <div className="flex items-center gap-2 text-rose-500">
                  <AlertCircle className="h-5 w-5" />
                  <h3 className="font-extrabold text-base">Confirm Delete</h3>
                </div>
                <button
                  onClick={() => setShowDeleteModal(false)}
                  className="text-slate-400 hover:text-slate-655 dark:hover:text-slate-200"
                >
                  <X className="h-4.5 w-4.5" />
                </button>
              </div>

              <div className="flex flex-col gap-2">
                <p className="text-xs font-semibold text-slate-700 dark:text-slate-350 leading-relaxed">
                  Are you sure you want to delete quiz <strong className="text-slate-800 dark:text-white">"{quizToDelete?.title}"</strong>?
                </p>
                <p className="text-[11px] text-rose-500 font-bold bg-rose-500/10 p-3 rounded-lg border border-rose-500/15 leading-relaxed">
                  Warning: Deleting this quiz will permanently remove all associated evaluation questions. This action is irreversible.
                </p>
              </div>

              <div className="flex gap-2 justify-end mt-2">
                <button
                  onClick={() => setShowDeleteModal(false)}
                  disabled={isDeleting}
                  className="px-4 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-slate-900 dark:hover:bg-slate-800 font-bold text-xs text-slate-600 dark:text-slate-300 transition-all"
                >
                  Cancel
                </button>
                <button
                  onClick={confirmDelete}
                  disabled={isDeleting}
                  className="px-4 py-2 rounded-xl bg-rose-600 hover:bg-rose-700 disabled:bg-rose-600/50 text-white font-bold text-xs shadow-md transition-all flex items-center gap-1.5"
                >
                  {isDeleting ? <Spinner size="sm" color="white" /> : "Delete"}
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </PageContainer>
  );
};

export default SubjectDetails;
