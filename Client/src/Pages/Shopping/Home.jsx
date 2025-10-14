import React, { useEffect, useState } from 'react'
import useEmblaCarousel from 'embla-carousel-react'
import Autoplay from 'embla-carousel-autoplay'
import ProductCart2 from '@/components/Common/ProductCart2';
import HorizontalCarousel from '@/components/Common/HorizontalCarousel';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip"
import { Button } from '@/components/ui/button';
import { ChevronsRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { getAllData } from '@/Store/homeDataSlice';
import { Badge } from '@/components/ui/badge';
import Loader3 from '@/components/Common/Loader3';

const highlightText = (text) => {
  if (!text) return '';
  return text.replace(/<([^>]+)>/g, `<span class="text-[#00cd5c]">$1</span>`);
};

function capitalize(str) {
  if (!str) return "";
  return str
    .toLowerCase()
    .split(" ")
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");
}

function Home() {
  const [loading, setLoading] = useState(true); // 👈 Loader state
  const [emblaRef] = useEmblaCarousel({ loop: true }, [Autoplay({ stopOnInteraction: false })])
  const { data, category, featuredProductData } = useSelector(state => state.homeData)
  const navigate = useNavigate();
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(getAllData());
  }, [dispatch]);

  // 👇 Loader effect: wait for full page load (images included)
  useEffect(() => {
    const handlePageLoad = () => {
      setTimeout(() => setLoading(false), 300); // small delay for smoothness
    };

    if (document.readyState === "complete") {
      handlePageLoad();
    } else {
      window.addEventListener("load", handlePageLoad);
      return () => window.removeEventListener("load", handlePageLoad);
    }
  }, []);

  return (
    <div className="relative">
      {/* 🔸 Fullscreen Loader */}
      {loading && <Loader3/>}

      {/* 🔸 Actual Home Content */}
      <div className={`${loading ? "opacity-0" : "opacity-100"} transition-opacity duration-500`}>
        <div className='mb-15'>

          {/* 🟢 Banner Carousel */}
          <div className="overflow-hidden" ref={emblaRef}>
            <div className="flex gap-2">
              {data?.banner?.map((item, index) =>
                <div key={`${item}-${index}`} className="flex-none w-full p-2 sm:p-3 md:p-4 lg:p-5" >
                  <div className="relative w-full h-[200px] sm:h-[300px] md:h-[400px] lg:h-[585px] overflow-hidden rounded-md">
                    <img
                      src={item}
                      alt={`loading${index}...`}
                      className="absolute inset-0 w-full h-full object-cover rounded-md transition-all duration-300"
                    />
                    <div className="absolute inset-0 rounded-md bg-gradient-to-r from-gray-500/20 via-gray-500/10 to-transparent" />
                    <div className="absolute inset-0 w-2/3 sm:w-1/2 flex flex-col justify-center item-start pl-4 sm:pl-8 md:pl-12 lg:p-16">
                      <h2 className="text-base sm:text-2xl md:text-4xl lg:text-[3.25rem] font-bold text-[#083C5A] lg:leading-16"
                        dangerouslySetInnerHTML={{
                          __html: highlightText(data.title[index]),
                        }}
                      />
                      <p className="mt-1 sm:mt-4 w-2/3 text-xs sm:text-sm md:text-ms lg:text-lg text-gray-600">{data.tagline[index]}</p>
                      <button
                        onClick={() => navigate('/shop/lists/all')}
                        className="bg-green-950 text-white text-xs sm:text-sm px-4 sm:px-6 py-1 sm:py-2 mt-2 md:mt-5 rounded-sm md:rounded-md w-fit"
                      >
                        Shop Now
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* 🟡 Categories */}
          <div className='flex flex-col md:gap-3 lg:gap-4 gap-5 mt-10 px-4 sm:px-6 md:px-8 lg:px-12'>
            <p className="text-3xl font-semibold">Categories</p>
            <div className='grid sm:grid-cols-[repeat(auto-fill,minmax(130px,1fr))] grid-cols-4 gap-3' >
              {category?.map(item =>
                <div onClick={() => navigate(`/shop/lists/${item._id}`)} key={item._id} className='p-3 rounded-md bg-white cursor-pointer'>
                  <img src={item.image} className='rounded-md' />
                  <p className='text-xs sm:text-sm font-semibold py-2 md:py-3 overflow-hidden text-center'>{capitalize(item.name)}</p>
                </div>
              )}
            </div>
          </div>

          {/* 🟠 Advertisements */}
          <div className="flex flex-wrap justify-center items-center gap-6 mt-10 px-4 sm:px-6 lg:px-12">
            {data?.advertisement?.slice(0, 2).map((ad, index) => (
              <div
                key={index}
                className="relative w-full sm:w-[48%] lg:w-[700px] rounded-xl overflow-hidden group"
              >
                <img
                  src={ad}
                  alt={`advertisement-${index + 1}`}
                  className="h-full w-full object-contain rounded-md transition-transform duration-500 group-hover:scale-105"
                />
                <div className="absolute top-3 left-3">
                  <Badge className="bg-primary/90 text-white px-3 py-1 text-xs rounded-full shadow-md">
                    Advertisement
                  </Badge>
                </div>
              </div>
            ))}
          </div>

          {/* 🟢 Featured Products */}
          <div className='flex flex-col md:gap-3 lg:gap-4 gap-5 mt-10 px-4 sm:px-6 md:px-8 lg:px-12'>
            <div className='flex items-center justify-between flex-wrap'>
              <p className="text-3xl font-semibold">Featured Products</p>
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button onClick={() => navigate(`/shop/lists/featured`)} variant="outline"><ChevronsRight /></Button>
                  </TooltipTrigger>
                  <TooltipContent><p>See All</p></TooltipContent>
                </Tooltip>
              </TooltipProvider>
            </div>
            <HorizontalCarousel>
              {featuredProductData?.productDetails?.map(item =>
                <div key={item._id} onDoubleClick={(e) => e.preventDefault()} className="flex-none w-[200px] sm:w-[220px] md:w-[240px] lg:w-[260px] h-[350px] md:h-[400px]">
                  <ProductCart2 productData={item} />
                </div>
              )}
            </HorizontalCarousel>
          </div>

          {/* 🔵 Category-wise products */}
          {data?.allcategory?.map(item =>
            <div key={item._id} className='flex flex-col md:gap-3 lg:gap-4 gap-5 mt-20 px-4 sm:px-6 md:px-8 lg:px-12'>
              <div className='flex items-center justify-between flex-wrap'>
                <p className="text-3xl font-semibold">{capitalize(item.name)}</p>
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Button onClick={() => navigate(`/shop/lists/${item._id}`)} variant="outline"><ChevronsRight /></Button>
                    </TooltipTrigger>
                    <TooltipContent><p>See All</p></TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              </div>
              <HorizontalCarousel>
                {item?.finalProductArray?.map(ele =>
                  <div key={ele._id} className="flex-none w-[200px] sm:w-[220px] md:w-[240px] lg:w-[260px] h-[350px] md:h-[400px]">
                    <ProductCart2 productData={ele} />
                  </div>
                )}
              </HorizontalCarousel>
            </div>
          )}

        </div>
      </div>
    </div>
  );
}

export default Home;
