import React, { useCallback, useEffect, useState } from 'react'
import photo from "../../assets/product/1209452_6-paper-boat-aamras-mango-fruit-juice.webp"
import { ArrowLeft, ChevronsRight, ArrowRight, ChevronDown, Heart, Share, ShieldCheck, ShoppingBasket, Star, Truck, Wallet, Minus, Plus } from 'lucide-react'
import { Badge } from '@/components/ui/badge'
import { useDispatch, useSelector } from 'react-redux'
import ProductCart2 from '@/components/Common/ProductCart2';
import HorizontalCarousel from '@/components/Common/HorizontalCarousel';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip"
import { Button } from '@/components/ui/button';
import getHandler from '@/Services/Get.service'
import { useLocation, useNavigate, useParams } from 'react-router-dom'
import { decrement, increment } from '@/Store/addToCartSlice'
import toast from 'react-hot-toast'
import Loader3 from '@/components/Common/Loader3'
import { wishListManage } from '@/Store/wishListSlice'


function ProductDetails() {
  const [featuredProductData, setFeaturedProductData] = useState([])
  const [iconRotate, setIconRotate] = useState(false)
  const [productData, setProductData] = useState({})
  const [viewImage, setViewImage] = useState("")
  const { productID } = useParams()
  const navigate = useNavigate()
  const dispatch = useDispatch()
  const location = useLocation()
  const user = useSelector(state => state.auth)
  const wishListProduct = useSelector(state =>
    state.wishList?.wishListItem?.find(item =>
      item?._id === productData._id
    ))
  const [loading, setloading] = useState(true)
  const [loadImage, setLoadImage] = useState(true)
  const [imageCount, setImageCount] = useState(0)
  const [allImages, setAllImages] = useState([])

  const fetchProductData = async () => {
    setloading(true)
    setLoadImage(true)
    setImageCount(0)
    await getHandler(`${import.meta.env.VITE_BACKEND_URL}/api/product/get-product/${productID}`)
      .then(res => {
        setProductData(res.data)
        setViewImage(res.data?.avatar)
        setAllImages([res.data?.avatar, ...(res.data?.otherImages || [])])
      })
      .catch(err => {
        toast.error(err?.response?.data?.message || "Something went wrong")
      })
      .finally(() => {
        setloading(false)
      })
  }

  useEffect(() => {
    fetchProductData()
  }, [location.pathname])

  const addToCartProductDetails = useSelector(state =>
    state.addToCart?.cartItems?.find(item =>
      item.productData?._id === productID
    )
  );

  const imageChangeHandler = (img, action = "Next") => {
    let index = allImages.indexOf(img)
    if (allImages.length == 1) {
      toast.error("No other images available")
      return;
    }
    if (action == 'Next') {
      if (index == allImages?.length - 1) index = -1;
      setViewImage(allImages[index + 1])
    } else if (action == 'Prev') {
      if (index == 0) index = allImages?.length;
      setViewImage(allImages[index - 1])
    } else {
      setViewImage(img)
      toast.error("something went wrong")
    }
  }

  const fetchAllData = useCallback(async () => {
    await getHandler(`${import.meta.env.VITE_BACKEND_URL}/api/feature/get-featured-product/home`)
      .then(res => {
        setFeaturedProductData(res.data);
      })
      .catch(error => {
        toast.error(error?.response?.data?.message || "failed to load some data");
      })
  }, []);

  useEffect(() => {
    if (imageCount >= allImages?.length && productData?.avatar) {
      setLoadImage(false);
    }
  }, [imageCount, productData]);

  useEffect(() => {
    fetchAllData()
  }, [])

  return (
    <>
      {(loading || loadImage) && <Loader3 />}
      <div className={`${(loadImage || loading) ? "opacity-0" : "opacity-100"} transition-opacity duration-500 `}>
        <div className={`flex flex-wrap lg:p-8 md:p-5 sm:p-2 pb-0 bg-white`}>
          <div className='flex flex-col p-2 w-full md:w-3/7 min-w-[100px] gap-3'>
            <div className='flex w-full'>
              <div className='flex flex-col items-center justify-center w-full gap-10 bg-gray-100 rounded-md p-7 border'>
                <img src={viewImage} onLoad={() => setImageCount(prev => prev + 1)} className='aspect-square w-full object-contain drop-shadow-2xl' />
              </div>
              <div className='grow p-2 flex flex-col justify-between items-center'>
                <div className='flex flex-col gap-5 items-center'>
                  <button
                    onClick={() => {
                      navigator.clipboard.writeText(window.location.href);
                      toast.success("Link copied to clipboard");
                    }}
                    className='p-2 group bg-blue-100 text-blue-700 cursor-pointer rounded-md'>
                      <Share size={20} className='group-active:animate-big-small' />
                    </button>
                  <button
                    onClick={(e) => {
                      if (!user.isAuthenticate) {
                        toast.error("Sign in to save this to your wishlist.")
                        return;
                      }
                      e.stopPropagation();
                      dispatch(wishListManage(productData))
                    }}

                    className={`p-2 ${wishListProduct ? "bg-pink-100" : "bg-blue-100"} text-blue-700 cursor-pointer rounded-md`}>
                    <Heart
                      size={20}
                      className={`transition-all duration-500
                          ${wishListProduct ? "fill-pink-500 animate-big-small text-pink-600" : ""}`}
                    />
                  </button>
                </div>
                <div className='flex flex-col gap-5 items-center'>
                  <button
                    onClick={() => imageChangeHandler(viewImage, "Next")}
                    className='p-2 transition-all group bg-blue-100 duration-500 text-blue-700 cursor-pointer rounded-md'>
                    <ArrowRight size={20} className='group-active:animate-frd-animation' />
                  </button>
                  <button
                    onClick={() => imageChangeHandler(viewImage, "Prev")}
                    className='p-2 group bg-blue-100 transition-all duration-200 text-blue-700 cursor-pointer rounded-md'>
                    <ArrowLeft size={20} className='group-active:animate-bkd-animation' />
                  </button>
                </div>
              </div>
            </div>
            {productData?.otherImages?.length > 0 &&
              <div className='flex gap-1 sm:gap-2 md:gap-3 lg:gap-4 py-2 px-3 sm:px-7 bg-gray-100 border rounded-md md:px-0 w-full'>
                <HorizontalCarousel>
                  {allImages.map((img) =>
                    <div key={img} onClick={() => setViewImage(img)} className='max-h-28 max-w-28 flex-none'>
                      <img loading='lazy' onLoad={() => setImageCount(prev => prev + 1)} src={img} alt="" className='p-1 drop-shadow-md rounded-md' />
                    </div>
                  )}
                </HorizontalCarousel>
              </div>}
            <div className="py-5 text-sm text-gray-600">
              <p className="mt-6 text-xs text-gray-500 leading-relaxed">
                <strong>Disclaimer:</strong> Every effort is made to maintain accuracy of all information. However, actual product packaging and materials may contain more and/or different information. The color of the product displayed in the image may differ from that received in the order. It is recommended not to solely rely on the details presented.
              </p>
            </div>
            <div onClick={() => setIconRotate(!iconRotate)} className='select-none mb-2 cursor-pointer flex gap-1 text-sm text-indigo-600 font-semibold justify-center'>View {iconRotate ? "Less" : "More"}
              <ChevronDown className={`relative top-0.5 duration-300 ${iconRotate ? "rotate-180" : "rotate-0"}`} size={20} />
            </div>
            {iconRotate &&
              <div className='flex flex-col gap-3'>
                {productData?.details &&
                  <div className='flex gap-1 text-sm flex-col text-gray-500 justify-center px-5'>
                    <p className='text-base font-semibold text-black whitespace-nowrap'>Key Features:</p>
                    <p>{productData?.details || "No Data"}</p>
                  </div>}
                {productData?.ingredients &&
                  <div className='flex gap-1 text-sm flex-col text-gray-500 justify-center px-5'>
                    <p className='text-base font-semibold text-black'>Ingredients:</p>
                    <p>{productData?.ingredients || "No Data"}</p>
                  </div>}
                {productData?.brand &&
                  <div className='flex gap-1 text-sm flex-col text-gray-500 justify-center px-5'>
                    <p className='text-base font-semibold text-black'>Brand:</p>{productData?.brand?.replace(/\b\w/g, char => char.toUpperCase()) || "No Data"}
                  </div>}
                {productData?.countryOfOrigin &&
                  <div className='flex gap-1 text-sm flex-col text-gray-500 justify-center px-5'>
                    <p className='text-base font-semibold text-black'>Country of Origin:</p>{productData?.countryOfOrigin || "No Data"}
                  </div>}
                {productData?.size &&
                  <div className='flex gap-1 text-sm flex-col text-gray-500 justify-center px-5'>
                    <p className='text-base font-semibold text-black'>Size:</p>{productData?.size || "No Data"}
                  </div>}
                {productData?.shelfLife &&
                  <div className='flex gap-1 text-sm flex-col text-gray-500 justify-center px-5'>
                    <p className='text-base font-semibold text-black'>Shelf Life:</p>{productData?.shelfLife || "No Data"}
                  </div>}
                {productData?.expiryDate &&
                  <div className='flex gap-1 text-sm flex-col text-gray-500 justify-center px-5'>
                    <p className='text-base font-semibold text-black'>Expiry Date:</p>{new Date(productData?.expiryDate)?.toLocaleDateString() || "No Data"}
                  </div>}
                {productData?.manufacturingDate &&
                  <div className='flex gap-1 text-sm flex-col text-gray-500 justify-center px-5'>
                    <p className='text-base font-semibold text-black'>Manufacturing Date:</p>{new Date(productData?.manufacturingDate)?.toLocaleDateString() || "No Data"}
                  </div>}
              </div>}

          </div>

          <div className='p-5 py-2 w-full md:w-4/7'>
            <p className='text-sm'><span className='text-green-600 font-semibold text-lg'>Green Basket</span> — Your Everyday Needs at Your Doorstep.</p>
            <div className='flex flex-col gap-5 py-5'>
              <h1 className='text-4xl font-extrabold'>{productData?.name?.replace(/\b\w/g, char => char.toUpperCase())}</h1>
              <div className='flex items-center justify-between gap-5 flex-wrap border-b-2 border-dashed border-gray-300 pb-2'>
                <div className="flex items-center gap-3">
                  <p className="font-medium">Price:</p>
                  {productData?.finalPrice !== productData?.price ?
                    <p className="line-through text-gray-500 text-lg">{productData?.price || "No Data"}</p>
                    : ""}
                  <p className="text-2xl font-bold text-orange-600">{productData?.finalPrice || "No Data"}</p>
                  {productData?.discount !== 0 &&
                    <Badge className={"bg-blue-500"}>{productData?.discount}% Off</Badge>}
                </div>
                <div className="flex items-center gap-2">
                  <p className="font-medium text-gray-400">1580 Sold</p>
                  <div className='h-2 w-2 rounded-full bg-gray-300'></div>
                  <div className="flex items-center gap-1 text-yellow-500">
                    <Star size={20} fill="currentColor" />
                    <span className="text-xl text-gray-600 font-bold">4.5</span>
                  </div>
                </div>
              </div>
            </div>
            <div className='flex flex-col gap-5'>
              {productData?.description &&
                <div className='flex flex-col gap-1 px-5 mb-5'>
                  <p className='text-lg font-semibold'>Description:</p>
                  <p className='text-gray-500'>{productData?.description || "No Data"}</p>
                </div>}
              {productData?.color &&
                <div className='flex text-black text-lg items-center font-semibold gap-2 px-5'>
                  <p className='text-base font-semibold text-gray-400'>Color:</p>{productData?.color || "No Data"}
                </div>}
              {productData?.weight &&
                <div className='flex text-black text-lg items-center font-semibold gap-2 px-5'>
                  <p className='text-base font-semibold text-gray-400'>Weight:</p>{productData?.weight || "No Data"}
                </div>}
              {productData?.size &&
                <div className='flex text-black text-lg items-center font-semibold gap-2 px-5'>
                  <p className='text-base font-semibold text-gray-400'>Size:</p>{productData?.size || "No Data"}
                </div>}
            </div>
            <div className="flex flex-col gap-2">
              <div className='flex items-center justify-end flex-wrap gap-5 p-5'>
                {
                  !addToCartProductDetails?.quantity ?
                    <button onClick={() => {
                      if (!user.isAuthenticate) {
                        toast.error("Sign in to add this product to your cart")
                        return;
                      }
                      dispatch(increment(productData))
                    }
                    } className={`text-sm w-[150px] py-2 cursor-pointer ${productData?.quantity === 0 ? "" : "hover:bg-green-700"} shadow-md ${productData?.quantity === 0 ? "bg-gray-400" : "bg-green-600"} rounded-md text-white font-semibold`}>{productData?.quantity === 0 ? "Out of Stock" : "Add to Cart"}</button> :
                    <>
                      {productData?.quantity === 0 ?
                        <button onClick={() => {
                          if (!user.isAuthenticate) {
                            toast.error("Sign in to add this product to your cart")
                            return;
                          }
                          dispatch(increment(productData))
                        }
                        } className={`text-sm w-[150px] py-2 cursor-pointer  shadow-md bg-gray-400 rounded-md text-white font-semibold`}>Out of Stock</button> :
                        <div className={`w-[150px] text-sm select-none font-semibold ${addToCartProductDetails?.quantity <= productData?.quantity ? "bg-green-100" : "bg-gray-200"} text-green-700 p-2 rounded-md flex items-center justify-between`}>
                          <button className='cursor-pointer px-2' onClick={() => dispatch(decrement(productData))}><Minus size={18} /></button>
                          {addToCartProductDetails?.quantity}
                          <button className='cursor-pointer px-2' onClick={() => dispatch(increment(productData))}><Plus size={18} /></button>
                        </div>
                      }
                    </>
                }
              </div>
              <div className="border-2 border-gray-300 border-dashed rounded-xl bg-white p-6 mt-5">
                <h2 className="text-lg sm:text-xl font-bold text-gray-800 mb-7">
                  Why Shop From <span className="text-green-600">Green Basket</span>?
                </h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm text-gray-700">
                  <div className="flex items-start gap-3">
                    <ShoppingBasket className="text-green-600 w-6 h-6" />
                    <div>
                      <p className="font-semibold">Fresh & Local</p>
                      <p>Daily-sourced groceries from trusted vendors.</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <Truck className="text-orange-500 w-6 h-6" />
                    <div>
                      <p className="font-semibold">Instant Delivery</p>
                      <p>Groceries at your doorstep in minutes.</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <Wallet className="text-blue-600 w-6 h-6" />
                    <div>
                      <p className="font-semibold">Secure Payments</p>
                      <p>Multiple options including UPI & COD.</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <ShieldCheck className="text-yellow-500 w-6 h-6" />
                    <div>
                      <p className="font-semibold">Trusted Service</p>
                      <p>Safe, reliable shopping every time.</p>
                    </div>
                  </div>
                </div>
                <div className="mt-8 border-t pt-6 text-sm text-gray-600">
                  <h3 className="font-semibold text-gray-800 text-base mb-3">Our Commitments</h3>
                  <ul className="list-disc list-inside space-y-2">
                    <li>
                      <span className="font-medium">100% Authentic Products:</span> We ensure every item you receive is genuine and quality-checked.
                    </li>
                    <li>
                      <span className="font-medium">Easy Return Policy:</span> Not happy with a product? Request a return or refund within 24 hours of delivery.
                    </li>
                    <li>
                      <span className="font-medium">Transparent Pricing:</span> No hidden charges — what you see is what you pay.
                    </li>
                    <li>
                      <span className="font-medium">Data Privacy:</span> Your personal information is encrypted and never shared.
                    </li>
                    <li>
                      <span className="font-medium">Eco-Friendly Packaging:</span> We use sustainable packaging wherever possible.
                    </li>
                  </ul>
                </div>
                <p className="mt-6 text-xs text-gray-500 leading-relaxed">
                  <strong>Disclaimer:</strong> Product availability, pricing, and delivery times may vary depending on your delivery location and local vendor inventory. While we strive for accuracy, minor differences in packaging or product description may occur due to supplier changes. Green Basket reserves the right to update policies and terms without prior notice.
                </p>
              </div>
            </div>
          </div>

        </div>

        {productData?.productVarient?.length > 0 && <div className="bg-white p-5">
          <h2 className="text-lg sm:text-xl font-semibold text-gray-800 mb-4">Available Variants</h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {productData.productVarient?.map((item, i) => (
              <div
                onClick={() => navigate(`/shop/product-details/${item?._id}`)}
                key={item?._id}
                className="flex gap-4 p-3 border border-gray-300 duration-300 rounded-lg hover:border-green-600 group hover:bg-green-50 transition-all cursor-pointer"
              >
                <div className="w-25 h-25 bg-gray-100 p-2 border group-hover:border-green-600 border-gray-300 rounded-md flex items-center justify-center">
                  <img
                    src={item?.avatar}
                    alt="Variant"
                    className="drop-shadow-md object-contain w-full h-full transition-transform duration-200 group-hover:scale-105"
                  />
                </div>
                <div className="flex flex-col justify-between flex-grow">
                  <h3 className="font-medium text-gray-800 text-base">{item?.name?.replace(/\b\w/g, char => char.toUpperCase())}</h3>
                  {(item?.size || item?.weight) && <p className="text-sm text-gray-500">{item.size ? `Size: ${item?.size}` : ""} {item.weight ? `Weight: ${item?.weight}` : ""}</p>}
                  <div className="flex justify-between items-end">
                    <div className="flex items-center gap-2">
                      { item?.finalPrice !== item?.price && <p className="text-gray-400 text-sm line-through">₹{item?.price}</p>}
                      <p className="text-orange-600 text-lg font-semibold">₹{item?.finalPrice}</p>
                    </div>
                    {item?.discount !== 0 && <span className="bg-green-600 text-white text-xs px-2 py-0.5 rounded-full font-semibold">{item?.discount}% OFF</span>}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>}

        <div className='flex flex-col md:gap-3 lg:gap-4 gap-5 px-5 py-7 bg-white'>
          <div className='flex items-center justify-between flex-wrap'>
            <p className="text-3xl font-semibold">Featured Products</p>
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button onClick={() => navigate(`/shop/lists/featured`)} variant="outline"><ChevronsRight /></Button>
                </TooltipTrigger>
                <TooltipContent>
                  <p>See All</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </div>
          <HorizontalCarousel>
            {featuredProductData?.productDetails?.map(item =>
              productID !== item._id &&
              <div key={item._id} onDoubleClick={(e) => e.preventDefault()} className="flex-none w-[200px] sm:w-[220px] md:w-[240px] lg:w-[260px] h-[350px] md:h-[400px]">
                <ProductCart2 productData={item} />
              </div>
            )}
          </HorizontalCarousel>
        </div>

        <div className='flex flex-col md:gap-3 lg:gap-4 gap-5 px-5 py-7 bg-white'>
          <div className='flex items-center justify-between flex-wrap'>
            <p className="text-3xl font-semibold">Related Products</p>
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button onClick={() => navigate(`/shop/lists/featured`)} variant="outline"><ChevronsRight /></Button>
                </TooltipTrigger>
                <TooltipContent>
                  <p>See All</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </div>
          <HorizontalCarousel>
            {productData?.relatedProducts?.map(item =>
              productID !== item._id &&
              <div key={item._id} onDoubleClick={(e) => e.preventDefault()} className="flex-none w-[200px] sm:w-[220px] md:w-[240px] lg:w-[260px] h-[350px] md:h-[400px]">
                <ProductCart2 productData={item} />
              </div>
            )}
          </HorizontalCarousel>
        </div>

      </div>
    </>
  )
}

export default ProductDetails
