import React from 'react'
import {
    Sheet,
    SheetTrigger,
    SheetHeader,
    SheetTitle,
    SheetDescription,
    SheetContent,
    SheetClose,
    SheetFooter
} from '../ui/sheet'
import { AlignLeft, Home, PhoneCall, ShoppingBag, Users } from 'lucide-react';
import { NavLink } from 'react-router-dom';

function MobileNav() {


    return (
            <Sheet>
                <SheetTrigger className="flex items-center p-2 text-sm text-gray-500 rounded-lg md:hidden hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-gray-200 dark:text-gray-400 dark:hover:bg-gray-700 dark:focus:ring-gray-600">
                    <AlignLeft />
                </SheetTrigger>
                <SheetContent side={'right'}>
                    <SheetHeader>
                        <SheetTitle>Navbar</SheetTitle>
                        <SheetDescription>Menu</SheetDescription>
                    </SheetHeader>
                    <div className="h-full px-3 pb-4 overflow-y-auto bg-white dark:bg-gray-800">
                        <ul className="space-y-2 font-medium">
                            <li>
                                <SheetClose asChild><NavLink to='/shop/home' className=" hover:bg-gray-100 text-gray-500 hover:text-black dark:hover:bg-gray-700 flex items-center p-2 rounded-lg dark:text-white group">
                                    <Home strokeWidth='2px' size='22px' />
                                    <span className="ms-3">Home</span>
                                </NavLink></SheetClose>
                            </li>
                            <li>
                                <SheetClose asChild><NavLink to='/shop/lists/all' className="hover:bg-gray-100 text-gray-500 hover:text-black dark:hover:bg-gray-700 flex items-center p-2 rounded-lg dark:text-white group">
                                    <ShoppingBag strokeWidth='2px' size='22px' />
                                    <span className="flex-1 ms-3 whitespace-nowrap">Shop</span>
                                </NavLink></SheetClose>
                            </li>
                            <li>
                                <SheetClose asChild><NavLink to='/shop/about' className="hover:bg-gray-100 text-gray-500 hover:text-black dark:hover:bg-gray-700 flex items-center p-2 rounded-lg dark:text-white group">
                                    <Users strokeWidth='2px' size='22px' />
                                    <span className="flex-1 ms-3 whitespace-nowrap">About</span>
                                </NavLink></SheetClose>
                            </li>
                            <li>
                                <SheetClose asChild><NavLink to='/shop/contact' className="hover:bg-gray-100 text-gray-500 hover:text-black dark:hover:bg-gray-700 flex items-center p-2 rounded-lg dark:text-white group">
                                    <PhoneCall strokeWidth='2px' size='22px' />
                                    <span className="flex-1 ms-3 whitespace-nowrap">Contact Us</span>
                                </NavLink></SheetClose>
                            </li>
                        </ul>
                    </div>

                </SheetContent>
            </Sheet>

    )
}

export default MobileNav