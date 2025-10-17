import { Pencil, X } from 'lucide-react'
import React, { useEffect, useState } from 'react'
import addImageLogo from "@/assets/add_image.png"
import postHandler from "../../Services/Post.Service.js"
import Select from "react-select";
import { Slider } from "@/components/ui/slider"
import { Badge } from '@/components/ui/badge'
import toast from 'react-hot-toast'
import getHandler from '@/Services/Get.service.js'
import Loader from '@/components/Common/Loader.jsx'
import { format } from "date-fns"
import { Calendar as CalendarIcon } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Calendar } from "@/components/ui/calendar"
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@/components/ui/popover"
import { useNavigate, useParams } from 'react-router-dom';

const initialData = {
    avatar: "",
    otherImages: ["", "", "", "", "", ""],
    name: "",
    category: "",
    description: "",
    brand: "",
    status: "",
    price: "",
    quantity: "",
    discount: [0],
    size: "",
    weight: "",
    countryOfOrigin: "",
    details: "",
    ingredients: "",
    shelfLife: "",
    manufacturingDate: "",
    expiryDate: "",
    variant: []
}

function capitalize(str) {
    if (!str) return "";
    return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();
}
const customStyles = {
    control: (provided) => ({
        ...provided,
        boxShadow: 'none',
        borderRadius: '8px',
        borderColor: '#ced4da',
        '&:hover': {
            borderColor: '#ced4da',
        },
    }),

    groupHeading: (provided) => ({
        ...provided,
        fontSize: '1rem',
        fontWeight: '600',
        color: '#4b5563',
        padding: '6px 12px',
    }),

    option: (provided, state) => ({
        ...provided,
        fontSize: '0.875rem',
        padding: '5px 20px',
        backgroundColor: state.isFocused ? '#f0f0f0' : 'white',
        color: '#4b5563',
    }),
};


const countryOfOrigin = [
    "Afghanistan", "Argentina", "Australia", "Austria", "Bangladesh", "Belgium",
    "Brazil", "Canada", "China", "Colombia", "Denmark", "Egypt", "Finland",
    "France", "Germany", "Greece", "Hong Kong", "India", "Indonesia", "Iran",
    "Ireland", "Israel", "Italy", "Japan", "Kenya", "Malaysia", "Mexico",
    "Netherlands", "Nepal", "New Zealand", "Nigeria", "Norway", "Pakistan",
    "Philippines", "Poland", "Portugal", "Qatar", "Russia", "Saudi Arabia",
    "Singapore", "South Africa", "South Korea", "Spain", "Sri Lanka", "Sweden",
    "Switzerland", "Thailand", "Turkey", "UAE", "UK", "Ukraine", "USA", "Vietnam"
];

