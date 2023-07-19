import React, { useContext } from "react";
import { useNavigate } from "react-router-dom";
import styled from "styled-components";
import { AuthContext } from "../../AuthContext";
import { HiOutlineUsers, HiMiniSparkles, HiOutlineRocketLaunch } from "react-icons/hi2";

const Friend = ({profileUser, friendID}) => {
    const {currentUser} = useContext(AuthContext);
    const navigate = useNavigate();

    const friendList = () => {
        let IDlist = [] ; 
        if(friendID) {
            for(let i = 0; i < friendID.length; i++) {
                IDlist.push(
                    <div key={i} className="friendList">
                        <div className="friendName">
                            <HiMiniSparkles size="12px" className="friendIcon"/> 
                            <p> {friendID[i]} </p>
                        </div>
                        {profileUser.uid !== currentUser.uid ? null : 
                            <HiOutlineRocketLaunch size="15px" className="goFriendProfile"
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
                <HiOutlineUsers size="30px"/>
                <h3> 친구 </h3>
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
        align-items: flex-end;
        margin-top: 10px;
        margin-bottom: 10px;
        @media screen and (max-width: 900px) {
            justify-content: flex-end;
            margin-right: 10px;
        }
    }
    h3 {
        font-size: 20px;
        margin-left: 10px;
        @media screen and (max-width: 900px) {
            display: none;
        }
    }
    .friendList {
        display: flex;
        flex-direction: row;
        justify-content: space-between;
        background-color: rgba(255, 255, 255, 0.27);
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
            .friendIcon {
                color: white;
                @media screen and (max-width: 900px) {
                    display: none;
                }
            }
            p {
                margin-left: 5px;
                color: white;
            }
        }
        .goFriendProfile {
            color: rgba(0, 150, 138, 0.85);
            margin-left: 5px;
            cursor: pointer;
            &:hover {
                color: rgba(0, 150, 138);
            }
        }
    }
`;

export default Friend;