import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { PlusCircle, Trash2, CheckCircle } from "lucide-react";
import Navbar from "./components/Navbar";
import Sidebar from "./components/Sidebar";
import { useRecipes } from "./context/RecipeContext";

const empty = { name: "", type: "Veg", time: "", image: "", description: "", ingredients: [""], steps: [{ title: "", description: "" }] };

const AddRecipe = () => {
  const [form, setForm] = useState(empty);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [success, setSuccess] = useState(false);
  const { addRecipe } = useRecipes();
  const navigate = useNavigate();

  const set = (field, val) => setForm((p) => ({ ...p, [field]: val }));

  const setIngredient = (i, val) => {
    const arr = [...form.ingredients];
    arr[i] = val;
    set("ingredients", arr);
  };

  const setStep = (i, field, val) => {
    const arr = [...form.steps];
    arr[i] = { ...arr[i], [field]: val };
    set("steps", arr);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    await addRecipe({ ...form, time: Number(form.time), ingredients: form.ingredients.filter(Boolean) });
    setSuccess(true);
    setForm(empty);
    setTimeout(() => { setSuccess(false); navigate("/home"); }, 1800);
  };

  const inputCls = "w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-orange-400 bg-white";
  const labelCls = "block text-sm font-semibold text-gray-700 mb-1";

  return (
    <div className="min-h-screen bg-gray-50 flex">
      <Sidebar open={sidebarOpen} onClose={() => setSidebarOpen(false)} />
      <div className="flex-1 flex flex-col">
        <Navbar query="" onQueryChange={() => {}} onMenuClick={() => setSidebarOpen(true)} />
        <main className="p-6 max-w-2xl mx-auto w-full">
          <h1 className="text-2xl font-bold mb-6 text-gray-800">Add New Recipe</h1>

          {success && (
            <div className="flex items-center gap-2 bg-green-50 border border-green-300 text-green-700 rounded-xl px-4 py-3 mb-6">
              <CheckCircle className="h-5 w-5" /> Recipe added successfully! Redirecting...
            </div>
          )}

          <form onSubmit={handleSubmit} className="bg-white rounded-2xl shadow p-6 space-y-5">
            {/* Name */}
            <div>
              <label className={labelCls}>Recipe Name</label>
              <input required className={inputCls} placeholder="e.g. Butter Chicken" value={form.name} onChange={(e) => set("name", e.target.value)} />
            </div>

            {/* Type + Time */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className={labelCls}>Type</label>
                <select className={inputCls} value={form.type} onChange={(e) => set("type", e.target.value)}>
                  <option>Veg</option>
                  <option>Non-Veg</option>
                  <option>Dessert</option>
                </select>
              </div>
              <div>
                <label className={labelCls}>Time (minutes)</label>
                <input required type="number" min="1" className={inputCls} placeholder="30" value={form.time} onChange={(e) => set("time", e.target.value)} />
              </div>
            </div>

            {/* Image URL */}
            <div>
              <label className={labelCls}>Image URL</label>
              <input className={inputCls} placeholder="https://..." value={form.image} onChange={(e) => set("image", e.target.value)} />
              {form.image && (
                <img src={form.image} alt="preview" className="mt-2 h-32 w-full object-cover rounded-xl" onError={(e) => (e.target.style.display = "none")} />
              )}
            </div>

            {/* Description */}
            <div>
              <label className={labelCls}>Description</label>
              <textarea required rows={3} className={inputCls} placeholder="Short description..." value={form.description} onChange={(e) => set("description", e.target.value)} />
            </div>

            {/* Ingredients */}
            <div>
              <label className={labelCls}>Ingredients</label>
              <div className="space-y-2">
                {form.ingredients.map((ing, i) => (
                  <div key={i} className="flex gap-2">
                    <input className={inputCls} placeholder={`Ingredient ${i + 1}`} value={ing} onChange={(e) => setIngredient(i, e.target.value)} />
                    {form.ingredients.length > 1 && (
                      <button type="button" onClick={() => set("ingredients", form.ingredients.filter((_, idx) => idx !== i))} className="text-red-400 hover:text-red-600">
                        <Trash2 className="h-4 w-4" />
                      </button>
                    )}
                  </div>
                ))}
              </div>
              <button type="button" onClick={() => set("ingredients", [...form.ingredients, ""])} className="mt-2 text-sm text-orange-600 hover:underline flex items-center gap-1">
                <PlusCircle className="h-4 w-4" /> Add Ingredient
              </button>
            </div>

            {/* Steps */}
            <div>
              <label className={labelCls}>Steps</label>
              <div className="space-y-3">
                {form.steps.map((step, i) => (
                  <div key={i} className="border border-gray-100 rounded-xl p-3 space-y-2 bg-gray-50">
                    <div className="flex justify-between items-center">
                      <span className="text-xs font-bold text-orange-500">Step {i + 1}</span>
                      {form.steps.length > 1 && (
                        <button type="button" onClick={() => set("steps", form.steps.filter((_, idx) => idx !== i))} className="text-red-400 hover:text-red-600">
                          <Trash2 className="h-4 w-4" />
                        </button>
                      )}
                    </div>
                    <input className={inputCls} placeholder="Step title" value={step.title} onChange={(e) => setStep(i, "title", e.target.value)} />
                    <textarea rows={2} className={inputCls} placeholder="Step description" value={step.description} onChange={(e) => setStep(i, "description", e.target.value)} />
                  </div>
                ))}
              </div>
              <button type="button" onClick={() => set("steps", [...form.steps, { title: "", description: "" }])} className="mt-2 text-sm text-orange-600 hover:underline flex items-center gap-1">
                <PlusCircle className="h-4 w-4" /> Add Step
              </button>
            </div>

            <button type="submit" className="w-full bg-orange-600 text-white py-3 rounded-xl font-semibold hover:bg-orange-700 transition text-base">
              Add Recipe
            </button>
          </form>
        </main>
      </div>
    </div>
  );
};

export default AddRecipe;
