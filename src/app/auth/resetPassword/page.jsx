'use client';
import { useState } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import axios from 'axios';

export default function LoginPage() {
    const [formData, setFormData] = useState({
        password: '',
        conformPassword: '',
    });
    const router = useRouter();
    const params = useSearchParams();

    const handleSubmit = async (e) => {
        e.preventDefault();
        const token = params.get('token');
        const type = params.get('type');
        if (formData.conformPassword.length > 0 && token) {
            if (formData.password !== formData.conformPassword) {
                alert('Passwords do not match');
                return;
            } else {
                axios.post('/api/auth/resetPassword', { newPassword: formData.password, token: token, type: type }).then((response) => {
                    if (response.status === 200) {
                        alert('Password changed successfully');
                    }
                }).catch((error) => {
                    console.error(error.response.data);
                });
            }
        }
    }

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50 p-4">
            <div className="max-w-4xl w-full flex flex-col md:flex-row shadow-2xl rounded-3xl overflow-hidden bg-white">
                {/* Gradient section - Full width on mobile, half width on desktop */}
                <div className="w-full md:w-1/2 bg-gradient-to-br from-red-500 via-red-400 to-pink-500 p-8 md:p-12 items-center justify-center flex">
                    <div className="flex flex-col items-center justify-center text-white">
                        {/* Logo - Smaller on mobile */}
                        <div className="mb-6 md:mb-8 transform scale-75 md:scale-100">
                            <div className="bg-white rounded-full p-3 md:p-4 inline-block">
                                <div className="flex items-start flex-col ">
                                    <span className="text-red-500 font-bold text-xl md:text-2xl">Taste</span>
                                    <span className="text-green-500 font-bold text-xl md:text-2xl">Perfect</span>
                                </div>
                            </div>
                        </div>

                        {/* Welcome text - Responsive font sizes */}
                        <h2 className="text-2xl md:text-3xl font-bold mb-3 md:mb-4 text-center">
                            Welcome, my Friend!
                        </h2>
                        <p className="text-center text-base md:text-lg px-4 md:px-0">
                            Start your journey with our stylish food delivery platform
                        </p>
                    </div>
                </div>

                {/* Form section - Full width on mobile, half width on desktop */}
                <div className="w-full md:w-1/2 bg-white p-8 md:p-12">
                    <div className="max-w-sm mx-auto">
                        <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-6 md:mb-8">
                            Change Password
                        </h2>

                        <form className="space-y-5" onSubmit={handleSubmit}>
                            {/* Email Input */}
                            <div className="space-y-1">
                                <input
                                    type="password"
                                    required
                                    className="appearance-none relative block w-full px-3 py-2 md:py-3 border border-gray-300 
                           placeholder-gray-500 text-gray-900 rounded-lg focus:outline-none focus:ring-2 
                           focus:ring-red-500 focus:border-red-500 focus:z-10 text-sm md:text-base bg-yellow-50"
                                    placeholder="Enter your password"
                                    value={formData.password}
                                    onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                                />
                            </div>

                            {/* Password Input */}
                            <div className="space-y-1">
                                <input
                                    type="password"
                                    required
                                    className="appearance-none relative block w-full px-3 py-2 md:py-3 border border-gray-300 
                           placeholder-gray-500 text-gray-900 rounded-lg focus:outline-none focus:ring-2 
                           focus:ring-red-500 focus:border-red-500 focus:z-10 text-sm md:text-base bg-yellow-50"
                                    placeholder="Conform your Password"
                                    value={formData.conformPassword}
                                    onChange={(e) => setFormData({ ...formData, conformPassword: e.target.value })}
                                />
                            </div>

                            {/* Submit Button */}
                            <div>
                                <button
                                    type="submit"
                                    className="w-full flex justify-center py-2.5 md:py-3 px-4 border border-transparent 
                           rounded-lg shadow-sm text-sm md:text-base font-medium text-white bg-red-500 
                           hover:bg-red-600 focus:outline-none focus:ring-2 focus:ring-offset-2 
                           focus:ring-red-500 transition-colors duration-200"
                                >
                                    Change Password
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    );
}