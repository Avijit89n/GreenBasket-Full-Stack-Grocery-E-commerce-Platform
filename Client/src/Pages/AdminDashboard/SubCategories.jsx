import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button'
import React, { useEffect, useState } from "react";
import Select from "react-select";
import {
    Tooltip,
    TooltipContent,
    TooltipTrigger,
} from "@/components/ui/tooltip"
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
import { RotateCcw, Search, Settings } from 'lucide-react'
import Loader from '@/components/Common/Loader';
import getHandler from '@/Services/Get.service';
import toast from 'react-hot-toast';
import postHandler from '@/Services/Post.Service';
import { useInView } from 'react-intersection-observer';
import Loader2 from '@/components/Common/Loader2';
import { useNavigate } from 'react-router-dom';

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

function capitalize(str) {
    if (!str) return "";
    return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();
}

const initialData = {
    name: "",
    description: "",
    status: "",
    category: []
}

function SubCategories() {
    const [ref, inView] = useInView({threshold: 0});

    const navigate = useNavigate()

    const [data, setData] = useState(initialData)
    const [options, setOption] = useState([])
    const [tableData, setTableData] = useState([]);
    const [loading, setLoading] = useState(false);
    const [open, setOpen] = useState(false);
    const [edit, setEdit] = useState(false);
    const [status, setStatus] = useState(false)
    const [page, setPage] = useState(1)
    const [paginationLoader, setPaginationLoader] = useState(false)
    const [editData, setEditData] = useState({ _id: data._id, name: data.name, description: data.description, category: data.category })

    const submitData = async (e) => {
        e.preventDefault();
        setLoading(true)

        if (options.length === 0) {
            toast.error("Please create a category first then try again.")
            setLoading(false)
            return
        }

        const formdata = new FormData();
        formdata.append("name", data.name);
        data.category?.map(item => {
            formdata.append("category", item.value);
        })
        formdata.append("status", data.status?.value || "status not selected");
        formdata.append("description", data.description);

        await postHandler(`${import.meta.env.VITE_BACKEND_URL}/api/subcategory/add-subcategory`, formdata)
            .then((res) => {
                toast.success(res.message || "Data added successfully")
                setData(initialData)
                navigate('/admin/sub-categories')
            })
            .catch((err) => {
                toast.error(err.response?.data?.message || "failed to add Data")
            })
            .finally(() => setLoading(false))
    }

    const fetchData = async () => {
        setPaginationLoader(true)
        await getHandler(`${import.meta.env.VITE_BACKEND_URL}/api/subcategory/get-table-data/sub-category?page=${page}&limit=12`)
            .then(res => {
                setTableData(prev => ({
                    isEnd: res.data?.isEnd,
                    details: [
                        ...(prev?.details || []),
                        ...(res.data?.details || [])
                    ]
                }))
            })
            .catch(err => {
                toast.error(err?.response?.data?.message || "failed to fetch Data")
            })
            .finally(() => setPaginationLoader(false))
    }

    const fetchCategory = async () => {
        setLoading(true)
        getHandler(`${import.meta.env.VITE_BACKEND_URL}/api/category/get-table-data/category`)
            .then((res) => {
                res.data?.map(item => {
                    setOption(prev => [...prev, { value: item._id, label: capitalize(item.name) }])
                })
            })
            .catch((err) => {
                toast.error(err?.response?.data?.message || "failed to fetch category. Please refresh and try again")
            })
            .finally(() => setLoading(false))
    }

    const deleteSubCategory = async (id) => {
        setLoading(true)
        await getHandler(`${import.meta.env.VITE_BACKEND_URL}/api/subcategory/delete-subcategory/${id}`)
            .then(res => {
                toast.success(res.message || "Delete successfull")
                setPage(1)
                setTableData({tableData: [], isEnd: false})
            })
            .catch(err => {
                toast.error(err.response?.data?.message || "Delete failed")
            })
            .finally(() => setLoading(false) )
    }

    const editSubCategory = async (id) => {
        setLoading(true);

        const formdata = new FormData();
        formdata.append("name", editData.name);
        formdata.append("description", editData.description);
        editData.category.map(item => {
            formdata.append("category", item.value || "")
        })

        await postHandler(`${import.meta.env.VITE_BACKEND_URL}/api/subcategory/edit-subcategory/${id}`, formdata)
            .then(res => {
                toast.success(res.message || "Sub-Category successfully updated")
                setPage(1)
                setTableData({tableData: [], isEnd: false})
            })
            .catch(err => {
                toast.error(err.response?.data?.message || "Failed to update Sub-Category")
            })
            .finally(() => setLoading(false) )

    }

    const changeStatus = async (id) => {
        setLoading(true)
        await getHandler(`${import.meta.env.VITE_BACKEND_URL}/api/subcategory/change-status/${id}`)
            .then((res) => {
                toast.success(res.message || "Update successfull")
                setPage(1)
                setTableData({tableData: [], isEnd: false})
            })
            .catch((err) => {
                toast.error(err.response?.data?.message || "Update failed")
            })
            .finally(() => setLoading(false) )

    }


    useEffect(() => {
        if (inView && !paginationLoader && !tableData.isEnd) {
            setPage(prev => prev + 1)
        }
    }, [inView])

    useEffect(() => {
        if (!tableData.isEnd) {
            fetchData();
        }
    }, [page])

    useEffect(() => {
        fetchCategory()
    }, [])

    return  (
        <div>
            <div className='p-2 font-sans'>
                <h1 className='mb-6 text-xl font-bold text-gray-700'>Sub Category</h1>
                <div className='flex lg:flex-row flex-col gap-2'>
                    <div className='bg-white lg:w-1/3 w-full p-4 rounded-md'>
                        <h3 className='mb-5 font-semibold'>Add New Category</h3>
                        <form onSubmit={submitData} className='flex flex-col justify-center'>
                            <div className='flex flex-col gap-2 m-2 mb-5'>
                                <label className='text-sm font-semibold'>Category<span className='text-red-500'>*</span></label>
                                <div className="w-full text-sm flex gap-2 items-center">
                                    <Select
                                        className='w-full'
                                        styles={customStyles}
                                        isMulti
                                        options={options}
                                        value={data.category}
                                        onChange={(selected) => setData(prev => ({ ...prev, category: selected }))}
                                        placeholder="Select Category"
                                    />
                                    <Tooltip>
                                        <TooltipTrigger asChild>
                                            <button onClick={() => {
                                                setOption([]),
                                                    fetchCategory()
                                            }} type='button' className='cursor-pointer border border-gray-300 p-2 rounded-md'><RotateCcw size={20} strokeWidth={1} /></button>
                                        </TooltipTrigger>
                                        <TooltipContent >
                                            <p>Refresh Category</p>
                                        </TooltipContent>
                                    </Tooltip>
                                </div>
                            </div>

                            <div className='flex flex-col gap-2 m-2 mb-5'>
                                <label className='text-sm font-semibold'>Status<span className='text-red-500'>*</span></label>
                                <div className="w-full text-sm">
                                    <Select
                                        styles={customStyles}
                                        options={[
                                            { value: "Active", label: "Active" },
                                            { value: "Inactive", label: "Inactive" },
                                        ]}
                                        value={data.status}
                                        placeholder="Select Status"
                                        onChange={(selected) => setData(prev => ({ ...prev, status: selected }))}
                                    />
                                </div>
                            </div>

                            <div className='flex flex-col gap-2 m-2 mb-5'>
                                <label className='text-sm font-semibold' htmlFor="subCategoryName">Name<span className='text-red-500'>*</span></label>
                                <input value={data?.name || ""} onChange={(e) => setData(prev => ({ ...prev, name: e.target.value }))} className='p-2 outline-none text-sm rounded-md border-gray-300 border' type="text" id="subCategoryName" placeholder="Sub Category Name" required />
                            </div>

                            <div className='flex flex-col gap-2 m-2 mb-5'>
                                <label className='text-sm font-semibold' htmlFor="subCategoryDescription">Description<span className='text-gray-400 text-[12px] italic'> (Optional)</span></label>
                                <textarea value={data?.description || ""} onChange={(e) => setData(prev => ({ ...prev, description: e.target.value }))} className='p-2 h-30 outline-none text-sm rounded-md border-gray-300 border' type="text" id="subCategoryDescription" placeholder="Description" />
                            </div>


                            <Button type="submit" className="m-2 bg-green-700 hover:bg-green-800">Submit</Button>


                        </form >
                    </div >
                    <div className='rounded-md bg-white px-4 lg:w-2/3 w-full h-150 overflow-scroll'>
                        <div className='h-7 sticky top-0 bg-white z-10 flex items-center flex-wrap gap-2'></div>
                        <Table className={"text-base"}>
                            <TableHeader>
                                <TableRow>
                                    <TableHead className="w-[200px]">Name</TableHead>
                                    <TableHead >Category</TableHead>
                                    <TableHead className={"w-[100px] text-center"}>Products</TableHead>
                                    <TableHead className={"w-[100px] text-center"}>Status</TableHead>
                                    <TableHead className="text-center">Actions</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody >
                                {tableData?.details?.map((item) => (
                                    <TableRow key={item._id}>
                                        <TableCell>{capitalize(item.name)}</TableCell>
                                        <TableCell className={"flex flex-wrap gap-2"}>
                                            {item?.category?.map((category) => (
                                                <Badge key={category._id} className="bg-gray-200 text-gray-400">{capitalize(category.name)}</Badge>
                                            ))}
                                        </TableCell>
                                        <TableCell className={"text-center"}>{item.products}</TableCell>
                                        <TableCell className={"text-center"}>
                                            {item.status === "active" ? (
                                                <Badge className="bg-green-100 text-green-500">{capitalize(item.status)}</Badge>
                                            ) : (
                                                <Badge className="bg-red-100 text-red-500">{capitalize(item.status)}</Badge>
                                            )}
                                        </TableCell>
                                        <TableCell className="text-center">
                                            <DropdownMenu>
                                                <DropdownMenuTrigger asChild>
                                                    <button ref={ref} className="border border-gray-300 p-1 rounded-md hover:bg-blue-100 hover:text-blue-700 hover:border-blue-100">
                                                        <Settings size={18} strokeWidth={1} />
                                                    </button>
                                                </DropdownMenuTrigger>
                                                <DropdownMenuContent>
                                                    <DropdownMenuItem onClick={() => { setEdit(true); setEditData({ _id: item._id, name: item.name, description: item.description, category: item.category.map(item => ({ value: item._id, label: item.name })) }) }}>Edit</DropdownMenuItem>
                                                    <DropdownMenuItem onClick={() => { setOpen(true); setEditData({ _id: item._id, name: item.name, description: item.description, category: item.category }) }}>Delete</DropdownMenuItem>
                                                    <DropdownMenuItem onClick={() => { setStatus(true); setEditData({ _id: item._id, name: item.name, description: item.description, category: item.category }) }}>Change Status</DropdownMenuItem>
                                                </DropdownMenuContent>
                                            </DropdownMenu>
                                        </TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>

                        {paginationLoader ?
                            <div className='w-full flex justify-center items-center p-5'><Loader2 height={7} width={7} /></div> : ""
                        }

                        {tableData.length === 0 ?
                            <div className='text-gray-400 text-sm flex justify-center items-center h-1/3 w-full'>
                                No Data Found
                            </div> :
                            <div className='h-7 sticky bottom-0 bg-white p-3 '></div>
                        }

                        <AlertDialog open={status} onOpenChange={setStatus}>
                            <AlertDialogContent>
                                <AlertDialogHeader>
                                    <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>

                                    <AlertDialogDescription>
                                        <span className="font-semibold">Are you sure you want to change the status of the Sub-category </span>
                                        <span className="font-bold">"{capitalize(editData.name)}"</span>?
                                    </AlertDialogDescription>

                                    <AlertDialogDescription>
                                        <span className="font-semibold ">Note:</span> Changing the status of this Sub-category will also update the status of all its associated products accordingly.
                                    </AlertDialogDescription>

                                    <AlertDialogDescription>
                                        <span className="font-semibold ">Warning:</span> Products under <span className="font-bold">"inactive"</span> Sub-categories will not be visible to customers.
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
                                        <span className='font-semibold'>Warning:</span> This action is irreversible.Deleting this category will permanently remove all its associated products.
                                    </AlertDialogDescription>
                                </AlertDialogHeader>
                                <AlertDialogFooter className={'pt-5'}>
                                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                                    <AlertDialogAction className={'bg-red-600 hover:bg-red-700'} onClick={() => deleteSubCategory(editData._id)}>
                                        Delete
                                    </AlertDialogAction>
                                </AlertDialogFooter>
                            </AlertDialogContent>
                        </AlertDialog>

                        <AlertDialog open={edit} onOpenChange={setEdit}>
                            <form >
                                <AlertDialogContent>
                                    <AlertDialogHeader>
                                        <AlertDialogTitle className={'font-bold'}>Edit Sub-Category</AlertDialogTitle>
                                        <AlertDialogDescription>
                                            Make changes to your profile here. Click save when you're done.
                                        </AlertDialogDescription>
                                        <div className='flex flex-col gap-3 my-5'>
                                            <div>
                                                <label className='text-sm font-semibold'>Select Category</label>
                                                <Select
                                                    className='w-full text-sm mt-1'
                                                    styles={customStyles}
                                                    isMulti
                                                    options={options}
                                                    value={editData.category}
                                                    onChange={(selected) => setEditData(prev => ({ ...prev, category: selected }))}
                                                    placeholder="Select Category"
                                                />
                                            </div>
                                            <div>
                                                <label className='text-sm font-semibold' htmlFor="editName">Name</label>
                                                <input className='w-full text-sm p-2 mt-1 rounded-md border border-gray-300 outline-none' value={editData.name} onChange={(e) => setEditData(prev => ({ ...prev, name: e.target.value }))} type="text" id="editName" placeholder="Name" />
                                            </div>
                                            <div>
                                                <label className='text-sm font-semibold' htmlFor="editDescription">Description</label>
                                                <input className='w-full text-sm mt-1 p-2 rounded-md border border-gray-300 outline-none' value={editData.description} onChange={(e) => setEditData(prev => ({ ...prev, description: e.target.value }))} type="text" id="editDescription" placeholder="Description" />
                                            </div>
                                        </div>

                                    </AlertDialogHeader>
                                    <AlertDialogFooter className={'pt-5'}>
                                        <AlertDialogCancel>Cancel</AlertDialogCancel>
                                        <AlertDialogAction className={'bg-indigo-600 hover:bg-indigo-700'} onClick={() => editSubCategory(editData._id)}>
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

export default SubCategories
