import React, { useEffect, useState } from 'react'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Search, Eye, ArrowDown, ChevronDown } from "lucide-react"
import getHandler from '@/Services/Get.service'
import toast from 'react-hot-toast'
import { ScrollArea } from '@/components/ui/scroll-area'
import { useInView } from 'react-intersection-observer'
import Loader2 from '@/components/Common/Loader2'
import { useNavigate } from 'react-router-dom'

export default function Orders() {
  const [page, setPage] = useState(1)
  const [data, setData] = useState([])
  const [loading, setLoading] = useState(false)
  const { ref, inView } = useInView({ threshold: 1 })
  const navigate = useNavigate()

  const fetchData = async () => {
    setLoading(true)
    try {
      const res = await getHandler(`${import.meta.env.VITE_BACKEND_URL}/api/order/get-orders?page=${page}&limit=10`)
      setData(prev => ({
        isEnd: res.data?.isEnd,
        data: [
          ...(prev.data || []),
          ...(res.data?.data || [])
        ]

      }))
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to fetch orders")
      setData([])
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    if (inView && !data.isEnd && !loading) {
      setPage(prev => prev + 1)
    }
  }, [inView])

  useEffect(() => {
    if (!data.isEnd && !loading) fetchData();
  }, [page])

  const formatStatus = (status) => {
    switch (status) {
      case "Order Placed":
        return <Badge className="bg-blue-100 text-blue-700 border border-blue-200">{status}</Badge>
      case "Order Received":
        return <Badge className="bg-indigo-100 text-indigo-700 border border-indigo-200">{status}</Badge>
      case "Shipped":
        return <Badge className="bg-purple-100 text-purple-700 border border-purple-200">{status}</Badge>
      case "In Transit":
        return <Badge className="bg-yellow-100 text-yellow-800 border border-yellow-200">{status}</Badge>
      case "Out for Delivery":
        return <Badge className="bg-orange-100 text-orange-500 border border-orange-200">{status}</Badge>
      case "Delivered":
        return <Badge className="bg-green-100 text-green-700 border border-green-200">{status}</Badge>
      case "Cancelled":
        return <Badge className="bg-red-100 text-red-700 border border-red-200">{status}</Badge>
      default:
        return <Badge variant="outline" className="capitalize">{status}</Badge>
    }
  };


  return (
    <div className="p-2 font-sans">
      <h1 className='mb-6 text-xl font-bold text-gray-700'>Orders</h1>

      <div className="bg-white rounded-xl shadow-md border border-gray-200 p-4">
        <div className="flex justify-between items-center mb-4 flex-wrap gap-2">
          <div className="flex items-center gap-2 px-4 pb-0 pt-2">
            <input
              type="text"
              placeholder="Search by Order ID or Customer"
              className="border border-gray-300 rounded-md px-3 py-2 text-sm w-64 outline-none focus:ring-2 focus:ring-primary"
            />
            <button className='p-2.5 rounded-md border border-gray-300' >
              <Search className="w-4 h-4 mr-1" />
            </button>
          </div>
        </div>

        <div className='p-4 pt-2'>
          <Table className="min-w-full text-base">
            <TableHeader >
              <TableRow>
                <TableHead className="text-gray-600">Order ID</TableHead>
                <TableHead className="text-gray-600">Date</TableHead>
                <TableHead className="text-gray-600">Customer</TableHead>
                <TableHead className="text-gray-600">Total</TableHead>
                <TableHead className="text-gray-600">Payment</TableHead>
                <TableHead className="text-gray-600">Status</TableHead>
                <TableHead className="text-gray-600 w-[100px] text-center">Action</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {data?.data?.length > 0 ? (
                data.data.map((item) => (
                  <TableRow key={item._id}>
                    <TableCell className="text-blue-500">#{item._id}</TableCell>
                    <TableCell className="text-gray-600">{new Date(item.createdAt).toLocaleString()}</TableCell>
                    <TableCell className="text-gray-700">{item?.userData?.fullName || "No Customer"}</TableCell>
                    <TableCell className="text-gray-700 font-semibold">₹{item.orderValue}</TableCell>
                    <TableCell className="text-gray-700"><Badge className={`${item?.paymentMethod !== "COD" ? "bg-green-100 text-green-500" : "bg-red-50 text-red-500"}`}>{item.paymentMethod}</Badge></TableCell>
                    <TableCell>{formatStatus(item.status)}</TableCell>
                    <TableCell className={"w-[100px] flex justify-center items-center text-gray-500"}>
                      <div ref={ref} className='flex items-center gap-2 m-2'>
                        <button onClick={() => navigate(`/admin/order-details/${item?._id}`)} className='flex justify-center items-center gap-2 text-sm p-2 rounded-md border border-gray-300'><Eye height={18} width={18} />View</button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={7} className="text-center py-6 text-muted-foreground">
                    No orders found.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
          {loading && <div className='w-full flex justify-center items-center p-4'><Loader2 height={8} width={8}/></div>}
        </div>
      </div>
    </div>
  )
}
