import { Clock, ChefHat, CheckCircle2, Circle } from "lucide-react";
import { useState } from "react";

const IngredientsPanel = ({ recipe }) => {
  const [checked, setChecked] = useState(new Set());

  const toggle = (i) => {
    setChecked((prev) => {
      const next = new Set(prev);
      if (next.has(i)) {
        next.delete(i);
      } else {
        next.add(i);
      }
      return next;
    });
  };

  return (
    <aside className="flex h-full flex-col overflow-hidden rounded-2xl border border-border bg-card shadow-card">

      {/* Image */}
      <div className="relative h-40 w-full overflow-hidden">
        <img
          src={recipe.image}
          alt={recipe.name}
          referrerPolicy="no-referrer"
          onError={(e) => { e.target.onerror = null; e.target.src = "https://www.themealdb.com/images/media/meals/1550441882.jpg"; }}
          className="h-full w-full object-cover"
        />

        <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent" />

        <div className="absolute bottom-0 left-0 right-0 p-4 text-white">
          <h2 className="text-xl font-bold">{recipe.name}</h2>

          <div className="mt-1 flex items-center gap-3 text-xs">
            <span className="flex items-center gap-1">
              <Clock size={14} /> {recipe.time} min
            </span>
            <span className="flex items-center gap-1">
              <ChefHat size={14} /> {recipe.type}
            </span>
          </div>
        </div>
      </div>

      {/* Ingredients */}
      <div className="flex-1 overflow-y-auto p-5">
        <h3 className="mb-3 text-sm font-bold uppercase text-gray-500">
          Ingredients
        </h3>

        <ul className="space-y-2">
          {recipe.ingredients.map((ing, i) => {
            const done = checked.has(i);

            return (
              <li key={i}>
                <button
                  onClick={() => toggle(i)}
                  className={`flex w-full items-center gap-3 rounded-xl border px-3 py-2 text-sm transition ${
                    done
                      ? "bg-green-100 border-green-300"
                      : "bg-white border-gray-200 hover:border-orange-400"
                  }`}
                >
                  {done ? (
                    <CheckCircle2 size={16} className="text-green-600" />
                  ) : (
                    <Circle size={16} className="text-gray-400" />
                  )}

                  <span
                    className={`flex-1 ${
                      done ? "line-through text-gray-400" : ""
                    }`}
                  >
                    {ing}
                  </span>
                </button>
              </li>
            );
          })}
        </ul>
      </div>
    </aside>
  );
};

export default IngredientsPanel;