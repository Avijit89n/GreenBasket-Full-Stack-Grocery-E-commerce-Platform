import React, { useState, useEffect } from 'react';
import { CheckCircle, Eye, Home, Package, CreditCard, MapPin, Clock, IndianRupee } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';

const OrderPlaced = ({details, deliveryCharge, handlingCharge, subtotal}) => {
  const [mounted, setMounted] = useState(false);
  const navigate = useNavigate();
  const user = useSelector(state=>state.auth.user)

  useEffect(() => {
    window.scrollTo(0, 0)
    setMounted(true);
  }, []);

  return (
    <div className="min-h-screen bg-gray-100">

      <div className="max-w-6xl mx-auto px-4 py-6">
        <div className={`transform transition-all duration-300 ${
          mounted ? 'translate-y-0 opacity-100' : 'translate-y-4 opacity-0'
        }`}>
          
          <div className="bg-white rounded border shadow-sm mb-4">
            <div className="border-l-4 border-green-500 p-6">
              <div className="flex items-start space-x-4">
                <div className="bg-green-100 p-2 rounded-full">
                  <CheckCircle className="w-8 h-8 text-green-600" />
                </div>
                <div className="flex-1">
                  <h1 className="text-2xl font-normal text-gray-900 mb-2">
                    Order placed, Thank You!
                  </h1>
                  <p className="text-gray-700 mb-4">
                    Confirmation will be sent to your email.
                  </p>
                  <div className="flex items-center space-x-6 text-sm">
                    <div>
                      <span className="text-gray-600">Order # </span>
                      <span className="font-medium text-blue-600">{details?._id || "No Data"}</span>
                    </div>
                    <div >
                      <span className="text-gray-600">Order total: </span>
                      <span className="font-bold text-gray-900">₹{details?.orderValue || "NaN"}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
            <div className="lg:col-span-2 space-y-4">
              <div className="bg-white rounded border shadow-sm">
                <div className="border-b px-6 py-4">
                  <h2 className="text-lg font-medium text-gray-900">Delivery Information</h2>
                </div>
                <div className="p-6">
                  <div className="flex items-start space-x-4">
                    <MapPin className="w-5 h-5 text-gray-600 mt-1" />
                    <div>
                      <div className="font-medium text-gray-900">{details?.address?.name || "No Data"}</div>
                      <div className="text-gray-600 text-sm mt-1">
                        <p>{details?.address?.address || "No Data"}</p>
                        <p>{details?.address?.contact || "NaN"}</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="bg-white rounded border shadow-sm">
                <div className="border-b px-6 py-4">
                  <h2 className="text-lg font-medium text-gray-900">Order Status</h2>
                </div>
                <div className="p-6">
                  <div className="flex items-center space-x-4">
                    <div className="bg-green-600 p-2 rounded-full">
                      <CheckCircle className="w-5 h-5 text-white" />
                    </div>
                    <div>
                      <div className="font-medium text-green-700">{details?.status || "No Data"}</div>
                      <div className="text-sm text-gray-600">{new Date(details?.createdAt).toLocaleString()}</div>
                      <div className="text-sm text-gray-600 mt-1">Your order has been confirmed and is being processed.</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="space-y-4">
              <div className="bg-white rounded border shadow-sm">
                <div className="border-b px-6 py-4">
                  <h2 className="text-lg font-medium text-gray-900">Order Actions</h2>
                </div>
                <div className="p-6 space-y-3">
                  <button
                    onClick={() => navigate(`/shop/my-orders/${user?._id}`)}
                    className="w-full bg-orange-400 hover:bg-orange-500 text-white py-2 px-4 rounded text-sm font-medium transition-colors duration-200 flex items-center justify-center space-x-2"
                  >
                    <Eye className="w-4 h-4" />
                    <span>My Orders</span>
                  </button>
                   
                  <button
                    onClick={() => navigate('/shop/home')}
                    className="w-full bg-white hover:bg-gray-50 text-gray-700 py-2 px-4 rounded border border-gray-300 hover:border-gray-400 text-sm font-medium transition-all duration-200 flex items-center justify-center space-x-2"
                  >
                    <Home className="w-4 h-4" />
                    <span>Go To Home</span>
                  </button>
                </div>
              </div>

              <div className="bg-white rounded border shadow-sm">
                <div className="border-b px-6 py-4">
                  <h2 className="text-lg font-medium text-gray-900">Payment Information</h2>
                </div>
                <div className="p-6">
                  <div className="flex items-center space-x-3 mb-3">
                    <CreditCard className="w-5 h-5 text-gray-600" />
                      <div className="text-sm font-medium text-gray-900">{details?.paymentMethod || "No Data"}</div>
                  </div>
                  <div className="border-t pt-3">
                    <div className="flex justify-between text-sm mb-1">
                      <span className="text-gray-600">Subtotal:</span>
                      <span className="text-gray-900">₹{subtotal?.toLocaleString("en-IN") || "NaN"}</span>
                    </div>
                    <div className="flex justify-between text-sm mb-1">
                      <span className="text-gray-600">Shipping:</span>
                      <span className={`${deliveryCharge?.toLocaleString("en-IN") === 0 ? "text-green-600" : "text-gray-900"}`}>₹{deliveryCharge?.toLocaleString("en-IN") === 0 ? "FREE" : deliveryCharge?.toLocaleString("en-IN") || "NaN"}</span>
                    </div>
                    <div className="flex justify-between text-sm mb-1">
                      <span className="text-gray-600">Handling Fee:</span>
                      <span className="text-gray-900">₹{handlingCharge?.toLocaleString("en-IN") || "NaN"}</span>
                    </div>
                    <div className="flex justify-between font-bold text-orange-600 border-t pt-2">
                      <span>Order Total:</span>
                      <span>₹{details?.orderValue?.toLocaleString("en-IN") || "NaN"}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="mt-6 bg-blue-50 border border-blue-200 rounded p-4">
            <div className="flex items-start space-x-3">
              <Clock className="w-5 h-5 text-blue-600 mt-0.5" />
              <div className="text-sm">
                <div className="font-medium text-blue-800">Need help with your order?</div>
                <div className="text-blue-700 mt-1">
                  Visit our <a href="#" className="underline hover:no-underline">Help Center</a> or contact <a href="#" className="underline hover:no-underline">Customer Service</a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OrderPlaced;