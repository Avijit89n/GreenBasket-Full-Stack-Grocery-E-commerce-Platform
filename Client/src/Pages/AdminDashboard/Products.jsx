
import React, { useEffect, useState } from 'react'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"
import { Plus, Search, Settings } from 'lucide-react'
import { Badge } from '@/components/ui/badge';
import { Link, useNavigate } from 'react-router-dom';
import getHandler from '@/Services/Get.service';
import toast from 'react-hot-toast';
import Loader from '@/components/Common/Loader'
import { useInView } from 'react-intersection-observer'
import Loader2 from '@/components/Common/Loader2'

function capitalize(str) {
  if (!str) return "";
  return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();
}

export default function Products() {
  const [ref, inView] = useInView({threshold: 0})

  const [productData, setProductData] = useState([])
  const [loading, setLoading] = useState(false)
  const [open, setOpen] = useState(false)
  const [status, setStatus] = useState(false)
  const [editdata, setEditData] = useState({})
  const [page, setPage] = useState(1)
  const [pagination, setPagination] = useState(false)
  const navigate = useNavigate();


  const fetchProductData = async () => {
    setPagination(true)
    await getHandler(`${import.meta.env.VITE_BACKEND_URL}/api/product/get-table-data/products?page=${page}&limit=10`)
      .then((res) => {
        setProductData(prev => ({
          isEnd: res.data.isEnd,
          tableData: [
            ...(prev?.tableData || []),
            ...(res.data?.tableData || [])
          ]
        }))
      })
      .catch((err) => {
        toast.error(err.response?.data?.message || "failed to fetch product details")
      })
      .finally(() => setPagination(false))
  }

  const changeStatus = async (id) => {
    setLoading(true)
    await getHandler(`${import.meta.env.VITE_BACKEND_URL}/api/product/change-status/${id}`)
    .then((res) => {
      toast.success(res.message || "Update successfull")
        setPage(1)
        setProductData({ tableData: [], isEnd: false });
      })
      .catch((err) => {
        toast.error(err.response?.data?.message || "Update failed")
      })
      .finally(() => setLoading(false))
  }

  const deleteProduct = async (id) => {
    setLoading(true)
    await getHandler(`${import.meta.env.VITE_BACKEND_URL}/api/product/delete-product/${id}`)
      .then((res) => {
        toast.success(res.message || "product successfully deleted")
        setPage(1)
        setProductData({ tableData: [], isEnd: false });
      })
      .catch((err) => {
        toast.error(err.response?.data?.message || "Update failed")
      })
      .finally(() => setLoading(false) )
  }

  useEffect(() => {
    if (inView && !productData.isEnd && !pagination) {
      setPage(prev => prev + 1);
    }
  }, [inView, pagination, productData.isEnd])

  useEffect(() => {
    if (!productData.isEnd) fetchProductData()
  }, [page])


  return (
    <div className='p-2 font-sans'>
      <h1 className='mb-6 text-xl font-bold text-gray-700'>Products</h1>
      <div className='bg-white p-5 rounded-md'>
        <div className='flex items-center justify-between flex-wrap'>
          <div className='flex items-center gap-2 flex-wrap my-5'>
            <input className='p-2 text-sm rounded-md border-gray-300 border outline-none' type="text" placeholder="Search here..." />
            <button className='hover:bg-gray-200 cursor-pointer p-2 border rounded-md text-sm border-gray-300'><Search size={18} strokeWidth={1} /></button>
          </div>
          <Link to="/admin/add-product/new">
            <button className='flex items-center justify-center gap-1 bg-green-700 text-white text-sm hover:bg-green-800 py-2 px-5 rounded-md'><Plus size={18} strokeWidth={2} /> Add New</button>
          </Link>
        </div>
        <Table className={"text-base"}>
          <TableHeader>
            <TableRow>
              <TableHead className="w-[120px]">Product</TableHead>
              <TableHead>Name</TableHead>
              <TableHead className="w-[120px] text-center">Price</TableHead>
              <TableHead className="w-[100px] text-center">Stock</TableHead>
              <TableHead className="w-[120px] text-center">Offer</TableHead>
              <TableHead className="w-[100px] text-center">Purchased</TableHead>
              <TableHead className="w-[100px] text-center">Status</TableHead>
              <TableHead className="w-[100px] text-center">Action</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {productData?.tableData?.map((product, index) => (
              <TableRow key={product._id}>
                <TableCell className="font-medium">
                  {productData?.tableData?.length - 1 === index ?
                    <img ref={ref}
                      className='p-1 h-16 w-16 object-contain border bg-gray-100 border-gray-200 rounded-md'
                      src={product.avatar} alt="" /> :
                    <img
                      className='p-2 h-16 w-16 object-contain border bg-gray-100 border-gray-200 rounded-md'
                      src={product.avatar} alt="" />
                  }
                </TableCell>
                <TableCell>{capitalize(product.name)}</TableCell>
                <TableCell className="text-center"> {"₹" + product.finalPrice.toString()} </TableCell>
                <TableCell className="text-center">
                  {product.quantity < 10 ?
                    <p className='text-red-500 font-bold'>{product.quantity}</p> :
                    product.quantity > 30 ?
                      <p className='text-green-500 font-bold'>{product.quantity}</p> :
                      <p className='text-yellow-500 font-bold'>{product.quantity}</p>
                  }
                </TableCell>
                <TableCell className="text-center"> {product.discount.toString() + "% off"} </TableCell>
                <TableCell className="text-center">{product.purchased || 0}</TableCell>
                <TableCell className="text-center">
                  {product.status === "active" ?
                    <Badge className="bg-green-100 text-green-500">{capitalize(product.status)}</Badge>
                    :
                    <Badge className="bg-red-100 text-red-500">{capitalize(product.status)}</Badge>
                  }
                </TableCell>
                <TableCell className="text-center">
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <button className="border m-3 border-gray-300 p-1 rounded-md hover:bg-blue-100 hover:text-blue-700 hover:border-blue-100">
                        <Settings size={18} strokeWidth={1} />
                      </button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent>
                      <DropdownMenuItem onClick={() => navigate(`/admin/add-product/${product._id}`)}>Edit</DropdownMenuItem>
                      <DropdownMenuItem onClick={() => { setOpen(true); setEditData({ name: product.name, _id: product._id }) }}>Delete</DropdownMenuItem>
                      <DropdownMenuItem onClick={() => { setStatus(true); setEditData({ name: product.name, _id: product._id }) }}>Change Status</DropdownMenuItem>
                    </DropdownMenuContent>

                  </DropdownMenu>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>

        {pagination ?
          <div className='flex justify-center items-center min-h-44'><Loader2 height={8} width={8}/></div>
          : ""
        }

        {productData?.tableData?.length === 0 ?
          <div className='my-10 text-gray-400 text-sm flex justify-center items-center h-1/3 w-full'>
            No Data Found
          </div> :
          <div className='sticky bottom-0 bg-white p-3 border-t-1'></div>
        }
      </div>
      <AlertDialog open={status} onOpenChange={setStatus}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>

            <AlertDialogDescription>
              <span className="font-semibold">Are you sure you want to change the status of the product </span>
              <span className="font-bold">"{capitalize(editdata.name)}"</span>?
            </AlertDialogDescription>

            <AlertDialogDescription>
              <span className="font-semibold">Note:</span> Changing this product's status will affect its visibility on the storefront.
            </AlertDialogDescription>

            <AlertDialogDescription>
              <span className="font-semibold">Warning:</span> Products marked as <span className="font-bold">"inactive"</span> will no longer be visible to customers or available for purchase.
            </AlertDialogDescription>
          </AlertDialogHeader>

          <AlertDialogFooter className="pt-5">
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              className="bg-yellow-600 hover:bg-yellow-700"
              onClick={() => changeStatus(editdata._id)}
            >
              Confirm
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>




      <AlertDialog open={open} onOpenChange={setOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>

            <AlertDialogDescription>
              <span className="font-semibold">Are you sure you want to delete the product </span>
              <span className="font-bold">"{capitalize(editdata.name)}"</span>?
            </AlertDialogDescription>

            <AlertDialogDescription>
              <span className="font-semibold">Warning:</span> This action is irreversible. Once deleted, the product will be permanently removed from your store and cannot be recovered.
            </AlertDialogDescription>
          </AlertDialogHeader>

          <AlertDialogFooter className="pt-5">
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              className="bg-red-600 hover:bg-red-700"
              onClick={() => deleteProduct(editdata._id)}
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>


    </div>
  )
}
