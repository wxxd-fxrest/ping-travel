import React, { useContext } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { AuthContext } from "../../AuthContext";
import styled from "styled-components";

const Plan = ({planData, profileUser}) => {
    const navigate = useNavigate();
    const location = useLocation();
    const {currentUser} = useContext(AuthContext);

    const pathname = location.pathname; 
    const pathUID = (pathname.split('/')[2]);
    let currentUserID = currentUser.email.split('@')[0];

    return (
        <Container>

            {planData.Data.ownerUID !== undefined && <div className="PlanContainer">
                <p> 공유한 친구 : {planData.Data.ownerUID} </p>
                <h3> 장소 : {planData.Data.placeName} </h3>
                <p> 날짜 : {planData.Data.date} </p>
                <p> 계획 : {planData.Data.plan} </p>
                <p> {planData.Data.ownerUID} </p>

                {(currentUserID === pathUID || !pathUID) && 
                    <button onClick={(e) => {
                        e.preventDefault();
                        navigate(`/plan/${profileUser.uid}/${planData.DocID}`);
                    }}> 상세보기 </button>}
            </div>}

            {planData.Data.selectFriend !== undefined && <div className="PlanContainer">
                <p> 함께한 친구 : {planData.Data.selectFriend} </p>
                <h3> 장소 : {planData.Data.placeName} </h3>
                <p> 날짜 : {planData.Data.date} </p>
                <p> 계획 : {planData.Data.plan} </p>
                <p> {profileUser.uid} </p>

                {(currentUserID === pathUID || !pathUID) && 
                    <button onClick={(e) => {
                        e.preventDefault();
                        navigate(`/plan/${profileUser.uid}/${planData.DocID}`);
                    }}> 상세보기 </button>}
            </div>}

        </Container>
    )
};

const Container = styled.div`
    .PlanContainer {
        display: flex;
        background-color: rgba(0, 150, 138, 0.3);
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

export default Plan;