import React, { useEffect, useState } from 'react'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Button } from '@/components/ui/button'
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion'
import { Ellipsis, Eye, EyeOff, Landmark, LocateFixed, MapPin, Pencil, Plus, Trash2, User } from 'lucide-react'
import { useDispatch, useSelector } from 'react-redux'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Badge } from '@/components/ui/badge'
import toast from 'react-hot-toast'
import postHandler from '@/Services/Post.Service.js'
import { login } from '@/Store/authSlice'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import getHandler from '@/Services/Get.service'
import Loader2 from '@/components/Common/Loader2'
import Loader3 from '@/components/Common/Loader3'

const initialState = {
  fullName: "",
  userName: "",
  email: "",
  phoneNumber: "",
  avatar: ""
}

const initialAddr = {
  name: "",
  phone: "",
  pincode: "",
  locality: "",
  address: "",
  city: "",
  state: "",
  landmark: "",
  alternetNum: "",
  adrType: ""
}

const initialPass = {
  currPass: "",
  newPass: "",
  confirmPass: ""
}

function Profile() {
  const user = useSelector(state => state.auth?.user)
  const [data, setData] = useState(initialState)
  const [addrData, setAddrData] = useState(initialAddr)
  const [newAddr, setNewAddr] = useState(false)
  const dispatch = useDispatch()
  const [addrLoad, setAddrLoad] = useState(false)
  const [passLoad, setPassLoad] = useState(false)
  const [profileLoad, setProfileLoad] = useState(false)
  const [edit, setEdit] = useState("")
  const [changePass, setChangePass] = useState(initialPass)
  const [eye1, setEye1] = useState(false)
  const [eye2, setEye2] = useState(false)
  const [eye3, setEye3] = useState(false)
  const [imageCount, setImageCount] = useState(0)
  const [loading, setLoading] = useState(true)

  const addAddress = async (e) => {
    setAddrLoad(true)
    e.preventDefault();
    await postHandler(`${import.meta.env.VITE_BACKEND_URL}/api/user/address/${user._id}`, {
      address: {
        name: addrData?.name || "",
        phone: [addrData?.phone, addrData?.alternetNum] || [],
        pincode: addrData?.pincode || "",
        locality: addrData?.locality || "",
        address: addrData?.address || "",
        city: addrData?.city || "",
        state: addrData?.state || "",
        adrType: addrData?.adrType || "",
        landmark: addrData?.landmark || "",
      }
    })
      .then(res => {
        toast.success(res?.message || "Address added successfully")
        dispatch(login(res?.data))
      })
      .catch((err) => {
        toast.error("Failed to add the address. Check all the required fields are filled")
      })
      .finally(() => {
        setNewAddr(false)
        setAddrData(initialAddr)
        setAddrLoad(false)
      })
  }

  const updateAddress = async (e, addressID) => {
    setAddrLoad(true)
    e.preventDefault();
    console.log(addrData)
    await postHandler(`${import.meta.env.VITE_BACKEND_URL}/api/user/update-address/${user._id}?addressID=${addressID}`, {
      address: {
        name: addrData?.name || "",
        phone: [addrData?.phone, addrData?.alternetNum] || [],
        pincode: addrData?.pincode || "",
        locality: addrData?.locality || "",
        address: addrData?.address || "",
        city: addrData?.city || "",
        state: addrData?.state || "",
        adrType: addrData?.adrType || "",
        landmark: addrData?.landmark || "",
      }
    })
      .then(res => {
        toast.success(res?.message || "Address updated successfully")
        dispatch(login(res?.data))
      })
      .catch((err) => {
        toast.error("Failed to update the address. Please try again")
      })
      .finally(() => {
        setNewAddr(false)
        setAddrData(initialAddr)
        setAddrLoad(false)
      })
  }

  const updatePassword = async (e) => {
    setPassLoad(true)
    e.preventDefault()
    await postHandler(`${import.meta.env.VITE_BACKEND_URL}/api/user/update-password/${user._id}`, { ...changePass })
      .then(res => {
        toast.success(res?.message || "Updated Successfully")
      })
      .catch(err => {
        toast.error(err?.response?.data?.message || "Failed to update Password")
      })
      .finally(() => {
        setPassLoad(false)
        setChangePass(initialPass)
      })
  }

  const updateProfile = async (e) => {
    setProfileLoad(true)
    e.preventDefault()
    console.log(data)

    const formdata = new FormData();
    formdata.append("fullName", data?.fullName || "")
    formdata.append("userName", data?.userName || "")
    formdata.append("email", data?.email || "")
    formdata.append("phoneNo", data?.phoneNumber || "")
    formdata.append("avatar", data?.avatar)
    await postHandler(`${import.meta.env.VITE_BACKEND_URL}/api/user/update-profile/${user._id}`, formdata)
      .then(res => {
        toast.success(res?.message || "Updated Successfully")
        dispatch(login(res?.data))
      })
      .catch(err => {
        toast.error(err?.response?.data?.message || "Failed to update Profile")
      })
      .finally(() => {
        setProfileLoad(false)
      })
  }

  const deleteAddress = async (addressID) => {
    await getHandler(`${import.meta.env.VITE_BACKEND_URL}/api/user/delete-address/${user._id}?addressID=${addressID}`)
      .then(res => {
        toast.success(res?.message || "Address deleted")
        dispatch(login(res.data))
      })
      .catch(err => {
        toast.error(err.response?.data?.message || "Failed to delete product")
      })
  }

  useEffect(() => {
    setData({
      fullName: user?.fullName,
      userName: user?.userName,
      email: user?.email,
      avatar: user?.avatar,
      phoneNumber: user?.phoneNo
    })
  }, [user])

  useEffect(() => {
    if(imageCount == 1){
      setLoading(false)
    }
  }, [imageCount])

  return (
    <div>
      {(loading || addrLoad) && <Loader3/>}
      <div className={`w-full min-h-screen bg-muted/40 py-6 ${loading ? "opacity-0" : "opacity-100"} transition-opacity duration-500`}>
        <div className="w-full max-w-full px-4 sm:px-6 lg:px-12 mx-auto grid grid-cols-1 lg:grid-cols-[1fr_2fr] gap-2">

          <form onSubmit={updateProfile} className="bg-white rounded-2xl p-6 shadow-sm h-[620px]">
            <div className="flex flex-col items-center">
              <div className='relative'>
                {data?.avatar ?
                  <img
                    onLoad={() => setImageCount(prev => prev + 1)}
                    loading='lazy'
                    className={"h-26 w-26 rounded-full border object-contain"}
                    src={
                      typeof (data?.avatar) === "string" && data.avatar.includes('https://res.cloudinary.com') ?
                        data.avatar :
                        URL.createObjectURL(data?.avatar)
                    } alt="User" /> :
                  <div className='h-26 w-26 rounded-full border flex justify-center items-center bg-gray-50'><User height={35} width={35} /></div>}
                <label htmlFor='avatar' className='cursor-pointer absolute bottom-0 right-0 w-8 text-sm border aspect-square flex justify-center items-center border-gray-500 rounded-full text-gray-500 bg-gray-100'><Pencil height={20} width={20} /></label>
                <input type="file" className='hidden' onChange={(e) => {
                  const file = e.target?.files?.[0];


                  if (file) {
                    setData(prev => ({ ...prev, avatar: file }));
                  }
                }}
                  id='avatar' accept='image/*' />
              </div>
              <h2 className="mt-4 text-lg font-semibold">{user?.fullName || "No Data"}</h2>
              <p className="text-sm text-muted-foreground">{user?.email || "No Data"}</p>
            </div>

            <div className="mt-6 space-y-4 text-sm">
              <div className='flex flex-col gap-1'>
                <label className='font-semibold' htmlFor='fullname'>Full Name</label>
                <input required id='fullname' onChange={(e) => setData(prev => ({ ...prev, fullName: e.target.value }))}
                  className='border text-gray-500 border-gray-300 p-2 text-sm rounded-md outline-none' type="text" value={data?.fullName || ""} placeholder="full name" />
              </div>
              <div className='flex flex-col gap-1'>
                <label className='font-semibold' htmlFor='username'>Username</label>
                <input required id='username' onChange={(e) => setData(prev => ({ ...prev, userName: e.target.value }))}
                  className='border text-gray-500 border-gray-300 p-2 text-sm rounded-md outline-none' type="text" value={data?.userName || ""} placeholder="username" />
              </div>
              <div className='flex flex-col gap-1'>
                <label className='font-semibold' htmlFor='email'>Email</label>
                <input required id='email' onChange={(e) => setData(prev => ({ ...prev, email: e.target.value }))}
                  className='border text-gray-500 border-gray-300 p-2 text-sm rounded-md outline-none' type="email" value={data?.email || ""} placeholder="email" />
              </div>
              <div className='flex flex-col gap-1'>
                <label className='font-semibold' htmlFor='phone'>Phone</label>
                <input required id='phone' onChange={(e) => setData(prev => ({ ...prev, phoneNumber: e.target.value }))}
                  className='border text-gray-500 border-gray-300 p-2 text-sm rounded-md outline-none' type="tel" value={data?.phoneNumber || ""} placeholder="Phone number" />
              </div>
              {!profileLoad ?
                <Button className="w-full mt-4 bg-orange-500 hover:bg-orange-600">Update Profile</Button> :
                <div className='w-full p-1.5 mt-8 bg-orange-500 flex justify-center items-center rounded-md'><Loader2 height={6} width={6} /></div>
              }
            </div>
          </form>

          <ScrollArea className='lg:max-h-[620px] lg:px-4'>
            <div className="space-y-6">

              <div className="bg-white rounded-2xl p-3 sm:p-6 border border-gray-100">
                <div className="flex items-center justify-between mb-6 flex-wrap gap-2">
                  <h3 className="text-2xl font-semibold text-gray-900 py-2">My Address</h3>
                  {!newAddr && <button onClick={() => {
                    setAddrData(initialAddr)
                    setNewAddr(true)
                    setEdit("")
                  }} className="inline-flex items-center gap-2 px-6 py-2 bg-emerald-600 text-white font-semibold text-sm rounded-md">
                    <Plus className="w-4 h-4" />
                    Add New
                  </button>}
                </div>
                <div className='flex flex-col gap-3'>
                  {newAddr && <div className='bg-white rounded-2xl p-6 border-2 border-gray-300 border-dashed'>
                    <h4 className="text-lg font-semibold text-gray-900">Add a New Address</h4>
                    <form onSubmit={addAddress}>
                      <div className='flex flex-col gap-4 my-7'>
                        <div className='flex gap-4 items-center flex-wrap'>
                          <button type='button' onClick={() => console.log("abc")}
                            className='flex justify-center items-center gap-2 bg-emerald-600 py-2 px-2 sm:px-4 text-sm text-white font-semibold rounded-md'>
                            <LocateFixed height={18} width={18} /> Use Current Location
                          </button>
                        </div>
                        <div className='flex gap-4 items-center flex-wrap'>
                          <div className='flex flex-col gap-1 text-sm grow'>
                            <label htmlFor="name">Name<span className='text-red-600'>*</span></label>
                            <input required value={addrData.name} onChange={(e) => setAddrData(prev => ({ ...prev, name: e.target.value }))} type="text" id='name' className='rounded-md p-2 border text-gray-500 border-gray-300 outline-none' placeholder='Enter your Name' />
                          </div>
                          <div className='flex flex-col gap-1 text-sm grow'>
                            <label htmlFor="Phone">Phone<span className='text-red-600'>*</span></label>
                            <input required value={addrData.phone} onChange={(e) => setAddrData(prev => ({ ...prev, phone: e.target.value }))} type="number" id='Phone' className='rounded-md p-2 border text-gray-500 border-gray-300 outline-none' placeholder='Enter your Phone Number' />
                          </div>
                        </div>
                        <div className='flex gap-4 items-center flex-wrap'>
                          <div className='flex flex-col gap-1 text-sm grow'>
                            <label htmlFor="pincode">Pincode<span className='text-red-600'>*</span></label>
                            <input required value={addrData.pincode} onChange={(e) => setAddrData(prev => ({ ...prev, pincode: e.target.value }))} type="text" id='pincode' className='rounded-md p-2 border text-gray-500 border-gray-300 outline-none' placeholder='Enter your Pincode' />
                          </div>
                          <div className='flex flex-col gap-1 text-sm grow'>
                            <label htmlFor="locality">Locality<span className='text-red-600'>*</span></label>
                            <input required value={addrData.locality} onChange={(e) => setAddrData(prev => ({ ...prev, locality: e.target.value }))} type="text" id='locality' className='rounded-md p-2 border text-gray-500 border-gray-300 outline-none' placeholder='Enter your Locality' />
                          </div>
                        </div>
                        <div className='flex gap-4 items-center flex-wrap'>
                          <div className='flex flex-col gap-1 text-sm grow'>
                            <label htmlFor="address">Address<span className='text-red-600'>*</span></label>
                            <textarea value={addrData.address} onChange={(e) => setAddrData(prev => ({ ...prev, address: e.target.value }))} id='address' className='min-h-20 rounded-md p-2 border border-gray-300 outline-none' placeholder='Enter your Address(Area or Street)' />
                          </div>
                        </div>
                        <div className='flex gap-4 items-center flex-wrap'>
                          <div className='flex flex-col gap-1 text-sm grow'>
                            <label htmlFor="city">City/District/Town<span className='text-red-600'>*</span></label>
                            <input required value={addrData.city} onChange={(e) => setAddrData(prev => ({ ...prev, city: e.target.value }))} type="text" id='city' className='rounded-md p-2 border text-gray-500 border-gray-300 outline-none' placeholder='Enter your City/District/Town' />
                          </div>
                          <div className='flex flex-col gap-1 text-sm grow'>
                            <label htmlFor="state">State<span className='text-red-600'>*</span></label>
                            <input required value={addrData.state} onChange={(e) => setAddrData(prev => ({ ...prev, state: e.target.value }))} type="text" id='state' className='rounded-md p-2 border text-gray-500 border-gray-300 outline-none' placeholder='Enter yout State' />
                          </div>
                        </div>
                        <div className='flex gap-4 items-center flex-wrap'>
                          <div className='flex flex-col gap-1 text-sm grow'>
                            <label htmlFor="landmark">Landmark<span className="text-gray-500 text-xs italic"> (Optional)</span></label>
                            <input value={addrData.landmark} onChange={(e) => setAddrData(prev => ({ ...prev, landmark: e.target.value }))} type="text" id='landmark' className='rounded-md p-2 border text-gray-500 border-gray-300 outline-none' placeholder='Enter landmark' />
                          </div>
                          <div className='flex flex-col gap-1 text-sm grow'>
                            <label htmlFor="Alternate_phone">Alternate Phone<span className="text-gray-500 text-xs italic"> (Optional)</span></label>
                            <input value={addrData.alternetNum} onChange={(e) => setAddrData(prev => ({ ...prev, alternetNum: e.target.value }))} type="number" id='Alternate_phone' className='rounded-md p-2 border text-gray-500 border-gray-300 outline-none' placeholder='Enter phone number' />
                          </div>
                        </div>
                        <div className='flex gap-2 justify-center flex-wrap flex-col'>
                          <label className='text-sm'>Address Type<span className='text-red-600'>*</span></label>
                          <div className='flex gap-5 text-gray-500 items-center mx-2'>
                            <div className='flex gap-1 text-sm'>
                              <input type='radio' checked={addrData?.adrType === "Home"} name='adrType' id='home' value="Home" onChange={(e) => setAddrData(prev => ({ ...prev, adrType: e.target.value }))} />
                              <label htmlFor="home">Home</label>
                            </div>
                            <div className='flex gap-1 text-sm'>
                              <input type='radio' checked={addrData?.adrType === "Work"} name='adrType' id='work' value="Work" onChange={(e) => setAddrData(prev => ({ ...prev, adrType: e.target.value }))} />
                              <label htmlFor="work">Work</label>
                            </div>
                          </div>
                        </div>
                        <div className='flex gap-4 items-center flex-wrap mt-5'>
                          {!addrLoad ?
                            <button type='submit' className='bg-emerald-600 text-white py-2 px-6 rounded-md'>Save</button> :
                            <div className='bg-emerald-600 py-2 rounded-md px-7'>
                              <Loader2 height={6} width={6} />
                            </div>}
                          <button type='button' disabled={addrLoad} onClick={() => setNewAddr(false)} className='bg-emerald-600 text-white py-2 px-6 rounded-md'>Cancel</button>
                        </div>
                      </div>
                    </form>
                  </div>}
                  {user?.address?.map(ele =>
                    ele?._id !== edit ?
                      <div key={ele?._id} className="bg-white rounded-2xl p-3 sm:p-6 border-2 border-gray-300 border-dashed">
                        <div className="flex gap-4 items-start flex-col">
                          <div className="space-y-4 w-full">
                            <div className="flex items-center gap-3 flex-wrap">
                              <div className='flex items-center gap-2 justify-between w-full'>
                                <h4 className="text-lg font-semibold text-gray-900 flex justify-center items-center gap-2">
                                  {ele?.name}
                                  {ele?.adrType && <Badge className={"bg-emerald-600"}>{ele?.adrType}</Badge>}
                                </h4>
                                <DropdownMenu>
                                  <DropdownMenuTrigger asChild>
                                    <button className='text-gray-500 text-sm px-1 rounded-md cursor-pointer'><Ellipsis height={18} width={18}/></button>
                                  </DropdownMenuTrigger>
                                  <DropdownMenuContent>
                                    <DropdownMenuItem onClick={() => {
                                      setEdit(ele?._id)
                                      setNewAddr(false)
                                      setAddrData({
                                        ...ele,
                                        phone: ele?.phone?.[0] || "",
                                        alternetNum: ele?.phone?.[1] || ""
                                      })
                                    }}>Edit</DropdownMenuItem>
                                    <DropdownMenuItem onClick={() => deleteAddress(ele?._id)}>Delete</DropdownMenuItem>
                                  </DropdownMenuContent>
                                </DropdownMenu>
                              </div>                              
                            </div>
                            <p className="text-gray-800">{`${ele?.locality || ""},${ele?.address || ""},${ele?.landmark || ""},${ele?.city || ""},${ele?.state || ""},${ele?.pincode || ""}`?.split(",")?.filter(ele => ele).join(",")}</p>
                            <p className="text-gray-800">Phone: {ele?.phone?.filter(ele => ele)?.join(", ")}</p>
                          </div>
                        </div>
                      </div> :
                      <div key={ele._id} className='bg-white rounded-2xl p-6 border-2 border-gray-300 border-dashed'>
                        <h4 className="text-lg font-semibold text-gray-900">Add a New Address</h4>
                        <form onSubmit={(e) => updateAddress(e, ele?._id)}>
                          <div className='flex flex-col gap-4 my-7'>
                            <div className='flex gap-4 items-center flex-wrap'>
                              <button type='button' onClick={() => console.log("abc")}
                                className='flex justify-center items-center gap-2 bg-emerald-600 py-2 px-2 sm:px-4 text-sm text-white font-semibold rounded-md'>
                                <LocateFixed height={18} width={18} /> Use Current Location
                              </button>
                            </div>
                            <div className='flex gap-4 items-center flex-wrap'>
                              <div className='flex flex-col gap-1 text-sm grow'>
                                <label htmlFor="name">Name<span className='text-red-600'>*</span></label>
                                <input required value={addrData.name} onChange={(e) => setAddrData(prev => ({ ...prev, name: e.target.value }))} type="text" id='name' className='rounded-md p-2 border text-gray-500 border-gray-300 outline-none' placeholder='Enter your Name' />
                              </div>
                              <div className='flex flex-col gap-1 text-sm grow'>
                                <label htmlFor="Phone">Phone<span className='text-red-600'>*</span></label>
                                <input required value={addrData.phone} onChange={(e) => setAddrData(prev => ({ ...prev, phone: e.target.value }))} type="number" id='Phone' className='rounded-md p-2 border text-gray-500 border-gray-300 outline-none' placeholder='Enter your Phone Number' />
                              </div>
                            </div>
                            <div className='flex gap-4 items-center flex-wrap'>
                              <div className='flex flex-col gap-1 text-sm grow'>
                                <label htmlFor="pincode">Pincode<span className='text-red-600'>*</span></label>
                                <input required value={addrData.pincode} onChange={(e) => setAddrData(prev => ({ ...prev, pincode: e.target.value }))} type="text" id='pincode' className='rounded-md p-2 border text-gray-500 border-gray-300 outline-none' placeholder='Enter your Pincode' />
                              </div>
                              <div className='flex flex-col gap-1 text-sm grow'>
                                <label htmlFor="locality">Locality<span className='text-red-600'>*</span></label>
                                <input required value={addrData.locality} onChange={(e) => setAddrData(prev => ({ ...prev, locality: e.target.value }))} type="text" id='locality' className='rounded-md p-2 border text-gray-500 border-gray-300 outline-none' placeholder='Enter your Locality' />
                              </div>
                            </div>
                            <div className='flex gap-4 items-center flex-wrap'>
                              <div className='flex flex-col gap-1 text-sm grow'>
                                <label htmlFor="address">Address<span className='text-red-600'>*</span></label>
                                <textarea value={addrData.address} onChange={(e) => setAddrData(prev => ({ ...prev, address: e.target.value }))} id='address' className='min-h-20 rounded-md p-2 border border-gray-300 outline-none' placeholder='Enter your Address(Area or Street)' />
                              </div>
                            </div>
                            <div className='flex gap-4 items-center flex-wrap'>
                              <div className='flex flex-col gap-1 text-sm grow'>
                                <label htmlFor="city">City/District/Town<span className='text-red-600'>*</span></label>
                                <input required value={addrData.city} onChange={(e) => setAddrData(prev => ({ ...prev, city: e.target.value }))} type="text" id='city' className='rounded-md p-2 border text-gray-500 border-gray-300 outline-none' placeholder='Enter your City/District/Town' />
                              </div>
                              <div className='flex flex-col gap-1 text-sm grow'>
                                <label htmlFor="state">State<span className='text-red-600'>*</span></label>
                                <input required value={addrData.state} onChange={(e) => setAddrData(prev => ({ ...prev, state: e.target.value }))} type="text" id='state' className='rounded-md p-2 border text-gray-500 border-gray-300 outline-none' placeholder='Enter yout State' />
                              </div>
                            </div>
                            <div className='flex gap-4 items-center flex-wrap'>
                              <div className='flex flex-col gap-1 text-sm grow'>
                                <label htmlFor="landmark">Landmark<span className="text-gray-500 text-xs italic"> (Optional)</span></label>
                                <input value={addrData.landmark} onChange={(e) => setAddrData(prev => ({ ...prev, landmark: e.target.value }))} type="text" id='landmark' className='rounded-md p-2 border text-gray-500 border-gray-300 outline-none' placeholder='Enter landmark' />
                              </div>
                              <div className='flex flex-col gap-1 text-sm grow'>
                                <label htmlFor="Alternate_phone">Alternate Phone<span className="text-gray-500 text-xs italic"> (Optional)</span></label>
                                <input value={addrData.alternetNum} onChange={(e) => setAddrData(prev => ({ ...prev, alternetNum: e.target.value }))} type="number" id='Alternate_phone' className='rounded-md p-2 border text-gray-500 border-gray-300 outline-none' placeholder='Enter phone number' />
                              </div>
                            </div>
                            <div className='flex gap-2 justify-center flex-wrap flex-col'>
                              <label className='text-sm'>Address Type<span className='text-red-600'>*</span></label>
                              <div className='flex gap-5 text-gray-500 items-center mx-2'>
                                <div className='flex gap-1 text-sm'>
                                  <input type='radio' checked={addrData?.adrType === "Home"} name='adrType' id='home' value="Home" onChange={(e) => setAddrData(prev => ({ ...prev, adrType: e.target.value }))} />
                                  <label htmlFor="home">Home</label>
                                </div>
                                <div className='flex gap-1 text-sm'>
                                  <input type='radio' checked={addrData?.adrType === "Work"} name='adrType' id='work' value="Work" onChange={(e) => setAddrData(prev => ({ ...prev, adrType: e.target.value }))} />
                                  <label htmlFor="work">Work</label>
                                </div>
                              </div>
                            </div>
                            <div className='flex gap-4 items-center flex-wrap mt-5'>
                              {!addrLoad ?
                                <button className='bg-emerald-600 text-white py-2 px-6 rounded-md'>Save</button> :
                                <div className='bg-emerald-600 py-2 rounded-md px-7'>
                                  <Loader2 height={6} width={6} />
                                </div>}
                              <button type='button' disabled={addrLoad} onClick={() => setEdit("")} className='bg-emerald-600 text-white py-2 px-6 rounded-md'>Cancel</button>
                            </div>
                          </div>
                        </form>
                      </div>)}
                  {(!user?.address || user?.address?.length === 0) && <p className='flex justify-center items-center text-sm text-gray-500'> No Address found</p>}
                </div>
              </div>

              <form onSubmit={updatePassword} className="bg-white rounded-2xl p-6 shadow-sm text-gray-500">
                <h3 className="text-xl font-semibold mb-7 text-black">Change Password</h3>
                <div onSubmit={updatePassword} className="space-y-4 text-sm">
                  <div className='flex flex-col gap-1'>
                    <label className='font-semibold' htmlFor='pass'>Current Password</label>
                    <div className='flex justify-center items-center gap-2'>
                      <input value={changePass?.currPass || ""} onChange={(e) => setChangePass(prev => ({ ...prev, currPass: e.target.value }))} id='pass' className='w-full text-sm p-2 border border-gray-300 rounded-md outline-none' type={eye1 ? "text" : "password"} placeholder="Enter your Current Password" />
                      <button onClick={() => setEye1(prev => !prev)} type='button' className={`${eye1 ? "text-blue-600 bg-blue-50 border-blue-400" : "text-gray-500 border-gray-300"} p-2 border rounded-md`}>{eye1 ? <EyeOff height={18} width={18} /> : <Eye height={18} width={18} />}</button>
                    </div>
                  </div>
                  <div className='flex flex-col gap-1'>
                    <label className='font-semibold' htmlFor='newpass'>New Password</label>
                    <div className='flex justify-center items-center gap-2'>
                      <input value={changePass?.newPass || ""} onChange={(e) => setChangePass(prev => ({ ...prev, newPass: e.target.value }))} id='newpass' className='w-full text-sm p-2 border border-gray-300 rounded-md outline-none' type={eye2 ? "text" : "password"} placeholder="Enter new Password" />
                      <button onClick={() => setEye2(prev => !prev)} type='button' className={`${eye2 ? "text-blue-600 bg-blue-50 border-blue-400" : "text-gray-500 border-gray-300"} p-2 border rounded-md`}>{eye2 ? <EyeOff height={18} width={18} /> : <Eye height={18} width={18} />}</button>
                    </div>
                  </div>
                  <div className='flex flex-col gap-1'>
                    <label className='font-semibold' htmlFor='conpass'>Confirm New Password</label>
                    <div className='flex justify-center items-center gap-2'>
                      <input value={changePass?.confirmPass || ""} onChange={(e) => setChangePass(prev => ({ ...prev, confirmPass: e.target.value }))} id='conpass' className='w-full text-sm p-2 border border-gray-300 rounded-md outline-none' type={eye3 ? "text" : "password"} placeholder="Confirm your Password" />
                      <button onClick={() => setEye3(prev => !prev)} type='button' className={`${eye3 ? "text-blue-600 bg-blue-50 border-blue-400" : "text-gray-500 border-gray-300"} p-2 border rounded-md`}>{eye3 ? <EyeOff height={18} width={18} /> : <Eye height={18} width={18} />}</button>
                    </div>
                  </div>
                </div>
                {!passLoad ?
                  <Button className="mt-7 bg-emerald-600 hover:bg-emerald-700">Update Password</Button> :
                  <div className=' mt-7 bg-emerald-600 p-1.5 rounded-md w-35 flex justify-center items-center'><Loader2 height={6} width={6} /></div>}
              </form>

              <div className="bg-white rounded-2xl p-6 shadow-sm text-gray-500">
                <h3 className="text-xl font-semibold mb-7 text-black">Frequently Asked Questions</h3>
                <Accordion type="single" collapsible className="w-full">
                  <AccordionItem value="item-1">
                    <AccordionTrigger>How do I change my password?</AccordionTrigger>
                    <AccordionContent>
                      Go to the Password tab and enter your current and new password.
                    </AccordionContent>
                  </AccordionItem>
                  <AccordionItem value="item-2">
                    <AccordionTrigger>Can I change my email address?</AccordionTrigger>
                    <AccordionContent>
                      Yes, go to Account Settings and update your email.
                    </AccordionContent>
                  </AccordionItem>
                  <AccordionItem value="item-3">
                    <AccordionTrigger>How to delete my account?</AccordionTrigger>
                    <AccordionContent>
                      Scroll to the Danger Zone and click "Delete Account".
                    </AccordionContent>
                  </AccordionItem>
                  <AccordionItem value="item-4">
                    <AccordionTrigger>What happens to my existing account when I update my email address (or mobile number)?</AccordionTrigger>
                    <AccordionContent>
                      Updating your email address (or mobile number) doesn't invalidate your account. Your account remains fully functional. You'll continue seeing your Order history, saved information and personal details.
                    </AccordionContent>
                  </AccordionItem>
                </Accordion>
              </div>

              <div className="bg-white rounded-2xl p-6 shadow-sm border border-red-200">
                <h3 className="text-xl font-semibold text-red-600 mb-7">Danger Zone</h3>
                <div className="flex flex-col md:flex-row items-start md:items-center justify-between">
                  <div className='px-2'>
                    <p className="font-medium">Delete Your Account</p>
                    <p className="text-sm text-muted-foreground">
                      Deleting your account is irreversible. Please proceed with caution.
                    </p>
                  </div>
                  <Button variant="destructive" className="mt-4 md:mt-0">
                    <Trash2 className="mr-2 h-4 w-4" /> Delete Account
                  </Button>
                </div>
              </div>
            </div>
          </ScrollArea>
        </div>
      </div>
    </div>
  )
}

export default Profile

