import toast from 'react-hot-toast';
import { Navigate, useLocation } from 'react-router-dom';

function CheckUserIsAuth({ isAuthenticated, user, children }) {
    const location = useLocation();

    if (!isAuthenticated && !(location.pathname.includes('login') ||
        location.pathname.includes('home') ||
        location.pathname.includes('lists') ||
        location.pathname.includes('about') ||
        location.pathname.includes('product-details') ||
        location.pathname.includes('contact') ||
        location.pathname.includes('register') 

    )) {
        return <Navigate to='/user/login' />;
    }
    if (isAuthenticated && (location.pathname.includes('login') || location.pathname.includes('register'))) {
        if (user.role === 'admin') {
            return <Navigate to='/admin/dashboard' />;
        } else {
            return <Navigate to='/shop/home' />;
        }
    }
    if (isAuthenticated && user.role === 'admin' && location.pathname.startsWith('/shop')) {
        return <Navigate to='/admin/dashboard' />;
    }

    if (isAuthenticated && user.role !== 'admin' && location.pathname.startsWith('/admin')) {
        return <Navigate to='/unauthenticated' />;
    }

    return <>{children}</>;
}

export default CheckUserIsAuth;
