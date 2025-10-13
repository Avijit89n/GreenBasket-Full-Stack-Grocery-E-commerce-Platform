import { useEffect, useState } from "react";
import {
  Package,
  Truck,
  CheckCircle,
  XCircle,
  Search,
  ChevronRight,
  TruckIcon,
  PackageIcon,
  Clock,
  MapPin,
  Calendar,
} from "lucide-react";
import getHandler from "@/Services/Get.service";
import { useParams } from "react-router-dom";

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

export default function MyOrders() {
  const [filter, setFilter] = useState("All");
  const [searchQuery, setSearchQuery] = useState("");
  const userID = useParams().userID;
  const [orders, setOrders] = useState([]);

  const getOrders = async () => {
    try {
      const res = await getHandler(
        `${import.meta.env.VITE_BACKEND_URL}/api/order/get-users-order/${userID}`
      );
      setOrders(res.data);
    } catch (error) {
      console.error("Failed to fetch orders:", error);
    }
  };

  useEffect(() => {
    getOrders();
  }, []);

  const filteredOrders = orders.filter((order) => {
    const matchesFilter =
      filter === "All" ||
      (filter === "Ongoing"
        ? !["Delivered", "Cancelled"].includes(order.status)
        : order.status === filter);
    const matchesSearch = order._id
      .toLowerCase()
      .includes(searchQuery.toLowerCase());
    return matchesFilter && matchesSearch;
  });

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

  return (
    <div className="bg-gradient-to-br from-slate-50 via-gray-50 to-slate-100 min-h-screen">
      
      <div className="shadow-md backdrop-blur-sm bg-white/95">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex flex-col gap-6">
            
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
              <div>
                <h1 className="text-3xl font-bold text-gray-900 tracking-tight">
                  My Orders
                </h1>
                <p className="text-sm text-gray-500 mt-1">
                  Track and manage your purchases
                </p>
              </div>

              <div className="relative w-full sm:w-80">
                <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search by order ID..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-11 pr-4 py-2.5 bg-gray-50 rounded-xl w-full border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition"
                />
              </div>
            </div>

            <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-hide">
              {["All", "Ongoing", "Delivered", "Cancelled"].map((f) => (
                <button
                  key={f}
                  onClick={() => setFilter(f)}
                  className={`px-5 py-2.5 rounded-xl text-sm font-semibold ${filter === f
                      ? "bg-green-700 text-white shadow-lg shadow-green-500/30 scale-105"
                      : "bg-white text-gray-600 hover:bg-gray-50 border border-gray-200 hover:border-gray-300"
                    }`}
                >
                  {f}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {filteredOrders.length === 0 ? (
          <div className="text-center py-20 h-10">
            <div className="rounded-2xl p-6">
              <Package className="w-20 h-20 text-gray-700 mx-auto" />
            </div>
            <p className="text-gray-900 text-xl font-semibold mb-2">
              No orders found
            </p>
            <p className="text-gray-500">
              {searchQuery
                ? "Try adjusting your search terms"
                : "Your order history will appear here"}
            </p>
          </div>
        ) : (
          <div className="grid gap-5">
            {filteredOrders.map((order) => {
              const StatusIcon = statusConfig[order.status]?.icon;
              return (
                <div
                  key={order._id}
                  className="bg-white border border-gray-200 rounded-2xl shadow-sm hover:shadow-xl transition-all duration-300 overflow-hidden group"
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
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}