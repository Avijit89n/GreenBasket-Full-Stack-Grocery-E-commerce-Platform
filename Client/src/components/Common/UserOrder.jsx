import React from 'react'
import { Calendar, ChevronRight, Clock, PackageIcon, TruckIcon, MapPin, Truck, CheckCircle, XCircle} from 'lucide-react';

function formatDateWithOrdinal(dateString) {
  const date = new Date(dateString);
  const day = date.getDate();
  const month = date.toLocaleString("default", { month: "short" });
  const year = date.getFullYear();

  const getOrdinal = (n) => {
    if (n > 3 && n < 21) return "th";
    switch (n % 10) {
      case 1:
        return "st";
      case 2:
        return "nd";
      case 3:
        return "rd";
      default:
        return "th";
    }
  };

  return `${day}${getOrdinal(day)} ${month}, ${year}`;
}

const statusConfig = {
    "Order Placed": {
        color: "text-slate-700",
        bg: "bg-slate-50",
        border: "border-slate-200",
        icon: Clock,
        ringColor: "ring-slate-200",
    },
    "Order Received": {
        color: "text-blue-700",
        bg: "bg-blue-50",
        border: "border-blue-200",
        icon: PackageIcon,
        ringColor: "ring-blue-200",
    },
    "Shipped": {
        color: "text-purple-700",
        bg: "bg-purple-50",
        border: "border-purple-200",
        icon: TruckIcon,
        ringColor: "ring-purple-200",
    },
    "In Transit": {
        color: "text-indigo-700",
        bg: "bg-indigo-50",
        border: "border-indigo-200",
        icon: Truck,
        ringColor: "ring-indigo-200",
    },
    "Out for Delivery": {
        color: "text-amber-700",
        bg: "bg-amber-50",
        border: "border-amber-200",
        icon: MapPin,
        ringColor: "ring-amber-200",
    },
    "Delivered": {
        color: "text-emerald-700",
        bg: "bg-emerald-50",
        border: "border-emerald-200",
        icon: CheckCircle,
        ringColor: "ring-emerald-200",
    },
    "Cancelled": {
        color: "text-rose-700",
        bg: "bg-rose-50",
        border: "border-rose-200",
        icon: XCircle,
        ringColor: "ring-rose-200",
    },
};

function UserOrder({ order }) {
    const StatusIcon = statusConfig[order.status]?.icon;
    const [imageCount, setImageCount] = React.useState(0)



    return (
        <div>
            <div className={`bg-white border border-gray-200 rounded-2xl shadow-sm hover:shadow-xl transition-all duration-300 overflow-hidden group
                        ${(imageCount === order.productDetails?.length) ? "opacity-100" : "opacity-0"}`}
            >
                <div className="p-6">

                    <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start mb-5 gap-4">
                        <div className="flex flex-col gap-3">
                            <div className="flex items-center gap-3 flex-wrap">
                                <span
                                    className={`inline-flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-bold border ${statusConfig[order.status]?.bg} ${statusConfig[order.status]?.color} ${statusConfig[order.status]?.border}`}
                                >
                                    <StatusIcon className="w-4 h-4" />
                                    {order.status}
                                </span>
                                <span className="inline-flex items-center gap-1.5 text-sm text-gray-500 bg-gray-50 px-3 py-2 rounded-lg">
                                    <Calendar className="w-4 h-4" />
                                    {formatDateWithOrdinal(order.createdAt)}
                                </span>
                            </div>
                            <div className="text-sm text-gray-600 font-medium">
                                Order ID: <span className="text-gray-900 font-mono">{order._id}</span>
                            </div>
                        </div>
                        <div className="flex flex-col items-start sm:items-end gap-1">
                            <p className="text-2xl font-bold text-gray-900">
                                ₹{order.orderValue.toLocaleString()}
                            </p>
                            <p className="text-sm text-gray-500">
                                {order?.products} {order?.products === 1 ? "item" : "items"}
                            </p>
                        </div>
                    </div>

                    <div className="flex gap-3 overflow-x-auto mb-5 pb-2 scrollbar-hide">
                        {order.productDetails?.map((img, index) => (
                            <div
                                key={img._id}
                                className="relative w-24 h-24 rounded-xl overflow-hidden border-2 border-blue-100 flex-shrink-0 bg-gradient-to-b from-blue-100 to-blue-50"
                            >
                                <img
                                    onLoad={() => setImageCount(prev => prev + 1)}
                                    loading="lazy"
                                    src={img.avatar}
                                    alt={`Product ${index + 1}`}
                                    className="w-full h-full object-contain p-2 drop-shadow-md"
                                />
                            </div>
                        ))}
                    </div>


                    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 pt-4 border-t border-gray-100">
                        <div className="text-sm">
                            {order.createdAt && (
                                <p className="text-gray-600">
                                    <span className="font-medium text-gray-900">
                                        {order.status === "Delivered"
                                            ? "Delivered on"
                                            : "Expected by"}
                                    </span>{" "}
                                    {formatDateWithOrdinal(order.createdAt)}
                                </p>
                            )}
                        </div>
                        <button className="text-green-600 hover:text-white hover:bg-green-600 font-semibold text-sm inline-flex items-center gap-2 px-4 py-2 rounded-lg border border-green-200 hover:border-green-600 transition-all group-hover:shadow-md">
                            View details
                            <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                        </button>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default UserOrder
