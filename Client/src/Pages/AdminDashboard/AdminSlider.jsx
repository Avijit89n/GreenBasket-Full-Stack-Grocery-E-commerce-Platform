import React from 'react'
import { Gauge, LayoutPanelLeft, LayoutTemplate, ShoppingBag, Star, Truck } from 'lucide-react';
import { NavLink } from 'react-router-dom';

function AdminSlider() {
  return (
    <aside id="logo-sidebar" className="fixed top-0 left-0 z-40 w-64 h-screen pt-20 transition-transform -translate-x-full bg-white border-r border-gray-200 md:translate-x-0 dark:bg-gray-800 dark:border-gray-700" aria-label="Sidebar">
      <div className="h-full px-3 pb-4 overflow-y-auto bg-white dark:bg-gray-800">
        <ul className="space-y-2 font-medium">
          <li>
            <NavLink to='/admin/dashboard' className={({ isActive }) => `${isActive ? 'bg-green-700 text-white dark:bg-gray-700' : 'hover:bg-gray-100 text-gray-500 hover:text-black dark:hover:bg-gray-700'} flex items-center p-2 rounded-lg dark:text-white group`}>
              <Gauge strokeWidth='2px' size='22px' />
              <span className="ms-3">Dashboard</span>
            </NavLink>
          </li>
          <li>
            <NavLink to='/admin/products' className={({ isActive }) => `${isActive ? 'bg-green-700 text-white dark:bg-gray-700' : 'hover:bg-gray-100 text-gray-500 hover:text-black dark:hover:bg-gray-700'} flex items-center p-2 rounded-lg dark:text-white group`}>
              <ShoppingBag strokeWidth='2px' size='22px' />
              <span className="flex-1 ms-3 whitespace-nowrap">Products</span>
            </NavLink>
          </li>
          <li>
            <NavLink to='/admin/orders' className={({ isActive }) => `${isActive ? 'bg-green-700 text-white dark:bg-gray-700' : 'hover:bg-gray-100 text-gray-500 hover:text-black dark:hover:bg-gray-700'} flex items-center p-2 rounded-lg dark:text-white group`}>
              <Truck strokeWidth='2px' size='22px' />
              <span className="flex-1 ms-3 whitespace-nowrap">Orders</span>
            </NavLink>
          </li>
          <li>
            <NavLink to='/admin/categories' className={({ isActive }) => `${isActive ? 'bg-green-700 text-white dark:bg-gray-700' : 'hover:bg-gray-100 text-gray-500 hover:text-black dark:hover:bg-gray-700'} flex items-center p-2 rounded-lg dark:text-white group`}>
              <LayoutPanelLeft strokeWidth='2px' size='22px' />
              <span className="flex-1 ms-3 whitespace-nowrap">Category</span>
            </NavLink>
          </li>
          <li>
            <NavLink to='/admin/sub-categories' className={({ isActive }) => `${isActive ? 'bg-green-700 text-white dark:bg-gray-700' : 'hover:bg-gray-100 text-gray-500 hover:text-black dark:hover:bg-gray-700'} flex items-center p-2 rounded-lg dark:text-white group`}>
              <LayoutTemplate strokeWidth='2px' size='22px' />
              <span className="flex-1 ms-3 whitespace-nowrap">Sub Category</span>
            </NavLink>
          </li>
          <li>
            <NavLink to='/admin/features' className={({ isActive }) => `${isActive ? 'bg-green-700 text-white dark:bg-gray-700' : 'hover:bg-gray-100 text-gray-500 hover:text-black dark:hover:bg-gray-700'} flex items-center p-2 rounded-lg dark:text-white group`}>
              <Star strokeWidth='2px' size='22px' />
              <span className="flex-1 ms-3 whitespace-nowrap">Features</span>
            </NavLink>
          </li>
        </ul>
      </div>
    </aside>
  )
}

export default AdminSlider
