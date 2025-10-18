import React, { useCallback, useEffect, useState } from 'react'
import useEmblaCarousel from 'embla-carousel-react'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import { WheelGesturesPlugin } from 'embla-carousel-wheel-gestures'

function HorizontalCarousel({ children }) {
  const [carouselRef, emblaApi] = useEmblaCarousel(
    {
      align: 'start',
      dragFree: true,
      containScroll: 'trimSnaps',
    },
    [
      WheelGesturesPlugin({
        forceWheelAxis: 'x',
        preventWheelScroll: true,
        wheelDraggingClass: 'is-dragging',
      }),
    ]
  )

  const [showPrev, setShowPrev] = useState(false)
  const [showNext, setShowNext] = useState(false)

  const onSelect = useCallback(() => {
    if (!emblaApi) return
    setShowPrev(emblaApi.canScrollPrev())
    setShowNext(emblaApi.canScrollNext())
  }, [emblaApi])

  const scrollPrev = useCallback(() => emblaApi && emblaApi.scrollPrev(), [emblaApi])
  const scrollNext = useCallback(() => emblaApi && emblaApi.scrollNext(), [emblaApi])

  useEffect(() => {
    if (!emblaApi) return
    onSelect()
    emblaApi.on('select', onSelect)
    emblaApi.on('reInit', onSelect)
  }, [emblaApi, onSelect])

  return (
    <div className="relative group w-full">
      {showPrev && (
        <button onClick={scrollPrev} className="absolute text-gray-400 group-hover:opacity-100 opacity-0 hidden md:block transition-all duration-500 bg-gradient-to-r from-gray-100 px-3 to-transparent left-0 top-0 z-10 h-full">
          <ChevronLeft className="w-5 h-5 sm:w-7 md:w-10 md:h-10 active:animate-bkd-animation" strokeWidth={3} />
        </button>
      )}

      <div ref={carouselRef} className="overflow-hidden rounded-md">
        <div className="flex gap-4 select-none">
          {children}
        </div>
      </div>

      {showNext && (
        <button onClick={scrollNext} className="absolute text-gray-400 group-hover:opacity-100 opacity-0 hidden md:block transition-all duration-500 bg-gradient-to-l from-gray-100 px-3 to-transparent right-0 top-0 z-10 h-full">
          <ChevronRight className="w-5 h-5 sm:w-7 md:w-10 md:h-10 active:animate-frd-animation" strokeWidth={3}/>
        </button>
      )}
    </div>
  )
}

export default HorizontalCarousel
