"use client";

import { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import { ChevronLeft, ChevronRight, Play } from "lucide-react";
import type { ReelShortBanner } from "@/types/reelshort";

interface BannerCarouselProps {
  banners: ReelShortBanner[];
  autoPlayInterval?: number;
}

export function BannerCarousel({
  banners,
  autoPlayInterval = 5000,
}: BannerCarouselProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isHovered, setIsHovered] = useState(false);

  const nextSlide = useCallback(() => {
    setCurrentIndex((prev) => (prev + 1) % banners.length);
  }, [banners.length]);

  const prevSlide = useCallback(() => {
    setCurrentIndex((prev) => (prev - 1 + banners.length) % banners.length);
  }, [banners.length]);

  // Auto-play
  useEffect(() => {
    if (isHovered || banners.length <= 1) return;

    const interval = setInterval(nextSlide, autoPlayInterval);
    return () => clearInterval(interval);
  }, [isHovered, nextSlide, autoPlayInterval, banners.length]);

  if (banners.length === 0) return null;

  const currentBanner = banners[currentIndex];

  return (
    <div
      className="relative w-full aspect-[3/1] md:aspect-[4/1] rounded-2xl overflow-hidden group"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Banner Image */}
      <Link href={`/detail/reelshort/${currentBanner.jump_param.book_id}`}>
        <img
          src={currentBanner.pic}
          alt={currentBanner.jump_param.book_title}
          className="w-full h-full object-cover transition-transform duration-700"
        />

        {/* Gradient Overlay */}
        <div className="absolute inset-0 bg-gradient-to-r from-background/90 via-background/40 to-transparent" />
        <div className="absolute inset-0 bg-gradient-to-t from-background/80 via-transparent to-transparent" />

        {/* Content */}
        <div className="absolute bottom-6 left-6 right-20 space-y-3">
          {/* Artistic Title */}
          {currentBanner.pic_artistic_word && (
            <img
              src={currentBanner.pic_artistic_word}
              alt=""
              className="h-12 md:h-16 object-contain"
            />
          )}

          <h3 className="text-lg md:text-xl font-bold text-white line-clamp-1">
            {currentBanner.jump_param.book_title}
          </h3>

          {/* Tags */}
          {currentBanner.jump_param.book_theme && (
            <div className="flex flex-wrap gap-2">
              {currentBanner.jump_param.book_theme.slice(0, 3).map((theme) => (
                <span
                  key={theme}
                  className="px-2 py-0.5 rounded-full text-xs text-white/90 backdrop-blur-sm" style={{ background: "hsl(0,0%,0%,0.45)", border: "1px solid hsl(0,0%,100%,0.1)" }}
                >
                  {theme}
                </span>
              ))}
            </div>
          )}

          {/* Play Button */}
          {currentBanner.play_button === 1 && (
            <button className="flex items-center gap-2 px-5 py-2 rounded-full text-white text-sm font-semibold transition-all hover:scale-105" style={{ background: "linear-gradient(135deg, hsl(4,90%,50%), hsl(20,95%,55%))", boxShadow: "0 4px 20px hsl(4,90%,40%,0.5)" }}>
              <Play className="w-4 h-4 fill-current" />
              Tonton
            </button>
          )}
        </div>

        {/* Badge */}
        {currentBanner.book_mark?.text && (
          <div
            className="absolute top-4 left-4 px-3 py-1 rounded-md text-xs font-bold"
            style={{
              backgroundColor: currentBanner.book_mark.color || "#E52E2E",
              color: currentBanner.book_mark.text_color || "#FFFFFF",
            }}
          >
            {currentBanner.book_mark.text}
          </div>
        )}
      </Link>

      {/* Navigation Arrows */}
      {banners.length > 1 && (
        <>
          <button
            onClick={(e) => {
              e.preventDefault();
              prevSlide();
            }}
            className="absolute left-3 top-1/2 -translate-y-1/2 p-2.5 rounded-full backdrop-blur-md opacity-0 group-hover:opacity-100 transition-all hover:scale-110" style={{ background: "hsl(0,0%,8%,0.85)", border: "1px solid hsl(0,0%,20%)" }}
          >
            <ChevronLeft className="w-5 h-5" />
          </button>
          <button
            onClick={(e) => {
              e.preventDefault();
              nextSlide();
            }}
            className="absolute right-3 top-1/2 -translate-y-1/2 p-2.5 rounded-full backdrop-blur-md opacity-0 group-hover:opacity-100 transition-all hover:scale-110" style={{ background: "hsl(0,0%,8%,0.85)", border: "1px solid hsl(0,0%,20%)" }}
          >
            <ChevronRight className="w-5 h-5" />
          </button>
        </>
      )}

      {/* Dots Indicator */}
      {banners.length > 1 && (
        <div className="absolute bottom-4 right-4 flex items-center gap-1.5">
          {banners.slice(0, 10).map((_, idx) => (
            <button
              key={idx}
              onClick={(e) => {
                e.preventDefault();
                setCurrentIndex(idx);
              }}
              className={`w-2 h-2 rounded-full transition-all duration-200 ${idx === currentIndex ? "w-6" : "bg-white/50 hover:bg-white/80"}`}
              style={idx === currentIndex ? { background: "hsl(4,90%,55%)", boxShadow: "0 0 8px hsl(4,90%,55%,0.7)" } : {}}
            />
          ))}
        </div>
      )}
    </div>
  );
}
