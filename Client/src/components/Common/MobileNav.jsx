import React, { useId, useState } from 'react'
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
import { AlignLeft, Heart, Home, LogOut, Package, PhoneCall, ShoppingBag, TriangleAlert, User, Users } from 'lucide-react';
import { NavLink, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { Avatar, AvatarFallback, AvatarImage } from '../ui/avatar';
import { logout } from '@/Store/authSlice';
import toast from 'react-hot-toast';
import postHandler from '@/Services/Post.Service';
import { clearOnLogoutCart, sentCartItems } from '@/Store/addToCartSlice';
import { addWishItems, clearOnLogoutWishlist } from '@/Store/wishListSlice';

function MobileNav() {
    const userId = useSelector(state => state?.auth)
    const [open, setOpen] = useState(false)
    const [sheetopen, setSheetOpen] = useState(false)
    const dispatch = useDispatch()
    const navigate = useNavigate()
    const { isNew, cartItems } = useSelector(state => state.addToCart)
    const wishList = useSelector(state => state.wishList)


    const onLogout = async () => {
        if (isNew && cartItems.length > 0) {
            dispatch(sentCartItems())
        }
        if (wishList?.isNew && wishList.wishListItem?.length > 0) {
            dispatch(addWishItems())
        }
        await postHandler(`${import.meta.env.VITE_BACKEND_URL}/api/user/logout`)
            .then(res => {
                dispatch(logout())
                dispatch(clearOnLogoutCart())
                dispatch(clearOnLogoutWishlist())
                toast.success(res.message)
                setSheetOpen(false)
            })
            .catch(err => {
                toast.error(err.response?.message || 'Logout Failed. please try again')
            })
    }

    return (
        <Sheet open={sheetopen} onOpenChange={setSheetOpen}>
            <SheetTrigger className="flex items-center p-2 text-sm text-gray-500 rounded-lg md:hidden hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-gray-200">
                <AlignLeft />
            </SheetTrigger>
            <SheetContent side={'right'}>
                <SheetHeader>
                    <SheetTitle className={'w-full flex justify-center items-center'}>
                        <Avatar className={`${userId?.user?.avatar ? "border-0" : "border-2 border-gray-700"} h-20 w-20`}>
                            <AvatarImage src={userId?.user?.avatar} />
                            <AvatarFallback asChild>
                                <User size={22} className="text-gray-800" />
                            </AvatarFallback>
                        </Avatar>
                    </SheetTitle>
                    <SheetDescription asChild>
                        <div className='w-full flex justify-center items-center flex-col border-b-1 pb-5'>
                            <h2 className="text-lg font-semibold">{userId.user?.fullName || "No Data"}</h2>
                            <p className="text-sm text-muted-foreground">{userId.user?.email || "No Data"}</p>
                        </div>
                    </SheetDescription>
                </SheetHeader>
                <div className="h-full px-4 pb-4 bg-white">
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

                    {userId?.isAuthenticate && <ul className="space-y-2 font-medium border-t-1 mt-4 pt-4">
                        <li>
                            <SheetClose asChild><NavLink to={`/shop/edit/profile/${userId?.user?._id}`} className=" hover:bg-gray-100 text-gray-500 hover:text-black dark:hover:bg-gray-700 flex items-center p-2 rounded-lg dark:text-white group">
                                <User strokeWidth='2px' size='22px' />
                                <span className="ms-3">Account</span>
                            </NavLink></SheetClose>
                        </li>
                        <li>
                            <SheetClose asChild><NavLink to='/shop/wishlist' className="hover:bg-gray-100 text-gray-500 hover:text-black dark:hover:bg-gray-700 flex items-center p-2 rounded-lg dark:text-white group">
                                <Heart strokeWidth='2px' size='22px' />
                                <span className="flex-1 ms-3 whitespace-nowrap">Wishlist</span>
                            </NavLink></SheetClose>
                        </li>
                        <li>
                            <SheetClose asChild><NavLink to={`/shop/my-orders/${userId?._id}`} className="hover:bg-gray-100 text-gray-500 hover:text-black dark:hover:bg-gray-700 flex items-center p-2 rounded-lg dark:text-white group">
                                <Package strokeWidth='2px' size='22px' />
                                <span className="flex-1 ms-3 whitespace-nowrap">My orders</span>
                            </NavLink></SheetClose>
                        </li>
                    </ul>}
                </div>
                {userId?.isAuthenticate && <SheetFooter>
                    <button onClick={() => onLogout()} className='w-full bg-red-200 border border-red-300 flex justify-center p-2 text-red-700 font-semibold gap-2 rounded-md hover:bg-red-300 cursor-pointer'>
                        <LogOut />Logout
                    </button>
                </SheetFooter>}
            </SheetContent>
        </Sheet>

    )
}

export default MobileNav