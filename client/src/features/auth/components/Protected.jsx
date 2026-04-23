import React from "react";
import { Navigate, useLocation } from "react-router-dom";
import { useSelector } from "react-redux";
import Loader from "./Loader";

export const Protected = ({ children }) => {
  const { user, loading, token } = useSelector((state) => state.auth);
  const location = useLocation();

  // 1. Agar backend se user verify ho raha hai toh loader dikhao
  if (loading) {
    return <Loader />;
  }

  // 2. Agar na Redux mein user hai aur na hi token (matlab user logged in nahi hai)
  // Tabhi login page par bhejo
  if (!user && !token) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  // 3. Sab sahi hai, toh page dikhao
  return children;
};