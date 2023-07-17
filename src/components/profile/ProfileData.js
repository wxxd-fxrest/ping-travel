/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { db } from "../../firebase";
import { collection, getDocs, query, where } from "firebase/firestore";
import Profile from "../profile/Profile.js";
import styled from "styled-components";

const ProfileData = ({mainPing, loginUserData}) => {
    const navigate = useNavigate();
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
                    <button className="haveBackBtn"
                        onClick={(e) => {
                            e.preventDefault();
                            navigate(-1);
                        }}> 뒤로가기 </button>}

                <Profile mainPing={mainPing} profileUser={profileUser} friendID={friendID}/>
            </div>
        </Container>
    )
};

const Container = styled.div`
    /* background-color: wheat; */
        .pathUIDunHave {
            height: 100vh;
            width: 100%;
        }
        .pathUIDhave {
            width: 100vw;
            height: 100vh;
            position: relative;
            .haveBackBtn {
                position: absolute;
            }
        }

`;

export default ProfileData;