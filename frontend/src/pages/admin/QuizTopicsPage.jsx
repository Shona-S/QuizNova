import React, { useState, useEffect } from 'react';
import AdminSidebar from '../../components/admin/AdminSidebar';
import api from '../../services/api';
import { toast } from '../../components/Toast';
import Spinner from '../../components/Spinner';
import { FileText, Search, Plus, Edit2, Trash2, Calendar, Clock, BarChart, BookOpen, AlertCircle, X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link } from 'react-router-dom';

const QuizTopicsPage = () => {
  const [topics, setTopics] = useState([]);
  const [subjects, setSubjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedSubjectFilter, setSelectedSubjectFilter] = useState('');
  const [selectedDifficultyFilter, setSelectedDifficultyFilter] = useState('');
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [topicToDelete, setTopicToDelete] = useState(null);
  const [isDeleting, setIsDeleting] = useState(false);

  const fetchData = async () => {
    try {
      const [topicsRes, subjectsRes] = await Promise.all([
        api.get('/api/admin/topics'),
        api.get('/api/admin/subjects')
      ]);
      setTopics(topicsRes.data);
      setSubjects(subjectsRes.data);
    } catch (error) {
      console.error("Failed to load topic details:", error);
      toast.error("Could not load topics list");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleDeleteClick = (topic) => {
    setTopicToDelete(topic);
    setShowDeleteModal(true);
  };

  const confirmDelete = async () => {
    if (!topicToDelete) return;
    setIsDeleting(true);
    try {
      await api.delete(`/api/admin/topics/${topicToDelete.id}`);
      toast.success(`Topic "${topicToDelete.title}" deleted successfully`);
      setTopics(topics.filter((t) => t.id !== topicToDelete.id));
      setShowDeleteModal(false);
    } catch (error) {
      console.error("Failed to delete topic:", error);
      toast.error(error.response?.data?.message || "Failed to delete topic");
    } finally {
      setIsDeleting(false);
      setTopicToDelete(null);
    }
  };

  const filteredTopics = topics.filter((topic) => {
    const matchesSearch = 
      topic.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (topic.description && topic.description.toLowerCase().includes(searchQuery.toLowerCase()));
    
    const matchesSubject = selectedSubjectFilter === '' || topic.subjectId.toString() === selectedSubjectFilter;
    const matchesDifficulty = selectedDifficultyFilter === '' || topic.difficultyLevel === selectedDifficultyFilter;

    return matchesSearch && matchesSubject && matchesDifficulty;
  });

  const getDifficultyBadge = (difficulty) => {
    const badges = {
      EASY: 'bg-emerald-500/10 border-emerald-500/20 text-emerald-600 dark:text-emerald-400',
      MEDIUM: 'bg-amber-500/10 border-amber-500/20 text-amber-600 dark:text-amber-400',
      HARD: 'bg-rose-500/10 border-rose-500/20 text-rose-600 dark:text-rose-400'
    };
    return badges[difficulty] || 'bg-slate-500/10 border-slate-500/20 text-slate-500';
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    const date = new Date(dateString);
    return date.toLocaleDateString(undefined, { year: 'numeric', month: 'short', day: 'numeric' });
  };

  return (
    <div className="flex min-h-screen text-slate-800 dark:text-slate-100">
      <AdminSidebar />

      <div className="flex-1 lg:pl-64 min-h-screen p-6 md:p-10 pt-24 lg:pt-10 flex flex-col gap-8">
        {/* Header Section */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200/50 dark:border-slate-800/50 pb-5">
          <div className="text-left">
            <h1 className="text-3xl font-extrabold tracking-tight">
              Manage <span className="text-gradient">Quiz Topics</span>
            </h1>
            <p className="text-slate-500 dark:text-slate-400 mt-1 text-sm font-medium">
              Create and configure quiz evaluation topics, time constraints, and difficulties.
            </p>
          </div>
          <Link
            to="/admin/topics/create"
            className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-sm shadow-md transition-all self-start sm:self-center"
          >
            <Plus className="h-4.5 w-4.5" />
            <span>Add Topic</span>
          </Link>
        </div>

        {/* Filter Controls Row */}
        <div className="flex flex-col md:flex-row gap-4 items-stretch md:items-center text-left">
          {/* Search bar */}
          <div className="relative flex-grow max-w-md">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400" />
            <input
              type="text"
              placeholder="Search topics by title..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-11 pr-4 py-3 rounded-2xl bg-white/40 dark:bg-slate-900/40 border border-slate-200 dark:border-slate-800 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 font-medium text-sm transition-all shadow-sm"
            />
          </div>

          {/* Subject Filter */}
          <div className="w-full md:w-56">
            <select
              value={selectedSubjectFilter}
              onChange={(e) => setSelectedSubjectFilter(e.target.value)}
              className="w-full px-4 py-3 rounded-2xl bg-white/40 dark:bg-slate-900/40 border border-slate-200 dark:border-slate-800 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 font-bold text-sm transition-all shadow-sm cursor-pointer"
            >
              <option value="">All Subjects</option>
              {subjects.map((sub) => (
                <option key={sub.id} value={sub.id}>{sub.name}</option>
              ))}
            </select>
          </div>

          {/* Difficulty Filter */}
          <div className="w-full md:w-48">
            <select
              value={selectedDifficultyFilter}
              onChange={(e) => setSelectedDifficultyFilter(e.target.value)}
              className="w-full px-4 py-3 rounded-2xl bg-white/40 dark:bg-slate-900/40 border border-slate-200 dark:border-slate-800 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 font-bold text-sm transition-all shadow-sm cursor-pointer"
            >
              <option value="">All Difficulties</option>
              <option value="EASY">Easy</option>
              <option value="MEDIUM">Medium</option>
              <option value="HARD">Hard</option>
            </select>
          </div>
        </div>

        {loading ? (
          <div className="flex-grow flex items-center justify-center min-h-[300px]">
            <Spinner size="lg" />
          </div>
        ) : filteredTopics.length === 0 ? (
          <div className="glass rounded-3xl p-16 border border-white/10 text-center flex flex-col items-center gap-4 max-w-lg mx-auto w-full mt-6">
            <div className="h-16 w-16 bg-emerald-500/10 rounded-2xl flex items-center justify-center text-emerald-500">
              <FileText className="h-8 w-8" />
            </div>
            <h3 className="font-extrabold text-xl">No Topics Found</h3>
            <p className="text-sm text-slate-500 dark:text-slate-400 leading-relaxed font-medium">
              {searchQuery || selectedSubjectFilter || selectedDifficultyFilter
                ? "No topics match the applied filters. Try adjusting your filter settings."
                : "Create a quiz topic inside one of your learning subjects to start adding questions."}
            </p>
            {!searchQuery && !selectedSubjectFilter && !selectedDifficultyFilter && (
              <Link
                to="/admin/topics/create"
                className="mt-2 px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-sm shadow-sm transition-all"
              >
                Create Topic
              </Link>
            )}
          </div>
        ) : (
          /* Grid list */
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredTopics.map((topic, idx) => (
              <motion.div
                key={topic.id}
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: idx * 0.05 }}
                className="glass p-6 rounded-2xl border border-white/15 dark:border-white/5 flex flex-col gap-4 justify-between text-left relative overflow-hidden"
              >
                <div className="flex flex-col gap-2">
                  <div className="flex justify-between items-start gap-2">
                    <div className="p-2.5 rounded-xl bg-emerald-500/10 text-emerald-600 dark:text-emerald-400">
                      <FileText className="h-5 w-5" />
                    </div>
                    <div className="flex items-center gap-1.5">
                      <span className={`text-[10px] uppercase font-black px-2.5 py-1 rounded-full border ${getDifficultyBadge(topic.difficultyLevel)}`}>
                        {topic.difficultyLevel}
                      </span>
                    </div>
                  </div>

                  <span className="text-[10px] font-black uppercase text-emerald-500 tracking-wider">
                    {topic.subjectName}
                  </span>

                  <h3 className="font-black text-xl text-slate-800 dark:text-white leading-snug">
                    {topic.title}
                  </h3>

                  <p className="text-sm text-slate-500 dark:text-slate-400 line-clamp-3 font-medium">
                    {topic.description || "No description provided."}
                  </p>
                </div>

                <div className="flex flex-col gap-3 mt-4 border-t border-slate-200/50 dark:border-slate-800/50 pt-4">
                  <div className="flex items-center justify-between text-xs text-slate-500 dark:text-slate-400 font-bold">
                    <span className="flex items-center gap-1.5">
                      <Clock className="h-3.5 w-3.5 text-slate-400" />
                      {topic.timeLimit} mins
                    </span>
                    <span className="flex items-center gap-1.5">
                      <BarChart className="h-3.5 w-3.5 text-slate-400" />
                      {topic.questionCount ?? 0} {topic.questionCount === 1 ? 'Question' : 'Questions'}
                    </span>
                  </div>

                  <div className="flex items-center justify-between mt-1">
                    <div className="flex items-center gap-1.5 text-xs text-slate-400 font-bold">
                      <Calendar className="h-3.5 w-3.5" />
                      <span>{formatDate(topic.createdAt)}</span>
                    </div>

                    <div className="flex items-center gap-2">
                      <Link
                        to={`/admin/topics/edit/${topic.id}`}
                        className="p-2 rounded-lg bg-slate-100 hover:bg-slate-200 dark:bg-slate-900 dark:hover:bg-slate-800 text-slate-600 dark:text-slate-300 transition-colors"
                        title="Edit Topic"
                      >
                        <Edit2 className="h-4 w-4" />
                      </Link>
                      <button
                        onClick={() => handleDeleteClick(topic)}
                        className="p-2 rounded-lg bg-rose-500/10 hover:bg-rose-500/20 text-rose-500 transition-colors"
                        title="Delete Topic"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
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
                  Are you sure you want to delete the topic <strong className="text-slate-800 dark:text-white">"{topicToDelete?.title}"</strong>?
                </p>
                <p className="text-xs text-rose-500 font-bold bg-rose-500/10 p-3.5 rounded-xl border border-rose-500/20 leading-relaxed">
                  Warning: Deleting this topic will permanently delete all associated evaluation questions. This action cannot be undone.
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

export default QuizTopicsPage;
