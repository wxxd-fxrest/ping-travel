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
import { HiOutlinePower, HiOutlineMapPin, HiOutlineDocumentText, HiBellAlert } from "react-icons/hi2";
// HiBell

const MenuBar = ({mainPing}) => {
    const {currentUser} = useContext(AuthContext);
    const navigate = useNavigate();

    const [requestAlert, setRequestAlert] = useState(false);
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
            <div className="menubar">
                <p className="search"> 친구를 검색하세요. </p>
                <FriendSearchID setRequestAlert={setRequestAlert} loginUserData={loginUserData}/>

                <div className="tabContainer" onClick={() => setTab(0)}>
                    <HiOutlineDocumentText size="25px" className="tabBtn" />
                    <h3> 메인 </h3>
                </div>
                <div className="tabContainer" onClick={() => setTab(1)}>
                    <HiOutlineMapPin size="25px" className="tabBtn" />
                    <h3> 리뷰 / 질문 </h3>
                </div>

                <div className="alertContainer">
                    <div className="alertTab"  
                        onClick={() => {
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
                        </> : <p> 요청이 없습니다. </p>}

                        <h5> 알림 </h5>          

                        {share !== undefined ? <>
                            {share.map((s, i) => {
                                return(
                                    <div key={i} className="alertShareContainer">
                                        <p> {s.alert} </p>
                                        <h6> · 장소: "{s.placeName}" </h6>
                                        <h1> · {s.date} </h1>
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
                        </> : <p> 알림이 없습니다. </p>}

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
                    <h4> 메인 </h4>
                    <ProfileData mainPing={mainPing} loginUserData={loginUserData}/>
                </>}
                {tab === 1 && <>
                    <h4> 리뷰 / 질문 </h4>
                    <ReviewQuestion mainPing={mainPing} />
                </>}
            </div>
        </Container>
    )
};

const Container = styled.div`
    background-color: #D4F4FA;
    display: flex;
    width: 100vw;
    height: 100vh;
    position: relative;
    overflow: hidden;
    .menubar {
        background-color: skyblue;
        width: 180px;
        max-width: 180px;
        min-width: 180px;
        padding: 15px;
        @media screen and (max-width: 500px) {
            width: 130px;
            max-width: 130px;
            min-width: 130px;
        }
        .logoutContainer {
            width: 100px;
            bottom: 10px;
            display: flex;
            align-items: center;
            justify-content: start;
            position: absolute;
            margin: 10px 10px 20px 10px;
            cursor: pointer;
            @media screen and (max-width: 500px) {
                margin: 10px 10px 20px 0px;
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
                top: 10px;
                @media screen and (max-width: 500px) {
                    /* display: none; */
                }
            }
        }
        .search {
            color: white;
            font-size: 11px;
            margin: 20px 10px 2px 20px;
            @media screen and (max-width: 500px) {
                margin: 20px 10px 2px 0px;
            }
        }
        .tabContainer {
            display: flex;
            align-items: center;
            justify-content: start;
            position: relative;
            margin: 10px 10px 20px 10px;
            cursor: pointer;
            @media screen and (max-width: 500px) {
                margin: 10px 10px 20px 0px;
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
                @media screen and (max-width: 500px) {
                    /* display: none; */
                }
            }
        }
        .alertContainer {
            /* background-color: wheat; */
            display: flex;
            flex-direction: column;
            margin: 10px 10px 20px 10px;
            .alertTab {
                /* background-color: violet; */
                display: flex;
                flex-direction: row;
                align-items: center;
                justify-content: start;
                position: relative;
                margin-bottom: 10px;
                cursor: pointer;
                .alertIcons {
                    color: white;
                }
                h3 {
                    width: 100px;
                    font-size: 14px;
                    color: white;
                    position: absolute;
                    left: 35px;
                    top: 10px;
                }
            }
            .alertScroll {
                height: 500px;
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
                .alertShareContainer {
                    display: flex;
                    background-color: rgba(255, 255, 255, 0.27);
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
                    p {
                        color: rgba(255, 255, 255);
                        font-size: 14px;
                        margin-bottom: 10px;
                    }
                    h6 {
                        /* color: rgba(255, 255, 255, 0.6); */
                        color: rgba(0, 150, 138, 0.9);
                        font-size: 13px;
                        margin-bottom: 5px;
                    }
                    h1 {
                        color: rgba(0, 150, 138, 0.9);
                        font-size: 13px;
                        margin-bottom: 5px;
                    }
                    button {
                        width: 100%;
                        height: 25px;
                        border-radius: 50px;
                        border: none;
                        background-color: rgba(0, 150, 138, 0.85);
                        color: white;
                        font-size: 10px;
                        font-weight: bold;
                        margin-top: 5px;
                        cursor: pointer;
                        &:hover {
                            background-color: rgba(0, 150, 138);
                        }
                    }
                }
            }
        }
    }
    .tab {
        /* background-color: yellow; */
        display: flex;
        flex-direction: column;
        width: 100%;
        height: 100%;
        padding: 30px 50px 0px 50px;
        h4 {
            font-size: 15px;
        }
    }
`;

export default MenuBar;