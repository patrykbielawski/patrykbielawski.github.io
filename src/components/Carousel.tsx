import { useEffect, useRef, useState } from "react";
import Button from "./Button";

interface Slide {
    url: string;
}

interface CarouselProps {
    slides: Slide[];
}

const Carousel = ({ slides }: CarouselProps) => {
    const [currentIndex, setCurrentIndex] = useState(0);
    const [touchStart, setTouchStart] = useState<number | null>(null);
    const [touchEnd, setTouchEnd] = useState<number | null>(null);
    const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

    const minSwipeDistance = 50;

    const onTouchStart = (e: React.TouchEvent) => {
        setTouchEnd(null);
        setTouchStart(e.targetTouches[0].clientX);
    };

    const onTouchMove = (e: React.TouchEvent) => {
        setTouchEnd(e.targetTouches[0].clientX);
    };

    const onTouchEnd = () => {
        if (!touchStart || !touchEnd) return;

        const distance = touchStart - touchEnd;
        const isLeftSwipe = distance > minSwipeDistance;
        const isRightSwipe = distance < -minSwipeDistance;

        if (isLeftSwipe) {
            nextSlide();
        } else if (isRightSwipe) {
            prevSlide();
        }
    };

    const [showControls, setShowControls] = useState(false);

    const prevSlide = () => {
        const isFirstSlide = currentIndex === 0;
        const newIndex = isFirstSlide ? slides.length - 1 : currentIndex - 1;
        setCurrentIndex(newIndex);
    };

    const nextSlide = () => {
        const isLastSlide = currentIndex === slides.length - 1;
        const newIndex = isLastSlide ? 0 : currentIndex + 1;
        setCurrentIndex(newIndex);
    };

    const [isPaused, setIsPaused] = useState(false);

    useEffect(() => {
        if (isPaused) return;

        const slideInterval = setInterval(() => {
            nextSlide();
        }, 5000);

        return () => clearInterval(slideInterval);
    }, [currentIndex, isPaused]);

    return (
        <div
            className="relative group ..."
            onTouchStart={(e) => {
                if (timerRef.current) clearTimeout(timerRef.current);
                onTouchStart(e);
                setShowControls(true);
            }}
            onTouchMove={onTouchMove}
            onTouchEnd={() => {
                onTouchEnd();
                timerRef.current = setTimeout(() => setShowControls(false), 3000);
            }}
        >
            <div
                onMouseEnter={() => setIsPaused(true)}    
                onMouseLeave={() => setIsPaused(false)}
                className="max-w-4xl h-160 w-full m-auto py-8 px-4 relative group"
            >
                <div
                    style={{ backgroundImage: `url(${slides[currentIndex].url})` }}
                    className="w-full h-[80%] md:h-[90%] lg:h-full rounded-2xl outline outline-brand-gold shadow-lg/80 bg-center bg-cover"
                >    
                </div>

                <div className={`
                    ${showControls ? "inline-block" : "hidden"}
                    hidden group-hover:inline-block py-0 md:py-2 p-4 absolute sm:top-[50%] top-[65%] translate-x-0
                    translate-y-[-50%] left-8 rounded-full bg-black/60 outline outline-brand-red/20 hover:scale-105
                    active:scale-95 duration-300 text-text-primary cursor-pointer hover:text-brand-red
                `}>
                    <Button
                        variant="ghost"
                        onClick={prevSlide} 
                        aria-label={"Previous Slide"}
                    >
                        <span className="material-symbols-rounded">chevron_backward</span>
                    </Button>
                </div>

                <div className={`
                    ${showControls ? "inline-block" : "hidden"}
                    hidden group-hover:inline-block py-0 md:py-2 p-4 absolute sm:top-[50%] top-[65%] translate-x-0
                    translate-y-[-50%] right-8 rounded-full bg-black/60 outline outline-brand-red/20 hover:scale-105
                    active:scale-95 duration-300 text-text-primary cursor-pointer hover:text-brand-red
                `}>
                    <Button 
                        variant="ghost"
                        onClick={nextSlide}
                        aria-label={"Next Slide"}
                    >
                        <span className="material-symbols-rounded">chevron_forward</span>
                    </Button>
                </div>

                <div className="flex top-4 justify-center py-2">
                    {slides.map((_slide, slideIndex) => (
                        <div
                            key={slideIndex}
                            onClick={() => setCurrentIndex(slideIndex)}
                            className={`text-2xl cursor-pointer mx-1 transition-all ${
                                currentIndex === slideIndex ? "text-blue-500 scale-125" : "text-gray-400"
                            }`}
                        >
                            •
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default Carousel;
