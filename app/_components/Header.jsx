"use client";
import React from 'react';
import Image from 'next/image';
import { Button } from "@/components/ui/button";
import { UserButton, useUser } from '@clerk/nextjs'; 
import Link from 'next/link'; 

function Header() {
  const { user, isSignedIn } = useUser();  

  return (
    <div className='p-5 flex justify-between items-center border shadow-md'>
      <Image src="/logo.svg" alt="logo" width={45} height={35} />

      <div className='flex gap-4 items-center'>

        {isSignedIn ? (
          <>
            <Link href="/dashboard">
              <Button>Dashboard</Button> 
            </Link>
            <UserButton /> 
          </>
        ) : (
          <Link href="/sign-in">
            <Button>Get Started</Button>  
          </Link>
        )}
      </div>
    </div>
  );
}

export default Header;
