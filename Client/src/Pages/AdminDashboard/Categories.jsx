import { Button } from '@/components/ui/button'
import { Pencil, Search, Settings } from 'lucide-react'
import React, { useEffect, useState } from 'react'
import add_image_icon from '../../assets/add_image.png'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import Select from "react-select";
import { Badge } from '@/components/ui/badge'
import getHandler from "../../Services/Get.service.js"
import toast from 'react-hot-toast'
import postHandler from '@/Services/Post.Service'
import Loader from '@/components/Common/Loader'
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
import Loader2 from '@/components/Common/Loader2'

const customStyles = {
  control: (provided) => ({
    ...provided,
    boxShadow: 'none',
    borderRadius: '8px',
    borderColor: '#ced4da',
    '&:hover': {
      borderColor: '#ced4da',
    }
  }),
};

const isActiveOptions = [
  { value: "Active", label: "Active" },
  { value: "Inactive", label: "Inactive" },
];

const initialData = {
  name: "",
  status: "",
  description: "",
  image: ""
}

function capitalize(str) {
  if (!str) return "";
  return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();
}

function Categories() {
  const [data, setData] = useState(initialData);
  const [tableData, setTableData] = useState([]);
  const [loading, setLoading] = useState(false)
  const [open, setOpen] = useState(false)
  const [edit, setEdit] = useState(false)
  const [status, setStatus] = useState(false)
  const [editData, setEditData] = useState({ _id: data._id, name: data.name, description: data.description, image: data.image })

  const handleImage = (e) => {
    const file = e.target.files[0];
    setData((prev) => ({
      ...prev,
      image: file
    }))
  }

  const submitData = async (e) => {
    e.preventDefault();
    setLoading(true)

    const formdata = new FormData();
    formdata.append("name", data.name);
    formdata.append("status", data.status.value || "nothing selected");
    formdata.append("description", data.description);
    formdata.append("image", data.image);

    await postHandler('http://localhost:8000/api/category/add-category', formdata)
      .then(res => {
        toast.success(res.message)
        setData(initialData)
        fetchData()
      })
      .catch(err => {
        toast.error(err.response?.data?.message || "Failed to create category. Try again")
        console.error(err)
      })
      .finally(() => setLoading(false))

  }

  const deleteCategory = async (id) => {
    setLoading(true)
    await getHandler(`http://localhost:8000/api/category/delete-category/${id}`)
      .then((res) => {
        toast.success(res.message || "Category deleted successfully")
        fetchData()
      })
      .catch((err) => {
        toast.error(err.response?.data?.message || "Failed to delete category")
      })
      .finally(() => setLoading(false))
  }

  const changeStatus = async (id) => {
    setLoading(true)
    await getHandler(`http://localhost:8000/api/category/change-status/${id}`)
      .then((res) => {
        toast.success(res.message || "Update successfull")
        fetchData()
      })
      .catch((err) => {
        toast.error(err.response?.data?.message || "Update failed")
      })
      .finally(() => setLoading(false))

  }

  const editCategory = async (id) => {
    setLoading(true)
    const formdata = new FormData();
    formdata.append("name", editData.name);
    formdata.append("description", editData.description);
    formdata.append("image", editData.image);

    await postHandler(`http://localhost:8000/api/category/edit-category/${id}`, formdata)
      .then((res) => {
        toast.success(res.message || "Category updated successfully")
        setEdit(false)
        fetchData()
      })
      .catch((err) => {
        toast.error(err.response?.data?.message || "Failed to update category")
      })
      .finally(() => setLoading(false))
  }

  const fetchData = async () => {
    setLoading(true)
    await getHandler('http://localhost:8000/api/category/get-table-data/category')
      .then(res => {
        setTableData(res.data)
      })
      .catch(err => {
        toast.error("failed to fetch Data")
        console.error(err)
      })
      .finally(() => setLoading(false))
  }

  useEffect(() => {
    fetchData()
  }, [])

  return (
    <div>
      <div className='p-2 font-sans'>
        <h1 className='mb-6 text-xl font-bold text-gray-700 X'>Category</h1>
        <div className='flex lg:flex-row flex-col gap-2 '>
          <div className='bg-white lg:w-1/3 w-full p-4 rounded-md'>
            <h3 className='mb-5 font-semibold'>Add New Category</h3>
            <form onSubmit={(e) => submitData(e)} className='flex flex-col justify-center'>
              {data.image ? (
                <div className='flex justify-center items-center relative m-2 mb-5 '>
                  <img className="rounded-md max-h-62 bg-no-repeat object-cover" src={URL.createObjectURL(data.image)} alt="" />
                  <div className='absolute top-0 left-0 m-2 border-gray-200 border bg-white w-10 h-10 flex items-center justify-center rounded-md'>
                    <label className='h-ful z-10 w-full cursor-pointer flex justify-center items-center' htmlFor="fileInput"><Pencil /></label>
                    <input onChange={handleImage} accept="image/png, image/jpeg" id='fileInput' className='hidden' type="file" />
                  </div>
                </div>
              ) : (
                <div className='relative h-64 w-full mb-5'>
                  <div className='m-2 h-full bg-orange-50 border border-orange-200 rounded-md'>
                    <div className='m-2 border-orange-200 border bg-white w-10 h-10 flex items-center justify-center rounded-md'>
                      <label className='h-ful z-10 w-full cursor-pointer flex justify-center items-center' htmlFor="fileInput"><Pencil /></label>
                      <input onChange={handleImage} accept="image/png, image/jpeg" id='fileInput' className='hidden' type="file" />
                    </div>
                  </div>

                  <div className='absolute top-0 flex w-full h-full items-center justify-center'>
                    <img className='h-15 w-15' src={add_image_icon} alt="loading..." />
                  </div>
                </div>
              )}

              <div className='flex flex-col gap-2 m-2 mb-5'>
                <label className='text-sm font-semibold' >Status<span className='text-red-500'>*</span></label>

                {/* react-select expects { value: "Active", label: "Active" } like object as
                value ans onchange we get the selected option means { value: "Active", label: "Active" } so
                when we create the formdata we write the data.status.value as data.state give us whole object */}

                <Select
                  styles={customStyles}
                  options={isActiveOptions}
                  value={data.status}
                  placeholder="Select Status"
                  onChange={selected => setData(prev => ({ ...prev, status: selected }))}
                />
              </div>

              <div className='flex flex-col gap-2 m-2 mb-5'>
                <label className='text-sm font-semibold' htmlFor="CategoryName">Name<span className='text-red-500'>*</span></label>
                <input value={data.name} onChange={(e) => setData(prev => ({ ...prev, name: e.target.value }))} className='p-2 outline-none text-sm rounded-md border-gray-300 border' type="text" id="CategoryName" placeholder="Category Name" required />
              </div>

              <div className='flex flex-col gap-2 m-2 mb-5'>
                <label className='text-sm font-semibold' htmlFor="CategoryDescription">Description<span className='text-gray-400 text-[12px] italic'> (Optional)</span></label>
                <textarea value={data.description} onChange={(e) => setData(prev => ({ ...prev, description: e.target.value }))} className='p-2 h-30 outline-none text-sm rounded-md border-gray-300 border' type="text" id="CategoryDescription" placeholder="Description" />
              </div>


              <Button type="submit" className="m-2 bg-green-700 hover:bg-green-800 ">Submit</Button>


            </form >
          </div >
          <div className='rounded-bl-md rounded-br-md md:rounded-tl-md md:rounded-tr-md bg-white px-4 lg:w-2/3 w-full h-200 overflow-scroll'>
            <div className='py-5 mb-5 p-2 sticky top-0 bg-white z-10 border-b-1 flex items-center flex-wrap gap-2'>
              <input className='p-2 text-sm rounded-md border-gray-300 border outline-none w-2/3' type="text" placeholder="Search here..." />
              <button className=' hover:bg-gray-200 cursor-pointer p-2 border rounded-md text-sm border-gray-300'><Search size={18} strokeWidth={1} /></button>
            </div>
            {loading ? <div className='flex justify-center items-center py-14'><Loader2 height={8} width={8}/></div> : <Table className={"text-base"}>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-[100px]">Image</TableHead>
                  <TableHead className="w-[150px]">Name</TableHead>
                  <TableHead className={"text-center"}>Products</TableHead>
                  <TableHead className={"text-center"}>Status</TableHead>
                  <TableHead>Sub-Category</TableHead>
                  <TableHead className="text-center">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {tableData.map(item => (
                  <TableRow key={item._id}>
                    <TableCell>
                      {item.image ? (
                        <img
                          className="h-16 w-16 rounded-md object-cover"
                          src={item.image}
                          alt={item.name}
                        />
                      ) : (
                        <div className="h-16 w-16 border border-gray-500 rounded-md bg-gray-200 flex items-center justify-center text-xs text-gray-600">
                          N/A
                        </div>
                      )}
                    </TableCell>
                    <TableCell>{capitalize(item.name)}</TableCell>
                    <TableCell className={"text-center"}>{item.products}</TableCell>
                    <TableCell className={"text-center"}>
                      {item.status === "active" ? (
                        <Badge className="bg-green-100 text-green-500">{capitalize(item.status)}</Badge>
                      ) : (
                        <Badge className="bg-red-100 text-red-500">{capitalize(item.status)}</Badge>
                      )}
                    </TableCell>
                    <TableCell>
                      <div className="flex flex-wrap gap-2">
                        <Badge className="bg-indigo-500">{item.subcategories?.length}</Badge>
                        {item.subcategories?.map((sub) => (
                          <Badge className="bg-gray-200 text-gray-400" key={sub._id}>{sub.name}</Badge>
                        ))}
                      </div>
                    </TableCell>
                    <TableCell className="text-center">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <button className="border border-gray-300 p-1 rounded-md hover:bg-blue-100 hover:text-blue-700 hover:border-blue-100">
                            <Settings size={18} strokeWidth={1} />
                          </button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent>
                          <DropdownMenuItem onClick={() => { setEdit(true); setEditData({ _id: item._id, name: item.name, description: item.description, image: item.image }) }}>Edit</DropdownMenuItem>
                          <DropdownMenuItem onClick={() => { setOpen(true); setEditData({ _id: item._id, name: item.name, description: item.description, image: item.image }) }}>Delete</DropdownMenuItem>
                          <DropdownMenuItem onClick={() => { setStatus(true); setEditData({ _id: item._id, name: item.name, description: item.description, image: item.image }) }}>change Status</DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>}
            {tableData.length === 0 ?
              <div className='text-gray-400 text-sm flex justify-center items-center h-1/3 w-full'>
                No Data Found
              </div> :
              <div className='sticky bottom-0 h-7 bg-white p-3'></div>
            }

            <AlertDialog open={status} onOpenChange={setStatus}>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>

                  <AlertDialogDescription>
                    <span className="font-semibold">Are you sure you want to change the status of the category </span>
                    <span className="font-bold">"{capitalize(editData.name)}"</span>?
                  </AlertDialogDescription>

                  <AlertDialogDescription>
                    <span className="font-semibold ">Note:</span> Changing the status of this category will also update the status of all its associated subcategories and products accordingly.
                  </AlertDialogDescription>

                  <AlertDialogDescription>
                    <span className="font-semibold ">Warning:</span> Products under <span className="font-bold">"inactive"</span> categories will not be visible to customers.
                  </AlertDialogDescription>
                </AlertDialogHeader>

                <AlertDialogFooter className="pt-5">
                  <AlertDialogCancel>Cancel</AlertDialogCancel>
                  <AlertDialogAction
                    className="bg-yellow-600 hover:bg-yellow-700"
                    onClick={() => changeStatus(editData._id)}
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
                  <AlertDialogDescription >
                    <span className='font-semibold'>Are you sure you want to delete this category </span><span className='font-bold'>"{capitalize(editData.name)}"</span> ?
                  </AlertDialogDescription>
                  <AlertDialogDescription >
                    <span className='font-semibold'>Warning:</span> This action is irreversible. Deleting this category will permanently remove all its associated subcategories and products.
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter className={'pt-5'}>
                  <AlertDialogCancel>Cancel</AlertDialogCancel>
                  <AlertDialogAction className={'bg-red-600 hover:bg-red-700'} onClick={() => deleteCategory(editData._id)}>
                    Delete
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>

            <AlertDialog open={edit} onOpenChange={setEdit}>
              <form action="">
                <AlertDialogContent className="sm:max-w-[500px]">
                  <AlertDialogHeader>
                    <AlertDialogTitle className={'font-bold'}>Edit Category</AlertDialogTitle>
                    <AlertDialogDescription>
                      Make changes to your profile here. Click save when you're done.
                    </AlertDialogDescription>

                    <div className={'text-black flex gap-3 flex-col justify-center items-center'}>
                      <div className='w-full gap-2 flex flex-col items-center justify-between'>
                        <div className='m-5 relative h-[130px] w-[130px] rounded-md bg-gray-200'>
                          <img className='h-full w-full rounded-md object-cover' src={
                            typeof editData.image === 'string' && editData.image.includes('res.cloudinary.com')
                              ? editData.image
                              : editData.image instanceof File
                                ? URL.createObjectURL(editData.image)
                                : ""
                          } alt="" />
                          <div className='border border-gray-500 absolute top-2 right-2 flex w-7 h-7 justify-center items-center rounded-md bg-white'>
                            <label className='cursor-pointer' htmlFor="imageEdit"><Pencil size={18} /></label>
                            <input onChange={(e) => setEditData(prev => ({ ...prev, image: e.target.files[0] }))} accept="image/png, image/jpeg" type="file" id="imageEdit" className='hidden h-full w-full' />
                          </div>
                        </div>
                        <div className='w-full'>
                          <div className='text-left flex flex-col'>
                            <label className='text-sm font-semibold' htmlFor="nameEdit">Name</label>
                            <input onChange={(e) => setEditData(prev => ({ ...prev, name: e.target.value }))} value={editData.name || ""} className='my-2 p-2 outline-none text-sm rounded-md border-gray-300 border' type="text" id="nameEdit" placeholder="Name" />
                          </div>
                          <div className='text-left flex flex-col'>
                            <label className='text-sm font-semibold' htmlFor="descriptionEdit">Description</label>
                            <textarea onChange={(e) => setEditData(prev => ({ ...prev, description: e.target.value }))} value={editData.description || ""} className='h-28 my-2 p-2 outline-none text-sm rounded-md border-gray-300 border' type="text" id="descriptionEdit" placeholder="Description" />
                          </div>
                        </div>
                      </div>
                    </div>
                  </AlertDialogHeader>
                  <AlertDialogFooter className={'pt-5'}>
                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                    <AlertDialogAction onClick={() => editCategory(editData._id)} className={'bg-indigo-600 hover:bg-indigo-700'} >
                      Save
                    </AlertDialogAction>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </form>
            </AlertDialog>

          </div>
        </div >
      </div >
    </div >
  )
}

export default Categories
