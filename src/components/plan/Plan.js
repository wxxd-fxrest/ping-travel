import React, { useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../../AuthContext";

const Plan = ({planData, profileUser}) => {
    const navigate = useNavigate();
    // let saveDate ;
    // if(planData !== ) {
    //     saveDate = planData.Data.recordDate.toDate()
    // }
    // let Year = saveDate.getFullYear();
    // let Month = saveDate.getMonth()+1;
    // let Date = saveDate.getDate();
    // let Hours = saveDate.getHours();
    // let Minutes = saveDate.getMinutes();
    // let lengthh ;

    // useEffect(() => {
    //     if(`${planData.Data.selectFriend}`.length !== 0) {
    //         setShare(true);
    //     } 
    //     // console.log(planData.Data.ownerUID)
    // }, [planData, share]); 
    console.log(planData)

    return (
        <div style={{borderBottom: "1px solid"}}>
            {planData.Data.ownerUID !== undefined && <>
                <p> 공유한 친구 : {planData.Data.ownerUID} </p>
                <h3> 장소 : {planData.Data.placeName} </h3>
                <p> 계획 : {planData.Data.plan} </p>
                <p> {planData.Data.ownerUID} </p>
                <button onClick={(e) => {
                    e.preventDefault();
                    navigate(`/plan/${profileUser.uid}/${planData.DocID}`);
                }}> 상세보기 </button>
            </>}
            {planData.Data.selectFriend !== undefined && <>
                <p> 함께한 친구 : {planData.Data.selectFriend} </p>
                <h3> 장소 : {planData.Data.placeName} </h3>
                <p> 계획 : {planData.Data.plan} </p>
                <p> {profileUser.uid} </p>
                {/* <p> 시간 : {Year}-{Month}-{Date} / {Hours} : {Minutes} </p>  */}
                <button onClick={(e) => {
                    e.preventDefault();
                    navigate(`/plan/${profileUser.uid}/${planData.DocID}`);
                }}> 상세보기 </button>
            </>}
        </div>
    )
};

export default Plan;