/* eslint-disable no-redeclare */
/* eslint-disable no-unused-vars */
import React, { useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../../AuthContext";
import { v4 as uuidv4 } from 'uuid';
import { db, storage } from "../../firebase";
import { arrayRemove, collection, doc, onSnapshot, query, updateDoc } from "firebase/firestore";
import { ref, getDownloadURL, uploadBytes, uploadString } from "firebase/storage";
import MapComponent from "../MapComponent";
import Friend from "./Friend";
import FirstTab from "./tabComponent/FirstTab";
import SecondTab from "./tabComponent/SecondTab";
import ThirdTab from "./tabComponent/ThirdTab";
import styled from "styled-components";
import { HiOutlineDocumentText } from "react-icons/hi2";

// import MARKER from '../../img/marker.png';
// import questionMarker from '../../img/question_marker.png';

// MARKER <a href="https://www.flaticon.com/free-icons/marker" title="marker icons">Marker icons created by kmg design - Flaticon</a> 
// questionMarker <a href="https://www.flaticon.com/free-icons/maps-and-location" title="maps and location icons">Maps and location icons created by Iconic Panda - Flaticon</a> 

const Profile = ({profileUser, friendID, pathUID}) => {
    const navigate = useNavigate();
    const {currentUser} = useContext(AuthContext);

    const [tab, setTab] = useState(0);
    const [myPingID, setMyPingID] = useState([]);
    const [attachment, setAttachment] = useState(""); 

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

    const onFileChange = (event) => {
        setAttachment(null);
        const {target: {files}} = event; 
        const theFile = files[0]; 
        const reader = new FileReader(); 
        reader.onloadend = (finishedEvent) => {
            const {currentTarget: {result}} = finishedEvent; 
            setAttachment(result); 
        };
        if (Boolean(theFile)) {
            reader.readAsDataURL(theFile); 
        }
    }; 

    const onEdit = async(event) => {
        event.preventDefault();
        try {
            let attachmentUrl = ""; 
            let uploadTask; 
            if(attachment !== "") {
                const attachmentRef = ref(storage, `images/${currentUser.uid + uuidv4()}`);
                uploadTask = uploadBytes(attachmentRef, attachment);
                await uploadString(attachmentRef, attachment, 'data_url');
                uploadTask.then(async (snapshot) => {
                    attachmentUrl = await getDownloadURL(snapshot.ref);
                    await updateDoc(doc(db, "UserInfo", `${currentUser.uid}`), {
                        attachmentUrl,
                    }) 
                    window.location.reload();
                })
            }
        } catch(error) {
            console.log(error);
        }
    };

    return (
        <Container> 
            <div className={pathUID ? 'pathUIDhave' : 'pathUIDunHave'}>
                <div className="profileFlex1">
                    <div div className="HeaderTabComponent">
                        <HiOutlineDocumentText size="30px" className="tabHeaderIcon"/>
                        <h4 className="tabHeaderName"> 메인 </h4>
                    </div>
                    <div className="profileContainer">

                        {profileUser.uid === currentUser.uid &&
                        <input type="file"
                            style={{display:"none"}}
                            id="inputFile"
                            onChange={onFileChange}
                            required />}
                        <label htmlFor="inputFile">
                            {attachment ? 
                                <img src={attachment} alt="" /> 
                                : 
                                <img src={profileUser.attachmentUrl} alt="" />}
                        </label>

                        <p> {profileUser.ID} </p>
                            {profileUser.uid === currentUser.uid ? <>
                                {attachment && <button className="organizeBtn" onClick={onEdit}> 프로필 수정 </button>}
                            </> : <button className="organizeBtn" onClick={onOrganize}> 친구 정리 </button>}
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
                            <SecondTab profileUser={profileUser} />
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
    width: 100%;
    height: 100vh;
    .pathUIDunHave {
        display: flex;
        .profileFlex1 {
            flex-direction: column;
            width: 100%;
            flex: 0.8;
            margin-right: 10px;
            .HeaderTabComponent {
                display: flex;
                flex-direction: row;
                justify-content: start;
                align-items: center;
                .tabHeaderIcon {
                    color: rgba(0, 150, 138, 0.85);
                }
                .tabHeaderName {
                    color: rgba(0, 150, 138, 0.85);
                    font-size: 20px;
                }
            }
            .profileContainer {
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
                    font-size: 24px;
                    margin-left: 20px;
                    margin-right: 10px;
                    color: rgba(0, 150, 138, 0.85);
                }
                .organizeBtn {
                    width: 80px;
                    height: 25px;
                    border-radius: 50px;
                    border: none;
                    background-color: rgba(0, 150, 138, 0.85);
                    color: white;
                    font-size: 10px;
                    font-weight: bold;
                    margin-left: 10px;
                    cursor: pointer;
                    &:hover {
                        background-color: rgba(0, 150, 138);
                    }
                }
            }
            .profileTab {
                background-color: white;
                display: flex;
                flex-direction: row;
                flex: 1;
                justify-content: center;
                height: 40px;
                align-items: end;
                .unSelectTab {
                    background-color: rgba(0, 150, 138, 0.85);
                    display: flex;
                    cursor: pointer;
                    flex: 0.36;
                    height: 32px;
                    font-size: 14px;
                    color: white;
                    align-items: end;
                    justify-content: center;
                    padding-bottom: 5px;
                    border-top-left-radius: 10px;
                    border-top-right-radius: 10px;
                    &:hover {
                        background-color: rgba(0, 150, 138, 0.3);
                    }
                }
                .selectTab {
                    background-color: white;
                    display: flex;
                    cursor: pointer;
                    flex: 0.36;
                    height: 32px;
                    font-size: 14px;
                    color: rgba(0, 150, 138, 0.85);
                    align-items: end;
                    justify-content: center;
                    padding-bottom: 5px;
                    border-top-left-radius: 10px;
                    border-top-right-radius: 10px;
                    border: solid 0.01rem rgba(0, 150, 138, 0.85);
                    border-bottom: none;
                    &:hover {
                        background-color: white;
                    }
                }
            }
            .profileTabComponent {
                background-color: white;
                border: solid 0.01rem rgba(0, 150, 138, 0.85);
                border-top: none;
                flex-direction: column;
                width: 100%;
                height: 100vh;
                .tabComponent {
                    display: flex;
                    flex-direction: row;
                    flex: 1;
                    align-items: center;
                    margin-left: 15px;
                    margin-right: 15px;
                    .wirteName {
                        display: flex;
                        flex: 0.85;
                        color: rgba(0, 150, 138, 0.85);
                        margin-right: 5px;
                        font-size: 16px;
                        padding-top: 20px;
                        padding-bottom: 10px;
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
                        padding-top: 10px;
                        padding-bottom: 10px;
                        cursor: pointer;
                        &:hover {
                            background-color: rgba(0, 150, 138);
                        }
                    }
                }
                .firstTabContainer {
                    display: flex;
                    flex-direction: column;
                    h4 {
                        display: flex;
                        color: rgba(0, 150, 138);
                        margin-right: 5px;
                        font-size: 16px;
                        margin-left: 15px;
                        margin-right: 15px;
                        padding-top: 20px;
                        /* padding-bottom: 10px; */
                    }
                    .firstTab {
                        display: flex;
                        justify-content: space-between;
                        margin-left: 15px;
                        margin-right: 15px;
                        .firstTabMap {
                            width: 65%;
                            margin-bottom: 10px;
                            border-radius: 10px;
                            overflow: hidden;
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
                            color: rgba(0, 150, 138);
                            font-size: 16px;
                            margin-bottom: 10px;
                        }
                        .firstTab {
                            display: flex;
                            flex-direction: column;
                            justify-content: space-between;
                            .firstTabMap {
                                width: 100%;
                                height: 230px;
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
            background-color: rgba(0, 150, 138, 0.3);
            flex-direction: column;
            display: flex;
            flex: 0.2;
            border-top-right-radius: 10px;
        }   
    }
    .pathUIDhave {
        display: flex;
        .profileFlex1 {
            display: flex;
            flex-direction: column;
            flex: 0.8;
            margin-right: 10px;
            .HeaderTabComponent {
                display: flex;
                flex-direction: row;
                justify-content: end;
                align-items: end;
                .tabHeaderIcon {
                    margin-top: 2px;
                    color: rgba(0, 150, 138, 0.85);
                    display: none;
                }
                .tabHeaderName {
                    margin-top: 2px;
                    color: rgba(0, 150, 138, 0.85);
                    font-size: 20px;
                }
            }
            .profileContainer {
                background-color: white;
                display: flex;
                flex-direction: row;
                padding: 20px;
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
                    color: rgba(0, 150, 138, 0.85);
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
                background-color: white;
                display: flex;
                flex-direction: row;
                flex: 1;
                justify-content: center;
                height: 40px;
                align-items: end;
                .unSelectTab {
                    background-color: rgba(0, 150, 138, 0.85);
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
                        background-color: rgba(0, 150, 138, 0.3);
                    }
                }
                .selectTab {
                    background-color: white;
                    display: flex;
                    cursor: pointer;
                    flex: 0.34;
                    height: 32px;
                    margin-left: 1px;
                    font-size: 14px;
                    color: rgba(0, 150, 138, 0.85);
                    align-items: end;
                    justify-content: center;
                    padding-bottom: 5px;
                    border-top-left-radius: 10px;
                    border-top-right-radius: 10px;
                    border: solid 0.01rem rgba(0, 150, 138, 0.85);
                    border-bottom: none;
                    &:hover {
                        background-color: white;
                    }
                }
            }
            .profileTabComponent {
                background-color: white;
                border: solid 0.01rem rgba(0, 150, 138, 0.85);
                border-top: none;
                flex-direction: column;
                width: 100%;
                height: 100vh;
                overflow: hidden;
                .tabComponent {
                    display: flex;
                    flex-direction: row;
                    flex: 1;
                    align-items: center;
                    margin-left: 15px;
                    margin-right: 15px;
                    .wirteName {
                        display: flex;
                        flex: 0.85;
                        color: rgba(0, 150, 138, 0.85);
                        margin-right: 5px;
                        font-size: 16px;
                        padding-top: 20px;
                        padding-bottom: 10px;
                    }
                }
                .firstTabContainer {
                    display: flex;
                    flex-direction: column;
                    h4 {
                        display: flex;
                        color: rgba(0, 150, 138);
                        margin-right: 5px;
                        font-size: 16px;
                        margin-left: 15px;
                        margin-right: 15px;
                        padding-top: 10px;
                    }
                    .firstTab {
                        display: flex;
                        justify-content: space-between;
                        margin-left: 15px;
                        margin-right: 15px;
                        .firstTabMap {
                            width: 65%;
                            margin-bottom: 10px;
                            border-radius: 10px;
                            overflow: hidden;
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
                            color: rgba(0, 150, 138);
                            font-size: 16px;
                            margin-bottom: 10px;
                        }
                        .firstTab {
                            display: flex;
                            flex-direction: column;
                            justify-content: space-between;
                            .firstTabMap {
                                width: 100%;
                                height: 230px;
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
            background-color: rgba(0, 150, 138, 0.3);
            flex-direction: column;
            display: flex;
            flex: 0.2;
            border-top-right-radius: 10px;
            border-bottom-right-radius: 10px;
        }   
    }
`;

export default Profile; 