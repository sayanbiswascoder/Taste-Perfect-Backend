'use client';
import { useState } from 'react';
import Sidebar from '../components/admin/Sidebar';
import Header from '../components/admin/Header';
import RestaurantTable from '../components/admin/RestaurantTable';
import BannerManager from '@/components/admin/BannerManager';
import { useRouter } from 'next/navigation';

export default function DashboardPage() {
  const route = useRouter()

  return (
    <main className="p-6 flex h-screen w-screen items-center justify-center">
      <button className='bg-green-500 p-5 rounded-lg text-white' onClick={() => route.push('/admin')}>Go To Admin Dashboard</button>
    </main>
  );
}