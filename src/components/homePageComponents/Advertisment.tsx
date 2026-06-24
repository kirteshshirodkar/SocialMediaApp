"use client";

import Image from "next/image";
import adImg from "../../assets/images/pro2.jpg"
export default function SidebarAd() {
  return (
    <div className="w-[300px] h-full bg-[#E5E7EB] flex items-center justify-center p-3 rounded-3xl">
      
      {/* Card */}
      <div className="w-full h-full rounded-3xl bg-[#F3F4F6] shadow-2xl flex flex-col overflow-hidden">
        
        {/* Image Section */}
        <div className="relative h-[40%] w-full group overflow-hidden">
          <Image
            src={adImg}
            alt="Ad Banner"
            fill
            className="object-cover transition-transform duration-700 group-hover:scale-110"
            priority
          />

          <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent" />

          <div className="absolute top-3 left-3 bg-white text-[#4B5563] px-3 py-1 rounded-full text-xs font-semibold shadow-md">
            Sponsored
          </div>
        </div>

        {/* Content */}
        <div className="flex flex-col justify-between flex-1 p-5">
          
          <div>
            <h2 className="text-xl font-bold text-[#4B5563] leading-snug mb-3">
              Discover Smarter{" "}
              <span className="text-[#2563EB]">Workflows</span>
            </h2>

            <p className="text-sm text-[#6B7280] leading-relaxed">
              Boost productivity with tools designed for modern creators and developers.
            </p>
          </div>

          {/* CTA */}
          <div className="flex flex-col gap-3 mt-6">
            
            <button className="w-full py-2.5 rounded-xl bg-gradient-to-r from-[#3B82F6] to-[#2563EB] text-white font-semibold shadow-xl hover:shadow-blue-400/40 hover:scale-[1.03] transition-all duration-300">
              Learn More
            </button>

            <button className="w-full py-2.5 rounded-xl bg-white text-[#4B5563] font-semibold shadow-md hover:bg-gray-100 transition-all duration-300">
              Buy Now
            </button>

          </div>

        </div>
      </div>
    </div>
  );
}