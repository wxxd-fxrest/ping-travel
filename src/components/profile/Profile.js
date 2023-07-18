/* eslint-disable no-redeclare */
/* eslint-disable no-unused-vars */
import React, { useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../../AuthContext";
import { db } from "../../firebase";
import { arrayRemove, collection, doc, onSnapshot, query, updateDoc } from "firebase/firestore";
import MapComponent from "../MapComponent";
import Friend from "./Friend";
import FirstTab from "./tabComponent/FirstTab";
import SecondTab from "./tabComponent/SecondTab";
import ThirdTab from "./tabComponent/ThirdTab";
import styled from "styled-components";

// import MARKER from '../../img/marker.png';
// import questionMarker from '../../img/question_marker.png';

// MARKER <a href="https://www.flaticon.com/free-icons/marker" title="marker icons">Marker icons created by kmg design - Flaticon</a> 
// questionMarker <a href="https://www.flaticon.com/free-icons/maps-and-location" title="maps and location icons">Maps and location icons created by Iconic Panda - Flaticon</a> 

const Profile = ({profileUser, friendID, pathUID}) => {
    const navigate = useNavigate();
    const {currentUser} = useContext(AuthContext);

    const [tab, setTab] = useState(0);
    const [myPingID, setMyPingID] = useState([]);

    useEffect(() => {
        const FeedCollection = query(
            collection(db, "UserInfo", `${profileUser.uid}`, "about"));
          onSnapshot(FeedCollection, (querySnapshot) => {
            let feedArray = []
            querySnapshot.forEach((doc) => {
                feedArray.push({
                    DocID: doc.id, 
                    Data: doc.data(),
                })
            });
            setMyPingID(feedArray);
            // console.log(feedArray)
        });
    }, [profileUser.uid]);
    
    const onOrganize = async(e) => {
        e.preventDefault();
        let currentUserID = currentUser.email.split('@')[0];
        const request = window.confirm("친구를 끊겠습니까?"); 
        if(request) {
            await updateDoc(doc(db, "UserInfo", currentUser.uid), {
                friendID: arrayRemove(profileUser.ID),
            }); // 수락 시 요청 데이터 삭제 
            await updateDoc(doc(db, "UserInfo", profileUser.uid), {
                friendID: arrayRemove(currentUserID),
            }); // 수락 시 요청 데이터 삭제 
            alert("정리 되었습니다."); 
            navigate(`/profile/${currentUserID}`);
        }
    };

    return (
        <Container> 
            <div className={pathUID ? 'pathUIDhave' : 'pathUIDunHave'}>
                <div className="profileFlex1">
                    <div className="profileContainer">
                        <img src={profileUser.attachmentUrl} alt="#" />
                        <p> {profileUser.ID} </p>
                            {profileUser.uid === currentUser.uid ? null : 
                                <button className="organizeBtn" onClick={onOrganize}> 친구 정리 </button>}
                    </div>

                    <div className="profileTab">
                        <h3 className={tab === 0 ? "selectTab" : "unSelectTab"} onClick={() => setTab(0)}> 여행 기록 </h3>
                        <h3 className={tab === 1 ? "selectTab" : "unSelectTab"} onClick={() => setTab(1)}> 여행 계획 </h3>
                        <h3 className={tab === 2 ? "selectTab" : "unSelectTab"} onClick={() => setTab(2)}> 리뷰 / 질문 </h3>
                    </div>

                    <div className="profileTabComponent">
                        {tab === 0 && <>
                            <div className="tabComponent">
                                <h4 className="wirteName"> 여행 기록 (with. friend) </h4>
                                {!pathUID &&
                                <button className="wirteBtn"
                                    onClick={() => navigate('/record/search')}> 기록하기 </button>}
                            </div>
                            <SecondTab profileUser={profileUser}/>
                        </>}
                        {tab === 1 && <>
                            <div className="tabComponent">
                                <h4 className="wirteName"> 여행 계획 (with. friend) </h4>
                                {!pathUID &&
                                <button className="wirteBtn"
                                    onClick={() => navigate('/plan/search')}> 계획하기 </button>}
                            </div>
                            <ThirdTab profileUser={profileUser} />
                        </>}
                        {tab === 2 && <div className="firstTabContainer">
                            <h4> 내가 남긴 질문/리뷰 </h4>
                            <div className="firstTab">
                                <div className="firstTabMap">
                                    <MapComponent />
                                </div>
                                <div className="firstTabComponent">
                                    <FirstTab myPingID={myPingID} profileUser={profileUser}/>
                                </div>
                            </div>
                        </div>}
                    </div>
                </div>
                <div className="profileFlex2">
                    <Friend profileUser={profileUser} friendID={friendID}/> 
                </div>
            </div>
        </Container>
    )
};

const Container = styled.div`
    background-color: white;
    display: flex;
    flex-direction: row;
    flex: 1;
    .pathUIDunHave {
        display: flex;
        .profileFlex1 {
            flex-direction: column;
            flex: 0.8;
            .profileContainer {
                background-color: blueviolet;
                display: flex;
                flex-direction: row;
                padding: 10px;
                align-items: center;
                justify-content: start;
                img {
                    width: 90px;
                    height: 90px;
                    border-radius: 100%;
                }
                p {
                    font-size: 20px;
                    margin-left: 20px;
                }
            }
            .profileTab {
                background-color: aliceblue;
                display: flex;
                flex-direction: row;
                /* padding-top: 10px; */
                /* padding-bottom: 10px; */
                flex: 1;
                justify-content: center;
                height: 40px;
                align-items: end;
                .unSelectTab {
                    background-color: green;
                    display: flex;
                    cursor: pointer;
                    flex: 0.34;
                    height: 32px;
                    margin-left: 1px;
                    margin-right: 1px;
                    font-size: 14px;
                    color: white;
                    align-items: end;
                    justify-content: center;
                    padding-bottom: 5px;
                    border-top-left-radius: 10px;
                    border-top-right-radius: 10px;
                    &:hover {
                        background-color: grey;
                    }
                }
                .selectTab {
                    background-color: grey;
                    display: flex;
                    cursor: pointer;
                    flex: 0.34;
                    height: 32px;
                    margin-left: 1px;
                    font-size: 14px;
                    color: white;
                    align-items: end;
                    justify-content: center;
                    padding-bottom: 5px;
                    border-top-left-radius: 10px;
                    border-top-right-radius: 10px;
                    &:hover {
                        background-color: grey;
                    }
                }
            }
            .profileTabComponent {
                background-color: grey;
                flex-direction: column;
                height: 70vh;
                overflow-y: scroll;
                -ms-overflow-style: none; /* 인터넷 익스플로러 */
                scrollbar-width: none; /* 파이어폭스 */
                padding: 15px;
                &::-webkit-scrollbar {
                    display: none;
                }
                .tabComponent {
                    /* background-color: skyblue; */
                    display: flex;
                    flex-direction: row;
                    flex: 1;
                    align-items: center;
                    /* padding: 8px; */
                    .wirteName {
                        /* background-color: aquamarine; */
                        display: flex;
                        flex: 0.85;
                        color: black;
                        margin-right: 5px;
                        font-size: 16px;
                    }
                    .wirteBtn {
                        flex: 0.15;
                        width: 100%;
                        height: 30px;
                        border-radius: 50px;
                        border: none;
                        background-color: rgba(0, 150, 138, 0.85);
                        color: white;
                        font-size: 10px;
                        font-weight: bold;
                        cursor: pointer;
                        &:hover {
                            background-color: rgba(0, 150, 138);
                        }
                    }
                }
                .firstTabContainer {
                    h4 {
                        display: flex;
                        /* flex: 0.85; */
                        color: black;
                        margin-right: 5px;
                        font-size: 16px;
                        margin-bottom: 10px;
                    }
                    .firstTab {
                        display: flex;
                        justify-content: space-between;
                        .firstTabMap {
                            width: 65%;
                            margin-bottom: 10px;
                        }
                        .firstTabComponent {
                            width: 33%;
                            height: 50.5vh;
                            overflow-y: scroll;
                            -ms-overflow-style: none; /* 인터넷 익스플로러 */
                            scrollbar-width: none; /* 파이어폭스 */
                            &::-webkit-scrollbar {
                                display: none;
                            }
                        }
                    }
                    @media screen and (max-width: 900px) {
                        h4 {
                            display: flex;
                            color: black;
                            font-size: 16px;
                            margin-bottom: 10px;
                        }
                        .firstTab {
                            display: flex;
                            flex-direction: column;
                            justify-content: space-between;
                            .firstTabMap {
                                width: 100%;
                            }
                            .firstTabComponent {
                                width: 100%;
                                /* height: 46.5vh; */
                                overflow-y: scroll;
                                -ms-overflow-style: none; /* 인터넷 익스플로러 */
                                scrollbar-width: none; /* 파이어폭스 */
                                &::-webkit-scrollbar {
                                    display: none;
                                }
                            }
                        }
                    }
                }
            }
        }
        .profileFlex2 {
            background-color: yellowgreen;
            flex-direction: column;
            display: flex;
            flex: 0.2;
        }   
    }
    .pathUIDhave {
        display: flex;
        .profileFlex1 {
            display: flex;
            flex-direction: column;
            flex: 0.8;
            .profileContainer {
                background-color: blueviolet;
                display: flex;
                flex-direction: row;
                padding: 25px;
                align-items: center;
                justify-content: start;
                position: relative;
                img {
                    margin-top: 20px;
                    margin-left: 10px;
                    width: 100px;
                    height: 100px;
                    border-radius: 100%;
                }
                p {
                    font-size: 24px;
                    margin-top: 20px;
                    margin-left: 20px;
                    margin-right: 20px;
                }
                .organizeBtn {
                    width: 100px;
                    height: 25px;
                    border-radius: 50px;
                    border: none;
                    background-color: rgba(0, 150, 138, 0.85);
                    color: white;
                    font-size: 10px;
                    font-weight: bold;
                    margin-top: 20px;
                    margin-right: 20px;
                    cursor: pointer;
                    &:hover {
                        background-color: rgba(0, 150, 138);
                    }
                }
            }
            .profileTab {
                /* background-color: aliceblue; */
                display: flex;
                flex-direction: row;
                /* padding-top: 10px; */
                /* padding-bottom: 10px; */
                flex: 1;
                justify-content: center;
                height: 40px;
                align-items: end;
                .unSelectTab {
                    background-color: green;
                    display: flex;
                    cursor: pointer;
                    flex: 0.34;
                    height: 32px;
                    margin-left: 1px;
                    margin-right: 1px;
                    font-size: 14px;
                    color: white;
                    align-items: end;
                    justify-content: center;
                    padding-bottom: 5px;
                    border-top-left-radius: 10px;
                    border-top-right-radius: 10px;
                    &:hover {
                        background-color: grey;
                    }
                }
                .selectTab {
                    background-color: grey;
                    display: flex;
                    cursor: pointer;
                    flex: 0.34;
                    height: 32px;
                    margin-left: 1px;
                    font-size: 14px;
                    color: white;
                    align-items: end;
                    justify-content: center;
                    padding-bottom: 5px;
                    border-top-left-radius: 10px;
                    border-top-right-radius: 10px;
                    &:hover {
                        background-color: grey;
                    }
                }
            }
            .profileTabComponent {
                background-color: grey;
                flex-direction: column;
                height: 70vh;
                overflow-y: scroll;
                -ms-overflow-style: none; /* 인터넷 익스플로러 */
                scrollbar-width: none; /* 파이어폭스 */
                padding: 15px;
                &::-webkit-scrollbar {
                    display: none;
                }
                .tabComponent {
                    /* background-color: skyblue; */
                    display: flex;
                    flex-direction: row;
                    flex: 1;
                    align-items: center;
                    margin-bottom: 10px;
                    /* padding: 8px; */
                    .wirteName {
                        /* background-color: aquamarine; */
                        display: flex;
                        flex: 0.85;
                        color: black;
                        margin-right: 5px;
                        font-size: 16px;
                    }
                }
                .firstTabContainer {
                    h4 {
                        display: flex;
                        /* flex: 0.85; */
                        color: black;
                        margin-right: 5px;
                        font-size: 16px;
                        margin-bottom: 10px;
                    }
                    .firstTab {
                        display: flex;
                        justify-content: space-between;
                        .firstTabMap {
                            width: 65%;
                            margin-bottom: 10px;
                        }
                        .firstTabComponent {
                            width: 33%;
                            height: 50.5vh;
                            overflow-y: scroll;
                            -ms-overflow-style: none; /* 인터넷 익스플로러 */
                            scrollbar-width: none; /* 파이어폭스 */
                            &::-webkit-scrollbar {
                                display: none;
                            }
                        }
                    }
                    @media screen and (max-width: 900px) {
                        h4 {
                            display: flex;
                            color: black;
                            font-size: 16px;
                            margin-bottom: 10px;
                        }
                        .firstTab {
                            display: flex;
                            flex-direction: column;
                            justify-content: space-between;
                            .firstTabMap {
                                width: 100%;
                            }
                            .firstTabComponent {
                                width: 100%;
                                /* height: 46.5vh; */
                                overflow-y: scroll;
                                -ms-overflow-style: none; /* 인터넷 익스플로러 */
                                scrollbar-width: none; /* 파이어폭스 */
                                &::-webkit-scrollbar {
                                    display: none;
                                }
                            }
                        }
                    }
                }
            }
        }
        .profileFlex2 {
            background-color: yellowgreen;
            flex-direction: column;
            display: flex;
            flex: 0.2;
        }   
    }
`;

export default Profile; 