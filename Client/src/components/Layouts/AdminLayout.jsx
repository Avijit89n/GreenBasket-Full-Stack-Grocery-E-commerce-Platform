import React from 'react'
import { Outlet } from 'react-router-dom';
import AdminSlider from '@/Pages/AdminDashboard/AdminSlider';
import AdminHeader from '@/Pages/AdminDashboard/AdminHeader';
import { useSelector } from 'react-redux';
import Loader from '../Common/Loader';

function AdminLayout() {
    const loading = useSelector(state => state.loaderCircle.isLoading)

    return loading ? <Loader /> : (
        <div>
            <AdminHeader />
            <AdminSlider />

            <div className="p-4 sm:ml-64">
                <div className="p-2 border-2 border-gray-200 border-dashed rounded-lg dark:border-gray-700 mt-14">
                    <Outlet />
                </div>
            </div>

        </div>
    )
}

export default AdminLayout
