// components/AdminManagement.js
import { useState, useEffect } from 'react';
import axios from 'axios';

const AdminManager = () => {
  const [admins, setAdmins] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [newAdmin, setNewAdmin] = useState({ name: '', email: '', mobile: '', superadmin: false });

  // Fetch the list of admins
  useEffect(() => {
    const fetchAdmins = async () => {
      try {
        const response = await axios.get('/api/admin/admins', {
          headers: {
            Authorization: `Bearer ${sessionStorage.getItem('JWT')}`,
          },
        });
        setAdmins(response.data);
      } catch (error) {
        console.error('Error fetching admins:', error);
      }
    };
    fetchAdmins();
  }, []);

  // Handle input changes
  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setNewAdmin({
      ...newAdmin,
      [name]: type === 'checkbox' ? checked : value,
    });
  };

  // Submit new admin
  const handleAddAdmin = async () => {
    try {
      await axios.post('/api/admin/admins', newAdmin, {
        headers: {
          Authorization: `Bearer ${sessionStorage.getItem('JWT')}`,
        },
      });
      setAdmins([...admins, newAdmin]);
      setShowModal(false);
      setNewAdmin({ name: '', email: '', superadmin: true });
    } catch (error) {
      console.error('Error adding new admin:', error);
    }
  };

  useEffect(()=> {
    console.log(newAdmin)
  }, [newAdmin]);

  return (
    <div className="p-6 bg-white rounded-lg shadow-md">
      <h2 className="text-2xl font-bold mb-4 text-black">Manage Admins</h2>
      <button
        className="bg-purple-600 text-white px-4 py-2 rounded mb-6"
        onClick={() => setShowModal(true)}
      >
        Add New Admin
      </button>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {admins.map((admin, index) => (
          <div key={index} className="p-4 bg-gray-100 rounded-lg shadow">
            <h3 className="text-lg font-semibold text-black">{admin.name}</h3>
            <p className='text-sm text-gray-500'>{admin.mobile} | {admin.email}</p>
            <p className="text-sm text-gray-500">
              {admin.superadmin ? 'Super Admin' : 'Admin'}
            </p>
          </div>
        ))}
      </div>

      {/* Modal for Adding New Admin */}
      {showModal && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md shadow-lg">
            <h3 className="text-xl font-bold mb-4 text-black">Add New Admin</h3>
            <div className="mb-4">
              <label className="block text-gray-700 font-semibold mb-2">Name</label>
              <input
                type="text"
                name="name"
                value={newAdmin.name}
                onChange={handleChange}
                className="w-full border-gray-700 rounded p-2 focus:outline-none ring-1 ring-slate-500 focus:ring-2 focus:ring-purple-600 text-black"
              />
            </div>
            <div className="mb-4">
              <label className="block text-gray-700 font-semibold mb-2">Email</label>
              <input
                type="email"
                name="email"
                value={newAdmin.email}
                onChange={handleChange}
                className="w-full border-gray-300 rounded p-2 focus:outline-none ring-1 ring-slate-500 focus:ring-2 focus:ring-purple-600 text-black"
              />
            </div>
            <div className="mb-4">
              <label className="block text-gray-700 font-semibold mb-2">Mobile</label>
              <input
                type="mobile"
                name="mobile"
                value={newAdmin.mobile}
                onChange={handleChange}
                className="w-full border-gray-300 rounded p-2 focus:outline-none ring-1 ring-slate-500 focus:ring-2 focus:ring-purple-600 text-black"
              />
            </div>
            <div className="mb-4">
              <label className="inline-flex items-center">
                <input
                  type="checkbox"
                  name="superadmin"
                  checked={newAdmin.superadmin}
                  onChange={handleChange}
                  className="form-checkbox h-5 w-5 text-purple-600"
                />
                <span className="ml-2 text-gray-700 font-semibold">Super Admin</span>
              </label>
            </div>
            <div className="flex justify-end space-x-4">
              <button
                onClick={() => setShowModal(false)}
                className="px-4 py-2 bg-gray-300 rounded hover:bg-gray-400"
              >
                Cancel
              </button>
              <button
                onClick={handleAddAdmin}
                className="px-4 py-2 bg-purple-600 text-white rounded hover:bg-purple-700"
              >
                Add Admin
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminManager;
