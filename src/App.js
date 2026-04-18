import React from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";

import LandingPage from "./LandingPage";
import Home from "./Home";
import Cooking from "./Cooking";
import AddRecipe from "./AddRecipe";
import ManageRecipes from "./ManageRecipes";
import Favorites from "./Favorites";
import { RecipeProvider } from "./context/RecipeContext";
import { AuthProvider, useAuth } from "./context/AuthContext";

const Protected = ({ children }) => {
  const { user } = useAuth();
  return user ? children : <Navigate to="/" replace />;
};

function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <RecipeProvider>
          <Routes>
            <Route path="/" element={<LandingPage />} />
            <Route path="/home" element={<Protected><Home /></Protected>} />
            <Route path="/cook/:id" element={<Protected><Cooking /></Protected>} />
            <Route path="/add" element={<Protected><AddRecipe /></Protected>} />
            <Route path="/manage" element={<Protected><ManageRecipes /></Protected>} />
            <Route path="/favorites" element={<Protected><Favorites /></Protected>} />
          </Routes>
        </RecipeProvider>
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;