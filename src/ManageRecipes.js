import React, { useState } from "react";
import { Pencil, Trash2, Save, X, Clock, Star } from "lucide-react";
import Navbar from "./components/Navbar";
import Sidebar from "./components/Sidebar";
import { useRecipes } from "./context/RecipeContext";

const ManageRecipes = () => {
  const { recipes, editRecipe, deleteRecipe } = useRecipes();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [editId, setEditId] = useState(null);
  const [editForm, setEditForm] = useState({});

  const startEdit = (r) => { setEditId(r.id); setEditForm({ name: r.name, type: r.type, time: r.time, description: r.description, image: r.image }); };
  const cancelEdit = () => { setEditId(null); setEditForm({}); };
  const saveEdit = (r) => { editRecipe({ ...r, ...editForm, time: Number(editForm.time) }); cancelEdit(); };

  const inputCls = "w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-orange-400";

  return (
    <div className="min-h-screen bg-gray-50 flex">
      <Sidebar open={sidebarOpen} onClose={() => setSidebarOpen(false)} />
      <div className="flex-1 flex flex-col">
        <Navbar query="" onQueryChange={() => {}} onMenuClick={() => setSidebarOpen(true)} />
        <main className="p-6">
          <h1 className="text-2xl font-bold mb-6 text-gray-800">Manage Recipes</h1>

          {recipes.length === 0 && (
            <p className="text-gray-500 text-center mt-20">No recipes found.</p>
          )}

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-5">
            {recipes.map((r) => (
              <div key={r.id} className="bg-white rounded-2xl shadow border border-gray-100 overflow-hidden">
                <img
                  src={r.image}
                  alt={r.name}
                  referrerPolicy="no-referrer"
                  className="w-full h-40 object-cover"
                  onError={(e) => { e.target.onerror = null; e.target.src = "https://www.themealdb.com/images/media/meals/1550441882.jpg"; }}
                />

                <div className="p-4">
                  {editId === r.id ? (
                    <div className="space-y-2">
                      <input className={inputCls} value={editForm.name} onChange={(e) => setEditForm((p) => ({ ...p, name: e.target.value }))} placeholder="Name" />
                      <select className={inputCls} value={editForm.type} onChange={(e) => setEditForm((p) => ({ ...p, type: e.target.value }))}>
                        <option>Veg</option><option>Non-Veg</option><option>Dessert</option>
                      </select>
                      <input className={inputCls} type="number" value={editForm.time} onChange={(e) => setEditForm((p) => ({ ...p, time: e.target.value }))} placeholder="Time (min)" />
                      <input className={inputCls} value={editForm.image} onChange={(e) => setEditForm((p) => ({ ...p, image: e.target.value }))} placeholder="Image URL" />
                      <textarea rows={2} className={inputCls} value={editForm.description} onChange={(e) => setEditForm((p) => ({ ...p, description: e.target.value }))} placeholder="Description" />
                      <div className="flex gap-2 pt-1">
                        <button onClick={() => saveEdit(r)} className="flex-1 flex items-center justify-center gap-1 bg-orange-600 text-white py-2 rounded-lg text-sm hover:bg-orange-700 transition">
                          <Save className="h-4 w-4" /> Save
                        </button>
                        <button onClick={cancelEdit} className="flex-1 flex items-center justify-center gap-1 border border-gray-300 text-gray-600 py-2 rounded-lg text-sm hover:bg-gray-50 transition">
                          <X className="h-4 w-4" /> Cancel
                        </button>
                      </div>
                    </div>
                  ) : (
                    <>
                      <div className="flex justify-between items-start mb-1">
                        <h3 className="font-bold text-gray-800 text-base leading-tight">{r.name}</h3>
                        <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${r.type === "Veg" ? "bg-green-100 text-green-700" : r.type === "Non-Veg" ? "bg-red-100 text-red-700" : "bg-purple-100 text-purple-700"}`}>
                          {r.type}
                        </span>
                      </div>
                      <p className="text-xs text-gray-500 mb-3 line-clamp-2">{r.description}</p>
                      <div className="flex items-center gap-3 text-xs text-gray-500 mb-4">
                        <span className="flex items-center gap-1"><Clock className="h-3 w-3" />{r.time} min</span>
                        <span className="flex items-center gap-1"><Star className="h-3 w-3 text-yellow-500 fill-yellow-500" />{r.rating}</span>
                      </div>
                      <div className="flex gap-2">
                        <button onClick={() => startEdit(r)} className="flex-1 flex items-center justify-center gap-1 border border-orange-500 text-orange-600 py-2 rounded-lg text-sm hover:bg-orange-50 transition">
                          <Pencil className="h-4 w-4" /> Edit
                        </button>
                        <button onClick={() => deleteRecipe(r.id)} className="flex-1 flex items-center justify-center gap-1 border border-red-400 text-red-500 py-2 rounded-lg text-sm hover:bg-red-50 transition">
                          <Trash2 className="h-4 w-4" /> Delete
                        </button>
                      </div>
                    </>
                  )}
                </div>
              </div>
            ))}
          </div>
        </main>
      </div>
    </div>
  );
};

export default ManageRecipes;
