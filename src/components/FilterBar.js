import React from "react";

// Filters list
const filters = ["All", "Veg", "Non-Veg", "Desserts", "Quick Recipes", "Healthy"];

const FilterBar = ({ active, onChange }) => {
  return (
    <div className="flex flex-wrap gap-2">
      {filters.map((f) => {
        const isActive = active === f;

        return (
          <button
            key={f}
            onClick={() => onChange(f)}
            className={`rounded-full px-5 py-2 text-sm font-medium transition-all duration-200 ${
              isActive
                ? "bg-orange-500 text-white shadow-md scale-105"
                : "border border-gray-300 bg-white text-gray-700 hover:border-orange-500 hover:text-orange-500 hover:-translate-y-0.5"
            }`}
          >
            {f}
          </button>
        );
      })}
    </div>
  );
};

export default FilterBar;