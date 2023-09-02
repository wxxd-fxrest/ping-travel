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

            {planData.Data.ownerID !== undefined && <div className="PlanContainer">
                <p> Ping Owner: {planData.Data.ownerID} </p>
                <h3> " {planData.Data.placeName} " </h3>
                <p> {planData.Data.date} </p>

                {(currentUserID === pathUID || !pathUID) && 
                    <button onClick={(e) => {
                        e.preventDefault();
                        navigate(`/plan/${profileUser.uid}/${planData.DocID}`);
                    }}> 상세보기 </button>}
            </div>}

            {planData.Data.selectFriend !== undefined && <div className="PlanContainer">
                <p> Ping Friend: {planData.Data.selectFriend} </p>
                <h3> " {planData.Data.placeName} " </h3>
                <p> {planData.Data.date} </p>

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
    padding-right: 29px;
    padding-left: 29px;
    .PlanContainer {
        display: flex;
        background-color: white;
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
        box-shadow: 0px 4px 6px rgba(0, 0, 0, 0.1), 0px 1px 3px rgba(0, 0, 0, 0.1);
        transition: transform 0.2s ease; /* 변환 효과 추가 */   
        p {
            color: rgba(250, 117, 65, 0.7);
            font-size: 12px;
            margin-bottom: 11px;
        }
        h3 {
            color: rgb(250, 117, 65);
            font-size: 15px;
            margin-bottom: 10px;
            font-weight: bold;
        }
        button {
            width: 100%;
            height: 30px;
            border-radius: 50px;
            border: none;
            background-color: rgba(250, 117, 65, 0.8);
            color: white;
            font-size: 10px;
            font-weight: bold;
            margin-top: 5px;
            cursor: pointer;
            position: relative; /* 상대적 위치 설정 */
            overflow: hidden; /* 내부 요소가 밖으로 벗어나지 않도록 설정 */
            /* 입체 효과를 위한 그림자 추가 */
            box-shadow: 0px 4px 6px rgba(0, 0, 0, 0.1), 0px 1px 3px rgba(0, 0, 0, 0.1);
            transition: transform 0.2s ease; /* 변환 효과 추가 */
        }

        button:hover {
            /* 호버 시 약간의 변환 효과 추가 */
            transform: translateZ(5px);
            background-color: rgb(250, 117, 65);
        }
    }
`;

export default Plan;