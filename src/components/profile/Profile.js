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
import { HiOutlineDocumentText, HiOutlineUserGroup } from "react-icons/hi2";

const Profile = ({profileUser, friendID, pathUID}) => {
    const navigate = useNavigate();
    const {currentUser} = useContext(AuthContext);

    const [tab, setTab] = useState(0);
    const [myPingID, setMyPingID] = useState([]);
    const [attachment, setAttachment] = useState(""); 
    const [open, setOpen] = useState(false);

    // 너비가 1000px 이하일 때 `profileFlex2`를 열고 `profileFlex1`를 닫도록 제어
    const handleResize = () => {
        if (window.innerWidth <= 1000) {
            setOpen(false);
        } else {
            setOpen(false);
        }
    };

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

        // 화면 크기 변경 이벤트 리스너 등록
        window.addEventListener("resize", handleResize);
        // 컴포넌트가 언마운트될 때 이벤트 리스너 제거
        return () => {
            window.removeEventListener("resize", handleResize);
        };
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
                <div className="HeaderTabComponent">
                    <HiOutlineDocumentText className="tabHeaderIcon"/>
                    <h4 className="tabHeaderName"> 메인 </h4>
                </div>

                <div className="bodyContainer">
                    {profileUser.uid === currentUser.uid && (
                      <>
                        {open === false ? (
                          <div className="clickOpen" onClick={() => setOpen(!open)}>
                            <HiOutlineUserGroup className="clickIcon"/>
                          </div>
                        ) : (
                          <div className="profileFlex2 open"> {/* 'open' 클래스 추가 */}
                            <Friend profileUser={profileUser} friendID={friendID} setOpen={setOpen} open={open}/> 
                          </div>
                        )}
                      </>
                    )}

                    <div className={open === true ? "profileFlex1" : "openProfileFlex1"}>
                        <div className="profileContainer">
                            {profileUser.uid === currentUser.uid &&
                            <input type="file"
                                style={{display:"none"}}
                                id="inputFile"
                                onChange={onFileChange}
                                required />}
                            <label htmlFor="inputFile">
                                {attachment ? 
                                    <img src={attachment} alt="" style={{cursor: "pointer"}}/> 
                                    : 
                                    <img src={profileUser.attachmentUrl} alt="" style={{cursor: "pointer"}}/>}
                            </label>

                            <p> {profileUser.ID} </p>
                                {profileUser.uid === currentUser.uid ? <>
                                    {attachment && <button className="organizeBtn" onClick={onEdit}> 프로필 수정 </button>}
                                </> : <button className="organizeBtn" onClick={onOrganize}> 친구 정리 </button>}
                        </div>

                        <div className="profileTab">
                            <h3 className={tab === 0 ? "selectTab" : "unSelectTab"} onClick={() => setTab(0)}> 여행 기록 </h3>
                            <h3 style={{margin: '0px 1px'}} className={tab === 1 ? "selectTab" : "unSelectTab"} onClick={() => setTab(1)}> 여행 계획 </h3>
                            <h3 className={tab === 2 ? "selectTab" : "unSelectTab"} onClick={() => setTab(2)}> 리뷰 / 질문 </h3>
                        </div>

                        <div className="profileTabComponent">
                            {tab === 0 && <>
                                <div className="tabComponent">
                                    <h4 className="wirteName"> 여행 기록 </h4>
                                    {!pathUID &&
                                    <button className="wirteBtn"
                                        onClick={() => navigate('/record/search')}> 기록하기 </button>}
                                </div>
                                <SecondTab profileUser={profileUser} pathUID={pathUID} />
                            </>}
                            {tab === 1 && <>
                                <div className="tabComponent">
                                    <h4 className="wirteName"> 여행 계획 </h4>
                                    {!pathUID &&
                                    <button className="wirteBtn"
                                        onClick={() => navigate('/plan/search')}> 계획하기 </button>}
                                </div>
                                <ThirdTab profileUser={profileUser} pathUID={pathUID}/>
                            </>}
                            {tab === 2 && <div className="firstTabContainer">
                                <h4> 질문/리뷰 </h4>
                                <div className="firstTab">
                                    <div className="firstTabMap">
                                        <MapComponent />
                                    </div>
                                    <div className="firstTabComponent">
                                        <FirstTab myPingID={myPingID} profileUser={profileUser} pathUID={pathUID}/>
                                    </div>
                                </div>
                            </div>}
                        </div>
                    </div>
                </div>
            </div>
        </Container>
    )
};

