import React, { useEffect, useRef, useState } from 'react'
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion"
import { SlidersHorizontal, Star, Tag } from 'lucide-react'
import { Slider } from '@/components/ui/slider';
import getHandler from '@/Services/Get.service';
import toast from 'react-hot-toast';
import ProductCart2 from '@/components/Common/ProductCart2';
import { useInView } from 'react-intersection-observer';
import Loader2 from '@/components/Common/Loader2';
import { useParams } from 'react-router-dom';

const categories = [
  {
    id: "1",
    name: "Atta, Dal & Rice",
    subcategories: [
      { id: "1-1", name: "Wheat Flour" },
      { id: "1-2", name: "Basmati Rice" },
      { id: "1-3", name: "Non-Basmati Rice" },
      { id: "1-4", name: "Chana Dal" },
      { id: "1-5", name: "Moong Dal" },
      { id: "1-6", name: "Toor Dal" }
    ]
  },
  {
    id: "2",
    name: "Snacks & Munchies",
    subcategories: [
      { id: "2-1", name: "Chips" },
      { id: "2-2", name: "Namkeen" },
      { id: "2-3", name: "Cookies" },
      { id: "2-4", name: "Popcorn" },
      { id: "2-5", name: "Crackers" },
      { id: "2-6", name: "Snack Bars" }
    ]
  },
  {
    id: "3",
    name: "Dairy, Bread & Eggs",
    subcategories: [
      { id: "3-1", name: "Milk" },
      { id: "3-2", name: "Curd" },
      { id: "3-3", name: "Paneer" },
      { id: "3-4", name: "Butter" },
      { id: "3-5", name: "Brown Bread" },
      { id: "3-6", name: "White Bread" },
      { id: "3-7", name: "Eggs" }
    ]
  },
  {
    id: "4",
    name: "Ice Creams & Chocolates",
    subcategories: [
      { id: "4-1", name: "Ice Cream Tubs" },
      { id: "4-2", name: "Chocobars" },
      { id: "4-3", name: "Dark Chocolate" },
      { id: "4-4", name: "Milk Chocolate" },
      { id: "4-5", name: "Gift Boxes" }
    ]
  },
  {
    id: "5",
    name: "Fruits & Vegetables",
    subcategories: [
      { id: "5-1", name: "Fresh Fruits" },
      { id: "5-2", name: "Fresh Vegetables" },
      { id: "5-3", name: "Leafy Greens" },
      { id: "5-4", name: "Exotic Fruits" },
      { id: "5-5", name: "Organic Veggies" }
    ]
  },
  {
    id: "6",
    name: "Beverages",
    subcategories: [
      { id: "6-1", name: "Soft Drinks" },
      { id: "6-2", name: "Fruit Juices" },
      { id: "6-3", name: "Energy Drinks" },
      { id: "6-4", name: "Tea" },
      { id: "6-5", name: "Coffee" },
      { id: "6-6", name: "Bottled Water" }
    ]
  },
  {
    id: "7",
    name: "Personal Care",
    subcategories: [
      { id: "7-1", name: "Soaps" },
      { id: "7-2", name: "Shampoos" },
      { id: "7-3", name: "Toothpaste" },
      { id: "7-4", name: "Deodorants" },
      { id: "7-5", name: "Hair Oils" },
      { id: "7-6", name: "Sanitary Products" }
    ]
  },
  {
    id: "8",
    name: "Cleaning Essentials",
    subcategories: [
      { id: "8-1", name: "Detergents" },
      { id: "8-2", name: "Floor Cleaners" },
      { id: "8-3", name: "Toilet Cleaners" },
      { id: "8-4", name: "Dishwashing Liquids" },
      { id: "8-5", name: "Sponges & Scrubs" }
    ]
  },
  {
    id: "9",
    name: "Breakfast & Instant Food",
    subcategories: [
      { id: "9-1", name: "Cereals" },
      { id: "9-2", name: "Oats" },
      { id: "9-3", name: "Instant Noodles" },
      { id: "9-4", name: "Poha" },
      { id: "9-5", name: "Upma Mix" },
      { id: "9-6", name: "Pasta" }
    ]
  },
  {
    id: "10",
    name: "Baby Care",
    subcategories: [
      { id: "10-1", name: "Diapers" },
      { id: "10-2", name: "Baby Wipes" },
      { id: "10-3", name: "Baby Food" },
      { id: "10-4", name: "Baby Lotion" },
      { id: "10-5", name: "Powder & Cream" }
    ]
  }
];

const discount = [10, 20, 30, 40, 50]
const rating = [4, 3, 2, 1]


