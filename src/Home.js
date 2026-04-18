import React, { useState, useMemo } from "react";
import { Sparkles } from "lucide-react";

import Navbar from "./components/Navbar";
import Sidebar from "./components/Sidebar";
import FilterBar from "./components/FilterBar";
import RecipeCard from "./components/RecipeCard";
import { useRecipes } from "./context/RecipeContext";

const Home = () => {
  const { recipes } = useRecipes();
  const [query, setQuery] = useState("");
  const [filter, setFilter] = useState("All");
  const [sidebarOpen, setSidebarOpen] = useState(false);

  // Filter logic
  // eslint-disable-next-line react-hooks/exhaustive-deps
  const filtered = useMemo(() => {
    const q = query.toLowerCase();

    return recipes.filter((r) => {
      const matchesQuery =
        !q ||
        r.name.toLowerCase().includes(q) ||
        r.type.toLowerCase().includes(q);

      const matchesFilter =
        filter === "All" ||
        (filter === "Veg" && r.type === "Veg") ||
        (filter === "Non-Veg" && r.type === "Non-Veg") ||
        (filter === "Desserts" && r.type === "Dessert") ||
        (filter === "Quick Recipes" && r.tags?.includes("Quick")) ||
        (filter === "Healthy" && r.tags?.includes("Healthy"));

      return matchesQuery && matchesFilter;
    });
  }, [query, filter]);

  return (
    <div className="min-h-screen bg-gray-50">

      <div className="flex min-h-screen">
        {/* Sidebar */}
        <Sidebar open={sidebarOpen} onClose={() => setSidebarOpen(false)} />

        <div className="flex-1 flex flex-col">

          {/* Navbar */}
          <Navbar
            query={query}
            onQueryChange={setQuery}
            onMenuClick={() => setSidebarOpen(true)}
          />

          <main className="p-6">

            {/* Hero */}
            <div className="bg-orange-500 text-white p-6 rounded-xl mb-6">
              <div className="flex items-center gap-2 text-sm mb-2">
                <Sparkles size={16} />
                Trending this week
              </div>

              <h1 className="text-3xl font-bold">
                Cook smarter, eat happier 🍳
              </h1>

              <p className="text-sm mt-2">
                Discover recipes and start cooking instantly.
              </p>
            </div>

            {/* Filters */}
            <div className="mb-6">
              <h2 className="text-xl font-bold mb-2">
                {query ? `Results for "${query}"` : "Popular Recipes"}
              </h2>

              <FilterBar active={filter} onChange={setFilter} />
            </div>

            {/* Recipes */}
            {filtered.length === 0 ? (
              <p>No recipes found</p>
            ) : (
              <div className="grid md:grid-cols-3 gap-6">
                {filtered.map((r) => (
                  <RecipeCard key={r.id} recipe={r} />
                ))}
              </div>
            )}

          </main>
        </div>
      </div>
    </div>
  );
};

export default Home;