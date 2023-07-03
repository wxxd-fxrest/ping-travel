import React from "react";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import Home from "./routers/Home";
import PlacePage from "./routers/PlacePage";

const Router = () => {
  return (
    <BrowserRouter>
        <Routes>
            <Route path='/' element={<Home />}  />
            <Route path="/place/:id" element={<PlacePage />} />
        </Routes>
    </BrowserRouter>
  );
};

export default Router;
