import { useEffect, useState } from "react";
import { Package } from "lucide-react";
import getHandler from "@/Services/Get.service";
import { useParams } from "react-router-dom";
import { useInView } from "react-intersection-observer";
import UserOrder from "@/components/Common/UserOrder";
import Loader3 from "@/components/Common/Loader3";
import Loader2 from "@/components/Common/Loader2";

export default function MyOrders() {
  const [page, setPage] = useState(1)
  const userID = useParams().userID;
  const [orders, setOrders] = useState({});
  const { ref, inView } = useInView({ threshold: 1 });
  const [pageLoad, setPageLoad] = useState(false);


  const getOrders = async () => {
    setPageLoad(true);
    try {
      const res = await getHandler(
        `${import.meta.env.VITE_BACKEND_URL}/api/order/get-users-order/${userID}?page=${page}&limit=7`
      );
      setOrders(prev => ({
        orderDetails: [...(prev?.orderDetails || []), ...(res.data.orderDetails || [])],
        isEnd: res.data.isEnd
      }));
    } catch (error) {
      console.error("Failed to fetch orders:", error);
    } finally {
      setPageLoad(false);
    }
  };


  useEffect(() => {
    if (orders?.isEnd || pageLoad) return;
    if (inView) {
      setPage((prevPage) => prevPage + 1);
    }
  }, [inView]);

  useEffect(() => {
    if (orders?.isEnd || pageLoad) return;
    getOrders();
  }, [page]);



  return (
    <>

    <div className={`bg-gradient-to-br from-slate-50 via-gray-50 to-slate-100 min-h-screen`}>

      <div className="shadow-md backdrop-blur-sm w-full bg-gray-100">
        <div className="max-w-7xl mx-auto px-4 w-full sm:px-6 lg:px-8 py-6 bg-white rounded-b-md">
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
            </div>

          </div>
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {orders?.orderDetails?.length === 0 ? (
            <div className="text-center py-20 h-10">
              <div className="rounded-2xl p-6">
                <Package className="w-20 h-20 text-gray-700 mx-auto" />
              </div>
              <p className="text-gray-900 text-xl font-semibold mb-2">
                No orders found
              </p>
              <p className="text-gray-500">
                Your order history will appear here
              </p>
            </div>
          ) : (
            <div className="grid gap-5">
              {orders?.orderDetails?.map((order, index) =>
                orders?.orderDetails?.length - 1 === index ?
                  <div key={order._id} ref={ref}
                    className="opacity-0 animate-fade-in-scale duration-300"
                    style={{ animationDelay: `${(index - ((page - 1) * 7)) * 200}ms` }}>
                    <UserOrder order={order} />
                  </div> :
                  <div key={order._id} 
                    className="opacity-0 animate-fade-in-scale duration-300"
                    style={{ animationDelay: `${(index - ((page - 1) * 7)) * 200}ms` }}>
                    <UserOrder order={order} />
                  </div>
              )}
              {pageLoad && <div className="flex justify-center items-center w-full py-5"><Loader2/></div>}
            </div>
          )}
        </div>
      </div>
    </div>
    </>
  );
}