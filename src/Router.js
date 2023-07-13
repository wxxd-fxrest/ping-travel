import React, { useContext } from "react";
import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import Home from "./routers/Home";
import PlacePage from "./routers/PlacePage";
import Search from "./components/search/Search.js";
import Auth from "./routers/Auth";
import { AuthContext } from "./AuthContext";
import ProfileData from "./components/profile/ProfileData";
import RecordSave from "./components/record/RecordSave";
import RecordSearch from "./components/record/RecordSearch";
import RecordDetail from "./components/record/RecordDetail";
import AddRecord from "./components/record/AddRecord";

const Router = ({mainPing, loginUserData}) => {
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
            <Route path='/record/search' element={<RecordSearch />}  />

            <Route index element={
              <ProtectedRoute>
                <Home mainPing={mainPing} loginUserData={loginUserData}/>
              </ProtectedRoute> } />
              
            <Route path="/place/:id" element={<PlacePage mainPing={mainPing} />} />
            <Route path="/profile/:id" element={<ProfileData mainPing={mainPing} />} />
            <Route path="/record/save/:id" element={<RecordSave />} />
            <Route path="/record/:uid/:id" element={<RecordDetail />} />
            <Route path="/addrecord/:uid/:id" element={<AddRecord />} />
        </Routes>
    </BrowserRouter>
  );
};

export default Router;
