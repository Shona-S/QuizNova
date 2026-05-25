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
import { Save, HelpCircle, FileText, Award } from 'lucide-react';
import { motion } from 'framer-motion';

const EditQuestion = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  
  const [topics, setTopics] = useState([]);
  const [selectedTopicDetails, setSelectedTopicDetails] = useState(null);
  const [loading, setLoading] = useState(true);

  // Form states
  const [questionTitle, setQuestionTitle] = useState('');
  const [optionA, setOptionA] = useState('');
  const [optionB, setOptionB] = useState('');
  const [optionC, setOptionC] = useState('');
  const [optionD, setOptionD] = useState('');
  const [correctAnswer, setCorrectAnswer] = useState('A');
  const [marks, setMarks] = useState(1);
  const [quizTopicId, setQuizTopicId] = useState('');
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    const fetchInitialData = async () => {
      try {
        const [questionRes, topicsRes] = await Promise.all([
          api.get(`/api/admin/questions/${id}`),
          api.get('/api/admin/topics')
        ]);
        
        const q = questionRes.data;
        setQuestionTitle(q.questionTitle);
        setOptionA(q.optionA);
        setOptionB(q.optionB);
        setOptionC(q.optionC);
        setOptionD(q.optionD);
        setCorrectAnswer(q.correctAnswer);
        setMarks(q.marks);
        setQuizTopicId(q.quizTopicId.toString());
        setTopics(topicsRes.data);
      } catch (error) {
        console.error("Failed to load question details:", error);
        toast.error("Could not fetch question details");
        navigate('/admin/dashboard');
      } finally {
        setLoading(false);
      }
    };
    fetchInitialData();
  }, [id, navigate]);

  // Fetch topic details dynamically to build breadcrumbs
  useEffect(() => {
    const fetchTopicDetails = async () => {
      if (quizTopicId) {
        try {
          const res = await api.get(`/api/admin/topics/${quizTopicId}`);
          setSelectedTopicDetails(res.data);
        } catch (err) {
          console.error("Failed to load topic details:", err);
          setSelectedTopicDetails(null);
        }
      } else {
        setSelectedTopicDetails(null);
      }
    };
    fetchTopicDetails();
  }, [quizTopicId]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!questionTitle.trim()) {
      toast.error("Question statement is required");
      return;
    }
    if (!optionA.trim() || !optionB.trim() || !optionC.trim() || !optionD.trim()) {
      toast.error("All options (A, B, C, and D) must be provided");
      return;
    }
    if (!quizTopicId) {
      toast.error("Please assign a quiz topic");
      return;
    }
    if (marks <= 0) {
      toast.error("Marks weightage must be greater than zero");
      return;
    }

    setIsSaving(true);
    try {
      await api.put(`/api/admin/questions/${id}`, {
        questionTitle: questionTitle.trim(),
        optionA: optionA.trim(),
        optionB: optionB.trim(),
        optionC: optionC.trim(),
        optionD: optionD.trim(),
        correctAnswer,
        marks: parseInt(marks),
        quizTopicId: parseInt(quizTopicId)
      });
      toast.success("Question updated successfully");
      navigate(`/admin/questions?quizId=${quizTopicId}`);
    } catch (error) {
      console.error("Failed to update question:", error);
      toast.error(error.response?.data?.message || "Failed to update question");
    } finally {
      setIsSaving(false);
    }
  };

  const backUrl = quizTopicId 
    ? `/admin/questions?quizId=${quizTopicId}`
    : '/admin/questions';

  const breadcrumbs = [];
  if (selectedTopicDetails) {
    breadcrumbs.push({ label: selectedTopicDetails.subjectName, path: `/admin/subjects/${selectedTopicDetails.subjectId}` });
    breadcrumbs.push({ label: selectedTopicDetails.title, path: `/admin/questions?quizId=${selectedTopicDetails.id}` });
  }
  breadcrumbs.push({ label: 'Edit Question' });

  return (
    <PageContainer breadcrumbs={breadcrumbs} backUrl={backUrl}>
      {/* Title */}
      <div className="text-left">
        <h1 className="text-4xl font-bold tracking-tight text-white">
          Edit <span className="text-gradient">Question</span>
        </h1>
        <p className="text-base text-slate-400 mt-2 font-medium">
          Update evaluation question statement, MCQ options, marks, or target quiz topic.
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
              
              {/* Context Selector */}
              <FormSelect
                label="Quiz Topic *"
                id="quiz-topic"
                value={quizTopicId}
                onChange={(e) => setQuizTopicId(e.target.value)}
                disabled={isSaving}
                required
                icon={<FileText className="h-5 w-5" />}
              >
                {topics.map((t) => (
                  <option key={t.id} value={t.id}>{t.title} ({t.subjectName})</option>
                ))}
              </FormSelect>

              {/* Question Text Area */}
              <FormTextarea
                label="Question Statement *"
                id="question-title"
                placeholder="Enter question statement"
                value={questionTitle}
                onChange={(e) => setQuestionTitle(e.target.value)}
                disabled={isSaving}
                required
              />

              {/* MCQ Options A & B */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <FormInput
                  label="Option A *"
                  id="option-a"
                  type="text"
                  placeholder="Enter option A"
                  value={optionA}
                  onChange={(e) => setOptionA(e.target.value)}
                  disabled={isSaving}
                  required
                />

                <FormInput
                  label="Option B *"
                  id="option-b"
                  type="text"
                  placeholder="Enter option B"
                  value={optionB}
                  onChange={(e) => setOptionB(e.target.value)}
                  disabled={isSaving}
                  required
                />
              </div>

              {/* MCQ Options C & D */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <FormInput
                  label="Option C *"
                  id="option-c"
                  type="text"
                  placeholder="Enter option C"
                  value={optionC}
                  onChange={(e) => setOptionC(e.target.value)}
                  disabled={isSaving}
                  required
                />

                <FormInput
                  label="Option D *"
                  id="option-d"
                  type="text"
                  placeholder="Enter option D"
                  value={optionD}
                  onChange={(e) => setOptionD(e.target.value)}
                  disabled={isSaving}
                  required
                />
              </div>

              {/* Correct Key and Score Weights */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <FormSelect
                  label="Correct Answer *"
                  id="correct-answer"
                  value={correctAnswer}
                  onChange={(e) => setCorrectAnswer(e.target.value)}
                  disabled={isSaving}
                  required
                >
                  <option value="A">Option A</option>
                  <option value="B">Option B</option>
                  <option value="C">Option C</option>
                  <option value="D">Option D</option>
                </FormSelect>

                <FormInput
                  label="Marks Weightage *"
                  id="marks"
                  type="number"
                  min="1"
                  placeholder="e.g. 1"
                  value={marks}
                  onChange={(e) => setMarks(e.target.value)}
                  disabled={isSaving}
                  required
                  icon={<Award className="h-5 w-5" />}
                />
              </div>

              {/* Action buttons footer */}
              <div className="flex gap-4 justify-end mt-2 border-t border-slate-800/40 pt-6">
                <Link to={backUrl}>
                  <GradientButton variant="secondary" className="h-12 text-sm">
                    Cancel
                  </GradientButton>
                </Link>
                <GradientButton
                  type="submit"
                  disabled={isSaving}
                  className="h-12 text-sm px-8"
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

export default EditQuestion;