function Lists() {
  const [data, setData] = useState({});
  const [page, setPage] = useState(1)
  const [loading, setLoading] = useState(false)
  const { ref, inView } = useInView({ threshold: 1, })
  const { categoryID } = useParams();


  const fetchData = async (url) => {
    setLoading(true);
    await getHandler(url)
      .then((res) => {
        setData(prev => (
          {
            isEnd: res.data?.isEnd,
            productDetails: [
              ...(prev?.productDetails || []),
              ...(res.data?.productDetails || [])
            ]
          }
        ))
      })
      .catch((err) => {
        toast.error(err.response?.data?.message || "Data fetch failed.Refresh and Try Again")
      })
      .finally(() => {
        setLoading(false)
      })
  }

  useEffect(() => {
    if (inView && !loading && !data.isEnd) {
      setPage(prev => prev + 1);
    }
  }, [inView]);

  useEffect(() => {
    if (!data.isEnd) {
      if (categoryID === "all") {
        fetchData(`${import.meta.env.VITE_BACKEND_URL}/api/product/get-product/page/limit?page=${page}&limit=9`);
      } else if (categoryID == 'featured') {
        fetchData(`${import.meta.env.VITE_BACKEND_URL}/api/feature/get-featured-product/home?page=${page}&limit=9`)
      } else {
        fetchData(`${import.meta.env.VITE_BACKEND_URL}/api/category/get-product/category/${categoryID}?page=${page}&limit=9`)
      }
    }
  }, [page])

  return (
    <div className='flex gap-3 m-3'>
      <div className='bg-white w-[300px] hidden md:block lg:block max-h-[1300px] p-5 rounded-md'>
        <h1 className='text-xl  font-bold border-b py-3 border-gray-300 flex gap-2 items-center'><SlidersHorizontal size={18} />Filters</h1>
        <Accordion
          type="multiple"
          className="w-full px-2"
          defaultValue={["item-1"]}
        >
          <AccordionItem value="item-1">
            <AccordionTrigger className='text-sm text-gray-600'>CATEGORY</AccordionTrigger>
            <AccordionContent className="flex flex-col gap-4 text-balance">
              <div className='max-h-[410px] overflow-scroll border-l-3 border-amber-400'>
                {categories.map(item =>
                  <div key={item.id}>
                    <div className='px-2 text-slate-400 font-medium mt-5 mb-1'>{item.name}</div>
                    {item.subcategories.map(sub =>
                      <label htmlFor={sub.id} key={sub.id} className='cursor-pointer px-4 py-1 rounded-tr-md rounded-br-md hover:bg-amber-100 hover:text-slate-700 text-gray-400 flex gap-2 items-center'>
                        <input className='accent-amber-500' type="checkbox" id={sub.id} />
                        <span >{sub.name}</span>
                      </label>
                    )}
                  </div>
                )}
              </div>
            </AccordionContent>
          </AccordionItem>
          <AccordionItem value="item-2">
            <AccordionTrigger className='text-sm text-gray-600'>CUSTOMER RATING</AccordionTrigger>
            <AccordionContent className="flex flex-col gap-4 text-balance">
              <div className='border-amber-400 border-l-3 '>
                {rating.map((item, index) => (
                  <label key={index} className='cursor-pointer px-4 py-1 rounded-tr-md rounded-br-md hover:bg-amber-100 hover:text-slate-700 text-gray-400 flex gap-2 items-center' htmlFor={discount + item.toString()}>
                    <input className='accent-amber-500' type='checkbox' id={"discount" + item.toString()} />
                    {item}<Star className='fill-amber-500 text-amber-500' strokeWidth={1} size={16} /> & more
                  </label>
                ))}
              </div>
            </AccordionContent>
          </AccordionItem>
          <AccordionItem value="item-3">
            <AccordionTrigger className='text-sm text-gray-600'>AVAILABILITY</AccordionTrigger>
            <AccordionContent className="flex flex-col gap-4 text-balance">
              <label htmlFor="availability" className='border-amber-400 border-l-3 cursor-pointer px-4 py-1 rounded-tr-md rounded-br-md hover:bg-amber-100 hover:text-slate-700 text-gray-400 flex gap-2 items-center'>
                <input className='accent-amber-500' type="checkbox" id="availability" />
                <span >Include Out of Stock</span>
              </label>
            </AccordionContent>
          </AccordionItem>
          <AccordionItem value="item-4">
            <AccordionTrigger className='text-sm text-gray-600'>PRICE</AccordionTrigger>
            <AccordionContent className="flex flex-col gap-4 text-balance">
              <div className="p-5 pb-4 border-l-3 border-amber-400 bg-white w-full">
                <Slider
                  rangeColor="bg-amber-500"
                  defaultValue={[100, 1500]}
                  max={2000}
                  step={100}
                  className="w-full"
                />
              </div>

            </AccordionContent>
          </AccordionItem>
          <AccordionItem value="item-5">
            <AccordionTrigger className='text-sm text-gray-600'>DISCOUNT</AccordionTrigger>
            <AccordionContent className="flex flex-col gap-4 text-balance">
              <div className='border-amber-400 border-l-3 '>
                {discount.map((item, index) => (
                  <label key={index} className='cursor-pointer px-4 py-1 rounded-tr-md rounded-br-md hover:bg-amber-100 hover:text-slate-700 text-gray-400 flex gap-2 items-center' htmlFor={discount + item.toString()}>
                    <input className='accent-amber-500' type='checkbox' id={"discount" + item.toString()} />
                    <span>{item}% & more</span>
                  </label>
                ))}
              </div>
            </AccordionContent>
          </AccordionItem>
        </Accordion>


      </div>
      <div className="bg-white w-full p-4 rounded-md ">
        <div className='grid gap-5 grid-cols-[repeat(auto-fit,minmax(230px,1fr))]'>
          {data.productDetails?.map((item, index) => (
            data.productDetails.length - 1 === index ?
              <div ref={ref} key={item._id} className='max-w-[500px] sm:max-w-[350px]'><ProductCart2 productData={item} /></div> :
              <div key={item._id} className='max-w-[500px] sm:max-w-[350px]'><ProductCart2 productData={item} /></div>
          ))}
        </div>
        {loading ?
          <div className='flex justify-center items-center w-full p-4'>
            <Loader2 />
          </div>
          : ""}
      </div>

    </div >
  )
}

export default Lists
