"use client";

import React, { useEffect } from 'react';
import Image from 'next/image';
import { LayoutGrid, CircleDollarSign, Send, HandCoins } from 'lucide-react';
import { UserButton } from '@clerk/nextjs';
import { usePathname, useRouter } from 'next/navigation'; 

function SideNav() {
  const router = useRouter(); 
  const path = usePathname();

  const menuList = [
    { id: 1, name: 'Dashboard', icon: LayoutGrid, path: '/dashboard' },
    { id: 2, name: 'Budgets', icon: CircleDollarSign, path: '/dashboard/budgets' },
    { id: 3, name: 'Expenses', icon: Send, path: '/dashboard/expenses' },
    { id: 4, name: 'Currency', icon: HandCoins, path: '/dashboard/currency_converter' }
  ];

  useEffect(() => {
    console.log(path);
  }, [path]);

  const handleNavigation = (menuPath) => {
    router.push(menuPath); 
  };

  return (
    <div className="h-screen p-5 border shadow-sm">
      <div className="flex items-center mb-5">
        {/* Logo */}
        <Image src="/logo.svg" alt="logo" width={45} height={35} />
        
        {/* Application Name with margin-left */}
        <h1 className="text-2xl font-bold text-primary ml-4">BankEase</h1>
      </div>

      <div className="mt-5">
        {menuList.map((menu) => (
          <h2
            key={menu.id}
            onClick={() => handleNavigation(menu.path)}
            className={`flex gap-2 items-center text-gray-500 font-medium p-5 cursor-pointer rounded-md hover:text-primary hover:bg-yellow-200 ${path === menu.path && 'text-primary bg-gray-200'}`}
          >
            <menu.icon className="w-5 h-5 text-gray-500" />
            {menu.name}
          </h2>
        ))}
      </div>

      <div className="fixed bottom-10 p-5 flex gap-2 items-center">
        <UserButton />
        Profile
      </div>
    </div>
  );
}

export default SideNav;


