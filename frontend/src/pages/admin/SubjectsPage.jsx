import React, { useState, useEffect } from 'react';
import AdminSidebar from '../../components/admin/AdminSidebar';
import api from '../../services/api';
import { toast } from '../../components/Toast';
import Spinner from '../../components/Spinner';
import { BookOpen, Search, Plus, Edit2, Trash2, Calendar, FileText, AlertCircle, X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link } from 'react-router-dom';

const SubjectsPage = () => {
  const [subjects, setSubjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
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

  const handleDeleteClick = (subject) => {
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
      toast.error(error.response?.data?.message || "Failed to delete subject. Make sure it doesn't contain active topics.");
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

  return (
    <div className="flex min-h-screen text-slate-800 dark:text-slate-100">
      <AdminSidebar />

      <div className="flex-1 lg:pl-64 min-h-screen p-6 md:p-10 pt-24 lg:pt-10 flex flex-col gap-8">
        {/* Header section */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200/50 dark:border-slate-800/50 pb-5">
          <div className="text-left">
            <h1 className="text-3xl font-extrabold tracking-tight">
              Manage <span className="text-gradient">Subjects</span>
            </h1>
            <p className="text-slate-500 dark:text-slate-400 mt-1 text-sm font-medium">
              Create, update, and manage core learning modules and subjects.
            </p>
          </div>
          <Link
            to="/admin/subjects/create"
            className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-sm shadow-md transition-all self-start sm:self-center"
          >
            <Plus className="h-4.5 w-4.5" />
            <span>Add Subject</span>
          </Link>
        </div>

        {/* Search Bar */}
        <div className="relative max-w-md w-full text-left">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400" />
          <input
            type="text"
            placeholder="Search subjects by title or description..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-11 pr-4 py-3 rounded-2xl bg-white/40 dark:bg-slate-900/40 border border-slate-200 dark:border-slate-850 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 font-medium text-sm transition-all shadow-sm"
          />
        </div>

        {loading ? (
          <div className="flex-grow flex items-center justify-center min-h-[300px]">
            <Spinner size="lg" />
          </div>
        ) : filteredSubjects.length === 0 ? (
          <div className="glass rounded-3xl p-16 border border-white/10 text-center flex flex-col items-center gap-4 max-w-lg mx-auto w-full mt-6">
            <div className="h-16 w-16 bg-emerald-500/10 rounded-2xl flex items-center justify-center text-emerald-500">
              <BookOpen className="h-8 w-8" />
            </div>
            <h3 className="font-extrabold text-xl">No Subjects Found</h3>
            <p className="text-sm text-slate-500 dark:text-slate-400 leading-relaxed font-medium">
              {searchQuery ? "No subjects match your query. Try refining your keyword criteria." : "Create your first learning subject to begin building quiz topics."}
            </p>
            {!searchQuery && (
              <Link
                to="/admin/subjects/create"
                className="mt-2 px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-sm shadow-sm transition-all"
              >
                Create Subject
              </Link>
            )}
          </div>
        ) : (
          /* Grid list */
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredSubjects.map((subject, idx) => (
              <motion.div
                key={subject.id}
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: idx * 0.05 }}
                className="glass p-6 rounded-2xl border border-white/15 dark:border-white/5 flex flex-col gap-4 justify-between text-left relative overflow-hidden"
              >
                <div className="flex flex-col gap-2">
                  <div className="flex justify-between items-start">
                    <div className="p-2.5 rounded-xl bg-emerald-500/10 text-emerald-600 dark:text-emerald-400">
                      <BookOpen className="h-5 w-5" />
                    </div>
                    <span className="text-xs font-extrabold px-2.5 py-1 rounded-full bg-slate-200/50 dark:bg-slate-900/50 text-slate-500 dark:text-slate-400 flex items-center gap-1.5">
                      <FileText className="h-3.5 w-3.5" />
                      {subject.topicCount ?? 0} {subject.topicCount === 1 ? 'Topic' : 'Topics'}
                    </span>
                  </div>
                  <h3 className="font-black text-xl text-slate-800 dark:text-white mt-1 leading-snug">
                    {subject.name}
                  </h3>
                  <p className="text-sm text-slate-500 dark:text-slate-400 line-clamp-3 font-medium">
                    {subject.description || "No description provided."}
                  </p>
                </div>

                <div className="flex items-center justify-between border-t border-slate-200/50 dark:border-slate-800/50 pt-4 mt-2">
                  <div className="flex items-center gap-1.5 text-xs text-slate-400 font-bold">
                    <Calendar className="h-3.5 w-3.5" />
                    <span>{formatDate(subject.createdAt)}</span>
                  </div>

                  <div className="flex items-center gap-2">
                    <Link
                      to={`/admin/subjects/edit/${subject.id}`}
                      className="p-2 rounded-lg bg-slate-100 hover:bg-slate-200 dark:bg-slate-900 dark:hover:bg-slate-800 text-slate-600 dark:text-slate-300 transition-colors"
                      title="Edit Subject"
                    >
                      <Edit2 className="h-4 w-4" />
                    </Link>
                    <button
                      onClick={() => handleDeleteClick(subject)}
                      className="p-2 rounded-lg bg-rose-500/10 hover:bg-rose-500/20 text-rose-500 transition-colors"
                      title="Delete Subject"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </div>

      {/* Delete Confirmation Modal */}
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
              className="glass max-w-md w-full rounded-3xl p-8 border border-white/10 shadow-2xl relative z-10 flex flex-col gap-6 text-left"
            >
              <div className="flex justify-between items-center">
                <div className="flex items-center gap-2.5 text-rose-500">
                  <AlertCircle className="h-6 w-6" />
                  <h3 className="font-extrabold text-lg">Confirm Delete</h3>
                </div>
                <button
                  onClick={() => setShowDeleteModal(false)}
                  className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>

              <div className="flex flex-col gap-2">
                <p className="text-sm font-medium text-slate-700 dark:text-slate-350 leading-relaxed">
                  Are you sure you want to delete the subject <strong className="text-slate-800 dark:text-white">"{subjectToDelete?.name}"</strong>?
                </p>
                <p className="text-xs text-rose-500 font-bold bg-rose-500/10 p-3.5 rounded-xl border border-rose-500/20 leading-relaxed">
                  Warning: Deleting this subject will also permanently remove all corresponding quiz topics and questions. This action is irreversible.
                </p>
              </div>

              <div className="flex gap-3 justify-end mt-2">
                <button
                  onClick={() => setShowDeleteModal(false)}
                  disabled={isDeleting}
                  className="px-5 py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-slate-900 dark:hover:bg-slate-800 font-bold text-sm text-slate-600 dark:text-slate-300 transition-all"
                >
                  Cancel
                </button>
                <button
                  onClick={confirmDelete}
                  disabled={isDeleting}
                  className="px-5 py-2.5 rounded-xl bg-rose-600 hover:bg-rose-700 disabled:bg-rose-600/50 text-white font-bold text-sm shadow-md transition-all flex items-center gap-2"
                >
                  {isDeleting ? <Spinner size="sm" color="white" /> : "Delete Permanently"}
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default SubjectsPage;
