import React, { useState, useEffect } from "react";
import { MdEdit, MdDelete } from "react-icons/md";
import axios from "axios";

const RestaurantManager = () => {
    const [restaurants, setRestaurants] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    // Fetch Restaurants Data
    const fetchRestaurants = async () => {
        setLoading(true);
        setError(null);
        try {
            const response = await axios.get("/api/restaurants");
            setRestaurants(response.data);
        } catch (err) {
            setError("Failed to fetch restaurants. Please try again.");
        } finally {
            setLoading(false);
        }
    };

    // Delete a Restaurant
    const deleteRestaurant = async (id) => {
        try {
            await axios.delete(`/api/restaurants/${id}`);
            setRestaurants((prev) => prev.filter((restaurant) => restaurant.id !== id));
        } catch (err) {
            alert("Failed to delete the restaurant. Please try again.");
        }
    };

    useEffect(() => {
        const fetchRestaurants = async () => {
            setLoading(true);
            setError(null);
            try {
                const response = await axios.get('/api/admin/fetchRestaurants', {
                    headers: {
                        Authorization: `Bearer ${sessionStorage.getItem('JWT')}`,
                    },
                });
                console.log(response.data)
                setRestaurants(response.data);
            } catch (error) {
                console.error('Error fetching admins:', error);
                setError("Failed to fetch restaurants. Please try again.");
            } finally {
                setLoading(false);
            }
        };
        fetchRestaurants();
    }, []);

    return (
        <div className="p-4">
            <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-semibold text-slate-600">Restaurants</h2>
                {/* <button className="bg-purple-600 text-white px-4 py-2 rounded hover:bg-purple-700">
          + Add New
        </button> */}
            </div>

            {loading ? (
                <p className="text-gray-500">Loading...</p>
            ) : error ? (
                <p className="text-red-500 font-medium">{error}</p>
            ) : (
                <div className="overflow-x-auto">
                    <table className="min-w-full bg-white border border-gray-200 rounded-lg shadow-md">
                        <thead>
                            <tr className="bg-purple-600 text-white">
                                <th className="px-4 py-2">Cover</th>
                                <th className="px-4 py-2">Restaurant</th>
                                <th className="px-4 py-2">Owner</th>
                                <th className="px-4 py-2">Menu</th>
                                <th className="px-4 py-2">Email</th>
                                <th className="px-4 py-2">Phone</th>
                                <th className="px-4 py-2">Action</th>
                            </tr>
                        </thead>
                        <tbody>
                            {restaurants.map((restaurant) => (
                                <tr
                                    key={restaurant.id}
                                    className="hover:bg-gray-100 border-b border-gray-200"
                                >
                                    <td className="px-4 py-2">
                                        <img
                                            src={restaurant.cover}
                                            alt={restaurant.name}
                                            className="w-12 h-12 rounded object-cover"
                                        />
                                    </td>
                                    <td className="px-4 py-2">{restaurant.name}</td>
                                    <td className="px-4 py-2">{restaurant.owner}</td>
                                    <td className="px-4 py-2">
                                        <a
                                            href={`/menu/${restaurant.id}`}
                                            className="text-purple-600 hover:underline"
                                        >
                                            View Menu
                                        </a>
                                    </td>
                                    <td className="px-4 py-2">{restaurant.email}</td>
                                    <td className="px-4 py-2">{restaurant.mobile}</td>
                                    <td className="px-4 py-2 flex gap-2">
                                        <button
                                            className="bg-blue-500 text-white rounded-full px-1 py-1 hover:bg-blue-600"
                                            onClick={() => alert("Edit functionality not implemented")}
                                        >
                                            <MdEdit />
                                        </button>
                                        <button
                                            className="bg-red-500 text-white px-1 py-1 rounded-full hover:bg-red-600"
                                            onClick={() => deleteRestaurant(restaurant.id)}
                                        >
                                            <MdDelete />
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}
        </div>
    );
};

export default RestaurantManager;
