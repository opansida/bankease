"use client";

import React, { useEffect } from 'react'; // 移除 use，添加 useEffect
import SideNav from './_components/SideNav';
import DashboardHeader from './_components/DashboardHeader';
import { db } from '@utils/dbConfig';
import { Budget } from '@utils/schema'; 
import { useUser } from '@clerk/nextjs';
import { eq } from 'drizzle-orm';

function DashboardLayout({ children }) {
  const { user } = useUser();

  useEffect(() => {
    if (user) {
      checkUserBudget();
    }
  }, [user]);

  const checkUserBudget = async () => {
    if (user?.primaryEmailAddress) {
      const result = await db
        .select()
        .from(Budget)
        .where(eq(Budget.createdBy, user.primaryEmailAddress));

      console.log(result); 
    } else {
      console.log("User email address is not available.");
    }
  };

  return (
    <div>
      <div className="fixed md:w-64 hidden md:block">
        <SideNav />
      </div>
      <div className="md:ml-64">
        <DashboardHeader />
        {children}
      </div>
    </div>
  );
}

export default DashboardLayout;

