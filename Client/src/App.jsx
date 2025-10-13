import { createBrowserRouter, createRoutesFromElements, Navigate, Route, RouterProvider, Routes, useLocation, useNavigate } from 'react-router-dom'
import Login from './Pages/Auth/Login'
import Register from './Pages/Auth/Register'
import DashBoard from './Pages/AdminDashboard/DashBoard'
import Features from './Pages/AdminDashboard/Features'
import Orders from './Pages/AdminDashboard/Orders'
import Products from './Pages/AdminDashboard/Products'
import AdminLayout from './components/Layouts/AdminLayout'
import Home from './Pages/Shopping/Home'
import Checkout from './Pages/Shopping/Checkout'
import Lists from './Pages/Shopping/Lists'
import Account from './Pages/Shopping/Account'
import Categories from './Pages/AdminDashboard/Categories'
import PageNotFound from './Pages/ErrorPages/PageNotFound'
import ShoppingLayout from './components/Layouts/ShoppingLayout'
import Contact from './Pages/Shopping/Contact'
import About from './Pages/Shopping/About'
import CheckUserIsAuth from './components/Common/CheckUserIsAuth'
import { useDispatch, useSelector } from 'react-redux'
import { useEffect } from 'react'
import { toast } from 'react-hot-toast';
import getHandler from './Services/Get.service.js'
import { login, logout } from './Store/authSlice'
import AddProduct from './Pages/AdminDashboard/AddProduct'
import SubCategories from './Pages/AdminDashboard/SubCategories'
import ProductDetails from './Pages/Shopping/ProductDetails'
import { sentCartItems, getCartItem } from './Store/addToCartSlice'
import Profile from './Pages/Shopping/Profile'
import Wishlist from './Pages/Shopping/WishList'
import { addWishItems, getWishItems } from './Store/wishListSlice'
import OrderView from './Pages/AdminDashboard/OrderView'
import MyOrders from './Pages/Shopping/MyOrders'

function App() {
  const navigate = useNavigate()
  const { isNew, cartItems } = useSelector(state => state.addToCart)
  const wishList = useSelector(state => state.wishList)

  const userDetails = useSelector(state => state.auth)
  const dispatch = useDispatch();
  const location = useLocation()

  const checkAuth = async () => {
    try {
      const res = await getHandler(`${import.meta.env.VITE_BACKEND_URL}/api/user/refresh/access/token`);
      dispatch(login(res.data));
    } catch (err) {
      dispatch(logout());
      toast.error(err?.response?.data?.message);
      if (!location.pathname.startsWith('/user')) {
        navigate('/user/login');
      }
    }
  };

  useEffect(() => {
    if (userDetails?.user?._id) {
      dispatch(getCartItem(userDetails?.user?._id))
      dispatch(getWishItems(userDetails?.user?._id))
    }
  }, [userDetails?.user?._id])

  useEffect(() =>{
    checkAuth();
  }, [])
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [location.pathname]);

  useEffect(() => {
    if (isNew && cartItems.length > 0) {
      setTimeout(() => {
        dispatch(sentCartItems())
      }, 10000)
    }
  }, [isNew])

  useEffect(() => {
    if (wishList?.isNew && wishList.wishListItem?.length > 0) {
      setTimeout(() => {
        dispatch(addWishItems())
      }, 10000)
    }
  }, [wishList?.isNew])

  window.onbeforeunload = () => {
    if (isNew && userDetails.isAuthenticate) {
      const formData = new FormData()
      formData.append("userID", userDetails?.user?._id)
      cartItems.map(ele => {
        formData.append("products", JSON.stringify({
          quantity: ele?.quantity,
          productID: ele.productData._id
        }))
      })
      navigator.sendBeacon(`${import.meta.env.VITE_BACKEND_URL}/api/cart/add-cart-item`, formData)
    }
    if (wishList?.isNew && userDetails.isAuthenticate) {
      const formData = new FormData()
      formData.append("userID", userDetails?.user?._id)
      wishList?.wishListItem?.map(item => {
        formData.append("products", item._id)
      })
      navigator.sendBeacon(`${import.meta.env.VITE_BACKEND_URL}/api/wishlist/add-wishlist`, formData)
    }
  }


  return (
    <Routes>
      <Route path="/" element={<Navigate to="/shop/home" replace />} />
      <Route exact path='/shop' element={
        <CheckUserIsAuth 
          key={userDetails.isAuthenticate?.role}
          isAuthenticated={userDetails.isAuthenticate} 
          user={userDetails.user}>
          <ShoppingLayout />
        </ CheckUserIsAuth >
      }>
        <Route exact path='home' element={<Home />} />
        <Route exact path='checkout' element={<Checkout />} />
        <Route exact path='lists/:categoryID' element={<Lists />} />
        <Route exact path='accounts' element={<Account />} />
        <Route exact path='about' element={<About />} />
        <Route exact path='contact' element={<Contact />} />
        <Route exact path='my-orders/:userID' element={<MyOrders />} />
        <Route exact path='edit/profile/:userID' element={<Profile />} />
        <Route exact path='wishlist' element={<Wishlist />} />
        <Route exact path='product-details/:productID' element={<ProductDetails />} />
      </Route>

      <Route exact path='/user/login' element={
        <CheckUserIsAuth isAuthenticated={userDetails.isAuthenticate} user={userDetails.user}>
          <Login />
        </CheckUserIsAuth>
      } />
      <Route exact path='/user/register' element={
        <CheckUserIsAuth isAuthenticated={userDetails.isAuthenticate} user={userDetails.user}>
          <Register />
        </CheckUserIsAuth>
      } />

      <Route exact path='/admin' element={
        <CheckUserIsAuth 
          key={userDetails.isAuthenticate?.role}
          isAuthenticated={userDetails.isAuthenticate} 
          user={userDetails.user}>
          <AdminLayout />
        </CheckUserIsAuth>
      }>
        <Route exact path='dashboard' element={<DashBoard />} />
        <Route exact path='features' element={<Features />} />
        <Route exact path='orders' element={<Orders />} />
        <Route exact path='products' element={<Products />} />
        <Route exact path='categories' element={<Categories />} />
        <Route exact path='sub-categories' element={<SubCategories />} />
        <Route exact path='order-details/:orderID' element={<OrderView />} />
        <Route exact path='add-product/:productID' element={<AddProduct />} />
      </Route>
      <Route path='*' element={<PageNotFound />} />
    </Routes>
  )
}

export default App
