import React, { useContext } from "react";
import { useNavigate } from "react-router-dom";
import styled from "styled-components";
import { AuthContext } from "../../AuthContext";
import { HiOutlineUsers, HiMiniSparkles, HiOutlineRocketLaunch, HiOutlineXCircle } from "react-icons/hi2";

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
                            <HiMiniSparkles size="12px" className="friendIcon"/> 
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
                <HiOutlineUsers size="30px" className="Icon"/>
                <h3> 친구 </h3>
                <HiOutlineXCircle size="30px" className="backIcon" onClick={() => setOpen(!open)} />
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
        position: relative;
        @media screen and (max-width: 900px) {
            margin-right: 10px;
        }
        .Icon {
            color: rgba(0, 150, 138, 0.95);
        }
        h3 {
            color: rgba(0, 150, 138, 0.95);
            font-size: 20px;
            @media screen and (max-width: 1100px) {
                display: none;
            }
        }
        .backIcon {
            color: rgba(0, 150, 138, 0.95);
            position: absolute;
            right: 0px;
            cursor: pointer;
            &:hover {
                color: rgba(0, 150, 138, 0.58);
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
        background-color: rgba(0, 150, 138, 0.45);
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
            width: 100px;
            .friendIcon {
                color: white;
                @media screen and (max-width: 900px) {
                    display: none;
                }
            }
            p {
                display: flex;
                margin-left: 5px;
                color: white;
                word-break: break-all;
            }
        }
        .goFriendProfile {
            color: rgba(0, 150, 138, 0.85);
            margin-left: 5px;
            height: 15px;
            width: 15px;
            cursor: pointer;
            &:hover {
                color: rgba(0, 150, 138);
            }
        }
    }
`;

export default Friend;