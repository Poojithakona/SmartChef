import React, { createContext, useContext, useEffect, useState } from "react";
import {
  collection,
  onSnapshot,
  addDoc,
  updateDoc,
  deleteDoc,
  doc,
  setDoc,
  getDoc,
} from "firebase/firestore";
import { db } from "../firebase";
import { useAuth } from "./AuthContext";
import { recipes as initialRecipes } from "../data/recipes";

const RecipeContext = createContext();

export const RecipeProvider = ({ children }) => {
  const { user } = useAuth();
  const [recipes, setRecipes] = useState([]); // eslint-disable-line no-unused-vars
  const [userRecipes, setUserRecipes] = useState([]);
  const [favorites, setFavorites] = useState([]);

  // Listen to user-added recipes from Firestore
  useEffect(() => {
    if (!user) { setUserRecipes([]); return; }
    const unsub = onSnapshot(collection(db, "recipes"), (snap) => {
      const data = snap.docs.map((d) => ({ ...d.data(), firestoreId: d.id }));
      setUserRecipes(data);
    });
    return unsub;
  }, [user]);

  // Load favorites from Firestore
  useEffect(() => {
    if (!user) { setFavorites([]); return; }
    const favRef = doc(db, "favorites", user.uid);
    getDoc(favRef).then((snap) => {
      if (snap.exists()) setFavorites(snap.data().ids || []);
    });
  }, [user]);

  // All recipes = static + user-added
  const allRecipes = [...initialRecipes, ...userRecipes];

  const addRecipe = async (recipe) => {
    const newRecipe = { ...recipe, id: Date.now(), rating: 4.5, tags: [], uid: user?.uid };
    await addDoc(collection(db, "recipes"), newRecipe);
  };

  const editRecipe = async (updated) => {
    // If it's a user-added recipe (has firestoreId), update Firestore
    const match = userRecipes.find((r) => r.id === updated.id);
    if (match?.firestoreId) {
      const { firestoreId, ...data } = updated;
      await updateDoc(doc(db, "recipes", match.firestoreId), data);
    } else {
      // Static recipe — update locally
      setRecipes((prev) => prev.map((r) => (r.id === updated.id ? updated : r)));
    }
  };

  const deleteRecipe = async (id) => {
    const match = userRecipes.find((r) => r.id === id);
    if (match?.firestoreId) {
      await deleteDoc(doc(db, "recipes", match.firestoreId));
    } else {
      setRecipes((prev) => prev.filter((r) => r.id !== id));
    }
    const newFavs = favorites.filter((fid) => fid !== id);
    setFavorites(newFavs);
    if (user) await setDoc(doc(db, "favorites", user.uid), { ids: newFavs });
  };

  const toggleFavorite = async (id) => {
    const newFavs = favorites.includes(id)
      ? favorites.filter((fid) => fid !== id)
      : [...favorites, id];
    setFavorites(newFavs);
    if (user) await setDoc(doc(db, "favorites", user.uid), { ids: newFavs });
  };

  const isFavorite = (id) => favorites.includes(id);

  return (
    <RecipeContext.Provider
      value={{ recipes: allRecipes, favorites, addRecipe, editRecipe, deleteRecipe, toggleFavorite, isFavorite }}
    >
      {children}
    </RecipeContext.Provider>
  );
};

export const useRecipes = () => useContext(RecipeContext);
