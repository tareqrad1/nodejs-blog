import { Loader, Lock, LockKeyhole, Mail, User } from 'lucide-react'
import React from 'react'
import { Link } from 'react-router-dom'
import { Input } from "@/components/ui/input"

const SignupPage: React.FC = (): React.JSX.Element => {
  function handleChange(e: React.ChangeEvent<HTMLInputElement>) {

  }
  return (
    <div className='flex bg-white text-black w-full h-[100vh]'>
    {/* left side */}
    <div className='hidden md:block md:w-1/2'>
      <img src='../../../public/SIDEBAR.png' className='h-[100vh] w-full object-cover'/>
    </div>
    {/* right side */}
    <div className='flex justify-center items-center w-full md:w-1/2'>
      <div className='flex flex-col'>
        <div className='space-y-3 mb-6'>
          <h1 className='text-[#183B56] text-4xl capitalize font-bold'>hi, welcome</h1>
          <p className='text-[#00072D]'>Join us now and start with your friends.</p>
        </div>
        <form className='space-y-4 text-start'>
        <div className='space-y-2'>
            <div className='flex gap-1'>
              <User className='opacity-60 size-5' />
              <h1 className='text-sm' >Full Name</h1>
            </div>
            <Input type="text" placeholder="Full Name" className='bg-white px-2' name='fullname'  onChange={handleChange}/>
        </div>
        <div className='space-y-2'>
            <div className='flex gap-1'>
              <Mail className='opacity-60 size-5' />
              <h1 className='text-sm'>Email</h1>
            </div>
            <Input type="email" required placeholder="Email" className='bg-white px-2' name='email'  onChange={handleChange}/>
        </div>
        <div className='space-y-2'>
        <div className='flex gap-1'>
          <Lock className='opacity-60 size-5' />
          <h1 className='text-sm'>Password</h1>
        </div>
          <Input type="password" placeholder="**********" className='bg-white px-2' name='password'  onChange={handleChange}/>
        </div>
        <div className='space-y-2'>
          <div className='flex gap-1'>
            <LockKeyhole className='opacity-60 size-5' />
            <h1 className='text-sm'>Confirm Password</h1>
          </div>
          <Input type='password' placeholder="**********" className='bg-white px-2' name='confirmPassword'  onChange={handleChange}/>
        </div>
        <p className='text-red-500 text-sm transition-colors'></p>
        {false ? <button className='bg-[#1565D8] w-full py-2 capitalize text-sm rounded-md flex justify-center text-white cursor-pointer'><Loader className='size-5 animate-spin'/></button> : <button className='bg-[#1565D8] w-full py-2 capitalize text-sm rounded-md text-white cursor-pointer hover:bg-[#1566d8e0] transition-colors'>create account</button>}
        </form>
        <p className='text-sm text-[#979797] mt-3'>Already have an account? {" "} <Link to={'/login'} className='text-black'>Sign In</Link></p>
      </div>
    </div>
  </div>
  )
}

export default SignupPage