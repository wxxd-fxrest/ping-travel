import React from "react";
import { useNavigate } from "react-router-dom";

const Record = ({recordData}) => {
    const navigate = useNavigate();
    console.log(recordData.DocID)
    return (
        <div>
            <h3> 장소 : {recordData.Data.placeName} </h3>
            <p> 기록 : {recordData.Data.record} </p>
            <button onClick={(e) => {
                e.preventDefault();
                navigate(`/record/${recordData.DocID}`)
            }}> 상세보기 </button>
        </div>
    )
};

export default Record;