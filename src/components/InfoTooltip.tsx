import React, { useState } from "react";
import { Info } from "lucide-react";

type Props = {
  text: React.ReactNode;
};

export default function InfoTooltip({ text }: Props) {
  const [isVisible, setIsVisible] = useState(false);

  return (
    <div className="relative inline-flex items-center group ml-1.5 align-middle">
      <button 
        className="text-neutral-500 hover:text-[#deff9a] transition-colors focus:outline-none"
        onMouseEnter={() => setIsVisible(true)}
        onMouseLeave={() => setIsVisible(false)}
        onClick={(e) => {
          e.preventDefault();
          setIsVisible(!isVisible);
        }}
      >
        <Info size={14} />
      </button>

      {/* Tooltip Popup */}
      <div 
        className={`absolute z-50 bottom-full left-1/2 -translate-x-1/2 mb-2 w-48 p-2 text-xs text-white bg-neutral-800 border border-neutral-700 rounded-lg shadow-xl pointer-events-none transition-all duration-200 ${
          isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-1"
        }`}
      >
        {text}
        {/* Triangle Arrow */}
        <div className="absolute top-full left-1/2 -translate-x-1/2 w-0 h-0 border-l-[6px] border-l-transparent border-r-[6px] border-r-transparent border-t-[6px] border-t-neutral-700"></div>
        <div className="absolute top-full left-1/2 -translate-x-1/2 w-0 h-0 border-l-[5px] border-l-transparent border-r-[5px] border-r-transparent border-t-[5px] border-t-neutral-800 -mt-[1px]"></div>
      </div>
    </div>
  );
}
