import React, { useState, useEffect } from 'react';
import { useNavigate, useParams, Link } from 'react-router-dom';
import PageContainer from '../../components/admin/PageContainer';
import SectionCard from '../../components/admin/SectionCard';
import FormInput from '../../components/admin/FormInput';
import FormTextarea from '../../components/admin/FormTextarea';
import GradientButton from '../../components/admin/GradientButton';
import api from '../../services/api';
import { toast } from '../../components/Toast';
import Spinner from '../../components/Spinner';
import { BookOpen, Save } from 'lucide-react';
import { motion } from 'framer-motion';

const EditSubject = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [loading, setLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    const fetchSubject = async () => {
      try {
        const response = await api.get(`/api/admin/subjects/${id}`);
        setName(response.data.name);
        setDescription(response.data.description || '');
      } catch (error) {
        console.error("Failed to load subject details:", error);
        toast.error("Could not load subject details");
        navigate('/admin/dashboard');
      } finally {
        setLoading(false);
      }
    };
    fetchSubject();
  }, [id, navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!name.trim()) {
      toast.error("Subject name is required");
      return;
    }

    setIsSaving(true);
    try {
      await api.put(`/api/admin/subjects/${id}`, { name: name.trim(), description: description.trim() });
      toast.success("Subject updated successfully");
      navigate(`/admin/subjects/${id}`);
    } catch (error) {
      console.error("Failed to update subject:", error);
      toast.error(error.response?.data?.message || "Failed to update subject");
    } finally {
      setIsSaving(false);
    }
  };

  const breadcrumbs = [
    { label: name || 'Subject', path: `/admin/subjects/${id}` },
    { label: 'Edit' }
  ];

  return (
    <PageContainer breadcrumbs={breadcrumbs} backUrl={`/admin/subjects/${id}`}>
      {/* Title */}
      <div className="text-left">
        <h1 className="text-4xl font-bold tracking-tight text-white">
          Edit <span className="text-gradient">Subject</span>
        </h1>
        <p className="text-base text-slate-400 mt-2 font-medium">
          Update subject details and description.
        </p>
      </div>

      {loading ? (
        <div className="flex-grow flex items-center justify-center min-h-[300px]">
          <Spinner size="lg" />
        </div>
      ) : (
        /* Form panel with expanded input dimensions */
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="max-w-2xl w-full mx-auto md:mx-0"
        >
          <SectionCard>
            <form onSubmit={handleSubmit} className="flex flex-col gap-6">
              <FormInput
                label="Subject Name *"
                id="subject-name"
                type="text"
                placeholder="e.g. Computer Science, Mathematics"
                value={name}
                onChange={(e) => setName(e.target.value)}
                disabled={isSaving}
                required
                icon={<BookOpen className="h-5 w-5" />}
              />

              <FormTextarea
                label="Description"
                id="subject-description"
                placeholder="Briefly summarize what topics this subject covers..."
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                disabled={isSaving}
              />

              {/* Action buttons */}
              <div className="flex gap-4 justify-end mt-2 border-t border-slate-800/40 pt-6">
                <Link to={`/admin/subjects/${id}`}>
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

export default EditSubject;
