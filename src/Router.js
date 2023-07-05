import React, { useContext } from "react";
import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import Home from "./routers/Home";
import PlacePage from "./routers/PlacePage";
import Search from "./components/search/Search.js";
import Auth from "./routers/Auth";
import Profile from "./components/profile/Profile";
import { AuthContext } from "./AuthContext";

const Router = ({mainPing}) => {
  const {currentUser} = useContext(AuthContext); 

  const ProtectedRoute = ({children}) => {
    if(!currentUser) {
      return <Navigate to="/auth" /> 
    }
    return children ;
  } ; 
  return (
    <BrowserRouter>
        <Routes>
            <Route path='/' element={<Home mainPing={mainPing}/>}  />
            <Route path='/auth' element={<Auth />}  />
            <Route path='/search' element={<Search />}  />

            <Route path="/profile/:id" element={
              <ProtectedRoute>
                <Profile mainPing={mainPing}/>
              </ProtectedRoute> } />
                            
            <Route path="/place/:id" element={<PlacePage />} />
        </Routes>
    </BrowserRouter>
  );
};

export default Router;
