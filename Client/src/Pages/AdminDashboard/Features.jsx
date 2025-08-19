import useEmblaCarousel from 'embla-carousel-react';
import Autoplay from 'embla-carousel-autoplay';
import React, { useEffect, useRef, useState } from 'react';
import getHandler from '@/Services/Get.service';
import toast from 'react-hot-toast';
import postHandler from '@/Services/Post.Service';
import { ImagePlus, Images, Pencil, Plus, Save, X } from 'lucide-react';
import Loader2 from '@/components/Common/Loader2';
import Loader from '@/components/Common/Loader';
import addimg from '../../assets/add_image.png'
import { useInView } from 'react-intersection-observer';

const highlightText = (text) => {
  if (!text) return '';
  return text.replace(/<([^>]+)>/g, `<span class="text-[#00cd5c]">$1</span>`);
};

function capitalize(str) {
  if (!str) return "";
  return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();
}

function Features() {
  const { ref, inView } = useInView({ threshold: 1 })
  const autoplay = useRef(Autoplay({ delay: 3000 }));
  const [emblaRef] = useEmblaCarousel({ loop: true }, [autoplay.current]);

  const [editingTitleIndex, setEditingTitleIndex] = useState(null);
  const [editingTaglineIndex, setEditingTaglineIndex] = useState(null);

  const [data, setData] = useState({})
  const [pagination, setPagination] = useState({})

  const [updateLoaderB, setUpdateLoaderB] = useState(false)
  const [updateLoaderA, setUpdateLoaderA] = useState(false)
  const [updateLoaderC, setUpdateLoaderC] = useState(false)
  const [updateLoaderP, setUpdateLoaderP] = useState(false)
  const [loader, setLoader] = useState(false)
  const [paginationLoader, setPaginationLoader] = useState(false)

  const [page, setPage] = useState(1)

  const fetchData = async () => {
    setLoader(true)
    await getHandler(`http://localhost:8000/api/feature/get-data/all-features`)
      .then((res) => {
        setData(res.data?.[0])
      })
      .catch((err) => {
        toast.error(err?.response?.data?.message || 'Failed to fetch Data');
      })
      .finally(() => setLoader(false));
  };

  const sendTitle = async () => {
    setUpdateLoaderB(true)
    const formData = new FormData();
    data.title.forEach(item => formData.append('title', item));
    data.tagline.forEach(item => formData.append('tagline', item));
    data.banner.forEach(item => formData.append('banner', item));
    await postHandler('http://localhost:8000/api/feature/add-banner/title/tagline', formData)
      .then((res) => {
        toast.success(res?.message || 'All data saved for homepage banner')
      })
      .catch((err) => {
        toast.error(err?.response?.data?.message || 'Failed to save Title')
      })
      .finally(() => setUpdateLoaderB(false))
  };

  const sendCategory = async () => {
    setUpdateLoaderC(true)
    const formData = new FormData();
    data.allCategories?.map(item => {
      if (item.selected) formData.append("category", item._id)
    })
    await postHandler('http://localhost:8000/api/feature/add-selected-category', formData)
      .then(res => {
        toast.success(res?.message || "Selected Category are Successfully featured in Home page")
      })
      .catch(err => {
        toast.error(err?.response?.data?.message || "Failed to featured category")
      })
      .finally(() => setUpdateLoaderC(false))
  }

  const sendAds = async () => {
    setUpdateLoaderA(true)
    const formData = new FormData;
    data.advertisement.map(ele => {
      formData.append('ads', ele)
    })
    await postHandler('http://localhost:8000/api/feature/add-advertisement', formData)
      .then((res) => {
        toast.success(res?.message || "Ads succesfully saved")
      })
      .catch((err) => {
        toast.error(err?.response?.data?.message || "Failed to save ads")
      })
      .finally(() => setUpdateLoaderA(false))
  }

  const sendProduct = async () => {
    setUpdateLoaderP(true)
    const formData = new FormData;
    pagination.productDetails.map(item => {
      if (item.selected) formData.append("products", item._id)
    })
    await postHandler('http://localhost:8000/api/feature/add-selected-product', formData)
      .then(res => {
        toast.success(res?.message || "Selected Products are Successfully featured in Home page")
      })
      .catch(err => {
        toast.error(err?.response?.data?.message || "Failed to featured Product")
      })
      .finally(() => setUpdateLoaderP(false))
  }

  const fetchProduct = async () => {
    setPaginationLoader(true)
    await getHandler(`http://localhost:8000/api/feature/get-products-features?page=${page}&limit=10`)
      .then(res => {
        setPagination(prev => ({
          isEnd: res?.data?.isEnd,
          productDetails: [
            ...(prev?.productDetails || []),
            ...(res.data.productDetails?.[0]?.Allproduct || [])
          ]
        }))
      })
      .catch((err) => {
        toast.error(err?.response?.data?.message || "FAiled to fetch products")
      })
      .finally(() => setPaginationLoader(false))
  }

  useEffect(() => {
    if (inView && !updateLoaderP && !pagination.isEnd) {
      setPage(prev => prev + 1)
    }
  }, [inView])

  useEffect(() => {
    if (!pagination.isEnd)
      fetchProduct();
  }, [page]);

  useEffect(() => {
    fetchData();
  }, []);

  const handleTitleChange = (e, index) => {
    const updated = [...data.title];
    updated[index] = e.target.value;
    setData(prev => ({
      ...prev,
      title: updated
    }));
  };

  const handleTaglineChange = (e, index) => {
    const updated = [...data.tagline];
    updated[index] = e.target.value;
    setData(prev => ({
      ...prev,
      tagline: updated
    }));
  };

  const handleBannerDelete = (index) => {
    setData((prev) => {
      const updated = [...prev.banner];
      updated[index] = null;
      return {
        ...prev,
        banner: updated
      }
    });
  };

  const handleAdsDelete = (index) => {
    setData((prev) => {
      const updated = [...prev.advertisement];
      updated[index] = null;
      return {
        ...prev,
        advertisement: updated
      }
    });
  };

  return(
    <>
    {loader ? <div className='flex justify-center items-center py-14'><Loader2 height={8} width={8}/></div> : <div className='flex flex-col gap-10'>

      <div className="flex flex-col gap-2 bg-gray-200 p-4 rounded-md">
        <div className="flex items-center justify-between bg-gray-100 px-6 py-4 rounded-md shadow border border-gray-300">
          <div>
            <h1 className="text-2xl font-bold text-gray-800 flex items-center gap-2">
              Home Banner Manager
            </h1>
            <p className="text-sm text-gray-500">Edit and manage your homepage carousel banners</p>
          </div>
        </div>

        <div className="bg-gray-50 border border-gray-300 rounded-md p-6 shadow">
          <div className="flex flex-wrap gap-5 items-center justify-between mb-4">
            <h2 className="text-xl flex items-center gap-2 font-semibold text-gray-800">
              <Images />Upload Banners (MAX 5)
            </h2>
            {!updateLoaderB ? (
              <button
                onClick={sendTitle}
                className="flex h-10 w-25 items-center justify-center gap-2 bg-green-600 hover:bg-green-700 rounded-lg text-white text-md font-medium transition"
              >
                <Save size={16} /> Save
              </button>
            ) : (
              <div className="flex h-10 w-25 items-center justify-center gap-2 bg-green-600 rounded-md transition">
                <Loader2 height={7} width={7} />
              </div>
            )}
          </div>

          <div className="flex flex-wrap max-h-45 overflow-scroll justify-center items-center gap-4">
            {Array.from({ length: 5 }).map((_, index) => (
              <div
                key={index}
                className="relative h-[60px] w-[140px] border border-dashed border-gray-400 bg-gray-100 rounded-lg overflow-hidden flex items-center justify-center"
              >
                {data.banner?.[index] ? (
                  <>
                    <img
                      src={
                        typeof data.banner[index] === 'string'
                          ? data.banner[index]
                          : URL.createObjectURL(data.banner[index])
                      }
                      className="w-full h-full object-cover"
                    />
                    <button
                      className="absolute top-1 right-1 bg-black/30 rounded-full p-1"
                      onClick={() => handleBannerDelete(index)}
                    >
                      <X className="h-4 w-4 text-white" />
                    </button>
                  </>
                ) : (
                  <>
                    <input
                      type="file"
                      id={`upload-${index}`}
                      className="hidden"
                      onChange={(e) => {
                        const file = e.target.files?.[0];
                        setData(prev => {
                          const updated = [...prev.banner];
                          updated[index] = file;
                          return {
                            ...prev,
                            banner: updated
                          }
                        })
                      }}
                    />
                    <label
                      htmlFor={`upload-${index}`}
                      className="absolute inset-0 flex flex-col items-center justify-center text-gray-500 text-xs cursor-pointer hover:bg-gray-200 transition"
                    >
                      <ImagePlus className="w-5 h-5 mb-1" />
                      Upload
                    </label>
                  </>
                )}
              </div>
            ))}
          </div>
        </div>

        <div className="overflow-hidden border-4 box-border border-gray-50 rounded-md" ref={emblaRef}>
          <div className="flex gap-2">
            {data.banner?.map((item, index) =>
              item ? (
                <div
                  key={index}
                  className="relative h-[150px] sm:h-[250px] md:h-[350px] lg:h-[450px] w-full flex-shrink-0"
                >
                  <img
                    src={typeof item === 'string' ? item : URL.createObjectURL(item)}
                    className="w-full h-full object-cover rounded-md"
                  />
                  <div className="absolute inset-0 flex flex-col justify-center px-6 sm:px-12 z-10 bg-gradient-to-r from-white/60 to-transparent">
                    <div className="max-w-[50%]">
                      {editingTitleIndex === index ? (
                        <textarea
                          autoFocus
                          value={data.title[index]}
                          onChange={(e) => handleTitleChange(e, index)}
                          onBlur={() => {
                            setEditingTitleIndex(null);
                            autoplay?.current?.play();
                          }}
                          rows={2}
                          className="w-full h-32 p-2 text-3xl sm:text-4xl lg:text-5xl font-bold text-gray-800 bg-transparent border-none"
                        />
                      ) : (
                        <h2
                          onDoubleClick={() => setEditingTitleIndex(index)}
                          className="text-sm sm:text-lg lg:text-5xl font-bold text-[#083C5A] lg:leading-16"
                          dangerouslySetInnerHTML={{
                            __html: highlightText(data.title[index]) || 'Double click to enter title',
                          }}
                        />
                      )}

                      {editingTaglineIndex === index ? (
                        <textarea
                          autoFocus
                          value={data.tagline[index]}
                          onChange={(e) => handleTaglineChange(e, index)}
                          onBlur={() => {
                            setEditingTaglineIndex(null);
                            autoplay?.current?.play();
                          }}
                          rows={2}
                          className="mt-2 p-2 w-full text-base sm:text-lg text-gray-700 border-none bg-transparent resize-none"
                        />
                      ) : (
                        <p
                          onDoubleClick={() => setEditingTaglineIndex(index)}
                          className="mt-2 text-xs sm:text-sm text-gray-600"
                        >{data?.tagline[index] || "Double click to enter tagline"}</p>
                      )}
                    </div>
                  </div>
                </div>
              ) : null
            )}
          </div>
        </div>
      </div>

      <div className="flex flex-col gap-2 bg-gray-200 p-4 rounded-md">
        <div className="flex items-center justify-between bg-gray-100 px-6 py-4 rounded-md shadow border border-gray-300">
          <div>
            <h1 className="text-2xl font-bold text-gray-800 flex items-center gap-2">
              Advertisement Manager
            </h1>
            <p className="text-sm text-gray-500">Edit and manage your homepage Advertisement</p>
          </div>
        </div>
        <div className="bg-gray-50 border border-gray-300 rounded-md p-6 shadow">
          <div className="flex flex-wrap gap-5 items-center justify-between mb-4">
            <h2 className="text-xl flex items-center gap-2 font-semibold text-gray-800">
              <Plus />Add Advertisement
            </h2>
            {!updateLoaderA ? (
              <button
                onClick={sendAds}
                className="flex h-10 w-25 items-center justify-center gap-2 bg-green-600 hover:bg-green-700 rounded-lg text-white text-md font-medium transition"
              >
                <Save size={16} /> Save
              </button>
            ) : (
              <div className="flex h-10 w-25 items-center justify-center gap-2 bg-green-600 rounded-md transition">
                <Loader2 height={7} width={7} />
              </div>
            )}
          </div>
          <div className='flex gap-5 flex-wrap items-center justify-center'>
            {data.advertisement?.[0] ? (
              <div className='w-[500px]  h-48 relative'>
                <img src={
                  typeof data.advertisement[0] === "string" && data.advertisement[0].includes("/res.cloudinary.com") ?
                    data.advertisement[0] :
                    URL.createObjectURL(data?.advertisement[0])
                } className='w-full h-full rounded-md object-cover' />
                <button
                  className="absolute top-1 right-1 bg-black/30 rounded-full p-1"
                  onClick={() => handleAdsDelete(0)}
                >
                  <X className="h-4 w-4 text-white" />
                </button>
              </div>
            ) : (
              <>
                <label className='w-[500px] h-48 flex-col gap-2 rounded-md text-center px-2 bg-blue-50 border-dashed border-2 border-blue-500 flex justify-center items-center' htmlFor='add1'>
                  <img src={addimg} alt="" className='h-7 w-7' />
                  <p className='text-sm text-blue-400'>Click for<span className='font-semibold text-blue-500'> upload Advertisement</span></p>
                </label>
                <input onChange={(e) => {
                  const updated = data.advertisement
                  updated[0] = e.target.files[0]

                  setData(prev => ({
                    ...prev,
                    advertisement: updated
                  }))
                }} type="file" id='add1' className='hidden' />
              </>
            )}
            {data.advertisement?.[1] ? (
              <div className='w-[500px] h-48 relative'>
                <img src={
                  typeof data.advertisement[1] === "string" && data.advertisement[1].includes("/res.cloudinary.com") ?
                    data.advertisement[1] :
                    URL.createObjectURL(data?.advertisement[1])
                } className='w-full h-full rounded-md object-cover' />
                <button
                  className="absolute top-1 right-1 bg-black/30 rounded-full p-1"
                  onClick={() => handleAdsDelete(1)}
                >
                  <X className="h-4 w-4 text-white" />
                </button>
              </div>
            ) : (
              <>
                <label className='w-[500px] h-48 flex-col gap-2 text-center px-2 rounded-md bg-blue-50 border-dashed border-2 border-blue-500 flex justify-center items-center' htmlFor='add2'>
                  <img src={addimg} alt="" className='h-7 w-7' />
                  <p className='text-sm text-blue-400'>Click for<span className='font-semibold text-blue-500'> upload Advertisement</span></p>
                </label>
                <input onChange={(e) => {
                  const updated = data.advertisement
                  updated[1] = e.target.files[0]
                  setData(prev => ({
                    ...prev,
                    advertisement: updated
                  }))
                }} type="file" id='add2' className='hidden' />
              </>
            )}
          </div>
        </div>
      </div>

      <div className="flex flex-col gap-2 bg-gray-200 p-4 rounded-md">
        <div className="flex items-center justify-between bg-gray-100 px-6 py-4 rounded-md shadow border border-gray-300">
          <div>
            <h1 className="text-2xl font-bold text-gray-800 flex items-center gap-2">
              Category Manager
            </h1>
            <p className="text-sm text-gray-500">Edit and manage your Category Which You want to Featured</p>
          </div>
        </div>
        <div className="bg-gray-50 border border-gray-300 rounded-md p-6 shadow">
          <div className="flex flex-wrap gap-5 items-center justify-between mb-4">
            <h2 className="text-xl flex items-center gap-2 font-semibold text-gray-800">
              <Pencil />Mark Categories as Featured
            </h2>
            {!updateLoaderC ? (
              <button
                onClick={sendCategory}
                className="flex h-10 w-25 items-center justify-center gap-2 bg-green-600 hover:bg-green-700 rounded-lg text-white text-md font-medium transition"
              >
                <Save size={16} /> Save
              </button>
            ) : (
              <div className="flex h-10 w-25 items-center justify-center gap-2 bg-green-600 rounded-md transition">
                <Loader2 height={7} width={7} />
              </div>
            )}
          </div>
          <div className='grid grid-cols-[repeat(auto-fill,minmax(100px,1fr))] lg:grid-cols-8 gap-2'>
            {data?.allCategories?.map(item =>
              <div
                onClick={() => {
                  setData(prev => ({
                    ...prev, allCategories: prev.allCategories.map(ele => {
                      if (ele._id === item._id) ele.selected = !ele.selected;
                      return ele;
                    })
                  }))
                }}
                key={item._id}
                className={`cursor-pointer border-2 ${item.selected ? "bg-emerald-100 border-emerald-200" : ""} p-2 text-center rounded-md`}
              >
                <img src={item.image} className={`rounded-md ${item.selected ? "border-emerald-200" : ""} border`} />
                <p className='text-sm font-semibold py-3'>{capitalize(item.name)}</p>
              </div>
            )}

          </div>
        </div>
      </div>

      <div className="flex flex-col gap-2 bg-gray-200 p-4 rounded-md">
        <div className="flex items-center justify-between bg-gray-100 px-6 py-4 rounded-md shadow border border-gray-300">
          <div>
            <h1 className="text-2xl font-bold text-gray-800 flex items-center gap-2">
              Product Manager
            </h1>
            <p className="text-sm text-gray-500">Edit and manage your Products Which You want to Featured</p>
          </div>
        </div>
        <div className="bg-gray-50 border border-gray-300 rounded-md p-6 shadow">
          <div className="flex flex-wrap gap-5 items-center justify-between mb-4">
            <h2 className="text-xl flex items-center gap-2 font-semibold text-gray-800">
              <Pencil />Mark Products as Featured
            </h2>
            {!updateLoaderP ? (
              <button
                onClick={sendProduct}
                className="flex h-10 w-25 items-center justify-center gap-2 bg-green-600 hover:bg-green-700 rounded-lg text-white text-md font-medium transition"
              >
                <Save size={16} /> Save
              </button>
            ) : (
              <div className="flex h-10 w-25 items-center justify-center gap-2 bg-green-600 rounded-md transition">
                <Loader2 height={7} width={7} />
              </div>
            )}
          </div>
          <div className='grid overflow-scroll grid-cols-[repeat(auto-fill,minmax(100px,1fr))] lg:grid-cols-8 gap-2'>
            {pagination.productDetails?.map((item, index) =>
              <div
                onClick={() => {
                  setPagination(prev => ({
                    ...prev,
                    productDetails: prev.productDetails.map(ele => {
                      if (ele._id === item._id) ele.selected = !ele.selected;
                      return ele
                    })
                  }))
                }}
                key={item._id}
                className={`cursor-pointer border-2 ${item.selected ? "bg-emerald-100 border-emerald-200" : ""} p-2 text-center rounded-md`}
              >
                <img src={item.avatar} 
                  className={`rounded-md ${item.selected ? "border-emerald-200" : ""} h-28 w-full object-contain border p-2 bg-gray-200`} />
                {
                  pagination.productDetails.length - 1 === index ?
                    <p ref={ref} className='text-sm font-semibold py-3'>{capitalize(item.name)}</p> :
                    <p className='text-sm font-semibold py-3'>{capitalize(item.name)}</p>
                }
              </div>
            )}

          </div>
          {paginationLoader ?
            <div className='w-full flex justify-center items-center p-5'>
              <Loader2 />
            </div>
            : ""}
        </div>
      </div>


    </div>}
    </>

  );
}

export default Features;