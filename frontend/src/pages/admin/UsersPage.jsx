import React, { useState, useEffect } from 'react';
import PageContainer from '../../components/admin/PageContainer';
import FormInput from '../../components/admin/FormInput';
import GradientButton from '../../components/admin/GradientButton';
import api from '../../services/api';
import { toast } from '../../components/Toast';
import Spinner from '../../components/Spinner';
import { Users, Search, Trash2, Calendar, AlertCircle, X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link } from 'react-router-dom';

const UsersPage = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [userToDelete, setUserToDelete] = useState(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const [actionInProgress, setActionInProgress] = useState({});

  const fetchUsers = async () => {
    try {
      const response = await api.get('/api/admin/users');
      setUsers(response.data);
    } catch (error) {
      console.error("Failed to load users catalog:", error);
      toast.error("Could not fetch user directory");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const handleBlockUnblock = async (user) => {
    const isBlocked = user.blocked;
    const action = isBlocked ? 'unblock' : 'block';
    
    // Set loading for this specific user action button
    setActionInProgress((prev) => ({ ...prev, [user.id]: true }));

    try {
      const response = await api.put(`/api/admin/users/${action}/${user.id}`);
      toast.success(`User "${user.name}" has been ${isBlocked ? 'unblocked' : 'blocked'} successfully`);
      
      // Update local state
      setUsers(users.map((u) => u.id === user.id ? response.data : u));
    } catch (error) {
      console.error(`Failed to ${action} user:`, error);
      toast.error(error.response?.data?.message || `Failed to ${action} user`);
    } finally {
      setActionInProgress((prev) => ({ ...prev, [user.id]: false }));
    }
  };

  const handleDeleteClick = (user) => {
    setUserToDelete(user);
    setShowDeleteModal(true);
  };

  const confirmDelete = async () => {
    if (!userToDelete) return;
    setIsDeleting(true);
    try {
      await api.delete(`/api/admin/users/${userToDelete.id}`);
      toast.success(`Candidate account "${userToDelete.name}" deleted successfully`);
      setUsers(users.filter((u) => u.id !== userToDelete.id));
      setShowDeleteModal(false);
    } catch (error) {
      console.error("Failed to delete user:", error);
      toast.error(error.response?.data?.message || "Failed to delete user");
    } finally {
      setIsDeleting(false);
      setUserToDelete(null);
    }
  };

  const filteredUsers = users.filter((user) =>
    user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    user.email.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    const date = new Date(dateString);
    return date.toLocaleDateString(undefined, { year: 'numeric', month: 'short', day: 'numeric' });
  };

  const breadcrumbs = [{ label: 'Candidates' }];

  return (
    <PageContainer
      breadcrumbs={breadcrumbs}
      title={<span>Manage <span className="text-gradient">Candidates</span></span>}
      subtitle="View registered users, revoke system access, or delete candidate profiles."
    >
      {/* Search filter */}
      <div className="max-w-md w-full text-left">
        <FormInput
          type="text"
          placeholder="Search candidates by name or email..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          icon={<Search className="h-5 w-5 text-slate-400" />}
        />
      </div>

      {loading ? (
        <div className="flex-grow flex items-center justify-center min-h-[300px]">
          <Spinner size="lg" />
        </div>
      ) : filteredUsers.length === 0 ? (
        <div className="max-w-md mx-auto w-full mt-4 text-left">
          <div className="rounded-3xl border border-zinc-800 bg-zinc-900/30 backdrop-blur-md p-8 text-center flex flex-col items-center gap-3">
            <div className="h-12 w-12 bg-emerald-500/10 rounded-xl flex items-center justify-center text-emerald-400">
              <Users className="h-6 w-6" />
            </div>
            <h3 className="font-extrabold text-base">No Candidates Found</h3>
            <p className="text-sm text-slate-400 leading-relaxed font-medium">
              {searchQuery ? "No registered users match your search query." : "No candidates have registered on the platform yet."}
            </p>
          </div>
        </div>
      ) : (
        /* Table Layout for Desktop / List for Mobile */
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="rounded-3xl border border-zinc-800 bg-zinc-900/30 backdrop-blur-md overflow-hidden shadow-sm text-left"
        >
          {/* Desktop Table View */}
          <div className="hidden md:block overflow-x-auto w-full">
            <table className="w-full border-collapse text-left">
              <thead>
                <tr className="border-b border-zinc-800 bg-zinc-950/30">
                  <th className="p-5 font-black text-[11px] uppercase tracking-wider text-slate-400">Candidate</th>
                  <th className="p-5 font-black text-[11px] uppercase tracking-wider text-slate-400">Email Address</th>
                  <th className="p-5 font-black text-[11px] uppercase tracking-wider text-slate-400">Status</th>
                  <th className="p-5 font-black text-[11px] uppercase tracking-wider text-slate-400">Joined Date</th>
                  <th className="p-5 font-black text-[11px] uppercase tracking-wider text-slate-400 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-zinc-800 font-medium text-base">
                {filteredUsers.map((user) => (
                  <tr key={user.id} className="hover:bg-emerald-500/5 transition-colors">
                    <td className="p-5 text-white font-bold">{user.name}</td>
                    <td className="p-5 text-slate-300">{user.email}</td>
                    <td className="p-5">
                      <span className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[10px] font-bold border ${
                        user.blocked
                          ? 'bg-rose-500/10 border-rose-500/20 text-rose-500'
                          : 'bg-emerald-500/10 border-emerald-500/20 text-emerald-500'
                      }`}>
                        <span className={`h-1.5 w-1.5 rounded-full ${user.blocked ? 'bg-rose-500' : 'bg-emerald-500'}`} />
                        {user.blocked ? 'Blocked' : 'Active'}
                      </span>
                    </td>
                    <td className="p-5 text-slate-400 text-sm font-bold">
                      <div className="flex items-center gap-1.5">
                        <Calendar className="h-4 w-4 text-slate-500" />
                        {formatDate(user.createdAt)}
                      </div>
                    </td>
                    <td className="p-5 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <button
                          onClick={() => handleBlockUnblock(user)}
                          disabled={actionInProgress[user.id]}
                          className={`inline-flex items-center gap-1 px-3 py-1 rounded-xl border text-xs font-bold transition-all shadow-sm ${
                            user.blocked
                              ? 'bg-emerald-500/10 hover:bg-emerald-500/20 border-emerald-500/20 text-emerald-450'
                              : 'bg-rose-500/10 hover:bg-rose-500/20 border-rose-500/20 text-rose-550'
                          }`}
                        >
                          {actionInProgress[user.id] ? (
                            <Spinner size="sm" />
                          ) : (
                            <span>{user.blocked ? 'Unblock' : 'Block'}</span>
                          )}
                        </button>
                        
                        <button
                          onClick={() => handleDeleteClick(user)}
                          className="p-2 rounded-xl bg-slate-900 hover:bg-rose-500/10 text-slate-400 hover:text-rose-500 transition-colors border border-white/5"
                          title="Delete Candidate"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Mobile Cards View */}
          <div className="block md:hidden divide-y divide-zinc-800">
            {filteredUsers.map((user) => (
              <div key={user.id} className="p-4 flex flex-col gap-3 text-left">
                <div className="flex justify-between items-start">
                  <div className="flex flex-col gap-0.5">
                    <span className="font-extrabold text-sm text-white">{user.name}</span>
                    <span className="text-xs text-slate-400">{user.email}</span>
                  </div>
                  <span className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[10px] font-bold border ${
                    user.blocked
                      ? 'bg-rose-500/10 border-rose-500/20 text-rose-500'
                      : 'bg-emerald-500/10 border-emerald-500/20 text-emerald-500'
                  }`}>
                    {user.blocked ? 'Blocked' : 'Active'}
                  </span>
                </div>

                <div className="flex items-center justify-between text-xs text-slate-400 font-bold border-t border-zinc-800 pt-2.5">
                  <span className="flex items-center gap-1">
                    <Calendar className="h-4 w-4" />
                    {formatDate(user.createdAt)}
                  </span>

                  <div className="flex items-center gap-1.5">
                    <button
                      onClick={() => handleBlockUnblock(user)}
                      disabled={actionInProgress[user.id]}
                      className={`px-2.5 py-1 rounded-xl border text-[10px] font-bold ${
                        user.blocked
                          ? 'bg-emerald-500/10 border-emerald-500/20 text-emerald-400'
                          : 'bg-rose-500/10 border-rose-500/20 text-rose-500'
                      }`}
                    >
                      {user.blocked ? 'Unblock' : 'Block'}
                    </button>
                    <button
                      onClick={() => handleDeleteClick(user)}
                      className="p-1.5 rounded-xl bg-rose-500/10 text-rose-500"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </motion.div>
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
                  <h3 className="font-extrabold text-lg">Delete Candidate</h3>
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
                  Are you sure you want to permanently delete candidate <strong className="text-white">"{userToDelete?.name}"</strong>?
                </p>
                <p className="text-xs text-rose-500 font-bold bg-rose-500/10 p-3 rounded-xl border border-rose-500/15 leading-relaxed">
                  Warning: Deleting this candidate will permanently remove all their profile details and attempts. This action is irreversible.
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

export default UsersPage;
