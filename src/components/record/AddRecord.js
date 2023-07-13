import React from "react";
import { useLocation } from "react-router-dom";
import RecordSearch from "./RecordSearch";

const AddRecord = () => {
    const location = useLocation() ;
    const pathname = location.pathname ; 
    const pathUID = (pathname.split('/')[2]);
    const pathDocID = (pathname.split('/')[3]);
    console.log(location.state)
    const state = (location.state)
    return(
        <div>
            AddRecord
            <RecordSearch pathUID={pathUID} pathDocID={pathDocID} state={state}/>
        </div>
    )
};

export default AddRecord;