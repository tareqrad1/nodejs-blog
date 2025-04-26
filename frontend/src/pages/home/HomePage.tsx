import Navbar from '@/components/content/Navbar'
import { Button } from '@/components/ui/button'
import { Globe } from 'lucide-react'
import React from 'react'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'

const HomePage: React.FC = (): React.JSX.Element => {
    return (
        <>
            <div className="relative w-full h-screen overflow-hidden">
                {/* Background Overlay */}
                <div className="absolute top-0 left-0 w-full h-full bg-black/90 z-0">
                    <img
                        src="/bg-image.png"
                        alt="background"
                        className="w-full h-full object-cover"
                    />
                </div>
                {/* Navbar */}
                <div className="relative z-30">
                    <Navbar />
                </div>

                {/* Centered Content */}
                <div className="absolute inset-0 flex flex-col justify-center items-center text-center px-4 space-y-6 z-10">
                    <motion.h1 className="text-3xl md:text-5xl font-bold text-white capitalize leading-tight"
                        initial={{ opacity: 0, y: -50 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8 }}
                        exit={{ opacity: 0, y: -50 }}
                    >
                        Read the Most Interesting Articles
                    </motion.h1>
                    <motion.p className="text-sm md:text-lg text-gray-300 max-w-xl"
                        initial={{ opacity: 0, y: -50 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8, delay: 0.3 }}
                        exit={{ opacity: 0, y: -50 }}
                    >
                        Our blog is your gateway to new thoughts, experiences, and inspiration. Dive in and start exploring!
                    </motion.p>
                    <Button className="py-5 px-8 text-white text-sm md:text-base flex items-center gap-2 opacity-90">
                        <Link to="/article" className="flex items-center gap-2">
                            <Globe className="w-5 h-5" />
                            Discover
                        </Link>
                    </Button>
                </div>
            </div>
        </>
    )
}

export default HomePage
