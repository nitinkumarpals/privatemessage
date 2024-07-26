'use client'
import React from 'react'
import Link from 'next/link';
import { useSession, signOut } from 'next-auth/react';
import { User } from 'next-auth';
import { space } from 'postcss/lib/list';
import { Button } from "@/components/ui/button"
const Navbar = () => {
    const { data: session } = useSession();
    const user: User = session?.user as User;
    const firstLetter = (user?.username || user?.email)?.charAt(0).toUpperCase();
    const lastName = (user?.username || user?.email)?.slice(1);
    const userName = `${firstLetter}${lastName}`;

  return (
    <nav className='p-4 md:p-6 shadow-md'>
        <div className='container mx-auto flex flex-col md:flex-row justify-between items-center'>
            <Link className='text-xl font-bold mb-4 md:mb-0' href="">Private Message</Link>
            {
                session?  (
                    <>
                        <span className='mr-4'>Welcome, {userName}</span>
                        <Button className='w-full md:w-auto' onClick={() => signOut()}>Logout</Button>
                    </>
                ) : (
                    <Link href="/sign-in"><Button>Login</Button></Link>
                )
            }
        </div>
    </nav>
  )
}

export default Navbar
