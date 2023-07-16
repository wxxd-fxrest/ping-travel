import React, { useContext } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import styled from "styled-components";
import { AuthContext } from "../../AuthContext";

const Plan = ({planData, profileUser}) => {
    const navigate = useNavigate();
    const location = useLocation();
    const {currentUser} = useContext(AuthContext);

    const pathname = location.pathname; 
    const pathUID = (pathname.split('/')[2]);
    let currentUserID = currentUser.email.split('@')[0];

    return (
        <Container style={{borderBottom: "1px solid"}}>

            {planData.Data.ownerUID !== undefined && <>
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
            </>}

            {planData.Data.selectFriend !== undefined && <>
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
            </>}

        </Container>
    )
};

const Container = styled.div``;

export default Plan;