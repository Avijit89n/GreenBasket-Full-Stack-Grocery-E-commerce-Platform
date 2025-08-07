import React, { useState } from 'react'
import mainLogo from '../../assets/mainLogo.png'
import { AlignLeft, LayoutPanelLeft, Truck, Bell, Star, LogOut, Plus, Settings, ShoppingBag, UserRound, TriangleAlert, LayoutTemplate, Gauge } from 'lucide-react'
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger, SheetDescription, SheetClose } from "@/components/ui/sheet"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger, } from "@/components/ui/dropdown-menu"
import admin from '../../assets/admin.jpg'
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"

import { Link, NavLink } from 'react-router-dom'
import postHandler from '@/Services/Post.Service'
import { useDispatch } from 'react-redux'
import { logout } from '@/Store/authSlice';
import toast from 'react-hot-toast'


function AdminHeader() {
  const [open, setOpen] = useState(false)
  const dispatch = useDispatch();

  const onLogout = async () => {
    await postHandler('http://localhost:8000/api/user/logout')
      .then(res => {
        if (res) {
          dispatch(logout())
          toast.success(res.message)
        }
      })
      .catch(err => {
        toast.error(err.response?.message || 'Logout Failed. please try again')
      })
      .finally(() => {
        setOpen(false)
      })
  }

  return (
    <nav className="fixed top-0 z-50 w-full bg-white border-b border-gray-200 dark:bg-gray-800 dark:border-gray-700">
      <div className="px-3 py-3 lg:px-5 lg:pl-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center justify-start rtl:justify-end">


            <Sheet >
              <SheetTrigger className="inline-flex items-center p-2 text-sm text-gray-500 rounded-lg sm:hidden hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-gray-200 dark:text-gray-400 dark:hover:bg-gray-700 dark:focus:ring-gray-600">
                <AlignLeft />
              </SheetTrigger>
              <SheetContent side={'left'}>
                <SheetHeader>
                  <SheetTitle>Admin Pannel</SheetTitle>
                  <SheetDescription>Menu</SheetDescription>
                </SheetHeader>
                <div className="h-full px-3 pb-4 overflow-y-auto bg-white dark:bg-gray-800">
                  <ul className="space-y-2 font-medium">
                    <li>
                      <SheetClose asChild><NavLink to='/admin/dashboard' className=" hover:bg-gray-100 text-gray-500 hover:text-black dark:hover:bg-gray-700 flex items-center p-2 rounded-lg dark:text-white group">
                        <Gauge strokeWidth='2px' size='22px' />
                        <span className="ms-3">Dashboard</span>
                      </NavLink></SheetClose>
                    </li>
                    <li>
                      <SheetClose asChild><NavLink to='/admin/products' className="hover:bg-gray-100 text-gray-500 hover:text-black dark:hover:bg-gray-700 flex items-center p-2 rounded-lg dark:text-white group">
                        <ShoppingBag strokeWidth='2px' size='22px' />
                        <span className="flex-1 ms-3 whitespace-nowrap">Products</span>
                      </NavLink></SheetClose>
                    </li>
                    <li>
                      <SheetClose asChild><NavLink to='/admin/orders' className="hover:bg-gray-100 text-gray-500 hover:text-black dark:hover:bg-gray-700 flex items-center p-2 rounded-lg dark:text-white group">
                        <Truck strokeWidth='2px' size='22px' />
                        <span className="flex-1 ms-3 whitespace-nowrap">Orders</span>
                      </NavLink></SheetClose>
                    </li>
                    <li>
                      <SheetClose asChild><NavLink to='/admin/categories' className="hover:bg-gray-100 text-gray-500 hover:text-black dark:hover:bg-gray-700 flex items-center p-2 rounded-lg dark:text-white group">
                        <LayoutPanelLeft strokeWidth='2px' size='22px' />
                        <span className="flex-1 ms-3 whitespace-nowrap">Category</span>
                      </NavLink></SheetClose>
                    </li>
                    <li>
                      <SheetClose asChild><NavLink to='/admin/sub-categories' className="hover:bg-gray-100 text-gray-500 hover:text-black dark:hover:bg-gray-700 flex items-center p-2 rounded-lg dark:text-white group">
                        <LayoutTemplate strokeWidth='2px' size='22px' />
                        <span className="flex-1 ms-3 whitespace-nowrap">Sub Category</span>
                      </NavLink></SheetClose>
                    </li>
                    <li>
                      <SheetClose asChild><NavLink to='/admin/features' className="hover:bg-gray-100 text-gray-500 hover:text-black dark:hover:bg-gray-700 flex items-center p-2 rounded-lg dark:text-white group">
                        <Star strokeWidth='2px' size='22px' />
                        <span className="flex-1 ms-3 whitespace-nowrap">Features</span>
                      </NavLink></SheetClose>
                    </li>
                  </ul>
                </div>
              </SheetContent>
            </Sheet>


            <Link to='/shop/home' className="flex ms-2 md:me-24">
              <img src={mainLogo} className="h-8 me-3" alt="FlowBite Logo" />
              <span className="self-center text-blue-900 text-xl font-bold sm:text-2xl">Green<span className='text-green-400'>Basket</span></span>
            </Link>

          </div>


          <div className="flex items-center">
            <div className="flex items-center ms-3">
              <DropdownMenu>
                <DropdownMenuTrigger className="flex text-sm bg-gray-800 rounded-full focus:ring-4 focus:ring-gray-300 dark:focus:ring-gray-600">
                  <img className="w-8 h-8 rounded-full" src={admin} alt="user photo" />
                </DropdownMenuTrigger>

                <DropdownMenuContent className='w-[200px]'>
                  <DropdownMenuLabel>My Account</DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem> <UserRound /> Profile</DropdownMenuItem>
                  <DropdownMenuItem > <Plus /> Add Admin </DropdownMenuItem>
                  <DropdownMenuItem> <Settings /> Settings</DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={() => setOpen(true)}>
                    < LogOut color='#E5484D' /> <span className='text-[#E5484D]'>Sign out</span>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>



              <AlertDialog open={open} onOpenChange={setOpen}>
                <AlertDialogContent>
                  <AlertDialogHeader>
                    <AlertDialogTitle className={'flex justify-center m-2'}><TriangleAlert size={'40px'} color={'oklch(82.8% 0.189 84.429)'} /></AlertDialogTitle>
                    <AlertDialogDescription className={'text-center text-gray-500 text-md mb-2'}>
                      Are you sure you want to log out? Your session will end immediately.
                    </AlertDialogDescription>
                  </AlertDialogHeader>
                  <AlertDialogFooter>
                    <AlertDialogCancel>No, cancel</AlertDialogCancel>
                    <AlertDialogAction className={'bg-red-500 hover:bg-red-600 cursor-pointer'} onClick={onLogout}>Yes, I'm sure</AlertDialogAction>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>

            </div>
          </div>
        </div>
      </div>
    </nav>
  )
}

export default AdminHeader
