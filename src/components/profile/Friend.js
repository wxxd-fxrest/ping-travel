import React, { useContext } from "react";
import { useNavigate } from "react-router-dom";
import styled from "styled-components";
import { AuthContext } from "../../AuthContext";
import { HiOutlineUsers, HiOutlineRocketLaunch, HiOutlineXCircle } from "react-icons/hi2";

const Friend = ({profileUser, friendID, onClickOpen, setOpen, open}) => {
    const {currentUser} = useContext(AuthContext);
    const navigate = useNavigate();

    const friendList = () => {
        let IDlist = [] ; 
        if(friendID) {
            for(let i = 0; i < friendID.length; i++) {
                IDlist.push(
                    <div key={i} className="friendList">
                        <div className="friendName">
                            <p> {friendID[i]} </p>
                        </div>
                        {profileUser.uid !== currentUser.uid ? null : 
                            <HiOutlineRocketLaunch className="goFriendProfile"
                                onClick={(e) => {
                                    e.preventDefault();
                                    navigate(`/profile/${friendID[i]}`);
                                    window.location.reload() ;
                                }} /> }
                    </div>
                )
            }
            return IDlist; 
        } else {
            return; 
        }
    }; 

    return(
        <Container>
            <div className="friendHeader">
                <HiOutlineUsers size="25px" className="Icon"/>
                <h3> 친구 </h3>
                <HiOutlineXCircle size="25px" className="backIcon" onClick={() => setOpen(!open)} />
            </div>
            {friendList()}
        </Container>
    )
};

const Container = styled.div`
    display: flex;
    flex-direction: column;
    margin-left: 10px;
    margin-right: 10px;
    .friendHeader {
        display: flex;
        flex-direction: row;
        justify-content: start;
        align-items: center;
        margin-top: 10px;
        margin-bottom: 10px;
        position: relative;
        @media screen and (max-width: 900px) {
            margin-right: 10px;
        }
        .Icon {
            color: rgba(250, 117, 65);
        }
        h3 {
            color: rgba(250, 117, 65);
            font-size: 15px;
            margin-left: 5px;
            @media screen and (max-width: 1100px) {
                display: none;
            }
        }
        .backIcon {
            color: rgba(250, 117, 65, 0.58);
            position: absolute;
            right: 0px;
            cursor: pointer;
            &:hover {
                color: rgba(250, 117, 65, 0.95);
            }
            @media screen and (max-width: 900px) {
                right: -10px;
            }
        }
    }
    .friendList {
        display: flex;
        flex-direction: row;
        justify-content: space-between;
        background-color: rgba(250, 117, 65, 0.8);
        border-radius: 10px;
        list-style: none;
        text-align: start;
        align-items: flex-start;
        position: relative;
        margin-top: 5px;
        margin-bottom: 10px;
        padding: 10px;

        .friendName {
            display: flex;
            align-items: center; /* 텍스트와 아이콘을 세로 가운데 정렬 */
            max-width: 100px; /* 최대 너비를 100px로 제한 */
            overflow: hidden; /* 너비를 초과하는 부분은 숨김 */

            @media screen and (max-width: 1300px) {
                max-width: 60px;
            }
            
            .friendIcon {
                color: white;

                @media screen and (max-width: 900px) {
                    display: none;
                }
            }
            p {
                color: white;
                word-break: break-all;
                white-space: nowrap; /* 줄 바꿈 방지 */
                text-overflow: ellipsis; /* 텍스트가 넘칠 경우 ...으로 처리 */
                overflow: hidden; /* 너비를 초과하는 부분은 숨김 */
                flex-shrink: 1; /* 텍스트를 줄이지 않고 아이콘 크기 유지 */
                margin-left: 5px;
            }
        }

        .goFriendProfile {
            color: rgba(255, 255, 255, 0.5);
            margin-left: 5px;
            height: 15px;
            width: 15px;
            cursor: pointer;
            transition: transform 0.2s ease; /* 변환 효과 추가 */

            &:hover {
                color: white;
                transform: scale(1.3); /* 호버 시 약간 확대되도록 설정 */
            }
        }
    }
`;

export default Friend;