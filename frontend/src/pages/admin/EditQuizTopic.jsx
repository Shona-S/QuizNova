import React, { useState, useEffect } from 'react';
import { useNavigate, useParams, Link } from 'react-router-dom';
import PageContainer from '../../components/admin/PageContainer';
import SectionCard from '../../components/admin/SectionCard';
import FormInput from '../../components/admin/FormInput';
import FormSelect from '../../components/admin/FormSelect';
import FormTextarea from '../../components/admin/FormTextarea';
import GradientButton from '../../components/admin/GradientButton';
import api from '../../services/api';
import { toast } from '../../components/Toast';
import Spinner from '../../components/Spinner';
import { FileText, Save, Clock, BarChart, BookOpen } from 'lucide-react';
import { motion } from 'framer-motion';

const EditQuizTopic = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  
  const [subjects, setSubjects] = useState([]);
  const [targetSubject, setTargetSubject] = useState(null);
  const [loading, setLoading] = useState(true);
  
  // Form fields
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [difficultyLevel, setDifficultyLevel] = useState('MEDIUM');
  const [timeLimit, setTimeLimit] = useState(15);
  const [subjectId, setSubjectId] = useState('');
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    const fetchInitialData = async () => {
      try {
        const [topicRes, subjectsRes] = await Promise.all([
          api.get(`/api/admin/topics/${id}`),
          api.get('/api/admin/subjects')
        ]);
        
        const topic = topicRes.data;
        setTitle(topic.title);
        setDescription(topic.description || '');
        setDifficultyLevel(topic.difficultyLevel);
        setTimeLimit(topic.timeLimit);
        setSubjectId(topic.subjectId.toString());
        setSubjects(subjectsRes.data);
      } catch (error) {
        console.error("Failed to load topic details:", error);
        toast.error("Could not fetch topic details");
        navigate('/admin/dashboard');
      } finally {
        setLoading(false);
      }
    };
    fetchInitialData();
  }, [id, navigate]);

  // Track target subject details
  useEffect(() => {
    if (subjects.length > 0 && subjectId) {
      const selected = subjects.find(s => s.id.toString() === subjectId);
      setTargetSubject(selected || null);
    }
  }, [subjectId, subjects]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!title.trim()) {
      toast.error("Topic title is required");
      return;
    }
    if (!subjectId) {
      toast.error("Please select a subject category");
      return;
    }
    if (timeLimit <= 0) {
      toast.error("Time limit must be a positive integer");
      return;
    }

    setIsSaving(true);
    try {
      await api.put(`/api/admin/topics/${id}`, {
        title: title.trim(),
        description: description.trim(),
        difficultyLevel,
        timeLimit: parseInt(timeLimit),
        subjectId: parseInt(subjectId)
      });
      toast.success("Quiz topic updated successfully");
      navigate(`/admin/subjects/${subjectId}`);
    } catch (error) {
      console.error("Failed to update topic:", error);
      toast.error(error.response?.data?.message || "Failed to update quiz topic");
    } finally {
      setIsSaving(false);
    }
  };

  const backUrl = subjectId ? `/admin/subjects/${subjectId}` : '/admin/dashboard';

  const breadcrumbs = [];
  if (targetSubject) {
    breadcrumbs.push({ label: targetSubject.name, path: `/admin/subjects/${targetSubject.id}` });
  }
  breadcrumbs.push({ label: title || 'Quiz', path: `/admin/questions?quizId=${id}` });
  breadcrumbs.push({ label: 'Edit Quiz' });

  return (
    <PageContainer breadcrumbs={breadcrumbs} backUrl={backUrl}>
      {/* Title */}
      <div className="text-left">
        <h1 className="text-4xl font-bold tracking-tight text-white">
          Edit Quiz <span className="text-gradient">Topic</span>
        </h1>
        <p className="text-base text-slate-400 mt-2 font-medium">
          Update quiz details, difficulty, or timer limits.
        </p>
      </div>

      {loading ? (
        <div className="flex-grow flex items-center justify-center min-h-[300px]">
          <Spinner size="lg" />
        </div>
      ) : (
        /* Form Panel using SectionCard */
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="max-w-2xl w-full mx-auto md:mx-0"
        >
          <SectionCard>
            <form onSubmit={handleSubmit} className="flex flex-col gap-6">
              <FormInput
                label="Quiz Title *"
                id="topic-title"
                type="text"
                placeholder="e.g. Basic ML, Cloud Security Basics"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                disabled={isSaving}
                required
                icon={<FileText className="h-5 w-5" />}
              />

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Subject Selector */}
                <FormSelect
                  label="Subject Category *"
                  id="topic-subject"
                  value={subjectId}
                  onChange={(e) => setSubjectId(e.target.value)}
                  disabled={isSaving}
                  required
                  icon={<BookOpen className="h-5 w-5" />}
                >
                  {subjects.map((sub) => (
                    <option key={sub.id} value={sub.id}>{sub.name}</option>
                  ))}
                </FormSelect>

                {/* Difficulty Selector */}
                <FormSelect
                  label="Difficulty Level *"
                  id="topic-difficulty"
                  value={difficultyLevel}
                  onChange={(e) => setDifficultyLevel(e.target.value)}
                  disabled={isSaving}
                  required
                  icon={<BarChart className="h-5 w-5" />}
                >
                  <option value="EASY">Easy</option>
                  <option value="MEDIUM">Medium</option>
                  <option value="HARD">Hard</option>
                </FormSelect>
              </div>

              <FormInput
                label="Time Limit (Minutes) *"
                id="topic-time-limit"
                type="number"
                min="1"
                placeholder="e.g. 15"
                value={timeLimit}
                onChange={(e) => setTimeLimit(e.target.value)}
                disabled={isSaving}
                required
                icon={<Clock className="h-5 w-5" />}
              />

              <FormTextarea
                label="Description"
                id="topic-description"
                placeholder="Summarize the core topics evaluated by this quiz..."
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                disabled={isSaving}
              />

              {/* Action buttons */}
              <div className="flex gap-4 justify-end mt-2 border-t border-slate-800/40 pt-6">
                <Link to={backUrl}>
                  <GradientButton variant="secondary" className="h-12 text-sm">
                    Cancel
                  </GradientButton>
                </Link>
                <GradientButton
                  type="submit"
                  disabled={isSaving}
                  className="h-12 text-sm"
                >
                  {isSaving ? <Spinner size="sm" color="white" /> : <Save className="h-5 w-5" />}
                  <span>{isSaving ? 'Saving...' : 'Save Changes'}</span>
                </GradientButton>
              </div>
            </form>
          </SectionCard>
        </motion.div>
      )}
    </PageContainer>
  );
};

export default EditQuizTopic;
