import React, { useContext, useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { AuthContext } from "../../AuthContext";

const Record = ({recordData, profileUser}) => {
    const navigate = useNavigate();
    const location = useLocation();
    const {currentUser} = useContext(AuthContext);

    const pathname = location.pathname; 
    const pathUID = (pathname.split('/')[2]);
    // console.log(pathUID)
    let currentUserID = currentUser.email.split('@')[0];
    // console.log(currentUserID)

    const [share, setShare] = useState(false);
    // let saveDate ;
    // if(recordData !== ) {
    //     saveDate = recordData.Data.recordDate.toDate()
    // }
    // let Year = saveDate.getFullYear();
    // let Month = saveDate.getMonth()+1;
    // let Date = saveDate.getDate();
    // let Hours = saveDate.getHours();
    // let Minutes = saveDate.getMinutes();
    // let lengthh ;
    useEffect(() => {
        if(`${recordData.Data.selectFriend}`.length !== 0) {
            setShare(true);
        } 
        // console.log(recordData.Data.ownerUID)
    }, [recordData, share]); 
    // console.log(recordData)

    return (
        <div style={{borderBottom: "1px solid"}}>
            {/* {share === true && <h4> 공유된 기록 </h4>} */}
            {recordData.Data.ownerUID !== undefined && <>
                <p> 공유한 친구 : {recordData.Data.ownerUID} </p>
                <h3> 장소 : {recordData.Data.placeName} </h3>
                <p> 기록 : {recordData.Data.record} </p>
                <p> {recordData.Data.ownerUID} </p>
                {currentUserID === pathUID && 
                    <button onClick={(e) => {
                        e.preventDefault();
                        navigate(`/record/${profileUser.uid}/${recordData.DocID}`);
                    }}> 상세보기 </button>}
            </>}
            {recordData.Data.selectFriend !== undefined && <>
                <p> 함께한 친구 : {recordData.Data.selectFriend} </p>
                <h3> 장소 : {recordData.Data.placeName} </h3>
                <p> 기록 : {recordData.Data.record} </p>
                <p> {profileUser.uid} </p>
                {/* <p> 시간 : {Year}-{Month}-{Date} / {Hours} : {Minutes} </p>  */}
                {currentUserID === pathUID && 
                    <button onClick={(e) => {
                        e.preventDefault();
                        navigate(`/record/${profileUser.uid}/${recordData.DocID}`);
                    }}> 상세보기 </button>}
            </>}
        </div>
    )
};

export default Record;