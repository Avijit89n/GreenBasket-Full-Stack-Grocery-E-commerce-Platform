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
import { Search, Eye } from "lucide-react"
import getHandler from '@/Services/Get.service'
import toast from 'react-hot-toast'

export default function Orders() {
  const [page] = useState(1)
  const [data, setData] = useState([])

  const fetchData = async () => {
    try {
      const res = await getHandler(`http://localhost:8000/api/order/get-orders?page=${page}&limit=10`)
      setData(res.data)
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to fetch orders")
      setData([])
    }
  }

  useEffect(() => {
    fetchData()
  }, [])

  const formatStatus = (status) => {
    switch (status) {
      case "delivered":
        return <Badge className="bg-green-100 text-green-700 border border-green-200">Delivered</Badge>
      case "pending":
        return <Badge className="bg-yellow-100 text-yellow-800 border border-yellow-200">Pending</Badge>
      case "cancelled":
        return <Badge className="bg-red-100 text-red-700 border border-red-200">Cancelled</Badge>
      default:
        return <Badge variant="outline" className="capitalize">{status}</Badge>
    }
  }

  return (
    <div className="p-6">
      <div className="mb-6">
        <h1 className="text-3xl font-semibold text-gray-800">Orders</h1>
        <p className="text-sm text-muted-foreground">Manage and track customer orders in real-time</p>
      </div>

      <div className="bg-white rounded-xl shadow-md border border-gray-200 p-4">
        <div className="flex justify-between items-center mb-4 flex-wrap gap-2">
          <div className="flex items-center gap-2">
            <input
              type="text"
              placeholder="Search by Order ID or Customer"
              className="border border-gray-300 rounded-md px-3 py-2 text-sm w-64 outline-none focus:ring-2 focus:ring-primary"
            />
            <Button variant="default" size="sm" className="bg-primary text-white">
              <Search className="w-4 h-4 mr-1" />
              Search
            </Button>
          </div>
        </div>

        <div className="overflow-x-auto">
          <Table className="min-w-full">
            <TableHeader className="bg-gray-100">
              <TableRow>
                <TableHead className="text-gray-600">Order ID</TableHead>
                <TableHead className="text-gray-600">Date</TableHead>
                <TableHead className="text-gray-600">Customer</TableHead>
                <TableHead className="text-gray-600">Total</TableHead>
                <TableHead className="text-gray-600">Payment</TableHead>
                <TableHead className="text-gray-600">Status</TableHead>
                <TableHead className="text-right text-gray-600">Action</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {data?.data?.length > 0 ? (
                data.data.map((item, index) => (
                  <TableRow key={item._id} className={index % 2 === 0 ? "bg-white" : "bg-gray-50"}>
                    <TableCell className="font-medium text-gray-800">{item._id.slice(-6)}</TableCell>
                    <TableCell className="text-gray-600">{new Date(item.createdAt).toLocaleDateString()}</TableCell>
                    <TableCell className="text-gray-700">{item?.userData?.fullName || "Guest"}</TableCell>
                    <TableCell className="text-gray-700">₹{item.orderValue}</TableCell>
                    <TableCell className="capitalize text-gray-700">{item.paymentMethod}</TableCell>
                    <TableCell>{formatStatus(item.status)}</TableCell>
                    <TableCell className="text-right">
                      <Button variant="ghost" size="icon" className="hover:bg-primary/10 text-primary">
                        <Eye className="w-4 h-4" />
                      </Button>
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
        </div>
      </div>
    </div>
  )
}
