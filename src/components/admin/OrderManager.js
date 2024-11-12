// pages/admin/orders.js
import { useState, useEffect } from 'react';
import axios from 'axios';

const OrderManager = () => {
  const [orders, setOrders] = useState([]);

  // Fetch orders from API
  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const response = await axios.get('/api/admin/orders');
        setOrders(response.data);
      } catch (error) {
        console.error('Error fetching orders:', error);
      }
    };
    fetchOrders();
  }, []);

  return (
    <div className="p-6 bg-white rounded-lg shadow-md">
      <h2 className="text-2xl font-bold mb-4 text-black">Order Manager</h2>
      <table className="min-w-full bg-white border border-gray-200">
        <thead>
          <tr>
            <th className="border-b p-4 text-left font-semibold text-black">Order ID</th>
            <th className="border-b p-4 text-left font-semibold text-black">Customer Name</th>
            <th className="border-b p-4 text-left font-semibold text-black">Status</th>
            <th className="border-b p-4 text-left font-semibold text-black">Total</th>
            <th className="border-b p-4 text-left font-semibold text-black">Actions</th>
          </tr>
        </thead>
        <tbody>
          {orders.map((order) => (
            <tr key={order.id} className="hover:bg-gray-50">
              <td className="border-b p-4 text-gray-700">{order.id}</td>
              <td className="border-b p-4 text-gray-700">{order.customerName}</td>
              <td className="border-b p-4 text-gray-700">{order.status}</td>
              <td className="border-b p-4 text-gray-700">${order.total.toFixed(2)}</td>
              <td className="border-b p-4 text-gray-700">
                {/* Optional: Add actions like "Update Status" */}
                <button className="bg-purple-600 text-white px-3 py-1 rounded">
                  Update Status
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default OrderManager;
