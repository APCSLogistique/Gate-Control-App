import { Users as UsersIcon, Plus, Shield } from 'lucide-react';

const Users = () => {
  const users = [
    { id: 1, name: 'Admin User', email: 'admin@apcs.dz', role: 'Admin', status: 'Active' },
    { id: 2, name: 'Operator User', email: 'operator@apcs.dz', role: 'Operator', status: 'Active' },
    { id: 3, name: 'Carrier User', email: 'carrier@apcs.dz', role: 'Carrier', status: 'Inactive' },
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-deep-ocean">Users & Roles</h1>
          <p className="text-gray-500 mt-1">Manage user access and permissions</p>
        </div>
        <button className="btn-primary flex items-center gap-2">
          <Plus size={18} />
          Add User
        </button>
      </div>

      <div className="card overflow-hidden p-0">
        <table className="w-full">
          <thead>
            <tr className="border-b">
              <th className="table-header">Name</th>
              <th className="table-header">Email</th>
              <th className="table-header">Role</th>
              <th className="table-header">Status</th>
              <th className="table-header">Actions</th>
            </tr>
          </thead>
          <tbody>
            {users.map((user) => (
              <tr key={user.id} className="hover:bg-gray-50">
                <td className="table-cell font-semibold">{user.name}</td>
                <td className="table-cell">{user.email}</td>
                <td className="table-cell">
                  <span className="flex items-center gap-2">
                    <Shield size={16} />
                    {user.role}
                  </span>
                </td>
                <td className="table-cell">
                  <span className={`status-badge ${user.status === 'Active' ? 'bg-green-100 text-status-success' : 'bg-gray-100 text-gray-600'}`}>
                    {user.status}
                  </span>
                </td>
                <td className="table-cell">
                  <button className="btn-secondary py-1 text-sm">Edit</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

    </div>
  );
};

export default Users;
