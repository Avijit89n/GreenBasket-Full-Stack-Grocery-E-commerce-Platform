import Form from '@/components/Common/Form';
import axios from 'axios';
import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { toast } from 'react-hot-toast';
import Loader from '@/components/Common/Loader';
import { ArrowLeft } from 'lucide-react';

const formData = [
    {
        label: "Full Name",
        name: "fullName",
        type: "text",
        placeholder: "Enter your Full Name",
        required: true,
        textPositionFront: true
    },
    {
        label: "Username",
        name: "userName",
        type: "text",
        placeholder: "Enter your Username",
        required: true,
        textPositionFront: true
    },
    {
        label: "Email",
        name: "email",
        type: "email",
        placeholder: "Enter your Email",
        required: true,
        textPositionFront: true
    },
    {
        label: "Phone No",
        name: "phoneNo",
        type: "tel",
        placeholder: "Enter your Phone No",
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
    fullName: "",
    email: "",
    password: "",
    phoneNo: "",
    confirmPassword: ""
}

function Register() {

    const [registerData, setRegisterData] = useState(initialValue);
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const onSubmit = (eve)=>{
        eve.preventDefault();
        setLoading(true);

        axios.post(`${import.meta.env.VITE_BACKEND_URL}/api/user/register`, registerData)
        .then((res)=>{
            console.log(res.data);
            toast.success(res.data.message);
            navigate('/user/login');
        })
        .catch((err)=>{
            console.log(err);
            toast.error(err.response?.data?.message);
        })
        .finally(()=>{
            setLoading(false);
        })
    }
    
    return loading ? (<Loader />) : (
        <div className="min-h-screen bg-gray-100 flex items-center justify-center p-4">
            <button onClick={() => navigate('/shop/home')} className='absolute top-5 left-3 flex justify-center items-center gap-2 text-base hover:underline hover:text-green-700 font-semibold'><ArrowLeft height={19} width={19}/> Back to home</button>
            <div className="max-w-md w-full bg-white rounded-xl shadow-lg p-8">
                <h2 className="text-2xl font-bold text-gray-900 mb-6 text-center">Create an Account</h2>
                
                <Form getItems={formData} 
                    btnText='Sign up' 
                    chkBox={true} 
                    chkText="I agree to the Terms and Conditions" 
                    localData={registerData}
                    setLocalData={setRegisterData}
                    onSubmit={onSubmit}
                />

                <div className="mt-6 text-center text-sm text-gray-600">
                    Already have an account?
                    <Link to="/user/login" className="text-green-700 hover:text-green-700 font-medium hover:underline">Login</Link>
                </div>
            </div>
        </div>
    )
}

export default Register
