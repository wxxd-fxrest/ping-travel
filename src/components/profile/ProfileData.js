/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import { db } from "../../firebase";
import { collection, getDocs, query, where } from "firebase/firestore";
import Profile from "../profile/Profile.js";
import styled from "styled-components";
import BackButton from "../modal/BackButton";

const ProfileData = ({mainPing, loginUserData}) => {
    const location = useLocation();

    const [profileUser, setProfileUser] = useState([]);
    const [friendID, setFriendID] = useState([]);

    const pathname = location.pathname; 
    const pathUID = (pathname.split('/')[2]);
    let ID;
    // console.log(loginUserData);

    useEffect(() => {
        const getLoginUserData = async() => {
            if(pathUID) {
                const q = query(
                    collection(db, "UserInfo"), 
                    where("ID", "==", `${pathUID}`));
                const querySnapshot = await getDocs(q);
                querySnapshot.forEach((doc) => {
                    setProfileUser(doc.data());
                    setFriendID(doc.data().friendID);
                    // console.log(doc.id, " => ", doc.data());
                });     
            } else if(!pathUID) {
                ID = loginUserData.ID;
                const q = query(
                    collection(db, "UserInfo"), 
                    where("ID", "==", `${ID}`));
                const querySnapshot = await getDocs(q);
                querySnapshot.forEach((doc) => {
                    setProfileUser(doc.data());
                    setFriendID(doc.data().friendID);
                    // console.log(doc.id, " => ", doc.data());
                });     
            }
        };
        getLoginUserData();
    }, [loginUserData, pathUID]); 

    return (
        <Container>
            <div className={pathUID ? 'pathUIDhave' : 'pathUIDunHave'}>
                {pathUID &&
                    <BackButton />}
                <Profile mainPing={mainPing} 
                    profileUser={profileUser} 
                    friendID={friendID} 
                    pathUID={pathUID}/>
            </div>
        </Container>
    )
};

const Container = styled.div`
    /* background-color: rgba(0, 150, 138, 0.3); */
    width: 100%;
    height: 100vh;
    .pathUIDunHave {
        /* background-color: rgba(0, 150, 138, 0.3); */
        height: 100vh;
        width: 100%;
        display: flex;
    }
    .pathUIDhave {
        /* background-color: rgba(0, 150, 138, 0.3); */
        width: 40vw;
        height: 67vh;
        position: relative;
        .haveBackBtn {
            position: absolute;
            z-index: 1;
            color: white;
            top: 10px;
            cursor: pointer;
            color: rgba(0, 150, 138, 0.85);
        }
        @media screen and (max-width: 900px) {
            width: 80vw;
        }
    }
`;

export default ProfileData;