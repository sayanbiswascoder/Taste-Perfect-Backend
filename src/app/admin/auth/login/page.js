'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import axios from 'axios';

export default function LoginPage() {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });
  const router = useRouter();

  const handleSubmit = async (e) => {
    e.preventDefault();
    axios.post('/api/admin/auth/login', formData).then((response) => {
      console.log(response)
      if (response.status === 200) {
        sessionStorage.setItem('JWT', response.data.token);
        router.push('/admin');
      }
    }).catch((error) => {
      console.error(error);
    });
  };

  const forgetPassword = async () => {
    if (formData.email) {
      axios.post('/api/admin/auth/resetPassword', {
        email: formData.email,
      }).then((response) => {
        console.log(response);
      }).catch((error) => {
        console.error(error);
      })
    }else {
      alert('Please enter your email address.');
    }
  };

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
              Sign in
            </h2>

            <form className="space-y-5" onSubmit={handleSubmit}>
              {/* Email Input */}
              <div className="space-y-1">
                <input
                  type="email"
                  required
                  className="appearance-none relative block w-full px-3 py-2 md:py-3 border border-gray-300 
                           placeholder-gray-500 text-gray-900 rounded-lg focus:outline-none focus:ring-2 
                           focus:ring-red-500 focus:border-red-500 focus:z-10 text-sm md:text-base bg-yellow-50"
                  placeholder="Email address"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
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
                  placeholder="Password"
                  value={formData.password}
                  onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                />
              </div>

              {/* Forgot Password Link */}
              <div className="text-center" onClick={forgetPassword}>
                <span
                  className="text-xs md:text-sm text-gray-600 hover:text-red-500 transition-colors duration-200 cursor-pointer"
                >
                  Forgot your password?
                </span>
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
                  SIGN IN
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}