import React from "react";
import { Clock, Star, Heart, Flame } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useRecipes } from "../context/RecipeContext";

const RecipeCard = ({ recipe }) => {
  const { toggleFavorite, isFavorite } = useRecipes();
  const fav = isFavorite(recipe.id);
  const navigate = useNavigate();

  return (
    <div className="relative rounded-xl border shadow hover:shadow-lg transition-all duration-300 hover:-translate-y-1 overflow-hidden">

      {/* Image */}
      <div className="relative">
        <img
          src={recipe.image}
          alt={recipe.name}
          referrerPolicy="no-referrer"
          onError={(e) => {
            e.target.onerror = null;
            e.target.src = "https://www.themealdb.com/images/media/meals/1550441882.jpg";
          }}
          className="w-full h-48 object-cover"
        />

        {/* Favorite */}
        <button
          onClick={() => toggleFavorite(recipe.id)}
          className="absolute top-3 right-3 bg-white p-2 rounded-full shadow"
        >
          <Heart
            className={`h-4 w-4 ${
              fav ? "text-red-500 fill-red-500" : "text-gray-500"
            }`}
          />
        </button>

        {/* Type */}
        <span className="absolute top-3 left-3 bg-orange-500 text-white px-2 py-1 rounded text-xs">
          {recipe.type}
        </span>

        {/* Quick tag */}
        {recipe.tags?.includes("Quick") && (
          <span className="absolute bottom-3 left-3 bg-yellow-500 text-white px-2 py-1 rounded text-xs flex items-center gap-1">
            <Flame className="h-3 w-3" /> Quick
          </span>
        )}
      </div>

      {/* Content */}
      <div className="p-4">
        <h3 className="text-lg font-bold">{recipe.name}</h3>
        <p className="text-sm text-gray-500 mb-2">
          {recipe.description}
        </p>

        {/* Time + Rating */}
        <div className="flex justify-between items-center text-sm mb-3">
          <div className="flex items-center gap-1 text-gray-500">
            <Clock className="h-4 w-4" />
            {recipe.time} min
          </div>

          <div className="flex items-center gap-1">
            {[...Array(5)].map((_, i) => (
              <Star
                key={i}
                className={`h-4 w-4 ${
                  i < Math.round(recipe.rating)
                    ? "text-yellow-500 fill-yellow-500"
                    : "text-gray-300"
                }`}
              />
            ))}
            <span className="text-xs font-bold">{recipe.rating}</span>
          </div>
        </div>

        {/* Button (UPDATED 🚀) */}
        <button
          onClick={() => navigate(`/cook/${recipe.id}`)}
          className="w-full bg-orange-600 text-white py-2 rounded hover:bg-orange-700 transition"
        >
          Start Cooking
        </button>
      </div>
    </div>
  );
};

export default RecipeCard;