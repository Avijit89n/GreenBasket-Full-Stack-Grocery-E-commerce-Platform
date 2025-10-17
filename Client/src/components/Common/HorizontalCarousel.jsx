import useEmblaCarousel from 'embla-carousel-react'
import React, { useCallback } from 'react'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import { WheelGesturesPlugin } from 'embla-carousel-wheel-gestures'

function HorizontalCarousel({ children }) {
    const [carouselRef, emblaApi] = useEmblaCarousel(
        { dragFree: true },
        [
            WheelGesturesPlugin({
                forceWheelAxis: 'x',
                preventWheelScroll: true,
                wheelDraggingClass: 'is-dragging'
            }),
        ]
    )


    const scrollPrev = useCallback(() => {
        if (emblaApi) {
            emblaApi.scrollPrev();
        }
    }, [emblaApi])

    const scrollNext = useCallback(() => {
        if (emblaApi) {
            emblaApi.scrollNext()
        }
    }, [emblaApi])

    return (
        <div className="relative">

            <div className="overflow-hidden" ref={carouselRef}>
                <div className="flex gap-4 select-none">{children}</div>
            </div>
            <button onClick={scrollPrev} className="absolute left-[-15px] top-1/2 -translate-y-1/2 z-20 
                   bg-white/80 backdrop-blur-sm text-black hover:bg-white border border-gray-300 
                   rounded-full shadow-lg w-10 h-10 flex items-center justify-center transition-all"
            >
                <ChevronLeft className="w-5 h-5" />
            </button>
            <button onClick={scrollNext} className="absolute right-[-15px] top-1/2 -translate-y-1/2 z-20 
                   bg-white/80 backdrop-blur-sm text-black hover:bg-white border border-gray-300 
                   rounded-full shadow-lg w-10 h-10 flex items-center justify-center transition-all"
            >
                <ChevronRight className="w-5 h-5" />
            </button>
        </div>
    )
}

export default HorizontalCarousel
