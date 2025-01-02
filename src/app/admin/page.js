'use client';
import { useEffect, useState } from 'react';
import { useRouter, usePathname } from 'next/navigation'
import Sidebar from '../../components/admin/Sidebar';
import Header from '../../components/admin/Header';
import RestaurantTable from '../../components/admin/RestaurantTable';
import RestaurantManager from '@/components/admin/RestaurantManager';
import LoadingSpinner from '@/components/admin/LoadingSpinner';
import BannerManager from '@/components/admin/BannerManager';
import AdminManager from '@/components/admin/AdminManager';
import OrderManager from '@/components/admin/OrderManager';

export default function DashboardPage() {
  const router = useRouter()

  const [isLogdin, setIsLogdin] = useState(false)
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [currentPage, setCurrentPage] = useState('dashboard')

  const pages = {
    "dashboard": {
      "title": "Restaurants Table",
      "component": <RestaurantTable />
    },
    "restaurants": {
      "title": "Restaurants Table",
      "component": <RestaurantManager />
    },
    "orders": {
      "title": "Past orders",
      "component": <OrderManager />
    },
    "banners": {
      "title": "Banners Manager",
      "component": <BannerManager />
    },
    "admins": {
      "title": "Admins Manager",
      "component": <AdminManager />
    },
    "/admin": {
      "title": "Admins Manager",
      "component": <></>
    }
  }

  useEffect(() => {
    const jwt = sessionStorage.getItem('JWT')
    if (!jwt) {
      // make the push after 2 seconds
      setTimeout(() => {
        router.push('/admin/auth/login')
      }, 2000)
    } else {
      setIsLogdin(true)
    }
  }, [])

  useEffect(() => {
    console.log(currentPage)
  }, [currentPage]);

  return (
    <>
      {isLogdin ? <div className="min-h-screen bg-gray-100">
        <Sidebar isOpen={sidebarOpen} setIsOpen={setSidebarOpen} currentPage={currentPage} setCurrentPage={setCurrentPage} />
        <div className="lg:pl-64">
          <Header onMenuClick={() => setSidebarOpen(true)} />
          {/* {currentPage} */}
          <main className="p-6">
            {
              // <AdminManager />
              pages[currentPage].component
            }
          </main>
        </div>
      </div > : <LoadingSpinner />
      }
    </>
  )
}