import React, { useEffect, useState } from 'react';
import {
    Printer,
    ChevronDown,
    ChevronLeft,
    ChevronRight,
    ShoppingBag,
    Mail,
    Phone,
    ChevronRight as ArrowRight,
    Calendar,
    MapPin,
    CreditCard,
    Truck,
    Package,
    Clock,
    CheckCircle,
    AlertCircle
} from 'lucide-react';
import { useParams } from 'react-router-dom';
import getHandler from '@/Services/Get.service';
import toast from 'react-hot-toast';
import { Badge } from '@/components/ui/badge';
import Select from 'react-select'
import postHandler from '@/Services/Post.Service';

function capitalize(str) {
    if (!str) return "";
    return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();
}
const options = [
  { value: 'Order Placed', label: 'Order Placed' },
  { value: 'Order Received', label: 'Order Received' },
  { value: 'Shipped', label: 'Shipped' },
  { value: 'In Transit', label: 'In Transit' },
  { value: 'Out for Delivery', label: 'Out for Delivery' },
  { value: 'Delivered', label: 'Delivered' },
  { value: 'Cancelled', label: 'Cancel Order' },
]

const customStyles = {
    control: (provided) => ({
        ...provided,
        boxShadow: 'none',
        borderRadius: '8px',
        borderColor: '#ced4da',
        '&:hover': {
            borderColor: '#ced4da',
        },
    }),

    groupHeading: (provided) => ({
        ...provided,
        fontSize: '1rem',
        fontWeight: '600',
        color: '#4b5563',
        padding: '6px 12px',
    }),

    option: (provided, state) => ({
        ...provided,
        fontSize: '0.875rem',
        padding: '5px 20px',
        backgroundColor: state.isFocused ? '#f0f0f0' : 'white',
        color: '#4b5563',
    }),
};

