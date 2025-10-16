import { useEffect, useState } from "react";
import { Package } from "lucide-react";
import getHandler from "@/Services/Get.service";
import { useParams } from "react-router-dom";
import { useInView } from "react-intersection-observer";
import UserOrder from "@/components/Common/UserOrder";
import Loader2 from "@/components/Common/Loader2";

export default function MyOrders() {
  const [page, setPage] = useState(1);
  const userID = useParams().userID;
  const [orders, setOrders] = useState({ orderDetails: [], isEnd: false });
  const { ref, inView } = useInView({ threshold: 0.8 });
  const [pageLoad, setPageLoad] = useState(false);

  const getOrders = async () => {
    setPageLoad(true);
    try {
      const res = await getHandler(
        `${import.meta.env.VITE_BACKEND_URL}/api/order/get-users-order/${userID}?page=${page}&limit=7`
      );
      setOrders(prev => ({
        orderDetails: [...prev.orderDetails, ...(res.data.orderDetails || [])],
        isEnd: res.data.isEnd
      }));
    } catch (error) {
      console.error("Failed to fetch orders:", error);
    } finally {
      setPageLoad(false);
    }
  };

  useEffect(() => {
    if (orders.isEnd || pageLoad) return;
    if (inView) setPage(prev => prev + 1);
  }, [inView]);

  useEffect(() => {
    if (orders.isEnd || pageLoad) return;
    getOrders();
  }, [page]);

  return (
    <div className="bg-gray-50 min-h-screen">
      
      <div className="bg-white shadow-md rounded-b-md py-6 px-4 sm:px-6 lg:px-8 z-10">
        <div className="max-w-7xl mx-auto">
          <h1 className="text-3xl font-bold text-gray-900">My Orders</h1>
          <p className="text-gray-500 mt-1">Track and manage your purchases</p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 flex flex-col gap-5">
        
        {orders.orderDetails.length === 0 && !pageLoad && (
          <div className="text-center py-20">
            <Package className="w-24 h-24 text-gray-400 mx-auto mb-4" />
            <p className="text-xl font-semibold text-gray-900 mb-2">No orders found</p>
            <p className="text-gray-500">Your order history will appear here</p>
          </div>
        )}

        {orders.orderDetails.map((order, index) => 
          index === orders.orderDetails.length - 1 ? 
          
            <div
              key={order._id}
              ref={ref}
              className="opacity-0 animate-fade-in-scale duration-300"
              style={{ animationDelay: `${(index - ((page - 1) * 7)) * 200}ms` }}
            >
              <UserOrder order={order} />
            </div>
            :
            <div
              key={order._id}
              className="opacity-0 animate-fade-in-scale duration-300"
              style={{ animationDelay: `${(index - ((page - 1) * 7)) * 200}ms` }}
            >
              <UserOrder order={order} />
            </div>
          
        )}


        {pageLoad && (
          <div className="flex justify-center py-6">
            <Loader2 />
          </div>
        )}
      </div>
    </div>
  );
}
