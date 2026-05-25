import React, { useState, useEffect } from 'react';
import PageContainer from '../../components/admin/PageContainer';
import SectionCard from '../../components/admin/SectionCard';
import FormInput from '../../components/admin/FormInput';
import FormSelect from '../../components/admin/FormSelect';
import GradientButton from '../../components/admin/GradientButton';
import api from '../../services/api';
import { toast } from '../../components/Toast';
import Spinner from '../../components/Spinner';
import { HelpCircle, Search, PlusCircle, Edit2, Trash2, CheckCircle, BarChart2, AlertCircle, X, ChevronDown, ChevronUp } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link, useSearchParams } from 'react-router-dom';

const QuestionsPage = () => {
  const [searchParams] = useSearchParams();
  const queryQuizId = searchParams.get('quizId');

  const [questions, setQuestions] = useState([]);
  const [topics, setTopics] = useState([]);
  const [selectedTopicDetails, setSelectedTopicDetails] = useState(null);
  
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedTopicFilter, setSelectedTopicFilter] = useState(queryQuizId || '');
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [questionToDelete, setQuestionToDelete] = useState(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const [expandedQuestions, setExpandedQuestions] = useState({});

  const fetchData = async () => {
    try {
      const [questionsRes, topicsRes] = await Promise.all([
        api.get('/api/admin/questions'),
        api.get('/api/admin/topics')
      ]);
      setQuestions(questionsRes.data);
      setTopics(topicsRes.data);
    } catch (error) {
      console.error("Failed to load questions or topics:", error);
      toast.error("Could not fetch questions list");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  // Fetch specific details of selected quiz topic for breadcrumbs
  useEffect(() => {
    const fetchSelectedTopicDetails = async () => {
      if (selectedTopicFilter) {
        try {
          const res = await api.get(`/api/admin/topics/${selectedTopicFilter}`);
          setSelectedTopicDetails(res.data);
        } catch (err) {
          console.error("Error fetching topic details:", err);
          setSelectedTopicDetails(null);
        }
      } else {
        setSelectedTopicDetails(null);
      }
    };
    fetchSelectedTopicDetails();
  }, [selectedTopicFilter]);

  // Sync state if query parameter changes
  useEffect(() => {
    if (queryQuizId) {
      setSelectedTopicFilter(queryQuizId);
    }
  }, [queryQuizId]);

  const handleDeleteClick = (question) => {
    setQuestionToDelete(question);
    setShowDeleteModal(true);
  };

  const confirmDelete = async () => {
    if (!questionToDelete) return;
    setIsDeleting(true);
    try {
      await api.delete(`/api/admin/questions/${questionToDelete.id}`);
      toast.success("Question deleted successfully");
      setQuestions(questions.filter((q) => q.id !== questionToDelete.id));
      setShowDeleteModal(false);
    } catch (error) {
      console.error("Failed to delete question:", error);
      toast.error(error.response?.data?.message || "Failed to delete question");
    } finally {
      setIsDeleting(false);
      setQuestionToDelete(null);
    }
  };

  const toggleExpand = (id) => {
    setExpandedQuestions((prev) => ({
      ...prev,
      [id]: !prev[id]
    }));
  };

  const filteredQuestions = questions.filter((q) => {
    const matchesSearch = q.questionTitle.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesTopic = selectedTopicFilter === '' || q.quizTopicId.toString() === selectedTopicFilter;
    return matchesSearch && matchesTopic;
  });

  // Calculate back link URL
  const backUrl = selectedTopicDetails
    ? `/admin/subjects/${selectedTopicDetails.subjectId}`
    : '/admin/dashboard';

  const breadcrumbs = [];
  if (selectedTopicDetails) {
    breadcrumbs.push({ label: selectedTopicDetails.subjectName, path: `/admin/subjects/${selectedTopicDetails.subjectId}` });
    breadcrumbs.push({ label: selectedTopicDetails.title });
  }

  return (
    <PageContainer
      breadcrumbs={breadcrumbs}
      backUrl={backUrl}
      title={<span>Manage <span className="text-gradient">Questions</span></span>}
      subtitle="Create and manage multiple-choice questions (MCQs), marks weightage, and options."
      headerActions={
        <Link to={`/admin/questions/create${selectedTopicFilter ? `?quizId=${selectedTopicFilter}` : ''}`}>
          <GradientButton className="h-12 text-sm">
            <PlusCircle className="h-5 w-5" />
            <span>Add Question</span>
          </GradientButton>
        </Link>
      }
    >
      {/* Filter Controls Row */}
      <div className="flex flex-col md:flex-row gap-4 items-stretch md:items-center text-left">
        {/* Search bar */}
        <div className="flex-grow max-w-md">
          <FormInput
            type="text"
            placeholder="Search questions..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            icon={<Search className="h-5 w-5 text-slate-400" />}
          />
        </div>

        {/* Topic Filter */}
        <div className="w-full md:w-72">
          <FormSelect
            value={selectedTopicFilter}
            onChange={(e) => setSelectedTopicFilter(e.target.value)}
          >
            <option value="">All Quiz Topics</option>
            {topics.map((t) => (
              <option key={t.id} value={t.id}>{t.title} ({t.subjectName})</option>
            ))}
          </FormSelect>
        </div>
      </div>

      {loading ? (
        <div className="flex-grow flex items-center justify-center min-h-[300px]">
          <Spinner size="lg" />
        </div>
      ) : filteredQuestions.length === 0 ? (
        <div className="max-w-md mx-auto w-full mt-4">
          <SectionCard className="text-center flex flex-col items-center gap-3">
            <div className="h-12 w-12 bg-emerald-500/10 rounded-xl flex items-center justify-center text-emerald-500">
              <HelpCircle className="h-6 w-6" />
            </div>
            <h3 className="font-extrabold text-base">No Questions Found</h3>
            <p className="text-sm text-slate-400 leading-relaxed font-medium">
              {searchQuery || selectedTopicFilter
                ? "No questions match your applied filter settings."
                : "Create your first question inside a quiz topic to build evaluation items."}
            </p>
            {!searchQuery && (
              <Link
                to={`/admin/questions/create${selectedTopicFilter ? `?quizId=${selectedTopicFilter}` : ''}`}
                className="mt-1"
              >
                <GradientButton className="h-10 text-xs px-4">
                  Create Question
                </GradientButton>
              </Link>
            )}
          </SectionCard>
        </div>
      ) : (
        /* Questions List */
        <div className="flex flex-col gap-3">
          {filteredQuestions.map((q, idx) => {
            const isExpanded = !!expandedQuestions[q.id];
            return (
              <motion.div
                key={q.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: Math.min(idx * 0.04, 0.4) }}
                className="rounded-3xl border border-zinc-800 bg-zinc-900/30 backdrop-blur-md overflow-hidden text-left shadow-sm hover:border-emerald-500/30 transition-all duration-200"
              >
                {/* Collapsed Header Summary */}
                <div
                  onClick={() => toggleExpand(q.id)}
                  className="p-5 flex items-center justify-between gap-4 cursor-pointer select-none"
                >
                  <div className="flex flex-col gap-1.5 flex-1 min-w-0">
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="text-[10px] uppercase font-black px-2 py-0.5 rounded bg-emerald-500/10 border border-emerald-500/15 text-emerald-400">
                        {q.quizTopicTitle}
                      </span>
                      <span className="text-[10px] font-black uppercase text-green-400 px-2 py-0.5 bg-green-500/10 border border-green-500/15 rounded flex items-center gap-1">
                        <BarChart2 className="h-3 w-3" />
                        {q.marks} {q.marks === 1 ? 'Mark' : 'Marks'}
                      </span>
                    </div>
                    <h4 className="font-bold text-lg text-white truncate">
                      {q.questionTitle}
                    </h4>
                  </div>

                  <div className="flex items-center gap-3">
                    <div className="flex items-center gap-1.5" onClick={(e) => e.stopPropagation()}>
                      <Link
                        to={`/admin/questions/edit/${q.id}`}
                        className="p-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-slate-350 hover:text-white transition-colors border border-white/5"
                        title="Edit Question"
                      >
                        <Edit2 className="h-4 w-4" />
                      </Link>
                      <button
                        onClick={() => handleDeleteClick(q)}
                        className="p-2 rounded-xl bg-rose-500/10 hover:bg-rose-500/20 text-rose-500 transition-colors border border-rose-500/20"
                        title="Delete Question"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>

                    <div className="text-slate-400 hover:text-slate-200 pl-1">
                      {isExpanded ? <ChevronUp className="h-5 w-5" /> : <ChevronDown className="h-5 w-5" />}
                    </div>
                  </div>
                </div>

                {/* Expanded Content Panel */}
                <AnimatePresence initial={false}>
                  {isExpanded && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.15 }}
                    >
                      <div className="px-5 pb-5 pt-1 border-t border-zinc-800 flex flex-col gap-4 bg-zinc-955/20">
                        {/* Full Question text */}
                        <div className="flex flex-col gap-1.5 mt-2">
                          <span className="text-[10px] font-black text-slate-500 uppercase tracking-wider">Question Text</span>
                          <p className="text-base text-slate-200 font-semibold leading-relaxed">
                            {q.questionTitle}
                          </p>
                        </div>

                        {/* Options grid */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mt-1">
                          {[
                            { label: 'A', text: q.optionA },
                            { label: 'B', text: q.optionB },
                            { label: 'C', text: q.optionC },
                            { label: 'D', text: q.optionD },
                          ].map((opt) => {
                            const isCorrect = q.correctAnswer === opt.label;
                            return (
                              <div
                                key={opt.label}
                                className={`p-3 rounded-2xl border flex items-center gap-3 ${
                                  isCorrect
                                    ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-400'
                                    : 'bg-zinc-950/40 border-zinc-800 text-slate-350'
                                }`}
                              >
                                <span className={`h-6 w-6 rounded-lg flex items-center justify-center font-bold text-xs ${
                                  isCorrect 
                                    ? 'bg-emerald-500 text-white' 
                                    : 'bg-slate-800 text-slate-400'
                                }`}>
                                  {opt.label}
                                </span>
                                <span className="text-base font-medium truncate">{opt.text}</span>
                                {isCorrect && <CheckCircle className="h-4.5 w-4.5 text-emerald-500 ml-auto flex-shrink-0" />}
                              </div>
                            );
                          })}
                        </div>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            );
          })}
        </div>
      )}

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
                <p className="text-sm font-semibold text-slate-300 leading-relaxed">
                  Are you sure you want to delete this question?
                </p>
                <p className="text-xs text-rose-500 font-bold bg-rose-500/10 p-3 rounded-xl border border-rose-500/15 leading-relaxed">
                  Warning: This action will permanently remove this question from its quiz topic pool.
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

export default QuestionsPage;
