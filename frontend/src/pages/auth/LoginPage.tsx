import { Eye, EyeClosed, Loader, Lock, Mail } from 'lucide-react'
import React from 'react'
import { Link } from 'react-router-dom'
import { Input } from "@/components/ui/input"

const LoginPage: React.FC = (): React.JSX.Element => {
  return (
    <div className='flex bg-white text-black w-full h-[100vh]'>
        {/* left side */}
            <div className='hidden md:block md:w-1/2'>
            <img src='../../../public/Screenshot 2025-03-09 134310.png' className='h-[100vh] w-full object-cover'/>
            </div>
            {/* right side */}
            <div className='flex justify-center items-center w-full md:w-1/2 px-4'>
            <div className='flex flex-col'>
                <div className='space-y-3 mb-6'>
                <h1 className='text-[#183B56] text-4xl capitalize font-bold'>welcome back</h1>
                <p className='text-[#00072D]'>Let's get you back to sharing your ideas and stories.</p>
                </div>
                <form className='space-y-3 text-start'>
                <div className='space-y-2'>
                <div className='flex gap-1'>
                    <Mail className='opacity-60 size-5' />
                    <h1 className='text-sm'>Email</h1>
                </div>
                <Input type="email" name='email'  required placeholder="Email" className='bg-white px-2'/>
                </div>
                {true ? (
                <div className="space-y-2">
                <div className="flex gap-1">
                    <Lock className="opacity-60 size-5" />
                    <h1 className="text-sm">Password</h1>
                </div>
                <div className="relative">
                    <Input
                        type="password"
                        name="password"
                        placeholder="**********"
                        className="bg-white pr-10 pl-2" // extra padding right
                    />
                    <EyeClosed
                        className="absolute right-2 top-1/2 -translate-y-1/2 text-sm opacity-60 cursor-pointer"
                    />
                </div>
            </div>
                ) : (
                    <div className="space-y-1">
                    <div className="flex items-center gap-1">
                        <h1 className="text-sm">Password</h1>
                        <Lock className="opacity-60 size-5" />
                    </div>
                    <div className="relative">
                        <Input
                            type="password"
                            name="password"
                            placeholder="**********"
                            className="bg-white pr-10 pl-2" // right padding for the eye
                        />
                        <Eye
                            className="absolute right-2 top-1/2 -translate-y-1/2 text-sm opacity-60 cursor-pointer"
                        />
                    </div>
                </div>
                
                )}
                <p className='text-sm hover:underline cursor-pointer w-fit'>forget password?</p>
                <p className='text-red-500 text-sm transition-colors'></p>
                {false ? <button className='bg-[#1565D8] w-full py-2 capitalize text-sm rounded-md flex justify-center text-white cursor-pointer'><Loader className='size-5 animate-spin'/></button> : <button className='bg-[#1565D8] w-full py-2 capitalize text-sm rounded-md text-white cursor-pointer hover:bg-[#1566d8e0] transition-colors'>login</button>}
                </form>
                <p className='text-sm text-[#979797] mt-3'>Don't have account? {" "} <Link to={'/signup'} className='text-black'>Sign Up</Link></p>
            </div>
            </div>
      </div>
  )
}

export default LoginPage