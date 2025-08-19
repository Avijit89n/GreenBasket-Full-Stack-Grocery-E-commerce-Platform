import React, { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { Badge } from "@/components/ui/badge";
import {
  Minus,
  Plus,
  ShoppingBag,
  Shield,
  IndianRupee,
  CreditCard,
  Smartphone,
  Banknote,
  Delete,
  Trash2,
} from "lucide-react";
import { clearCart, decrement, increment, itemQuantityUpdate, removeItemFromCart } from "@/Store/addToCartSlice";
import { useNavigate } from "react-router-dom";
import postHandler from "@/Services/Post.Service";
import toast from "react-hot-toast";
import OrderPlaced from "@/components/Common/OrderPlaced";
import Loader2 from "@/components/Common/Loader2";


const paymentOptions = [
  {
    id: "cod",
    label: "Cash on Delivery",
    description: "Pay in cash when your order is delivered.",
    icon: IndianRupee,
  },
  {
    id: "card",
    label: "Credit / Debit Card",
    description: "Visa, MasterCard, Rupay, and more accepted.",
    icon: CreditCard,
  },
  {
    id: "upi",
    label: "UPI (Google Pay / PhonePe)",
    description: "Pay instantly using your preferred UPI app.",
    icon: Smartphone,
  },
  {
    id: "netbanking",
    label: "Net Banking",
    description: "Secure payment via your bank account.",
    icon: Banknote,
  },
];

function Checkout() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const addToCartItems = useSelector((state) => state.addToCart?.cartItems) || [];
  const user = useSelector((state) => state.auth);
  const [totalPrice, setTotalPrice] = useState(0);
  const [finalPrice, setFinalPrice] = useState(0);
  const [selectedAddress, setSelectedAddress] = useState('');
  const [selectedPayment, setSelectedPayment] = useState("");
  const [isOrderPlaced, setIsOrderPlaced] = useState(false);
  const [loading, setLoading] = useState(false)
  const [orderDetails, setOrderDetails] = useState("") 
  const [holdPrice, setHoldPrice] = useState(0)

  useEffect(() => {
    setTotalPrice(
      addToCartItems.reduce(
        (initial, ele) => initial + ele?.productData?.price * ele.quantity,
        0
      )
    );
    setFinalPrice(
      addToCartItems.reduce(
        (initial, ele) => initial + ele?.productData?.finalPrice * ele.quantity,
        0
      )
    );
  }, [addToCartItems]);

  const deliveryCharge = finalPrice >= 200 ? 0 : 49;
  const handlingCharge = 15;
  const finalTotal = finalPrice + deliveryCharge + handlingCharge;

  const updateItemQuantity = async () => {
    const formData = new FormData();
    addToCartItems.map(ele => {
      formData.append("productID", ele?.productData._id)
    })
    await postHandler(`${import.meta.env.VITE_BACKEND_URL}/api/product/get-quantity`, formData)
      .then(res => {
        dispatch(itemQuantityUpdate(res?.data))
      })
      .catch(err => {
        toast.error(err?.response?.data?.message || "Something went wrong")
      })
  }

  useEffect(() => {
    updateItemQuantity()
  }, [])

  const placeOrder = async (e) => {
    setLoading(true)
    e.preventDefault()
    await postHandler(`${import.meta.env.VITE_BACKEND_URL}/api/order/add-orders`, {
      orderAddress: selectedAddress,
      orderPayment: selectedPayment,
      orderItems: addToCartItems.map((item) => ({
        productId: item.productData._id,
        quantity: item.quantity,
      })),
      user: user.user._id,
    })
      .then(res => {
        toast.success(res?.message || "Order Placed Successfully")
        setHoldPrice(finalPrice)
        dispatch(clearCart())
        setIsOrderPlaced(true)
        setOrderDetails(res?.data)
      })
      .catch(err => {
        toast.error(err?.response?.data?.message || "Something went wrong")
      })
      .finally(() => {
        setLoading(false)
      })
  }
  if(isOrderPlaced) return <OrderPlaced details={orderDetails} deliveryCharge={deliveryCharge} handlingCharge={handlingCharge} subtotal={holdPrice} />
  return (
    <div className="min-h-screen bg-gray-50">
      {addToCartItems.length > 0 ?
        <div className="max-w-7xl mx-auto px-4 py-6">
          <div className="grid lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2 space-y-4">
              <div className="bg-white rounded-lg border border-gray-200 shadow-sm">
                <div className="px-6 py-4 border-b border-gray-200">
                  <h2 className="text-lg font-medium text-gray-900">Select Delivery Address</h2>
                </div>
                <div className="p-6 space-y-3">
                  {user?.user?.address?.map((addr) => (
                    <div
                      key={addr._id}
                      className={`p-4 rounded-md border cursor-pointer transition-colors ${selectedAddress?._id === addr._id
                        ? "border-green-500 bg-green-50"
                        : "border-gray-200 hover:border-gray-300"
                        }`}
                      onClick={() => setSelectedAddress(addr)}
                    >
                      <div className="flex items-start gap-3">
                        <input
                          type="radio"
                          name="address"
                          checked={selectedAddress?._id === addr._id}
                          onChange={() => setSelectedAddress(addr)}
                          className="mt-1 hidden"
                        />
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-1">
                            <span className="font-semibold text-lg text-gray-900">
                              {addr.name}
                            </span>
                            <Badge className="text-white bg-emerald-600">{addr.adrType}</Badge>
                          </div>
                          <p className="text-gray-800">
                            {`${addr?.locality || ""},${addr?.address || ""},${addr?.landmark || ""},${addr?.city || ""},${addr?.state || ""},${addr?.pincode || ""}`
                              .split(",")
                              .filter((addr) => addr)
                              .join(", ")}
                          </p>
                          <p className="text-gray-800">
                            Phone: {addr?.phone?.filter((p) => p)?.join(", ")}
                          </p>
                        </div>
                      </div>
                    </div>
                  ))}
                  <button className="w-full p-3 border-2 border-dashed border-gray-300 rounded-md text-green-600 hover:border-green-500 transition-colors">
                    + Add a new address
                  </button>
                </div>
              </div>

              <div className="bg-white rounded-lg border border-gray-200 shadow-sm">
                <div className="px-6 py-4 border-b border-gray-200">
                  <h2 className="text-lg font-semibold text-gray-900">Payment Methods</h2>
                </div>

                <div className="p-6 space-y-4">
                  {paymentOptions.map((method) => {
                    const Icon = method.icon;
                    const isSelected = selectedPayment === method.id;

                    return (
                      <div
                        key={method.id}
                        onClick={() => setSelectedPayment(method.id)}
                        className={`flex items-start p-4 border rounded-md cursor-pointer transition-colors ${isSelected
                            ? "border-emerald-500 bg-emerald-50"
                            : "border-gray-200 hover:border-gray-300"
                          }`}
                      >
                        <input
                          type="radio"
                          name="paymentMethod"
                          checked={isSelected}
                          onChange={() => setSelectedPayment(method.id)}
                          className="mt-1 mr-4 hidden"
                        />
                        <Icon className="w-5 h-5 mt-1 text-emerald-600 mr-3" />
                        <div>
                          <p className="font-medium text-gray-900">{method.label}</p>
                          <p className="text-sm text-gray-600">{method.description}</p>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              <div className="bg-white rounded-lg border border-gray-200 shadow-sm">
                <div className="px-6 py-4 border-b border-gray-200">
                  <h2 className="text-lg font-medium text-gray-900">
                    Order Items ({addToCartItems.length})
                  </h2>
                </div>

                <div className="p-6">
                  <div className="space-y-4">
                    {addToCartItems.map((item) => (
                      <div
                        key={item.productData._id}
                        className="flex items-start gap-4 pb-4 border-b border-gray-300 last:border-b-0"
                      >
                        <div className="w-25 h-25 bg-gray-50 rounded-md border border-gray-200 overflow-hidden flex-shrink-0">
                          <img
                            src={item.productData.avatar}
                            alt={item.productData.name}
                            className="w-full h-full object-contain p-2"
                          />
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center justify-between gap-2 flex-wrap">
                          <h3 className="font-medium text-gray-900 text-sm mb-1 line-clamp-2 flex items-center gap-2">
                            {item.productData.name.replace(/\b\w/g, (char) => char.toUpperCase())}
                            {item?.productData?.quantity === 0 && <p className="text-red-500 font-semibold">(Out of Stock)</p>}
                          </h3>
                          <button onClick={() => dispatch(removeItemFromCart
                            (item?.productData))} className="p-1.5 rounded-md bg-red-100 text-red-500"><Trash2 height={18} width={18}/></button>
                          </div>
                          <p className="text-xs text-gray-500 mb-2">
                            by{" "}
                            {item.productData.brand.replace(/\b\w/g, (char) => char.toUpperCase())}
                          </p>
                          <div className="flex items-center justify-between mt-3 flex-wrap">
                            <div className="flex items-center gap-2">
                              <span className="text-lg font-semibold text-gray-900">
                                ₹{item.productData.finalPrice.toLocaleString("en-IN")}
                              </span>
                              {item.productData.discount > 0 && (
                                <>
                                  <span className="text-sm line-through text-gray-400">
                                    ₹{item.productData.price.toLocaleString("en-IN")}
                                  </span>
                                  <span className="text-xs text-green-600 font-medium">
                                    {item.productData.discount}% off
                                  </span>
                                </>
                              )}
                            </div>
                            <div className="flex items-center border border-gray-300 rounded">
                              <button
                                onClick={() => dispatch(decrement(item.productData))}
                                className="p-1.5 hover:bg-gray-50 text-gray-600"
                              >
                                <Minus size={14} />
                              </button>
                              <span className="px-3 py-1.5 text-sm font-medium text-gray-900 min-w-[40px] text-center border-x border-gray-300">
                                {item.quantity}
                              </span>
                              <button
                                onClick={() => dispatch(increment(item.productData))}
                                className="p-1.5 hover:bg-gray-50 text-gray-600"
                              >
                                <Plus size={14} />
                              </button>
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            <div className="lg:col-span-1">
              <div className="bg-white rounded-lg border border-gray-200 shadow-sm sticky top-20">
                <div className="px-6 py-4 border-b border-gray-200">
                  <h3 className="text-lg font-medium text-gray-900">Order Summary</h3>
                </div>
                <div className="p-6">
                  <div className="space-y-3 mb-4">
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600">Price ({addToCartItems.length} items)</span>
                      <span className="text-gray-900">
                        ₹{totalPrice.toLocaleString("en-IN")}
                      </span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600">Discount</span>
                      <span className="text-green-600">
                        -₹{(totalPrice - finalPrice).toLocaleString("en-IN")}
                      </span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600">Delivery Charges</span>
                      <span className={deliveryCharge === 0 ? "text-green-600" : "text-gray-900"}>
                        {deliveryCharge === 0 ? (
                          <span className="flex items-center gap-1">
                            FREE <span className="line-through text-gray-400">₹49</span>
                          </span>
                        ) : (
                          `₹${deliveryCharge}`
                        )}
                      </span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600">Packaging Fee</span>
                      <span className="text-gray-900">₹{handlingCharge}</span>
                    </div>
                  </div>

                  {finalPrice < 200 && (
                    <div className="bg-green-50 border border-green-200 rounded-md p-3 mb-4">
                      <p className="text-sm text-green-800">
                        Add items worth ₹
                        {(200 - finalPrice).toLocaleString("en-IN")} to get FREE delivery
                      </p>
                    </div>
                  )}

                  <div className="border-t border-gray-200 pt-4 mb-6">
                    <div className="flex justify-between items-center">
                      <span className="text-base font-semibold text-gray-900">Total Amount</span>
                      <span className="text-lg font-semibold text-gray-900">
                        ₹{finalTotal.toLocaleString("en-IN")}
                      </span>
                    </div>
                    <p className="text-sm text-green-600 mt-1">
                      You will save ₹{(totalPrice - finalPrice).toLocaleString("en-IN")} on this order
                    </p>
                  </div>

                 {!loading ? <button
                    onClick={placeOrder}
                    className="w-full bg-orange-500 text-white py-3 rounded-md hover:bg-orange-600 transition-colors font-medium">
                    PLACE ORDER
                  </button> :
                  <div className="w-full bg-orange-500 p-2 rounded-md flex justify-center items-center"><Loader2 height={8} width={8}/></div>}

                  <div className="flex items-center justify-center gap-2 mt-4 text-xs text-gray-500 text-center">
                    <Shield size={14} />
                    <span>Safe and Secure Payments. Easy returns. 100% Authentic products.</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div> :

        <div className="bg-gray-100 w-screen h-screen flex items-center justify-center">
          <div className="text-center py-12">
            <ShoppingBag size={48} className="text-gray-500 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">Your cart is empty</h3>
            <p className="text-gray-500 mb-6">Add products to continue shopping</p>
            <button
              className="px-6 py-2 bg-orange-500 text-white rounded-md hover:bg-orange-600 transition-colors"
              onClick={() => navigate("/shop/lists/all")}>
              Continue Shopping
            </button>
          </div>
        </div>
      }
    </div>
  );
}

export default Checkout;
