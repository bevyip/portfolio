import React from "react";

const BentoGrid = () => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 w-full">
      {[1, 2, 3, 4, 5, 6].map((item) => (
        <div
          key={item}
          className="bento-item bg-white rounded-3xl p-8 shadow-xl border border-gray-100 aspect-square flex flex-col justify-between hover:scale-[1.02] transition-transform duration-300"
        >
          <div className="w-12 h-12 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 font-bold text-xl">
            {item}
          </div>
          <div>
            <h3 className="text-xl font-bold text-gray-900 mb-2">Project {item}</h3>
            <p className="text-gray-500 text-sm">
              An amazing interaction design case study.
            </p>
          </div>
        </div>
      ))}
    </div>
  );
};

export default BentoGrid;