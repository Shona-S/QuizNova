import React, { useState, useEffect } from 'react';
import PageContainer from '../../components/admin/PageContainer';
import SectionCard from '../../components/admin/SectionCard';
import GradientButton from '../../components/admin/GradientButton';
import api from '../../services/api';
import { toast } from '../../components/Toast';
import Spinner from '../../components/Spinner';
import { BookOpen, Search, PlusCircle, Edit2, Trash2, Calendar, FileText, HelpCircle, AlertCircle, X, Users } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link, useNavigate } from 'react-router-dom';

const DashboardHome = () => {
  const navigate = useNavigate();
  const [subjects, setSubjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  
  // Delete modal state
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [subjectToDelete, setSubjectToDelete] = useState(null);
  const [isDeleting, setIsDeleting] = useState(false);

  const fetchSubjects = async () => {
    try {
      const response = await api.get('/api/admin/subjects');
      setSubjects(response.data);
    } catch (error) {
      console.error("Failed to load subjects:", error);
      toast.error("Could not fetch subjects catalog");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSubjects();
  }, []);

  const handleDeleteClick = (e, subject) => {
    e.stopPropagation(); // Prevent card navigation
    setSubjectToDelete(subject);
    setShowDeleteModal(true);
  };

  const confirmDelete = async () => {
    if (!subjectToDelete) return;
    setIsDeleting(true);
    try {
      await api.delete(`/api/admin/subjects/${subjectToDelete.id}`);
      toast.success(`Subject "${subjectToDelete.name}" deleted successfully`);
      setSubjects(subjects.filter((s) => s.id !== subjectToDelete.id));
      setShowDeleteModal(false);
    } catch (error) {
      console.error("Failed to delete subject:", error);
      toast.error(error.response?.data?.message || "Failed to delete subject");
    } finally {
      setIsDeleting(false);
      setSubjectToDelete(null);
    }
  };

  const filteredSubjects = subjects.filter((subject) =>
    subject.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    (subject.description && subject.description.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    const date = new Date(dateString);
    return date.toLocaleDateString(undefined, { year: 'numeric', month: 'short', day: 'numeric' });
  };

  const headerActions = (
    <Link to="/admin/subjects/create">
      <GradientButton className="h-12 text-sm">
        <PlusCircle className="h-5 w-5" />
        <span>Create Subject</span>
      </GradientButton>
    </Link>
  );

  return (
    <PageContainer
      title="Console Dashboard"
      subtitle="Create subjects, define evaluate structures, and manage candidate access."
      headerActions={headerActions}
    >
      {/* Search Input Box */}
      <div className="relative max-w-lg w-full text-left">
        <Search className="absolute left-5 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400 pointer-events-none" />
        <input
          type="text"
          placeholder="Search subjects..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full pl-14 pr-5 h-14 rounded-2xl bg-zinc-950/40 text-white border border-zinc-800 placeholder:text-gray-500 focus:outline-none focus:ring-2 focus:ring-emerald-500/40 focus:border-emerald-500 font-medium text-base transition-all duration-200 shadow-sm"
        />
      </div>

      {loading ? (
        <div className="flex-grow flex items-center justify-center min-h-[300px]">
          <Spinner size="lg" />
        </div>
      ) : filteredSubjects.length === 0 ? (
        <SectionCard className="max-w-md mx-auto w-full text-center py-16 flex flex-col items-center gap-4">
          <div className="h-14 w-14 bg-emerald-500/10 rounded-2xl flex items-center justify-center text-emerald-500">
            <BookOpen className="h-8 w-8" />
          </div>
          <h3 className="font-bold text-2xl text-white">No Subjects Found</h3>
          <p className="text-base text-slate-400 leading-relaxed font-medium">
            {searchQuery ? "No subjects match your query. Try refining your keyword criteria." : "Create your first learning subject to begin building quiz topics."}
          </p>
          {!searchQuery && (
            <Link to="/admin/subjects/create" className="mt-2">
              <GradientButton className="h-12">
                Create Subject
              </GradientButton>
            </Link>
          )}
        </SectionCard>
      ) : (
        /* Cards Grid: 3 cards per row on desktop, 2 on tablet, 1 on mobile */
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6 md:gap-8">
          {filteredSubjects.map((subject, idx) => (
            <SectionCard
              key={subject.id}
              interactive
              onClick={() => navigate(`/admin/subjects/${subject.id}`)}
              className="flex flex-col gap-6 justify-between h-full"
            >
              <div className="flex flex-col gap-3.5">
                <div className="flex justify-between items-center">
                  <div className="p-2.5 rounded-xl bg-emerald-500/10 text-emerald-600 dark:text-emerald-400">
                    <BookOpen className="h-5 w-5" />
                  </div>
                  <span className="text-[10px] font-black uppercase text-emerald-450 bg-emerald-500/10 border border-emerald-500/15 px-2.5 py-0.5 rounded-md">
                    Subject
                  </span>
                </div>

                <h3 className="font-bold text-2xl text-white leading-snug">
                  {subject.name}
                </h3>
                <p className="text-base text-slate-400 line-clamp-3 font-medium leading-relaxed">
                  {subject.description || "No description provided."}
                </p>
              </div>

              <div className="flex flex-col gap-5">
                {/* Substats */}
                <div className="grid grid-cols-2 gap-4 py-3.5 bg-slate-500/5 rounded-2xl border border-white/5 px-4">
                  <div className="flex flex-col gap-0.5">
                    <span className="text-[10px] uppercase font-bold text-slate-400 flex items-center gap-1.5">
                      <FileText className="h-3.5 w-3.5 text-emerald-500" />
                      Quizzes
                    </span>
                    <span className="text-lg font-black text-white">{subject.topicCount ?? 0}</span>
                  </div>
                  <div className="flex flex-col gap-0.5">
                    <span className="text-[10px] uppercase font-bold text-slate-400 flex items-center gap-1.5">
                      <HelpCircle className="h-3.5 w-3.5 text-teal-500" />
                      Questions
                    </span>
                    <span className="text-lg font-black text-white">{subject.questionCount ?? 0}</span>
                  </div>
                </div>

                {/* Subject Actions Row - Footer Aligned Horizontally */}
                <div className="flex items-center justify-between border-t border-slate-800/40 pt-4" onClick={(e) => e.stopPropagation()}>
                  <span className="text-xs text-slate-400 font-bold flex items-center gap-1.5">
                    <Calendar className="h-4 w-4" />
                    {formatDate(subject.createdAt)}
                  </span>

                  <div className="flex items-center gap-2">
                    <Link
                      to={`/admin/topics/create?subjectId=${subject.id}`}
                      className="px-3.5 py-2 rounded-xl bg-emerald-500/10 hover:bg-emerald-600 text-emerald-400 hover:text-white font-bold text-xs transition-all duration-200"
                      title="Add Quiz Topic"
                    >
                      + Add Quiz
                    </Link>
                    <Link
                      to={`/admin/subjects/edit/${subject.id}`}
                      className="p-2 rounded-xl bg-[#0f172a] hover:bg-[#1e293b] border border-white/10 text-slate-400 hover:text-white transition-all duration-200"
                      title="Edit Subject"
                    >
                      <Edit2 className="h-4.5 w-4.5" />
                    </Link>
                    <button
                      onClick={(e) => handleDeleteClick(e, subject)}
                      className="p-2 rounded-xl bg-rose-500/10 hover:bg-rose-500/20 text-rose-500 transition-all duration-200"
                      title="Delete Subject"
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

      {/* Delete Subject Confirmation Modal */}
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
              className="bg-zinc-950 max-w-sm w-full rounded-3xl p-6 border border-zinc-800 shadow-2xl relative z-10 flex flex-col gap-4 text-left"
            >
              <div className="flex justify-between items-center">
                <div className="flex items-center gap-2 text-rose-500">
                  <AlertCircle className="h-5 w-5" />
                  <h3 className="font-extrabold text-lg">Confirm Delete</h3>
                </div>
                <button
                  onClick={() => setShowDeleteModal(false)}
                  className="text-slate-400 hover:text-white"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>

              <div className="flex flex-col gap-2">
                <p className="text-sm font-semibold text-slate-350 leading-relaxed">
                  Are you sure you want to delete <strong className="text-white">"{subjectToDelete?.name}"</strong>?
                </p>
                <p className="text-xs text-rose-500 font-bold bg-rose-500/10 p-3 rounded-xl border border-rose-500/15 leading-relaxed">
                  Warning: Deleting this subject will permanently remove all associated quiz topics and questions from the system.
                </p>
              </div>

              <div className="flex gap-2 justify-end mt-2">
                <GradientButton
                  variant="secondary"
                  onClick={() => setShowDeleteModal(false)}
                  disabled={isDeleting}
                  className="h-10 text-xs px-4"
                >
                  Cancel
                </GradientButton>
                <GradientButton
                  onClick={confirmDelete}
                  disabled={isDeleting}
                  className="h-10 text-xs px-4 bg-rose-600 hover:bg-rose-700 text-white border-transparent"
                >
                  {isDeleting ? <Spinner size="sm" color="white" /> : "Delete"}
                </GradientButton>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </PageContainer>
  );
};

export default DashboardHome;
