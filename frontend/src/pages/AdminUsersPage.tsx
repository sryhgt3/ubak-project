import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import { toast } from 'sonner';

interface UserData {
  id: number;
  username: string;
  email: string | null;
  role: string;
  vip_expiration: string | null;
  telegram_chat_id: string | null;
}

const AdminUsersPage: React.FC = () => {
  const { token, userRole } = useAuth();
  const [users, setUsers] = useState<UserData[]>([]);
  const [loading, setLoading] = useState(true);

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

  if (userRole !== 'Admin') {
    return <div className="p-8 text-center text-red-500">Access Denied. Admins only.</div>;
  }

  if (loading) {
    return <div className="p-8 text-center text-gray-500">Loading users...</div>;
  }

  return (
    <div className="max-w-6xl mx-auto py-8 px-4">
      <h1 className="text-3xl font-bold mb-8 text-gray-900">User Management</h1>
      
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-gray-50 text-gray-600 text-sm border-b border-gray-200">
                <th className="p-4 font-medium">Username</th>
                <th className="p-4 font-medium">Role</th>
                <th className="p-4 font-medium">VIP Expires</th>
                <th className="p-4 font-medium">Telegram Linked</th>
                <th className="p-4 font-medium text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {users.map(u => (
                <tr key={u.id} className="hover:bg-gray-50 transition-colors">
                  <td className="p-4 text-gray-800 font-medium">{u.username}</td>
                  <td className="p-4">
                    <span className={`px-2 py-1 text-xs rounded-full font-medium ${
                      u.role === 'Admin' ? 'bg-purple-100 text-purple-700' :
                      u.role === 'VIP' ? 'bg-amber-100 text-amber-700' : 'bg-gray-100 text-gray-700'
                    }`}>
                      {u.role}
                    </span>
                  </td>
                  <td className="p-4 text-sm text-gray-500">
                    {u.vip_expiration ? new Date(u.vip_expiration).toLocaleDateString() : '-'}
                  </td>
                  <td className="p-4 text-sm text-gray-500">
                    {u.telegram_chat_id ? 'Yes' : 'No'}
                  </td>
                  <td className="p-4 text-right">
                    <button 
                      onClick={() => openEditModal(u)}
                      className="text-blue-600 hover:text-blue-800 text-sm font-medium mr-4"
                    >
                      Edit
                    </button>
                    <button 
                      onClick={() => handleDeleteUser(u.id)}
                      className="text-red-600 hover:text-red-800 text-sm font-medium"
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Edit Modal */}
      {isModalOpen && selectedUser && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl w-full max-w-md p-6 shadow-xl">
            <h2 className="text-xl font-bold mb-4">Edit User: {selectedUser.username}</h2>
            
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-1">Role</label>
              <select 
                value={editRole} 
                onChange={(e) => setEditRole(e.target.value)}
                className="w-full px-4 py-2 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
              >
                <option value="Free">Free</option>
                <option value="VIP">VIP</option>
                <option value="Admin">Admin</option>
              </select>
            </div>

            {editRole === 'VIP' && (
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-1">VIP Expiration Date</label>
                <input 
                  type="date" 
                  value={editVipExp} 
                  onChange={(e) => setEditVipExp(e.target.value)}
                  className="w-full px-4 py-2 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>
            )}

            <div className="flex justify-end gap-3 mt-8">
              <button 
                onClick={closeEditModal}
                className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-lg font-medium transition-colors"
              >
                Cancel
              </button>
              <button 
                onClick={handleUpdateRole}
                className="px-4 py-2 bg-indigo-600 text-white rounded-lg font-medium hover:bg-indigo-700 transition-colors"
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