const OrderView = () => {
    const { orderID } = useParams();
    const [orderDetails, setOrderDetails] = useState("");
    const [selectedData, setSelectedData] = useState("")

    const handleSave = async () => {
        const formData = new FormData();
        formData.append("status", selectedData?.value ||"")
        await postHandler(`${import.meta.env.VITE_BACKEND_URL}/api/order/change-order-status/${orderID}`,formData)
        .then((res) => {
            toast.success(res?.message || "Order status updated successfully");
            setOrderDetails(prev => ({
                ...prev,
                status: selectedData?.value
            }));
        })
        .catch(err => {
            toast.error(err?.response?.data?.message || "Failed to update order status");
        })
    }

    const fetchOrderDetails = async () => {
        await getHandler(`${import.meta.env.VITE_BACKEND_URL}/api/order/get-order-details/${orderID}`)
            .then(res => {
                if (!res?.data) {
                    toast.error("No order details found");
                    return;
                }
                setSelectedData({value: res?.data?.status, label: res?.data?.status})
                setOrderDetails(res?.data);
                toast.success(res?.message || "Order details fetched successfully");
            })
            .catch(err => {
                toast.error(err?.response?.data?.message || "Failed to fetch order details");
            })
    }
    useEffect(() => {
        fetchOrderDetails();
    }, [orderID])

    return (
        <div className="min-h-screen bg-gray-50 rounded-md">
            <div className="max-w-7xl mx-auto sm:p-6 p-3">

                <div className="flex items-center space-x-6 flex-wrap gap-2 mb-5">
                    <h1 className="md:text-3xl sm:text-2xl text-xl font-bold text-gray-900 whitespace-nowrap overflow-scroll">Order <span className='text-blue-500'>#{orderDetails?._id || "No data"}</span></h1>

                    <div className="flex items-center space-x-1">
                        <div className={`w-2.5 h-2.5 ${orderDetails?.paymentMethod === "COD" ? "bg-red-500" : "bg-emerald-700"} rounded-full`}></div>
                        <span className={`text-sm font-semibold ${orderDetails?.paymentMethod === "COD" ? "text-red-500" : "text-emerald-700"}`}>{orderDetails?.paymentMethod === "COD" ? "Unpaid" : "Paid"}</span>
                    </div>

                    <div className="flex items-center space-x-1">
                        <div className="w-2.5 h-2.5 bg-blue-500 rounded-full"></div>
                        <span className="text-sm font-semibold text-blue-700">{orderDetails?.status}</span>
                    </div>

                    <div className="flex items-center text-gray-600 text-sm space-x-1 bg-gray-100 px-3 py-1.5 rounded-full">
                        <Calendar className="w-4 h-4" />
                        <span className="font-medium">{new Date(orderDetails?.createdAt).toLocaleString()}</span>
                    </div>
                </div>

                <div className="flex items-center justify-between mb-8 pb-6 border-b border-gray-200 flex-wrap gap-4">
                    <div className="flex items-center space-x-2 flex-wrap gap-2">
                        <Select
                         options={options} 
                         styles={customStyles}
                         className='w-56 text-base'
                         value={selectedData}
                         onChange={(selected) => setSelectedData(selected)}
                        />
                        <div className="relative">
                            <button onClick={() => handleSave()} className="flex items-center space-x-2 text-green-700 text-sm font-medium bg-green-100 px-4 py-2 rounded-lg border-green-300 border">
                                save
                            </button>
                        </div>
                    </div>

                    <div className="flex items-center space-x-6 text-sm flex-wrap gap-3">
                        <div className="text-center">
                            <div className="font-bold text-gray-900 text-lg">{orderDetails?.products?.length}</div>
                            <div className="text-gray-600">Items</div>
                        </div>
                        <div className="text-center">
                            <div className="font-bold text-gray-900 text-lg">₹{orderDetails?.orderValue}</div>
                            <div className="text-gray-600">Total</div>
                        </div>
                        <div className="text-center">
                            <div className={`font-bold ${orderDetails?.paymentMethod === "COD" ? "text-red-500" : "text-emerald-600"} text-lg`}>{orderDetails?.paymentMethod === "COD" ? "Unpaid" : "Paid"}</div>
                            <div className="text-gray-600">Status</div>
                        </div>
                    </div>
                </div>

                <div className="grid lg:grid-cols-3 grid-cols-1 lg:gap-8">
                    <div className="md:col-span-2 col-span-1 space-y-6">
                        <div className="bg-white rounded-xl border border-gray-200 shadow-sm">
                            <div className="flex items-center justify-between p-6 border-b border-gray-100 bg-gray-50 rounded-t-xl">
                                <div className="flex items-center space-x-3">
                                    <Package className="w-5 h-5 text-gray-600" />
                                    <h2 className="text-lg font-semibold text-gray-900">Order details</h2>

                                </div>
                                <Badge className="bg-blue-100 text-blue-800 font-semibold">
                                    {orderDetails?.products?.length} items
                                </Badge>
                            </div>

                            <div className="divide-y divide-gray-50">
                                {orderDetails?.productDetails?.map((item) => (
                                    <div key={item?._id} className="p-6 hover:bg-gray-25">
                                        <div className="flex items-start space-x-4">
                                            <div className={`w-20 h-20 rounded-lg flex items-center justify-center bg-gray-100 flex-shrink-0 border border-gray-100`}>
                                                <img src={item?.avatar} alt={item?.name} className='p-2 drop-shadow-2xl' />
                                            </div>

                                            <div className="flex-1 min-w-0">
                                                <h3 className="font-semibold text-gray-900 text-base mb-1">{capitalize(item?.name)}</h3>
                                                <div className="text-xs text-gray-500 mb-2">Brand: {capitalize(item?.brand)}</div>
                                                <div className="text-xs text-gray-500 mb-2">Weight: {item?.weight}</div>

                                            </div>

                                            <div className="text-right space-y-1">
                                                <div className="font-semibold text-gray-900">₹{item?.finalPrice?.toFixed(2)}</div>
                                                <div className="text-sm text-gray-500">each</div>
                                            </div>

                                            <div className="text-center space-y-1 min-w-[60px]">
                                                <div className="font-semibold text-gray-900 text-lg">{
                                                    orderDetails?.products?.find(p => {
                                                        const matchedProduct = p.productId.toString() === item._id.toString();
                                                        if (matchedProduct) return p;
                                                    })?.quantity
                                                }</div>
                                                <div className="text-sm text-gray-500">qty</div>
                                            </div>

                                            <div className="text-right space-y-1 min-w-[80px]">
                                                <div className="font-bold text-gray-900 text-lg">₹{
                                                    (item?.finalPrice * (orderDetails?.products?.find(p => {
                                                        const matchedProduct = p.productId.toString() === item._id.toString();
                                                        if (matchedProduct) return p;
                                                    })?.quantity)).toFixed(2)}</div>
                                                <div className="text-sm text-gray-500">total</div>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>

                            <div className="p-6 bg-gray-50 border-t border-gray-100 rounded-b-xl">
                                <div className="space-y-3">
                                    <div className="flex justify-between text-sm">
                                        <span className="text-gray-600">Subtotal</span>
                                        <span className="font-medium">₹{orderDetails?.productDetails?.reduce((acc, curr) =>
                                            acc + ((curr?.finalPrice) * (orderDetails?.products?.find(p => {
                                                const matchedProduct = p.productId.toString() === curr._id.toString();
                                                if (matchedProduct) return p;
                                            })?.quantity)), 0).toFixed(2)}
                                        </span>
                                    </div>
                                    <div className="flex justify-between text-sm">
                                        <span className="text-gray-600">Delivery Charge</span>
                                        <span className="font-medium">₹{
                                            orderDetails?.productDetails?.reduce((acc, curr) =>
                                                acc + ((curr?.finalPrice) * (orderDetails?.products?.find(p => {
                                                    const matchedProduct = p.productId.toString() === curr._id.toString();
                                                    if (matchedProduct) return p;
                                                })?.quantity)), 0).toFixed(2) > 200 ?
                                                "FREE" : 49}</span>
                                    </div>
                                    <div className="flex justify-between text-sm">
                                        <span className="text-gray-600">Handling Charge</span>
                                        <span className="font-medium">₹{15}</span>
                                    </div>
                                    <div className="flex justify-between pt-3 border-t border-gray-200">
                                        <span className="font-semibold text-gray-900">Total</span>
                                        <span className="font-bold text-xl text-gray-900">₹{orderDetails?.orderValue?.toFixed(2)}</span>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="bg-white rounded-xl border border-gray-200 shadow-sm">
                            <div className="flex items-center p-6 border-b border-gray-100 bg-gray-50 rounded-t-xl">
                                <MapPin className="w-5 h-5 text-gray-600 mr-3" />
                                <h2 className="text-lg font-semibold text-gray-900">Shipping Address</h2>
                            </div>
                            <div className="p-6">
                                <div className="space-y-1 text-sm flex flex-col gap-2">
                                    <div className="font-semibold text-gray-900">{orderDetails?.address?.name}</div>
                                    <div className="text-gray-600">{orderDetails?.address?.address}</div>
                                    <div className="text-gray-600">{orderDetails?.address?.contact}</div>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="space-y-6 mt-6 lg:mt-0">
                        <div className="bg-white rounded-xl border border-gray-200 shadow-sm">
                            <div className="p-6 border-b border-gray-100 bg-gray-50 rounded-t-xl">
                                <h2 className="text-lg font-semibold text-gray-900">Customer</h2>
                            </div>
                            <div className="p-6">
                                <div className="flex items-center justify-between mb-4">
                                    <div className="flex items-center space-x-3">
                                        <img
                                            src={orderDetails?.user?.avatar}
                                            alt={orderDetails?.user?.name}
                                            className="w-12 h-12 rounded-full object-cover border-2 border-gray-100"
                                        />
                                        <div>
                                            <div className="font-semibold text-gray-900">{orderDetails?.user?.fullName}</div>
                                            <div className="text-sm text-gray-500">@{orderDetails?.user?.userName}</div>
                                        </div>
                                    </div>
                                </div>

                                <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                                    <div className="flex items-center space-x-2 text-gray-600">
                                        <ShoppingBag className="w-4 h-4" />
                                        <span className="text-sm font-medium">{orderDetails?.products?.length} items</span>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="bg-white rounded-xl border border-gray-200 shadow-sm">
                            <div className="flex items-center justify-between p-6 border-b border-gray-100 bg-gray-50 rounded-t-xl">
                                <h2 className="text-lg font-semibold text-gray-900">Contact info</h2>
                            </div>
                            <div className="p-6 space-y-4">
                                <div className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
                                    <Mail className="w-4 h-4 text-gray-500" />
                                    <span className="text-gray-900 text-sm font-medium">{orderDetails?.user?.email}</span>
                                </div>
                                <div className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
                                    <Phone className="w-4 h-4 text-gray-500" />
                                    <span className="text-gray-900 text-sm font-medium">+91 {orderDetails?.user?.phoneNo}</span>
                                </div>
                            </div>
                        </div>

                        <div className="bg-white rounded-xl border border-gray-200 shadow-sm">
                            <div className="flex items-center justify-between p-6 border-b border-gray-100 bg-gray-50 rounded-t-xl">
                                <h2 className="text-lg font-semibold text-gray-900">Payment</h2>
                            </div>
                            <div className="p-6 space-y-4">
                                <div className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
                                    <CreditCard className="w-4 h-4 text-gray-500" />
                                    <span className="text-gray-900 text-sm font-medium">{orderDetails?.paymentMethod}</span>
                                </div>
                                {orderDetails?.paymentMethod !== "COD" && <div className="flex items-center justify-between p-3 bg-emerald-50 rounded-lg border border-emerald-100">
                                    <div className="flex items-center space-x-3">
                                        <CheckCircle className="w-4 h-4 text-emerald-600" />
                                        <span className="text-emerald-900 text-sm font-semibold">Paid</span>
                                    </div>
                                </div>}
                                {orderDetails?.paymentMethod !== "COD" && <div className="text-xs text-gray-500 px-3">
                                    Transaction ID: //enter transaction id
                                </div>}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default OrderView;