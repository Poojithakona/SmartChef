import React, { useState } from "react";
import { Heart } from "lucide-react";
import Navbar from "./components/Navbar";
import Sidebar from "./components/Sidebar";
import RecipeCard from "./components/RecipeCard";
import { useRecipes } from "./context/RecipeContext";

const Favorites = () => {
  const { recipes, favorites } = useRecipes();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [query, setQuery] = useState("");

  const favRecipes = recipes.filter(
    (r) => favorites.includes(r.id) && r.name.toLowerCase().includes(query.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-gray-50 flex">
      <Sidebar open={sidebarOpen} onClose={() => setSidebarOpen(false)} />
      <div className="flex-1 flex flex-col">
        <Navbar query={query} onQueryChange={setQuery} onMenuClick={() => setSidebarOpen(true)} />
        <main className="p-6">
          <h1 className="text-2xl font-bold mb-6 text-gray-800 flex items-center gap-2">
            <Heart className="h-6 w-6 text-red-500 fill-red-500" /> Favorites
          </h1>

          {favRecipes.length === 0 ? (
            <div className="flex flex-col items-center justify-center mt-32 text-gray-400">
              <Heart className="h-16 w-16 mb-4 text-gray-200" />
              <p className="text-xl font-semibold">No favorites yet</p>
              <p className="text-sm mt-1">Tap the ❤️ on any recipe to save it here.</p>
            </div>
          ) : (
            <div className="grid md:grid-cols-3 gap-6">
              {favRecipes.map((r) => (
                <RecipeCard key={r.id} recipe={r} />
              ))}
            </div>
          )}
        </main>
      </div>
    </div>
  );
};

export default Favorites;
