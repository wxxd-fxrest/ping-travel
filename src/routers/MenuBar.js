import React, { useCallback, useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../AuthContext";
import { auth, db } from "../firebase";
import { signOut } from "firebase/auth";
import { arrayRemove, doc, getDoc, updateDoc } from "firebase/firestore";
import FriendRequest from "../components/friend/FriendRequest";
import FriendSearchID from "../components/friend/FriendSearchID";
import ReviewQuestion from "../components/ReviewQuestion";
import ProfileData from "../components/profile/ProfileData";
import styled from "styled-components";
import { HiOutlinePower, HiOutlineMapPin, HiOutlineDocumentText, HiBellAlert, HiMiniMagnifyingGlass } from "react-icons/hi2";

// HiBell

const MenuBar = ({mainPing}) => {
    const {currentUser} = useContext(AuthContext);
    const navigate = useNavigate();

    const [requestAlert, setRequestAlert] = useState(false);
    const [open, setOpen] = useState(false); 
    const [loginUserData, setLoginUserData] = useState([]);
    const [friendRequest, setFriendRequest] = useState([]);
    const [share, setShare] = useState([]);
    const [tab, setTab] = useState(0);

    const getLoginUserData = useCallback(async () =>  {
        if(currentUser.uid) {
            const docRef = doc(db, "UserInfo", `${currentUser.uid}`);
            const docSnap = await getDoc(docRef);
            if (docSnap.exists()) {
            setLoginUserData(docSnap.data());
            setFriendRequest(docSnap.data().friendRequest);
            setShare(docSnap.data().shareAlert);
            // console.log(docSnap.data())
            } else {
            console.log("No such document!");
            }
        } else {
            return;
        }
    }, [currentUser.uid]);

    useEffect(() => {
        getLoginUserData();
    }, [currentUser.uid, getLoginUserData]);
    
    return (
        <Container>
            <div className="main">
                <div className="menubar">
                    <div className="menuLogo">
                        <div className="logo">
                            <h3> Ping Travel </h3>
                            <div className='logoBar' />
                        </div>
                    </div>
                    <p className="search"> 친구를 검색하세요. </p>
                    <FriendSearchID setRequestAlert={setRequestAlert} open={open} setOpen={setOpen} loginUserData={loginUserData}/>

                    <div className={tab === 0 ? "clickTabContainer" : "tabContainer"} onClick={() => setTab(0)}>
                        <HiOutlineDocumentText size="25px" className="tabBtn" />
                        <h3> 메인 </h3>
                    </div>
                    <div className={tab === 1 ? "clickTabContainer" : "tabContainer"} onClick={() => setTab(1)}>
                        <HiOutlineMapPin size="25px" className="tabBtn" />
                        <h3> 리뷰 / 질문 </h3>
                    </div>

                    <div className="alertContainer">
                        <div className="alertTab"  
                            onClick={() => {
                                setOpen(false)
                                setRequestAlert(!requestAlert)}}>
                            <HiBellAlert size="25px" className="alertIcons" />
                            <h3> 알림 </h3>
                        </div>

                        {requestAlert === true ? <div className="alertScroll">
                            <h5> 친구요청 </h5>         

                            {friendRequest !== undefined ? <>
                                {friendRequest.map((f, i) => (
                                    <FriendRequest key={i} friendRequest={f} loginUserData={loginUserData}/>
                                ))}
                            </> : <p className="noRequest"> · 요청이 없습니다. </p>}

                            <h5> 알림 </h5>          

                            {share !== undefined ? <>
                                {share.map((s, i) => {
                                    return(
                                        <div key={i} className="alertShareContainer">
                                            <p> {s.alert} </p>
                                            <h6> · " {s.placeName} " </h6>
                                            <button onClick={async() => {
                                                await updateDoc(doc(db, "UserInfo", currentUser.uid), {
                                                    shareAlert: arrayRemove(s),
                                                }); // 수락 시 요청 데이터 삭제 
                                                navigate(`/profile/${loginUserData.ID}`);
                                                window.location.reload(); 
                                            }}> 확인 </button>
                                        </div>
                                    )
                                })}
                            </> : <p style={{color: 'white', fontSize: '13px', margin: '10px 0px'}}> · 알림이 없습니다. </p>}

                        </div> : null }
                    </div>
                    <div className="logoutContainer" 
                        onClick={() => {
                            signOut(auth) 
                            navigate("/")
                            alert("로그아웃 되었습니다.")}}>
                        <HiOutlinePower className="logoutBtn" size="23px"/>
                        <h3> 로그아웃 </h3> 
                    </div>
                </div>

                <div className="tab">
                    {tab === 0 && <> 
                        <ProfileData mainPing={mainPing} loginUserData={loginUserData}/>
                    </>}
                    {tab === 1 && <>
                        <div className="reviewQuestionTab">
                            <div className="searchBox" 
                                    onClick={(e) => {
                                        e.preventDefault();
                                        navigate('/search');
                                    }}>
                                <HiMiniMagnifyingGlass className='searchIcon' />
                                <p> 검색 </p>
                            </div>
                            <div className="tabComponent">
                                <HiOutlineMapPin className="tabHeaderIcon" />
                                <h4 className="tabHeaderName"> 리뷰 / 질문 </h4>
                            </div>
                        </div>
                        <ReviewQuestion mainPing={mainPing} />
                    </>}
                </div>
            </div>
        </Container>
    )
};

const Container = styled.div`
    background-color: #f2b195;
    display: flex;
    width: 60vw;
    height: 100vh;
    position: relative;
    overflow: hidden;
    flex-direction: column;
    transition: all 0.2s ease; 

    @media screen and (max-width: 1330px) {
        width: 70vw;
    }
    @media screen and (max-width: 1100px) {
        width: 80vw;
    }
    @media screen and (max-width: 850px) {
        width: 90vw;
    }
    @media screen and (max-width: 750px) {
        width: 100vw;
    }
    .main {
        display: flex;
        flex-direction: row;
        flex: 1;
        .menubar {
            /* background-color: rgba(0, 150, 138, 0.3); */
            width: 180px;
            max-width: 180px;
            min-width: 180px;
            flex: 0.1;
            padding: 15px;
            border-right: solid 0.01rem white;
            @media screen and (max-width: 750px) {
                width: 150px;
                max-width: 150px;
                min-width: 150px;
            }
            @media screen and (max-width: 600px) {
                width: 50px;
                max-width: 50px;
                min-width: 50px;
            }
            .menuLogo {
                display: flex;
                justify-content: center;
            }

            .logo {
                background-color: white;
                display: inline-flex;
                width: 75px;
                height: 75px;
                border-radius: 100%;
                border: 1.3px solid rgb(255, 255, 255, 0.8);
                text-align: center;
                align-items: center;
                justify-content: center;
                position: relative;
                /* 입체 효과를 위한 그림자 추가 */
                box-shadow: 0px 4px 6px rgba(0, 0, 0, 0.1), 0px 1px 3px rgba(0, 0, 0, 0.1);
                transition: transform 0.2s ease; /* 변환 효과 추가 */

                @media screen and (max-width: 600px) {
                    width: 45px;
                    height: 45px;
                    margin-bottom: 20px;
                }

                .logoBar {
                    position: absolute;
                    display: flex;
                    width: 100%;
                    height: 100%;
                    text-align: center;
                    align-items: center;
                    justify-content: center;
                    border-left: 3px solid rgba(250, 117, 65, 0.9);
                    border-radius: 100%;
                    animation: rotate_image 6s ease-in-out infinite;
                    transform-origin: 50% 50%;

                    @keyframes rotate_image {
                        100% {
                            transform: rotate(360deg);
                        }
                    }
                }
                h3 {
                    font-size: 0.7rem;
                    font-weight: 100;
                    color: rgba(250, 117, 65);

                    &::first-letter {
                        font-size: 1.6rem;
                        letter-spacing: -10px;
                    }
                }
            }
            .logo:hover {
                /* 호버 시 약간의 변환 효과 추가 */
                transform: translateZ(5px);
            }
            .logoutContainer {
                background-color: rgba(250, 117, 65, 0);
                bottom: 10px;
                left: 25px;
                display: flex;
                align-items: center;
                justify-content: start;
                position: absolute;
                margin: 10px 10px 20px 10px;
                cursor: pointer;
                @media screen and (max-width: 600px) {
                    margin: 10px 10px 20px 0px;
                    justify-items: center;
                    left: 30px;
                }
                .logoutBtn{
                    color: white;
                }
                h3 {
                    width: 100px;
                    font-size: 14px;
                    color: white;
                    position: absolute;
                    left: 35px;
                    top: 8px;
                    @media screen and (max-width: 600px) {
                        display: none;
                    }
                }
            }
            .search {
                /* color: rgba(0, 150, 138, 0.85); */
                color: white;
                font-size: 11px;
                margin: 20px 10px 5px 15px;
                @media screen and (max-width: 600px) {
                    display: none;
                }
            }
            .tabContainer {
                display: flex;
                align-items: center;
                justify-content: start;
                position: relative;
                /* margin: 10px 10px 10px 10px; */
                margin: 20px;
                cursor: pointer;
                transition: transform 0.2s ease; /* 변환 효과 추가 */

                &:hover {
                    transform: scale(1.1); /* 호버 시 약간 확대되도록 설정 */
                }
                @media screen and (max-width: 600px) {
                    margin: 10px 10px 20px 0px;
                    justify-items: center;
                    left: 10px;
                }
                .tabBtn {
                    color: white;
                }
                h3 {
                    font-size: 14px;
                    color: white;
                    position: absolute;
                    left: 35px;
                    top: 10px;
                    @media screen and (max-width: 600px) {
                        display: none;
                    }
                }
            }
            .clickTabContainer {
                background-color: rgba(250, 117, 65, 0.8);
                height: 40px;
                width: 65%;
                border-radius: 0px 10px 10px 10px;
                display: flex;
                align-items: center;
                justify-content: start;
                position: relative;
                margin: 10px;
                padding: 0px 20px;
                cursor: pointer;
                /* 입체 효과를 위한 그림자 추가 */
                box-shadow: 0px 4px 6px rgba(0, 0, 0, 0.1), 0px 1px 3px rgba(0, 0, 0, 0.1);
                transition: transform 0.2s ease; /* 변환 효과 추가 */
            }

            .clickTabContainer:hover {
                /* 호버 시 약간의 변환 효과 추가 */
                transform: translateZ(5px);
            }

            /* 나머지 스타일 유지 */
            .clickTabContainer .tabBtn {
                color: white;
            }

            .clickTabContainer h3 {
                font-size: 14px;
                color: white;
                position: absolute;
                left: 58px;
                top: 16px;
                @media screen and (max-width: 600px) {
                    display: none;
                }
            }
            .alertContainer {
                /* background-color: wheat; */
                display: flex;
                flex-direction: column;
                margin: 20px 10px 20px 10px;
                .alertTab {
                    display: flex;
                    flex-direction: row;
                    align-items: center;
                    justify-content: start;
                    position: relative;
                    margin-bottom: 10px;
                    padding-left: 10px;
                    cursor: pointer;
                    transition: transform 0.2s ease; /* 변환 효과 추가 */

                    &:hover {
                        transform: scale(1.1); /* 호버 시 약간 확대되도록 설정 */
                    }
                    @media screen and (max-width: 600px) {
                        justify-items: center;
                        left: 0px;
                    }
                    .alertIcons {
                        color: white;
                    }
                    h3 {
                        width: 100px;
                        font-size: 14px;
                        color: white;
                        position: absolute;
                        left: 43px;
                        top: 10px;
                        @media screen and (max-width: 600px) {
                            display: none;
                        }
                    }
                }
                .alertScroll {
                    display: flex;
                    height: 400px;
                    flex-direction: column;
                    overflow-y: scroll;
                    -ms-overflow-style: none; /* 인터넷 익스플로러 */
                    scrollbar-width: none; /* 파이어폭스 */
                    &::-webkit-scrollbar {
                        display: none;
                    }
                    h5 {
                        color: white;
                        font-size: 12px;
                        margin-top: 10px;
                    }
                    .noRequest {
                        margin-top: 10px;
                        color: white;
                        font-size: 12px;
                    }
                    .alertShareContainer {
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
                        background: linear-gradient(to bottom, #ffffff, #f0f0f0);
                        box-shadow: 0px 4px 6px rgba(0, 0, 0, 0.1);
                        p {
                            color: rgba(250, 117, 65, 0.6);
                            font-size: 13px;
                            margin-bottom: 10px;
                        }
                        h6 {
                            color: rgba(250, 117, 65, 0.9);
                            font-size: 13px;
                            font-weight: 500;
                            margin-bottom: 5px;
                        }
                        button {
                            width: 100%;
                            height: 25px;
                            border-radius: 50px;
                            border: none;
                            background-color: rgba(250, 117, 65, 0.8);
                            color: white;
                            font-size: 10px;
                            font-weight: bold;
                            margin-top: 5px;
                            cursor: pointer;
                            box-shadow: 0px 4px 6px rgba(0, 0, 0, 0.1), 0px 1px 3px rgba(0, 0, 0, 0.1);
                            transition: transform 0.2s ease; /* 변환 효과 추가 */
                        }

                        button:hover {
                            /* 호버 시 약간의 변환 효과 추가 */
                            transform: translateZ(5px);
                            background-color: rgb(250, 117, 65);
                        }
                    }
                }
                @media screen and (max-width: 600px) {
                    display: none;
                }
            }
        }
        .tab {
            display: flex;
            flex-direction: column;
            /* align-items: center; */
            width: 100vw;
            height: 100%;
            flex: 0.9;
            /* padding: 15px 30px 0px 30px; */
            @media screen and (max-width: 900px) {
                /* padding: 15px 10px 0px 10px; */
            }
            @media screen and (max-width: 600px) {
                flex: 0.9;
            }
            .reviewQuestionTab {
                display: flex;
                flex-direction: row;
                justify-content: space-between;
                align-items: center;
                margin-right: 100px;
                /* margin-left: 100px; */
                border-bottom: solid 0.01rem white;
                .searchBox {
                    border: 1px solid white;
                    margin-left: 10px;
                    border-radius: 20px;
                    padding: 10px;
                    display: flex;
                    flex-direction: row;
                    align-items: end;
                    cursor: pointer;
                    .searchIcon {
                        color: white;
                        width: 25px;
                        height: 25px;
                        margin-left: 10px;
                    }
                    p {
                        color: white;
                        font-size: 20px;
                        margin-left: 10px;
                        margin-right: 10px;
                        /* margin: 10px 10px 0px 5px; */
                    }
                    &:hover {
                        background-color: rgba(255, 255, 255, 0.15);
                    }
                }
                .tabComponent {
                    display: flex;
                    align-items: end;
                    .tabHeaderIcon {
                        color: white;
                        width: 35px;
                        height: 35px;
                        margin: 10px 0px 10px 50px;
                    }
                    .tabHeaderName {
                        color: white;
                        font-size: 20px;
                        margin: 10px 10px 10px 0px;
                    }
                }
            }
        }
    }
`;

export default MenuBar;