import React, { useContext, useEffect } from "react";
import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import Home from "./routers/Home";
import PlacePage from "./routers/PlacePage";
import Search from "./components/search/Search.js";
import Auth from "./routers/Auth";
import Profile from "./components/profile/Profile";
import { AuthContext } from "./AuthContext";
import { collection, doc, getDoc, getDocs, onSnapshot, query, where } from "firebase/firestore";
import { db } from "./firebase";
import ProfileData from "./components/profile/ProfileData";

const Router = ({mainPing}) => {
  const {currentUser} = useContext(AuthContext); 

  const ProtectedRoute = ({children}) => {
    if(!currentUser) {
      return <Navigate to="/auth" /> 
    }
    return children ;
  }; 

  return (
    <BrowserRouter>
        <Routes>
            <Route path='/auth' element={<Auth />}  />
            <Route path='/search' element={<Search />}  />

            <Route index element={
              <ProtectedRoute>
                <Home mainPing={mainPing}/>
              </ProtectedRoute> } />
                            
            <Route path="/place/:id" element={<PlacePage mainPing={mainPing} />} />
            <Route path="/profile/:id" element={<ProfileData mainPing={mainPing} />} />
        </Routes>
    </BrowserRouter>
  );
};

export default Router;
