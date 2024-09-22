import React from 'react';
import { UserButton } from '@clerk/nextjs';

function DashboardHeader() {
  return (
    <div className='p-5 shadow-sm border-b flex justify-between items-center bg-white'>
      <div className='text-xl font-semibold text-gray-700'>
        Welcome to <span className="text-primary font-bold">BankEase</span>.
      </div>
      <div>
        <UserButton />
      </div>
    </div>
  );
}

export default DashboardHeader;