const Container = styled.div`
    display: flex;
    flex-direction: row;
    flex: 1;
    width: 100%;
    height: 100vh;
    .pathUIDunHave {
        display: flex;
        position: relative;
        flex-direction: column;
        .HeaderTabComponent {
            display: flex;
            flex-direction: row;
            justify-content: flex-end;
            align-items: center;
            border-bottom: solid 0.01rem white;
            margin-right: 80px;
            .tabHeaderIcon {
                color: white;
                width: 35px;
                height: 35px;
                margin: 10px 0px 10px 50px;
            }
            .tabHeaderName {
                color: white;
                font-size: 20px;
                margin: 10px 20px 0px 0px;
            }
        }
        .bodyContainer {
            display: flex;
            flex-direction: row;
            margin: 30px 0px;
            height: 85%;
            .clickOpen {
                background-color: white;
                position: absolute;
                top: 60px;
                z-index: 10;
                border-top-right-radius: 10px;
                border-bottom-right-radius: 10px;
                height: 50px;
                width: 45px;
                display: flex;
                justify-content: center;
                align-items: center;
                cursor: pointer;
                transition: all 0.2s ease; /* 변경 사항이 부드럽게 적용되도록 트랜지션 설정 */

                /* 요소를 띄우는 입체적인 효과 추가 */
                box-shadow: 0px 2px 6px rgba(0, 0, 0, 0.2);
                transform: translateY(0); /* 초기 위치는 아래로 내려갔다가 */
            }
            .clickOpen:hover {
                /* 호버 시 약간 띄워 보이도록 변경 */
                transform: translateY(-3px);
            }
            .clickIcon {
                color: rgba(250, 117, 65);
                width: 28px;
                height: 28px;
            }
            .profileFlex2 {
                background-color: white;
                flex-direction: column;
                display: flex;
                flex: 0.2;
                min-width: 120px;
                height: min-content;
                max-height: 500px;
                margin-top: 5px;
                border-radius: 0px 10px 10px 0px;
                padding-bottom: 10px;
                overflow-y: scroll;
                -ms-overflow-style: none; /* 인터넷 익스플로러 */
                scrollbar-width: none; /* 파이어폭스 */
                &::-webkit-scrollbar {
                    display: none;
                }
            }  
            .profileFlex1 { 
                background-color: white;
                flex-direction: column;
                width: 100%;
                flex: 0.65;
                margin-left: 30px;
                /* margin-right: 30px; */
                padding-left: 1px;
                padding-right: 1px;
                border-top-left-radius: 30px;
                border-top-right-radius: 30px;
                @media screen and (max-width: 1100px) {
                    display: none;
                }
                @media screen and (max-width: 750px) {
                    margin-left: 5px;
                    margin-right: 5px;
                }
                .profileContainer {
                    display: flex;
                    flex-direction: row;
                    margin-top: 20px;
                    padding: 10px;
                    align-items: center;
                    justify-content: start;
                    padding-left: 30px;
                    padding-right: 30px;
                    img {
                        width: 70px;
                        height: 70px;
                        border-radius: 100%;
                    }
                    p {
                        font-size: 22px;
                        margin-left: 15px;
                        margin-right: 10px;
                        color:  rgba(250, 117, 65, 0.85);
                    }
                    .organizeBtn {
                        width: 80px;
                        height: 25px;
                        border-radius: 50px;
                        border: none;
                        color: white;
                        font-size: 10px;
                        font-weight: bold;
                        margin-left: 10px;
                        background-color: rgba(250, 117, 65, 0.8);
                        box-shadow: 0px 4px 6px rgba(0, 0, 0, 0.1), 0px 1px 3px rgba(0, 0, 0, 0.1);
                        transition: transform 0.2s ease; /* 변환 효과 추가 */

                        &:hover {
                            /* 호버 시 약간의 변환 효과 추가 */
                            transform: translateZ(5px);
                            background-color: rgb(250, 117, 65);
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
                        background-color:  rgba(250, 117, 65, 0.85);
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
                            background-color:  rgba(250, 117, 65, 0.3);
                        }
                    }
                    .selectTab {
                        display: flex;
                        cursor: pointer;
                        flex: 0.36;
                        height: 32px;
                        font-size: 14px;
                        color:  rgba(250, 117, 65, 0.85);
                        align-items: end;
                        justify-content: center;
                        padding-bottom: 5px;
                        border-top-left-radius: 10px;
                        border-top-right-radius: 10px;
                        border-bottom: none;
                        border: solid 0.01rem  rgba(250, 117, 65, 0.85);
                        border-bottom: none;
                    }
                }
                .profileTabComponent {
                    /* background-color:  rgba(250, 117, 65, 0.1); */
                    border-top: none;
                    flex-direction: column;
                    width: 100%;
                    height: 92%;
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
                            color:  rgba(250, 117, 65, 0.85);
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
                            background-color:  rgba(250, 117, 65, 0.85);
                            color: white;
                            font-size: 10px;
                            font-weight: bold;
                            padding-top: 10px;
                            padding-bottom: 10px;
                            cursor: pointer;
                            position: relative; /* 상대적 위치 설정 */

                            /* 그림자 효과 추가 */
                            box-shadow: 0px 4px 6px rgba(0, 0, 0, 0.1), 0px 1px 3px rgba(0, 0, 0, 0.1);

                            /* 텍스트 위에 띄우기 */
                            z-index: 1;

                            /* 호버 시 배경색 변경 및 그림자 효과 강화 */
                            &:hover {
                                background-color:   rgb(250, 117, 65);
                                box-shadow: 0px 6px 8px rgba(0, 0, 0, 0.2), 0px 3px 6px rgba(0, 0, 0, 0.2);
                            }
                        }
                    }
                    .firstTabContainer {
                        display: flex;
                        flex-direction: column;
                        h4 {
                            display: flex;
                            color:  rgb(250, 117, 65);
                            font-size: 16px;
                            margin-left: 15px;
                            margin-right: 15px;
                            margin-bottom: 10px;
                            padding-top: 20px;
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
                                overflow-x: hidden;
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
                                color:   rgb(250, 117, 65);
                                font-size: 16px;
                                margin-bottom: 10px;
                            }
                            .firstTab {
                                display: flex;
                                flex-direction: column;
                                justify-content: space-between;
                                .firstTabMap {
                                    width: 100%;
                                    height: 200px;
                                }
                                .firstTabComponent {
                                    width: 100%;
                                    height: 38vh;
                                    overflow-y: scroll;
                                    overflow-x: hidden;
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
            .openProfileFlex1{
                /* background-color: white; */
                flex-direction: column;
                width: 100%;
                flex: 1;
                margin-left: 60px;
                margin-right: 80px;
                /* border-top-left-radius: 30px;
                border-top-right-radius: 30px; */
                border-radius: 30px;
                transition: all 0.2s ease; 
                box-shadow: 0px 0px 10px rgba(0, 0, 0, 0.2);
                transform: translateZ(5px); 
                @media screen and (max-width: 850px) {
                    margin-left: 50px;
                    margin-right: 80px;
                }
                @media screen and (max-width: 750px) {
                    margin-left: 50px;
                    margin-right: 80px;
                }
                .profileContainer {
                    display: flex;
                    flex-direction: row;
                    margin-top: 10px;
                    padding: 20px 30px;
                    align-items: center;
                    justify-content: start;
                    img {
                        width: 70px;
                        height: 70px;
                        border-radius: 50%; /* 원 모양의 이미지를 위해 50%로 설정 */
                        box-shadow: 0px 0px 10px rgba(0, 0, 0, 0.2); /* 그림자 효과 추가 */
                        transition: all 0.2s ease; /* 변경 사항이 부드럽게 적용되도록 트랜지션 설정 */

                        /* 이미지 호버 시 스타일 변경 */
                        &:hover {
                            transform: scale(1.05); /* 호버 시 이미지가 약간 커지는 효과 추가 */
                            box-shadow: 0px 0px 15px rgba(0, 0, 0, 0.3); /* 호버 시 그림자가 더 강조되도록 변경 */
                        }
                    }
                    p {
                        font-size: 22px;
                        font-weight: bold;
                        margin-left: 15px;
                        margin-right: 10px;
                        /* color:  rgba(250, 117, 65, 0.85); */
                        color: white;
                    }
                    .organizeBtn {
                        width: 80px;
                        height: 25px;
                        border-radius: 50px;
                        border: none;
                        color: white;
                        font-size: 10px;
                        font-weight: bold;
                        margin-left: 10px;
                        cursor: pointer;
                        background-color: rgba(250, 117, 65, 0.8);
                        box-shadow: 0px 4px 6px rgba(0, 0, 0, 0.1), 0px 1px 3px rgba(0, 0, 0, 0.1);
                        transition: transform 0.2s ease; /* 변환 효과 추가 */

                        &:hover {
                            /* 호버 시 약간의 변환 효과 추가 */
                            transform: translateZ(5px);
                            background-color: rgb(250, 117, 65);
                        }
                    }
                }
                .profileTab {
                    background-color: transparent;
                    display: flex;
                    flex-direction: row;
                    flex: 1;
                    justify-content: space-around; /* 탭들을 균등한 간격으로 정렬합니다. */
                    /* height: 40px; */
                    align-items: center;
                    .unSelectTab {
                        background-color: rgba(250, 117, 65);
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
                    }
                    .selectTab {
                        background-color: rgba(255, 255, 255, 0.3);
                        display: flex;
                        cursor: pointer;
                        flex: 0.36;
                        height: 32px;
                        font-size: 14px;
                        color: rgba(250, 117, 65);
                        align-items: end;
                        justify-content: center;
                        padding-bottom: 5px;
                        border-top-left-radius: 10px;
                        border-top-right-radius: 10px;
                        border-bottom: none;
                        transition: background-color 0.2s ease, transform 0.2s ease; /* 트랜지션 효과 추가 */
                        box-shadow: 0px 0px 0px rgba(0, 0, 0, 0.2); /* 그림자 효과 추가 */
                        transform: translateZ(5px); /* 입체적인 효과 추가 */
                    }
                }
                .profileTabComponent {
                    /* background-color: rgba(255, 255, 255, 0.3); */
                    background: linear-gradient(to bottom, rgba(255, 255, 255, 0.3), transparent);
                    /* border: solid 0.01rem  rgba(250, 117, 65, 0.85); */
                    border-top: none;
                    flex-direction: column;
                    width: 100%;
                    /* 아래의 margin 값을 조정하여 탭과 컴포넌트 사이의 간격을 조절할 수 있습니다. */
                    /* margin-bottom: 20px; */
                    height: 75%;
                    overflow: hidden;
                    .tabComponent {
                        display: flex;
                        flex-direction: row;
                        flex: 1;
                        align-items: center;
                        margin-left: 30px;
                        margin-right: 30px;
                        .wirteName {
                            display: flex;
                            flex: 0.85;
                            color: rgba(250, 117, 65);
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
                            background-color: rgb(250, 117, 65, 0.9);
                            color: white;
                            font-size: 10px;
                            font-weight: bold;
                            padding-top: 10px;
                            padding-bottom: 10px;
                            cursor: pointer;
                            position: relative; /* 상대적 위치 설정 */

                            /* 그림자 효과 추가 */
                            box-shadow: 0px 4px 6px rgba(0, 0, 0, 0.1), 0px 1px 3px rgba(0, 0, 0, 0.1);

                            /* 텍스트 위에 띄우기 */
                            z-index: 1;

                            /* 호버 시 배경색 변경 및 그림자 효과 강화 */
                            &:hover {
                                background-color:  rgb(250, 117, 65);
                                box-shadow: 0px 6px 8px rgba(0, 0, 0, 0.2), 0px 3px 6px rgba(0, 0, 0, 0.2);
                            }
                        }
                    }
                    .firstTabContainer {
                        display: flex;
                        flex-direction: column;
                        h4 {
                            display: flex;
                            color: rgb(250, 117, 65);
                            font-size: 16px;
                            margin-left: 15px;
                            margin-right: 15px;
                            padding-top: 20px;
                            margin-bottom: 10px;
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
                                overflow-x: hidden;
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
                                color:   rgb(250, 117, 65);
                                font-size: 16px;
                                margin-bottom: 10px;
                            }
                            .firstTab {
                                display: flex;
                                flex-direction: column;
                                justify-content: space-between;
                                .firstTabMap {
                                    width: 100%;
                                    height: 200px;
                                }
                                .firstTabComponent {
                                    width: 100%;
                                    height: 38vh;
                                    overflow-y: scroll;
                                    overflow-x: hidden;
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
        }
    }
    .pathUIDhave {
        /* background-color:  rgba(250, 117, 65, 0.3); */
        display: flex;
        position: relative;
        flex-direction: column;
        .HeaderTabComponent {
            /* background-color: white; */
            display: flex;
            flex-direction: row;
            justify-content: flex-end;
            align-items: center;
            border-bottom: solid 0.01rem  rgba(250, 117, 65, 0.85);
            .tabHeaderIcon {
                color:  rgba(250, 117, 65, 0.85);
                width: 35px;
                height: 35px;
                margin: 10px 0px 10px 50px;
            }
            .tabHeaderName {
                color:  rgba(250, 117, 65, 0.85);
                font-size: 20px;
                margin: 10px 10px 0px 0px;
            }
        }
        .bodyContainer {
            display: flex;
            flex-direction: row;
            .clickOpen {
                background-color:  rgba(250, 117, 65, 0.85);
                position: absolute;
                top: 60px;
                z-index: 10;
                border-top-right-radius: 10px;
                border-bottom-right-radius: 10px;
                height: 50px;
                width: 45px;
                display: flex;
                justify-content: center;
                align-items: center;
                cursor: pointer;
                .clickIcon {
                    color: white;
                    width: 28px;
                    height: 28px;
                }
            }
            .profileFlex2 {
                flex-direction: column;
                display: flex;
                flex: 0.2;
                border-right: solid 0.01rem  rgba(250, 117, 65, 0.85);
            }  
            .openProfileFlex1{
                flex-direction: column;
                width: 90%;
                flex: 1;
                /* margin-left: 5px; */
                /* margin-right: 5px; */
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
                        color:  rgba(250, 117, 65, 0.85);
                    }
                    .organizeBtn {
                        width: 80px;
                        height: 25px;
                        border-radius: 50px;
                        border: none;
                        color: white;
                        font-size: 10px;
                        font-weight: bold;
                        margin-left: 10px;
                        cursor: pointer;
                        background-color: rgba(250, 117, 65, 0.8);
                        box-shadow: 0px 4px 6px rgba(0, 0, 0, 0.1), 0px 1px 3px rgba(0, 0, 0, 0.1);
                        transition: transform 0.2s ease; /* 변환 효과 추가 */

                        &:hover {
                            /* 호버 시 약간의 변환 효과 추가 */
                            transform: translateZ(5px);
                            background-color: rgb(250, 117, 65);
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
                        background-color:  rgba(250, 117, 65, 0.85);
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
                            background-color:  rgba(250, 117, 65, 0.9);
                        }
                    }
                    .selectTab {
                        display: flex;
                        cursor: pointer;
                        flex: 0.36;
                        height: 32px;
                        font-size: 14px;
                        color:  rgba(250, 117, 65, 0.85);
                        align-items: end;
                        justify-content: center;
                        padding-bottom: 5px;
                        border-top-left-radius: 10px;
                        border-top-right-radius: 10px;
                        border: solid 0.01rem  rgba(250, 117, 65, 0.85);
                        border-bottom: none;
                        &:hover {
                            background-color:  rgba(250, 117, 65, 0.2);
                        }
                    }
                }
                .profileTabComponent {
                    /* background-color:  rgba(250, 117, 65, 0.1); */
                    /* background-color: bisque; */
                    /* border: solid 0.01rem  rgba(250, 117, 65, 0.85); */
                    border-top: none;
                    flex-direction: column;
                    width: 100%;
                    /* height: 53vh; */
                    .tabComponent {
                        display: flex;
                        flex-direction: row;
                        flex: 1;
                        align-items: center;
                        margin-left: 30px;
                        margin-right: 30px;
                        .wirteName {
                            display: flex;
                            flex: 0.85;
                            color:  rgba(250, 117, 65, 0.85);
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
                            background-color:  rgba(250, 117, 65, 0.85);
                            color: white;
                            font-size: 10px;
                            font-weight: bold;
                            padding-top: 10px;
                            padding-bottom: 10px;
                            cursor: pointer;
                            &:hover {
                                background-color:   rgb(250, 117, 65);
                            }
                        }
                    }
                    .firstTabContainer {
                        display: flex;
                        flex-direction: column;
                        h4 {
                            display: flex;
                            color:  rgb(250, 117, 65);
                            margin-right: 5px;
                            font-size: 16px;
                            margin-left: 15px;
                            margin-right: 15px;
                            padding-top: 20px;
                            margin-bottom: 10px;
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
                                /* height: 37vh; */
                                height: 50.5vh;
                                overflow-y: scroll;
                                overflow-x: hidden;
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
                                color: rgb(250, 117, 65);
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
                                    height: 37vh;
                                    overflow-y: scroll;
                                    overflow-x: hidden;
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
        }
    }
`;

export default Profile; 