import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import { toast } from 'sonner';
import { Search, Edit2, Trash2, Shield, User, Crown } from 'lucide-react';

interface UserData {
  id: number;
  username: string;
  email: string | null;
  role: string;
  vip_expiration: string | null;
  telegram_chat_id: string | null;
}

const AdminUsersPage: React.FC = () => {
  const { token, user } = useAuth();
  const userRole = user?.role;
  const [users, setUsers] = useState<UserData[]>([]);
  const [loading, setLoading] = useState(true);

  // Filter State
  const [searchQuery, setSearchQuery] = useState('');
  const [roleFilter, setRoleFilter] = useState('All');

  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState<UserData | null>(null);
  const [editRole, setEditRole] = useState('Free');
  const [editVipExp, setEditVipExp] = useState('');

  const fetchUsers = async () => {
    try {
      const response = await axios.get(`${import.meta.env.VITE_API_URL || 'http://localhost:8800'}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setUsers(response.data);
    } catch (error) {
      toast.error('Failed to fetch users');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (userRole === 'Admin') {
      fetchUsers();
    }
  }, [userRole, token]);

  const openEditModal = (user: UserData) => {
    setSelectedUser(user);
    setEditRole(user.role);
    if (user.vip_expiration) {
      setEditVipExp(user.vip_expiration.split('T')[0]);
    } else {
      setEditVipExp('');
    }
    setIsModalOpen(true);
  };

  const closeEditModal = () => {
    setIsModalOpen(false);
    setSelectedUser(null);
  };

  const handleUpdateRole = async () => {
    if (!selectedUser) return;
    
    const payload = {
      role: editRole,
      vip_expiration: editRole === 'VIP' && editVipExp ? new Date(editVipExp).toISOString() : null,
    };

    try {
      await axios.put(`${import.meta.env.VITE_API_URL || 'http://localhost:8800'}/${selectedUser.id}/role`, payload, {
        headers: { Authorization: `Bearer ${token}` }
      });
      toast.success('User updated successfully');
      fetchUsers();
      closeEditModal();
    } catch (error) {
      toast.error('Failed to update user');
    }
  };

  const handleDeleteUser = async (id: number) => {
    if (!window.confirm('Are you sure you want to delete this user?')) return;
    try {
      await axios.delete(`${import.meta.env.VITE_API_URL || 'http://localhost:8800'}/${id}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      toast.success('User deleted successfully');
      fetchUsers();
    } catch (error) {
      toast.error('Failed to delete user');
    }
  };

  const filteredUsers = users.filter(u => {
    const matchSearch = u.username.toLowerCase().includes(searchQuery.toLowerCase());
    const matchRole = roleFilter === 'All' || u.role === roleFilter;
    return matchSearch && matchRole;
  });

  if (userRole !== 'Admin') {
    return <div className="p-8 text-center text-red-500">Access Denied. Admins only.</div>;
  }

  if (loading) {
    return <div className="p-8 text-center text-gray-500">Loading users...</div>;
  }

  return (
    <div className="max-w-6xl mx-auto py-8 px-4">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
        <div>
          <h1 className="text-3xl font-bold text-slate-100">User Management</h1>
          <p className="text-slate-400 mt-1 text-sm">Manage user roles, VIP access, and integrations.</p>
        </div>
        
        <div className="flex flex-col sm:flex-row gap-3 w-full md:w-auto">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
            <input 
              type="text" 
              placeholder="Search users..." 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full sm:w-64 pl-9 pr-4 py-2 bg-slate-900 border border-slate-800 rounded-lg text-slate-200 placeholder-slate-500 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-colors"
            />
          </div>
          
          <select
            value={roleFilter}
            onChange={(e) => setRoleFilter(e.target.value)}
            className="w-full sm:w-40 px-4 py-2 bg-slate-900 border border-slate-800 rounded-lg text-slate-200 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-colors appearance-none"
          >
            <option value="All">All Roles</option>
            <option value="Admin">Admin</option>
            <option value="VIP">VIP</option>
            <option value="Free">Free</option>
          </select>
        </div>
      </div>
      
      <div className="bg-slate-900 rounded-xl border border-slate-800 overflow-hidden shadow-xl">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse min-w-[800px]">
            <thead>
              <tr className="bg-slate-950/50 text-slate-400 text-xs uppercase tracking-wider border-b border-slate-800">
                <th className="p-4 font-semibold">User</th>
                <th className="p-4 font-semibold">Role</th>
                <th className="p-4 font-semibold">VIP Expires</th>
                <th className="p-4 font-semibold">Telegram</th>
                <th className="p-4 font-semibold text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/50">
              {filteredUsers.length === 0 ? (
                <tr>
                  <td colSpan={5} className="p-8 text-center text-slate-500">
                    No users found matching your criteria.
                  </td>
                </tr>
              ) : (
                filteredUsers.map(u => (
                  <tr key={u.id} className="hover:bg-slate-800/50 transition-colors group">
                    <td className="p-4">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-slate-800 border border-slate-700 flex items-center justify-center text-slate-300 shrink-0">
                          <User className="w-5 h-5" />
                        </div>
                        <div>
                          <div className="text-slate-200 font-medium">{u.username}</div>
                          {u.email && <div className="text-slate-500 text-xs mt-0.5">{u.email}</div>}
                        </div>
                      </div>
                    </td>
                    <td className="p-4">
                      <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 text-xs rounded-full font-medium border ${
                        u.role === 'Admin' ? 'bg-purple-500/10 text-purple-400 border-purple-500/20' :
                        u.role === 'VIP' ? 'bg-amber-500/10 text-amber-400 border-amber-500/20' : 
                        'bg-slate-800 text-slate-400 border-slate-700'
                      }`}>
                        {u.role === 'Admin' && <Shield className="w-3 h-3" />}
                        {u.role === 'VIP' && <Crown className="w-3 h-3" />}
                        {u.role}
                      </span>
                    </td>
                    <td className="p-4 text-sm text-slate-400">
                      {u.vip_expiration ? (
                        <span className={new Date(u.vip_expiration) < new Date() ? 'text-red-400' : ''}>
                          {new Date(u.vip_expiration).toLocaleDateString(undefined, { year: 'numeric', month: 'short', day: 'numeric' })}
                        </span>
                      ) : (
                        <span className="text-slate-600">-</span>
                      )}
                    </td>
                    <td className="p-4 text-sm">
                      {u.telegram_chat_id ? (
                        <span className="inline-flex px-2 py-1 text-xs rounded bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">Linked</span>
                      ) : (
                        <span className="text-slate-600">-</span>
                      )}
                    </td>
                    <td className="p-4 text-right">
                      <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                        <button 
                          onClick={() => openEditModal(u)}
                          className="p-2 text-slate-400 hover:text-indigo-400 hover:bg-indigo-400/10 rounded-lg transition-colors"
                          title="Edit User"
                        >
                          <Edit2 className="w-4 h-4" />
                        </button>
                        <button 
                          onClick={() => handleDeleteUser(u.id)}
                          className="p-2 text-slate-400 hover:text-red-400 hover:bg-red-400/10 rounded-lg transition-colors"
                          title="Delete User"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Edit Modal */}
      {isModalOpen && selectedUser && (
        <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl w-full max-w-md p-6 shadow-2xl">
            <h2 className="text-xl font-bold mb-6 text-slate-100">Edit User: <span className="text-indigo-400">{selectedUser.username}</span></h2>
            
            <div className="mb-5">
              <label className="block text-sm font-medium text-slate-400 mb-2">Role</label>
              <select 
                value={editRole} 
                onChange={(e) => setEditRole(e.target.value)}
                className="w-full px-4 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-slate-200 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-colors appearance-none"
              >
                <option value="Free">Free</option>
                <option value="VIP">VIP</option>
                <option value="Admin">Admin</option>
              </select>
            </div>

            {editRole === 'VIP' && (
              <div className="mb-6 animate-in fade-in slide-in-from-top-2 duration-200">
                <label className="block text-sm font-medium text-slate-400 mb-2">VIP Expiration Date</label>
                <input 
                  type="date" 
                  value={editVipExp} 
                  onChange={(e) => setEditVipExp(e.target.value)}
                  className="w-full px-4 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-slate-200 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-colors [color-scheme:dark]"
                />
              </div>
            )}

            <div className="flex justify-end gap-3 mt-8 pt-6 border-t border-slate-800/50">
              <button 
                onClick={closeEditModal}
                className="px-5 py-2.5 text-slate-300 hover:text-white hover:bg-slate-800 rounded-xl font-medium transition-colors"
              >
                Cancel
              </button>
              <button 
                onClick={handleUpdateRole}
                className="px-5 py-2.5 bg-indigo-600 text-white rounded-xl font-medium hover:bg-indigo-500 transition-colors shadow-lg shadow-indigo-500/20"
              >
                Save Changes
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminUsersPage;
