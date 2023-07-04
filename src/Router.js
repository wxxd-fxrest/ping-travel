import React from "react";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import Home from "./routers/Home";
import PlacePage from "./routers/PlacePage";
import Search from "./components/search/Search.js";
import Auth from "./routers/Auth";
import Profile from "./components/profile/Profile";

const Router = () => {
  return (
    <BrowserRouter>
        <Routes>
            <Route path='/' element={<Home />}  />
            <Route path='/auth' element={<Auth />}  />
            <Route path='/profile/:id' element={<Profile />}  />
            <Route path='/search' element={<Search />}  />
            <Route path="/place/:id" element={<PlacePage />} />
        </Routes>
    </BrowserRouter>
  );
};

export default Router;
