import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import Navbar from '../Common/NAvbar';
import Footer from '../Common/Footer';
import { Outlet } from 'react-router-dom';
import HomeLoader from '../Common/HomeLoader';

function ShoppingLayout() {
  const loading = useSelector((state) => state.loaderCircle.isLoading);
  const [showLoader, setShowLoader] = useState(false);

  useEffect(() => {
    if (loading) {
      setShowLoader(true);
    } else {
      const timer = setTimeout(() => setShowLoader(false), 1000);
      return () => clearTimeout(timer);
    }
  }, [loading]);

  return (
    <div className="relative min-h-screen">
      <Navbar />
      {showLoader && <HomeLoader/>}
      <Outlet />
      <Footer />
    </div>
  );
}

export default ShoppingLayout;
