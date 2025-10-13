import React, { useState } from 'react'
import mainLogo from '../../assets/mainlogo.png'
import { ShoppingCart, Bell, CircleUser, Heart, LogOut, UserRound, Settings, Plus, TriangleAlert, Package, Languages, Lock, LogIn, User } from 'lucide-react'
import { Link, NavLink, useNavigate } from 'react-router-dom'
import MobileNav from './MobileNav'
import { Badge } from '../ui/badge'
import { useDispatch, useSelector } from 'react-redux'
import { logout } from '@/Store/authSlice'
import postHandler from '@/Services/Post.Service'
import toast from 'react-hot-toast'
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger, } from "@/components/ui/dropdown-menu"
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
import { Avatar, AvatarFallback, AvatarImage } from '../ui/avatar'
import { clearOnLogoutCart, sentCartItems } from '@/Store/addToCartSlice'
import { addWishItems, clearOnLogoutWishlist } from '@/Store/wishListSlice'



function Navbar() {
  const dispatch = useDispatch()
  const [open, setOpen] = useState(false)
  const navigate = useNavigate()
  const user = useSelector(state => state.auth)
  const totalCart = useSelector(state => state.addToCart.cartItems)?.length
  const totalWishList = useSelector(state => state.wishList.wishListItem)?.length
  const { isNew, cartItems } = useSelector(state => state.addToCart)
  const wishList = useSelector(state => state.wishList)


  const onLogout = async () => {
    if(isNew && cartItems.length > 0) {
      dispatch(sentCartItems())
    }
    if (wishList?.isNew && wishList.wishListItem?.length > 0) {
      dispatch(addWishItems())
    }
    await postHandler(`${import.meta.env.VITE_BACKEND_URL}/api/user/logout`)
      .then(res => {
        if (res) {
          dispatch(logout())
          dispatch(clearOnLogoutCart())
          dispatch(clearOnLogoutWishlist())
          toast.success(res.message)
        }
      })
      .catch(err => {
        toast.error(err.response?.message || 'Logout Failed. please try again')
      })
  }
  return (
    <div className='flex flex-col sticky top-0 z-50 bg-white shadow-sm'>
      <div className='h-16 w-full px-4 sm:px-6 md:px-10 flex items-center justify-between'>
        <Link to='/shop/home' className="flex items-center gap-2">
          <img src={mainLogo} className="h-8" alt="GreenBasket Logo" />
          <span className="text-blue-900 text-xl font-bold sm:text-2xl">
            Green<span className='text-green-400'>Basket</span>
          </span>
        </Link>
        <nav className='hidden md:flex gap-6 items-center'>
          <NavLink
            to="/shop/home"
            className={({ isActive }) =>
              `${isActive ? "text-green-700 border-b-2 border-green-700" : "text-gray-500"} px-2 py-1 font-medium hover:text-green-700`
            }
          >
            Home
          </NavLink>
          <NavLink
            to="/shop/lists/all"
            className={({ isActive }) =>
              `${isActive ? "text-green-700 border-b-2 border-green-700" : "text-gray-500"} px-2 py-1 font-medium hover:text-green-700`
            }
          >
            Shop
          </NavLink>
          <NavLink
            to="/shop/about"
            className={({ isActive }) =>
              `${isActive ? "text-green-700 border-b-2 border-green-700" : "text-gray-500"} px-2 py-1 font-medium hover:text-green-700`
            }
          >
            About
          </NavLink>
          <NavLink
            to="/shop/contact"
            className={({ isActive }) =>
              `${isActive ? "text-green-700 border-b-2 border-green-700" : "text-gray-500"} px-2 py-1 font-medium hover:text-green-700`
            }
          >
            Contact Us
          </NavLink>
        </nav>
        <div className='flex items-center md:gap-4 gap-2'>
          {user.isAuthenticate && <Link to={"/shop/wishlist"}>
            <div className="hidden md:flex relative items-center justify-center">
              <Heart size={22} className="text-gray-800" />
              {totalWishList > 0 && <Badge className="absolute -top-2 -right-2 h-5 w-5 rounded-full text-xs bg-green-600 text-white">{totalWishList}</Badge>}
            </div>
          </Link>}
          {user.isAuthenticate && <Link to={"/shop/checkout"}>
            <div className="flex relative items-center justify-center">
              <ShoppingCart size={22} className="text-gray-800" />
              {totalCart > 0 && <Badge className="absolute -top-2 -right-2 h-5 w-5 rounded-full text-xs bg-green-600 text-white">{totalCart}</Badge>}
            </div>
          </Link>}
          {user.isAuthenticate ?
            <DropdownMenu>
              <DropdownMenuTrigger>
                <Avatar className={`${user?.user?.avatar ? "border-0" : "border-2 border-gray-700"} hidden md:flex h-6 w-6`}>
                  <AvatarImage src={user?.user?.avatar} />
                  <AvatarFallback asChild>
                    <User size={22} className="text-gray-800" />
                  </AvatarFallback>
                </Avatar>
              </DropdownMenuTrigger>

              <DropdownMenuContent className='w-[200px] p-2'>
                <DropdownMenuLabel>My Account</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem className={"p-2"} onClick={() => navigate(`/shop/edit/profile/${user?.user?._id}`)}> <UserRound /> My Account</DropdownMenuItem>
                <DropdownMenuItem className={"p-2"} onClick={() => navigate(`/shop/my-orders/${user?.user?._id}`)} > <Package /> My Orders </DropdownMenuItem>
                <DropdownMenuItem className={"p-2"} onClick={() => toast.error("Sorry this features is not available yet")}> <Languages /> Language</DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={() => setOpen(true)}>
                  < LogOut color='#E5484D' /> <span className='text-[#E5484D]'>Sign out</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu> :
            <button onClick={() => navigate('/user/login')} className='bg-green-600 text-white text-sm rounded-md p-2 sm:px-4 sm:py-2 hover:bg-green-700 font-semibold flex justify-center items-center gap-2'>
              <p className='hidden sm:flex'>Login</p><LogIn height={20} width={20} />
            </button>}

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

          <div className='md:hidden flex items-center justify-center p-1'>
            <MobileNav />
          </div>
        </div>
      </div>
      <div className='h-[1px] w-full bg-gray-200'></div>
    </div>
  )
}

export default Navbar
