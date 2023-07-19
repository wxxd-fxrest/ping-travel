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
        // console.log(recordData.Data.writeUID)
    }, [recordData, share]); 
    // console.log(recordData)

    return (
        <Container>

            {recordData.Data.writeUID !== undefined && <div className="RecordContainer">
                <p> 공유한 친구 : {recordData.Data.writeUID} </p>
                <h3> 장소 : {recordData.Data.placeName} </h3>
                <p> 날짜 : {recordData.Data.date} </p>
                <p> 기록 : {recordData.Data.record} </p>
                <p> {recordData.Data.writeUID} </p>

                {(currentUserID === pathUID || !pathUID) && 
                    <button onClick={(e) => {
                        e.preventDefault();
                        navigate(`/record/${profileUser.uid}/${recordData.DocID}`);
                    }}> 상세보기 </button>}
            </div>}

            {recordData.Data.selectFriend !== undefined && <div className="RecordContainer">
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
            </div>}

        </Container>
    )
};

const Container = styled.div`
    .RecordContainer {
        display: flex;
        background-color: rgba(255, 255, 255, 0.27);
        border-radius: 10px;
        list-style: none;
        text-align: start;
        align-items: flex-start;
        justify-content: center;
        position: relative;
        flex-direction: column;
        margin-top: 5px;
        margin-bottom: 10px;
        padding: 13px;
        display: flex;
        border-bottom: solid 1px black;
        border-right: solid 1px black;
        p {
            color: rgba(0, 150, 138, 0.9);
            font-size: 13px;
            margin-bottom: 5px;
        }
        h3 {
            color: rgba(255, 255, 255);
            font-size: 14px;
            margin-bottom: 10px;
        }
        button {
            width: 100%;
            height: 25px;
            border-radius: 50px;
            border: none;
            background-color: rgba(0, 150, 138, 0.85);
            color: white;
            font-size: 10px;
            font-weight: bold;
            margin-top: 5px;
            cursor: pointer;
            &:hover {
                background-color: rgba(0, 150, 138);
            }
        }
    }
`;

export default Record;