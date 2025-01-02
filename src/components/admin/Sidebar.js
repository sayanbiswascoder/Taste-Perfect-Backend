import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import axios from "axios";
import Link from "next/link";

export default function Sidebar({ isOpen, setIsOpen, currentPage, setCurrentPage }) {
    const route = useRouter()
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [superadmin, setSuperAdmin] = useState()

    const navigation = [
        { name: 'Dashboard', icon: 'M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6', page: 'dashboard' },
        { name: 'Restaurants', icon: 'M3 3h18v18H3z', page: 'restaurants' },
        { name: 'Riders', icon: 'M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7', page: '/admin' },
        { name: 'Customers', icon: 'M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z', page: '/admin' },
        { name: 'Past Orders', icon: 'M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2', page: 'orders' },
        { name: 'Chat Support', icon: 'M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z', page: '/admin' },
    ]

    const managementLinks = [
        { name: 'Banners', icon: 'M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z', page: 'banners' },
        { name: 'Cities', icon: 'M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4', page: '/admin' },
        { name: 'Send Notification', icon: 'M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9', page: '/admin' },
    ];

    const fetchData = () => {
        axios.get('/api/admin/accountDetails', {
            headers: {
                Authorization: `Bearer ${sessionStorage.getItem('JWT')}`,
            },
        }).then((response) => {
            if (response.status === 200) {
                setName(response.data.name);
                setEmail(response.data.email);
                setSuperAdmin(response.data.superadmin);
            }
        }).catch((error) => {
            console.error(error);
        })
    }

    useEffect(() => {
        fetchData()
    }, [])

    return (
        <>
            <div
                className={`fixed inset-0 bg-gray-600 bg-opacity-75 transition-opacity lg:hidden ${isOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'
                    }`}
                onClick={() => setIsOpen(false)}
            />

            <div
                className={`fixed inset-y-0 left-0 flex w-64 flex-col bg-white transition-transform lg:translate-x-0 ${isOpen ? 'translate-x-0' : '-translate-x-full'
                    }`}
            >
                <div className="flex h-16 flex-shrink-0 items-center px-4">
                    <img
                        className="h-8 w-8 rounded-full"
                        src="/api/placeholder/32/32"
                        alt="User"
                    />
                    <span className="ml-2 text-sm font-semibold text-black">NIKHIL AGARWAL</span>
                </div>

                <div className="flex-1 flex flex-col overflow-y-auto">
                    <nav className="flex-1 space-y-1 px-2 py-4">
                        {navigation.map((item) => (
                            <div
                                key={item.name}
                                onClick={() => setCurrentPage(item.page)}
                                className={`group flex items-center px-2 py-2 text-sm font-medium rounded-md   cursor-pointer ${currentPage == item.page ? 'bg-purple-500 text-white' : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'}`}
                            >
                                <svg
                                    className={`mr-3 h-6 w-6 ${currentPage == item.page ? 'text-white' : 'text-gray-400 group-hover:text-gray-500'}`}
                                    fill="none"
                                    viewBox="0 0 24 24"
                                    stroke="currentColor"
                                    aria-hidden="true"
                                >
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth={2}
                                        d={item.icon}
                                    />
                                </svg>
                                {item.name}
                            </div>
                        ))}

                        {
                            superadmin && <div
                                onClick={() => setCurrentPage('admins')}
                                className={`group flex items-center px-2 py-2 text-sm font-medium rounded-md   cursor-pointer ${currentPage == 'admins' ? 'bg-purple-500 text-white' : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'}`}
                            >
                                <svg
                                    className={`mr-3 h-6 w-6 ${currentPage == 'admins' ? 'text-white' : 'text-gray-400 group-hover:text-gray-500'}`}
                                    fill="none"
                                    viewBox="0 0 36 36"
                                    stroke="currentColor"
                                    aria-hidden="true"
                                >
                                    <path d="M14.68,14.81a6.76,6.76,0,1,1,6.76-6.75A6.77,6.77,0,0,1,14.68,14.81Zm0-11.51a4.76,4.76,0,1,0,4.76,4.76A4.76,4.76,0,0,0,14.68,3.3Z" class="clr-i-outline clr-i-outline-path-1"></path><path d="M16.42,31.68A2.14,2.14,0,0,1,15.8,30H4V24.22a14.81,14.81,0,0,1,11.09-4.68l.72,0a2.2,2.2,0,0,1,.62-1.85l.12-.11c-.47,0-1-.06-1.46-.06A16.47,16.47,0,0,0,2.2,23.26a1,1,0,0,0-.2.6V30a2,2,0,0,0,2,2H16.7Z" class="clr-i-outline clr-i-outline-path-2"></path><path d="M26.87,16.29a.37.37,0,0,1,.15,0,.42.42,0,0,0-.15,0Z" class="clr-i-outline clr-i-outline-path-3"></path><path d="M33.68,23.32l-2-.61a7.21,7.21,0,0,0-.58-1.41l1-1.86A.38.38,0,0,0,32,19l-1.45-1.45a.36.36,0,0,0-.44-.07l-1.84,1a7.15,7.15,0,0,0-1.43-.61l-.61-2a.36.36,0,0,0-.36-.24H23.82a.36.36,0,0,0-.35.26l-.61,2a7,7,0,0,0-1.44.6l-1.82-1a.35.35,0,0,0-.43.07L17.69,19a.38.38,0,0,0-.06.44l1,1.82A6.77,6.77,0,0,0,18,22.69l-2,.6a.36.36,0,0,0-.26.35v2.05A.35.35,0,0,0,16,26l2,.61a7,7,0,0,0,.6,1.41l-1,1.91a.36.36,0,0,0,.06.43l1.45,1.45a.38.38,0,0,0,.44.07l1.87-1a7.09,7.09,0,0,0,1.4.57l.6,2a.38.38,0,0,0,.35.26h2.05a.37.37,0,0,0,.35-.26l.61-2.05a6.92,6.92,0,0,0,1.38-.57l1.89,1a.36.36,0,0,0,.43-.07L32,30.4A.35.35,0,0,0,32,30l-1-1.88a7,7,0,0,0,.58-1.39l2-.61a.36.36,0,0,0,.26-.35V23.67A.36.36,0,0,0,33.68,23.32ZM24.85,28a3.34,3.34,0,1,1,3.33-3.33A3.34,3.34,0,0,1,24.85,28Z" class="clr-i-outline clr-i-outline-path-4" />
                                </svg>
                                Admins
                            </div>
                        }


                        <div className="mt-8">
                            <h3 className="px-3 text-sm font-medium text-gray-500">MANAGE</h3>
                            <div className="mt-1 space-y-1">
                                {managementLinks.map((item) => (
                                    <div
                                        key={item.name}
                                        onClick={() => setCurrentPage(item.page)}
                                        className={`group flex items-center px-2 py-2 text-sm font-medium rounded-md cursor-pointer ${currentPage == item.page ? 'bg-purple-500 text-white' : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'}`}
                                    >
                                        <svg
                                            className={`mr-3 h-6 w-6 ${currentPage == item.page ? 'text-white' : 'text-gray-400 group-hover:text-gray-500'}`}
                                            fill="none"
                                            viewBox="0 0 24 24"
                                            stroke="currentColor"
                                        >
                                            <path
                                                strokeLinecap="round"
                                                strokeLinejoin="round"
                                                strokeWidth={2}
                                                d={item.icon}
                                            />
                                        </svg>
                                        {item.name}
                                    </div>
                                ))}
                            </div>
                        </div>
                    </nav>

                    <div className="flex-shrink-0 border-t border-gray-200 p-4">
                        <button className="w-full flex items-center justify-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-red-600 hover:bg-red-700" onClick={() => {
                            sessionStorage.removeItem('JWT')
                            route.push('/admin/auth/login')
                        }}>
                            LOGOUT
                        </button>
                    </div>
                </div>
            </div>
        </>
    );
}