export default function AddProduct() {
    const { productID } = useParams()

    const navigate = useNavigate()

    const [data, setdata] = useState(initialData)
    const [loading, setLoading] = useState(false)
    const [categoryName, setCategoryName] = useState([])
    const [varientOption, setvariantOption] = useState([])
    const [manufacturingDateOpen, setManufacturingDateOpen] = useState(false);
    const [expiryDateOpen, setExpiryDateOpen] = useState(false)

    const handleImages = (e, index) => {
        const file = e.target.files[0]
        const arrayOfImages = [...data.otherImages]
        arrayOfImages[index] = file
        setdata(prev => ({ ...prev, otherImages: arrayOfImages }))
    }


    const fetchDataForCategory = async () => {
        setLoading(true)
        await getHandler(`${import.meta.env.VITE_BACKEND_URL}/api/category/get-table-data/category`)
            .then((res) => {
                setCategoryName(res.data)
            })
            .catch(() => {
                toast.error("Failed to fetch category. Click on refresh button")
                setCategoryName([])
            })
            .finally(() => setLoading(false))
    }

    const submitData = async (e) => {
        e.preventDefault();
        setLoading(true);

        const formData = new FormData();
        formData.append("name", data.name)
        formData.append("description", data.description)
        formData.append("avatar", data.avatar)
        formData.append("brand", data.brand)
        formData.append("price", data.price)
        formData.append("discount", Array.isArray(data?.discount) ? data?.discount?.[0] : data?.discount)
        formData.append("weight", data.weight)
        formData.append("size", data.size)
        formData.append("quantity", data.quantity)
        formData.append("status", typeof data.status === 'string' ? data?.status : data?.status?.value)
        formData.append("category", data.category.value)
        formData.append("manufacturingDate", data.manufacturingDate)
        formData.append("expiryDate", data.expiryDate)
        formData.append("countryOfOrigin", typeof data.countryOfOrigin === 'string' ? data?.countryOfOrigin : data?.countryOfOrigin?.value)
        formData.append("ingredients", data.ingredients)
        formData.append("details", data.details)
        formData.append("shelfLife", data.shelfLife)
        data.otherImages?.map(item => {
            if (item) formData.append("otherImages", item)
        })
        data.variant?.map(item => {
            formData.append("variant", item?.value)
        })

        await postHandler(`${import.meta.env.VITE_BACKEND_URL}/api/product/add-product/${productID}`, formData)
            .then((res) => {
                toast.success(res.message || "product added successfully")
                setdata(initialData)
                navigate('/admin/products')
            })
            .catch((err) => {
                toast.error(err.response?.data?.message || "Failed to add product")
            })
            .finally(() => {
                setLoading(false);
            })
    }

    const handleVariant = async (id) => {
        await getHandler(`${import.meta.env.VITE_BACKEND_URL}/api/subcategory/get-variant/${id?.value || id}?currentProductID=${productID}`)
            .then((res) => {
                setvariantOption(res.data)
                console.log(res.data)
            })
            .catch((err) => {
                toast.error(err?.response?.data?.message || "Failed to fetch Variant data")
            })
    }

    const fetchInformation = async () => {
        setLoading(true)
        await getHandler(`${import.meta.env.VITE_BACKEND_URL}/api/product/edit-product/${productID}`)
            .then((res) => {
                handleVariant(res.data.category._id)
                setdata({
                    ...res.data,
                    variant: res?.data?.variant.map(item => ({ value: item._id, label: item.name })),
                    category: { value: res?.data?.category?._id, label: capitalize(res?.data?.category?.name) },
                    otherImages: [...Array(5)].map((_, index) =>
                        res?.data?.otherImages?.[index] && typeof res?.data?.otherImages?.[index] === 'string' && res?.data?.otherImages?.[index].includes('res.cloudinary.com') ? res?.data?.otherImages?.[index] : "")
                })
            })
            .catch((err) => {
                toast.error(err?.response?.data?.message || "Failed to fetchData")
            })
            .finally(() => setLoading(false))
    }

    useEffect(() => {
        fetchDataForCategory()
        if (productID !== "new") {
            fetchInformation()
        }
    }, [])


    return loading ? <Loader /> : (
        <div>
            <div className='p-2 font-sans'>
                <h1 className='mb-6 text-xl font-bold text-gray-700'>Add Products</h1>
                <form onSubmit={submitData} className=' bg-white p-5 rounded-md flex flex-col lg:flex-row'>
                    <div className='w-full lg:w-1/3 flex flex-col'>
                        <div className='border relative border-gray-200 rounded-md p-2 border-dashed'>
                            {data.avatar ? (
                                <div className='flex justify-center items-center'>
                                    <img className='max-h-84 rounded-md object-contain max-w-full' src={
                                        typeof data?.avatar === 'string' && data?.avatar.includes('res.cloudinary.com') ? data?.avatar : URL.createObjectURL(data.avatar)
                                    } alt="loading..." />
                                </div>
                            ) : (
                                <div className='h-84 bg-gray-100 rounded-md flex justify-center items-center'>
                                    <img className='h-15 w-15' src={addImageLogo} alt="loading..." />
                                </div>
                            )}
                            <div className='bg-white h-12 w-12 border border-gray-300 absolute top-5 right-5 rounded-md'>
                                <label htmlFor='avatar' className="flex justify-center items-center h-full w-full cursor-pointer"><Pencil /></label>
                                <input onChange={(e) => setdata(prev => ({ ...prev, avatar: e.target.files[0] }))} type="file" id='avatar' className='hidden' />
                            </div>
                        </div>
                        <div className='flex flex-wrap justify-center items-center gap-1 place-items-center p-4'>
                            {
                                data.otherImages?.map((productImage, i) => (
                                    <div key={i} className='relative  border border-gray-100 p-1 rounded-md'>
                                        {productImage ? (
                                            <div className='flex justify-center items-center'>
                                                <img className='max-h-[100px] max-w-[100px] rounded-md object-contain' src={
                                                    typeof productImage === 'string' && productImage.includes('res.cloudinary.com') ? productImage : URL.createObjectURL(productImage)
                                                } alt="loading..." />
                                                <div className='h-6 w-6 absolute top-0 left-0 bg-red-200 rounded-full'>
                                                    <button type='button' onClick={() => setdata(prev => ({
                                                        ...prev,
                                                        otherImages: prev?.otherImages?.map((item, index) => index === i ? '' : item)
                                                    }))} className="flex justify-center items-center h-full w-full cursor-pointer">
                                                        <X size={15} color='red' />
                                                    </button>
                                                </div>
                                            </div>

                                        ) : (
                                            <div className='bg-gray-100 h-[100px] w-[100px] rounded-md flex justify-center items-center'>
                                                <img className='h-5 w-5' src={addImageLogo} alt="loading..." />
                                            </div>
                                        )}
                                        <div className='bg-white h-7 w-7 border border-gray-300 absolute top-3 right-3 rounded-md'>
                                            <label htmlFor={`otherImages${i}`} className="flex justify-center items-center h-full w-full cursor-pointer">
                                                <Pencil size={15} />
                                            </label>
                                            <input onChange={e => handleImages(e, i)} id={`otherImages${i}`} type="file" className='hidden' />
                                        </div>

                                    </div>
                                ))
                            }
                        </div>

                        <div className='border border-gray-300 rounded-md gap-5 p-3 border-dashed flex flex-col mx-7 my-9'>
                            <div className='w-full'>
                                <label className="block mb-2 text-sm font-medium text-gray-700">Country Of Origin<span className='text-red-500'>*</span></label>
                                <div className="w-full text-sm">
                                    <Select
                                        styles={customStyles}
                                        options={countryOfOrigin.map(item => ({ value: item, label: item }))}
                                        value={typeof data.countryOfOrigin === 'object' ? data.countryOfOrigin : data.countryOfOrigin ? { value: data.countryOfOrigin, label: data.countryOfOrigin } : null}
                                        placeholder="Select Country Of Origin"
                                        onChange={(selected) => setdata(prev => ({ ...prev, countryOfOrigin: selected }))}
                                    />
                                </div>
                            </div>
                            <div className='w-full'>
                                <label className="block mb-2 text-sm font-medium text-gray-700">Product Variant<span className='text-gray-400 text-[12px] italic'> (Optional)</span></label>
                                <div className="w-full text-sm">
                                    <Select
                                        isMulti
                                        isDisabled={!varientOption || varientOption?.length === 0}
                                        styles={customStyles}
                                        options={varientOption?.[0]?.products?.map(item => ({ value: item._id, label: capitalize(item.name) }))}
                                        value={data.variant}
                                        placeholder="Select Variant"
                                        onChange={(selected) => setdata(prev => ({ ...prev, variant: selected }))}
                                    />
                                </div>
                            </div>
                        </div>
                        <div className='border border-gray-300 rounded-md gap-5 p-3 border-dashed flex flex-col mx-7'>
                            <div className='w-full'>
                                <label htmlFor="shelfLife" className="block mb-2 text-sm font-medium text-gray-700">Shelf Life<span className='text-red-500'>*</span></label>
                                <input value={data.shelfLife} onChange={(e) => setdata(prev => ({ ...prev, shelfLife: e.target.value }))} className='w-full border p-2 rounded-md text-sm border-gray-300' id='shelfLife' type="text" placeholder="Enter Shelf Life" required />
                            </div>
                            <div className='w-full'>
                                <label className="block mb-2 text-sm font-medium text-gray-700">Manufacturing Date<span className='text-red-500'>*</span></label>
                                <Popover open={manufacturingDateOpen} onOpenChange={setManufacturingDateOpen}>
                                    <PopoverTrigger asChild>
                                        <Button
                                            variant="outline"
                                            data-empty={!data.manufacturingDate}
                                            className="data-[empty=true]:text-muted-foreground justify-start text-left w-full font-normal"
                                        >
                                            <CalendarIcon />
                                            {data.manufacturingDate ? format(data.manufacturingDate, "PPP") : <span className='overflow-hidden'>Pick a Manufacturing Date</span>}
                                        </Button>
                                    </PopoverTrigger>
                                    <PopoverContent className="w-auto p-0">
                                        <Calendar mode="single" selected={data.manufacturingDate} onSelect={(date) => {
                                            setdata(prev => ({ ...prev, manufacturingDate: date }))
                                            setManufacturingDateOpen(false)
                                        }
                                        } />
                                    </PopoverContent>
                                </Popover>
                            </div>
                            <div className='w-full'>
                                <label className="block mb-2 text-sm font-medium text-gray-700">Expiery Date<span className='text-red-500'>*</span></label>
                                <Popover open={expiryDateOpen} onOpenChange={setExpiryDateOpen}>
                                    <PopoverTrigger asChild>
                                        <Button
                                            variant="outline"
                                            data-empty={!data.expiryDate}
                                            className="data-[empty=true]:text-muted-foreground justify-start text-left w-full font-normal"
                                        >
                                            <CalendarIcon />
                                            {data.expiryDate ? format(data.expiryDate, "PPP") : <span className='overflow-hidden'>Pick an Expiry Date</span>}
                                        </Button>
                                    </PopoverTrigger>
                                    <PopoverContent className="w-auto p-0">
                                        <Calendar mode="single" selected={data.expiryDate} onSelect={(date) => {
                                            setdata(prev => ({ ...prev, expiryDate: date }))
                                            setExpiryDateOpen(false)
                                        }
                                        } />
                                    </PopoverContent>
                                </Popover>
                            </div>
                        </div>
                        <div className='border border-gray-300 rounded-md gap-5 p-3 border-dashed flex flex-col mx-7 mt-10'>
                            <div className='w-full'>
                                <label htmlFor="size" className="block mb-2 text-sm font-medium text-gray-700">Size<span className='text-gray-400 text-[12px] italic'> (Optional)</span></label>
                                <input value={data.size} onChange={(e) => setdata(prev => ({ ...prev, size: e.target.value }))} className='outline-none w-full border p-2 rounded-md text-sm border-gray-300' id='size' type="text" placeholder="Enter Size" />
                            </div>
                            <div className='w-full'>
                                <label htmlFor="weight" className="block mb-2 text-sm font-medium text-gray-700">Weight (with unit)<span className='text-gray-400 text-[12px] italic'> (Optional)</span></label>
                                <input value={data.weight} onChange={(e) => setdata(prev => ({ ...prev, weight: e.target.value }))} className='outline-none w-full border p-2 rounded-md text-sm border-gray-300' id='weight' type="text" placeholder="Enter Weight" />
                            </div>
                        </div>

                    </div>

                    <div className='w-full lg:w-2/3 flex flex-col'>
                        <div className='flex flex-wrap items-center w-full p-2'>
                            <div className='min-w-[100px] w-1/2 p-2'>
                                <label htmlFor="productName" className="block mb-2 text-sm font-medium text-gray-700">Product Name<span className='text-red-500'>*</span></label>
                                <input value={data.name} onChange={(e) => setdata(prev => ({ ...prev, name: e.target.value }))} className='outline-none w-full border p-2 rounded-md text-sm border-gray-300' id='productName' type="text" placeholder="Name" />
                            </div>
                            <div className='min-w-[100px] w-1/2 p-2'>
                                <label className="block mb-2 text-sm font-medium text-gray-700">Product Category<span className='text-red-500'>*</span></label>
                                <div className='w-full flex items-center gap-2'>
                                    <div className="w-full text-sm">
                                        <Select
                                            styles={customStyles}
                                            options={categoryName.map(category => ({
                                                label: capitalize(category.name),
                                                options: category.subcategories.map(item => (
                                                    { value: item._id, label: capitalize(item.name) }
                                                ))
                                            }
                                            ))}
                                            value={data.category}
                                            placeholder="Select Category"
                                            onChange={(selected) => {
                                                setdata(prev => ({ ...prev, category: selected, variant: null }))
                                                handleVariant(selected)
                                            }}
                                        />
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className='flex flex-wrap items-center w-full p-2'>
                            <div className='min-w-[100px] w-full p-2'>
                                <label htmlFor="productDescription" className="block mb-2 text-sm font-medium text-gray-700">Product Description<span className='text-gray-400 text-[12px] italic'> (Optional)</span></label>
                                <textarea value={data.description} onChange={(e) => setdata(prev => ({ ...prev, description: e.target.value }))} className='w-full h-44 border p-2 rounded-md text-sm border-gray-300' id='productDescription' type="text" placeholder="Enter Product Description" />
                            </div>
                        </div>
                        <div className='flex flex-wrap items-center w-full p-2'>
                            <div className='min-w-[100px] w-full p-2'>
                                <label htmlFor="productDetails" className="block mb-2 text-sm font-medium text-gray-700">Product Details<span className='text-gray-400 text-[12px] italic'> (Optional)</span></label>
                                <textarea value={data.details} onChange={(e) => setdata(prev => ({ ...prev, details: e.target.value }))} className='w-full h-44 border p-2 rounded-md text-sm border-gray-300' id='productDetails' type="text" placeholder="Enter Product specification" />
                            </div>
                        </div>
                        <div className='flex flex-wrap items-center w-full p-2'>
                            <div className='min-w-[100px] w-full p-2'>
                                <label htmlFor="productIngredients" className="block mb-2 text-sm font-medium text-gray-700">Product Ingredients<span className='text-gray-400 text-[12px] italic'> (Optional)</span></label>
                                <textarea value={data.ingredients} onChange={(e) => setdata(prev => ({ ...prev, ingredients: e.target.value }))} className='w-full h-44 border p-2 rounded-md text-sm border-gray-300' id='productIngredients' type="text" placeholder="Enter Product ingredients" />
                            </div>
                        </div>
                        <div className='flex flex-wrap items-center w-full p-2'>
                            <div className='min-w-[100px] w-1/2 p-2'>
                                <label htmlFor="brandName" className="block mb-2 text-sm font-medium text-gray-700">Brand Name<span className='text-red-500'>*</span></label>
                                <input value={data.category.status} onChange={(e) => setdata(prev => ({ ...prev, brand: e.target.value }))} className='outline-none w-full border p-2 rounded-md text-sm border-gray-300' id='brandName' type="text" placeholder="Brand Name" />
                            </div>
                            <div className='min-w-[100px] w-1/2 p-2'>
                                <label className="block mb-2 text-sm font-medium text-gray-700">Status<span className='text-red-500'>*</span></label>
                                <div className="w-full text-sm">
                                    <Select
                                        styles={customStyles}
                                        options={
                                            [
                                                { value: "active", label: "Active" },
                                                { value: "inactive", label: "Inactive" },
                                            ]
                                        }
                                        value={
                                            typeof data.status === 'object' ?
                                                data.status :
                                                data.status ?
                                                    { value: data.status, label: capitalize(data.status) } :
                                                    null
                                        }
                                        placeholder="Select Status"
                                        onChange={(selected) => setdata(prev => ({ ...prev, status: selected }))}
                                    />
                                </div>
                            </div>
                        </div>
                        <div className='flex flex-wrap items-center w-full p-2'>
                            <div className='min-w-[100px] w-1/2 p-2'>
                                <label htmlFor="price" className="block mb-2 text-sm font-medium text-gray-700">Price (MRP) (₹)<span className='text-red-500'>*</span></label>
                                <input value={data.price} onChange={(e) => setdata(prev => ({ ...prev, price: e.target.value }))} className='outline-none w-full border p-2 rounded-md text-sm border-gray-300' id='price' type="number" placeholder="Enter Price" />
                            </div>
                            <div className='min-w-[100px] w-1/2 p-2'>
                                <label htmlFor="quantity" className="block mb-2 text-sm font-medium text-gray-700">Quantity<span className='text-red-500'>*</span></label>
                                <input value={data.quantity} onChange={(e) => setdata(prev => ({ ...prev, quantity: e.target.value }))} className='outline-none w-full border p-2 rounded-md text-sm border-gray-300' id='quantity' type="number" placeholder="Enter Quantity" />
                            </div>
                        </div>
                        <div className='flex items-center w-full p-2'>
                            <div className='w-full p-2'>
                                <label className="block mb-3 text-sm font-medium text-gray-700">Discount(%)<span className='text-gray-400 text-[12px] italic'> (Optional)</span></label>
                                <Slider
                                    rangeColor="bg-gray-500"
                                    sliderBtnColor="bg-gray-300"
                                    sliderBtnBorder="border-gray-400"
                                    defaultValue={[0]}
                                    min={0}
                                    max={100}
                                    step={1}
                                    value={Array.isArray(data.discount) ? data.discount : [data.discount]}
                                    onValueChange={(selected) => setdata(prev => ({ ...prev, discount: selected }))}
                                />
                                <div className='text-4xl p-5 text-gray-400 text-center w-full'>
                                    <p className='flex justify-center items-center'>
                                        {data.discount} <span className='text-2xl'>% Off</span>
                                        {data.discount < 20 ? <Badge className='bg-green-100 text-green-600 m-2 p-2'>Low Discount</Badge> :
                                            data.discount < 60 ? <Badge className='bg-yellow-100 text-yellow-600 m-2 p-2'>Medium Discount</Badge> :
                                                <Badge className='bg-red-100 text-red-600 m-2 p-2'>High Discount</Badge>}
                                    </p>
                                </div>
                            </div>
                        </div>
                        <div className='flex items-center w-full p-2'>
                            <div className='min-w-[100px] w-full p-2'>
                                <label htmlFor="finalPrice" className="block mb-2 text-sm font-medium text-gray-700">Final Price (₹)</label>
                                <input value={data.price - (data.price * (data.discount / 100))} className='outline-none w-full border p-2 rounded-md text-sm border-gray-300' id='finalPrice' type="number" readOnly />
                            </div>
                        </div>
                        <div className='flex items-center justify-end gap-10 w-full p-4 my-5'>
                            <button className='text-sm w-45 bg-gray-200 hover:bg-gray-300 p-2 rounded-md'>Cancel</button>
                            <button type='submit' className='text-sm bg-green-600 hover:bg-green-700 text-white p-2 w-45 rounded-md'>Submit</button>
                        </div>

                    </div>
                </form>
            </div>
        </div>
    )
}
