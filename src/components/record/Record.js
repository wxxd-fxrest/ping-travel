import React, { useContext, useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import styled from "styled-components";
import { AuthContext } from "../../AuthContext";

const Record = ({recordData, profileUser}) => {
    const navigate = useNavigate();
    const location = useLocation();
    const {currentUser} = useContext(AuthContext);

    const pathname = location.pathname; 
    const pathUID = (pathname.split('/')[2]);
    // console.log(pathUID)
    let currentUserID = currentUser.email.split('@')[0];
    const [share, setShare] = useState(false);

    useEffect(() => {
        if(`${recordData.Data.selectFriend}`.length !== 0) {
            setShare(true);
        } 
        // console.log(recordData.Data.ownerUID)
    }, [recordData, share]); 
    // console.log(recordData)

    return (
        <Container style={{borderBottom: "1px solid"}}>

            {recordData.Data.ownerUID !== undefined && <>
                <p> 공유한 친구 : {recordData.Data.ownerUID} </p>
                <h3> 장소 : {recordData.Data.placeName} </h3>
                <p> 날짜 : {recordData.Data.date} </p>
                <p> 기록 : {recordData.Data.record} </p>
                <p> {recordData.Data.ownerUID} </p>

                {(currentUserID === pathUID || !pathUID) && 
                    <button onClick={(e) => {
                        e.preventDefault();
                        navigate(`/record/${profileUser.uid}/${recordData.DocID}`);
                    }}> 상세보기 </button>}
            </>}

            {recordData.Data.selectFriend !== undefined && <>
                <p> 함께한 친구 : {recordData.Data.selectFriend} </p>
                <h3> 장소 : {recordData.Data.placeName} </h3>
                <p> 날짜 : {recordData.Data.date} </p>
                <p> 기록 : {recordData.Data.record} </p>
                <p> {profileUser.uid} </p>

                {(currentUserID === pathUID || !pathUID) && 
                    <button onClick={(e) => {
                        e.preventDefault();
                        navigate(`/record/${profileUser.uid}/${recordData.DocID}`);
                    }}> 상세보기 </button>}
            </>}

        </Container>
    )
};

const Container = styled.div``;

export default Record;