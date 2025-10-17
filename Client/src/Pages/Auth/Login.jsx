import Form from '@/components/Common/Form';
import postHandler from '@/Services/Post.Service.js';
import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom';
import { login, logout } from '../../Store/authSlice.js';
import { useDispatch, useSelector } from 'react-redux';
import { toast } from 'react-hot-toast';
import { hideLoader, showLoader } from '@/Store/loaderSlice.js';
import { ArrowLeft } from 'lucide-react';
import Loader3 from '@/components/Common/Loader3.jsx';


const formData = [
    {
        label: "Email",
        name: "email",
        type: "email",
        placeholder: "Enter your Email",
        required: true,
        textPositionFront: true
    },
    {
        label: "Password",
        name: "password",
        type: "password",
        placeholder: "Enter Password",
        required: true,
        textPositionFront: true
    }
]

const initialValue = {
    email: "",
    password: ""
} 

function Login() {
    const loading = useSelector(state => state.loaderCircle.isLoading)
    const [loginData, setLoginData] = useState(initialValue);
    const dispatch = useDispatch();
    const navigate = useNavigate();



    const onSubmit = async (eve) => {
        eve.preventDefault();
        dispatch(showLoader())
        await postHandler(`${import.meta.env.VITE_BACKEND_URL}/api/user/login`, loginData)
            .then((res) => {
                if (res) {
                    dispatch(login(res.data.user))
                    navigate('/shop/home')
                    toast.success(res.message || "Login Successfull")
                }

                setLoginData(initialValue);
            })
            .catch(err => {
                dispatch(logout());
                toast.error(err.response?.data?.message || 'Login Failed. please try again')
            })
            .finally(()=>dispatch(hideLoader()))

    }

    return (
        <div className="opacity-0 animate-fade-in-scale transition-all duration-500 relative min-h-screen bg-gradient-to-br from-white via-gray-100 to-green-50 flex items-center justify-center p-4">
            {loading && <Loader3 />}
            <button onClick={() => navigate('/shop/home')} className='absolute top-5 left-3 flex justify-center items-center gap-2 text-base hover:underline hover:text-green-700 font-semibold'><ArrowLeft height={19} width={19}/> Back to home</button>
            <div className="max-w-md w-full bg-white rounded-xl shadow-lg p-8">
                <h2 className="text-2xl font-bold text-gray-900 mb-6 text-center">Login</h2>
                <Form getItems={formData}
                    chkBox={true}
                    btnText={'Login'}
                    chkText="Remember me"
                    localData={loginData}
                    setLocalData={setLoginData}
                    onSubmit={onSubmit}
                />
                <div className='py-2'>
                    <Link to="#" className="text-sm my-10 hover:underline text-green-700 hover:text-green-700">Forgot password?</Link>
                </div>

                <div className="mt-6 text-center text-sm text-gray-600">
                    Don't have an account?
                    <Link to="/user/register" className="text-green-700 hover:underline hover:text-green-700 font-medium">Sign up</Link>
                </div>
            </div>
        </div>
    )
}

export default Login



