import React from 'react';
import Skeleton from 'react-loading-skeleton';
import { AnimatePresence, motion } from 'framer-motion';
import 'react-loading-skeleton/dist/skeleton.css';

export default function HomeLoader() {
    const categoryCount = 20;

    return (
        <AnimatePresence>
        <motion.div
            initial={{ opacity: 1 }}
            animate={{ opacity: 0.6 }}
            exit={{ opacity: 0.3 }}
            transition={{ delay: 0.98 }}
            className='bg-white fixed inset-0 overflow-y-auto top-15 z-40 w-full pb-10'>
            <div className="overflow-hidden">
                <div className="flex gap-2">
                    <div className="flex-none w-full p-2 sm:p-3 md:p-4 lg:p-5">
                        <div className="relative w-full h-[200px] sm:h-[300px] md:h-[400px] lg:h-[585px] overflow-hidden rounded-md">
                            <Skeleton baseColor='#d1d5db' borderRadius={10} className="absolute inset-0 w-full h-full" />
                            <div className="absolute inset-0 rounded-md bg-gradient-to-r from-gray-200/20 via-gray-200/10 to-transparent" />
                            <div className="absolute inset-0 w-2/3 sm:w-1/2 flex flex-col justify-center item-start pl-4 sm:pl-8 md:pl-12 lg:p-16 space-y-3">
                                <Skeleton borderRadius={10} height={50} width="130%"/>
                                <Skeleton borderRadius={10} height={20} width="60%" />
                                <Skeleton height={36} width={100} borderRadius={6} />
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <div className="flex flex-col md:gap-3 lg:gap-4 mt-10 px-4 sm:px-6 md:px-8 lg:px-12">
                <Skeleton height={32} width={200} borderRadius={6} baseColor='#d1d5db'/>
                <div className="grid sm:grid-cols-[repeat(auto-fill,minmax(130px,1fr))] grid-cols-4 pt-5 md:pt-0 gap-3">
                    {Array(categoryCount).fill().map((_, index) => (
                        <div key={index} className="p-3 bg-white rounded-md border">
                            <Skeleton height={100} className="rounded-md" baseColor='#d1d5db'/>
                            <Skeleton height={14} width="80%" className="mt-3 mx-auto" baseColor='#d1d5db'/>
                        </div>
                    ))}
                </div>
            </div>
        </motion.div>
        </AnimatePresence>
    );
}
