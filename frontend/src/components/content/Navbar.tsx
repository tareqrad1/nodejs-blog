import React from 'react'
import { Link } from 'react-router-dom'
import { CircleUserRound } from 'lucide-react'
import SvgLogo from '@/svgs/logo'

const Navbar: React.FC = (): React.JSX.Element => {
    const isLoggedIn = true

    return (
        <div className="w-full bg-transparent py-4">
            <div className="max-w-7xl mx-auto flex justify-between items-center px-4">
                {/* Logo */}
                <div>
                    <Link to="/" >
                        <SvgLogo />
                    </Link>
                </div>

                {/* Links */}
                <ul className="flex items-center gap-2 md:gap-6">
                <li>
                    <Link
                    to="/"
                    className="text-gray-300 text-sm hover:text-white transition-colors"
                    >
                    Home
                    </Link>
                </li>
                <li>
                    <Link
                    to="/article"
                    className="text-gray-300 text-sm hover:text-white transition-colors"
                    >
                    Article
                    </Link>
                </li>
                <li>
                    <Link
                    to="/faq"
                    className="text-gray-300 text-sm hover:text-white transition-colors"
                    >
                    FAQ
                    </Link>
                </li>
                </ul>

                {/* Profile / Login */}
                {isLoggedIn ? (
                <Link to="/account" className="flex items-center gap-3">
                        <div className="hidden text-white text-xs sm:flex flex-col">
                        <p>Hey</p>
                        <p className="font-semibold">Ales Nesetril</p>
                    </div>
                    <img
                    src="/avatar.png"
                    alt="User Avatar"
                    className="h-10 w-10 rounded-full object-cover"
                    />
                </Link>
                ) : (
                <CircleUserRound className="text-gray-300 w-8 h-8 cursor-pointer hover:text-white transition-colors" />
                )}
            </div>
        </div>
    )
}

export default Navbar
