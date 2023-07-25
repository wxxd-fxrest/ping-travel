/* eslint-disable no-redeclare */
import React, { useContext, useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import { AuthContext } from "../AuthContext";
import { Map } from "react-kakao-maps-sdk";
import { db } from "../firebase";
import { addDoc, collection, doc, getDocs, query, setDoc, Timestamp, where } from "firebase/firestore";
import MainPing from "../components/MainPing";
import BackButton from "../components/modal/BackButton";
import styled from "styled-components";
import { HiOutlinePencilSquare } from "react-icons/hi2";
            
const PlacePage = ({mainPing}) => {
    const {currentUser} = useContext(AuthContext);
    const { kakao } = window;
    const location = useLocation();
    const state = location.state;
    // console.log(state)
    const [profileData, setProfileData] = useState([]); 
    const [type, setType] = useState(false);
    const [text, setText] = useState("");
    const [toggle, setToggle] = useState(false);
  
    useEffect(() => {
        const ProfileUserInfo = async () => {
            const getUserData = query(
                collection(db, "UserInfo"), 
                where("uid", "==", `${currentUser.uid}`));
            const querySnapshot = await getDocs(getUserData);
              querySnapshot.forEach((doc) => {
                  setProfileData(doc.data());
                //   console.log("profileData: ", profileData)
              }); 
        }; 
        ProfileUserInfo();
    }, [currentUser.uid]);

    const onChange = (event) => {
        const {target : {name, value}} = event ; 
        if(name === "text") {
            setText(value); 
        } 
    };

    const onSaveBtn = async() => {
        let DocName = state.id
        await setDoc(doc(db, "MainPing", DocName), {
            placeName: state.name, 
            placeY: state.placey,
            placeX: state.placex,
            placeID: state.id,
            placeNumber: state.phone,
            placeAddress: state.address,
            placeRoadAddress: state.roadAdrees
        });
        if(type === true) {
            await addDoc(collection(db, "MainPing", DocName, "about"), {
                UID: currentUser.uid,
                userID: profileData.ID,
                date: Timestamp.now(),
                about: text, 
                type: 'question', 
                placeID: state.id,
                placeName: state.name, 
                placeNumber: state.phone,
                placeAddress: state.address,
                placeRoadAddress: state.roadAdrees,
                placeY: state.placey,
                placeX: state.placex,
            });
            await addDoc(collection(db, "UserInfo", `${currentUser.uid}`, "about"), {
                UID: currentUser.uid,
                userID: profileData.ID,
                date: Timestamp.now(),
                about: text, 
                type: 'question', 
                placeID: state.id,
                placeName: state.name, 
                placeNumber: state.phone,
                placeAddress: state.address,
                placeRoadAddress: state.roadAdrees,
                placeY: state.placey,
                placeX: state.placex,
            });
        } else if(type === false) {
            await addDoc(collection(db, "MainPing", DocName, "about"), {
                UID: currentUser.uid,
                userID: profileData.ID,
                date: Timestamp.now(),
                about: text, 
                type: 'review',
                placeID: state.id,
                placeName: state.name, 
                placeNumber: state.phone,
                placeAddress: state.address,
                placeRoadAddress: state.roadAdrees,
                placeY: state.placey,
                placeX: state.placex,
            });
            await addDoc(collection(db, "UserInfo", `${currentUser.uid}`, "about"), {
                UID: currentUser.uid,
                userID: profileData.ID,
                date: Timestamp.now(),
                about: text, 
                type: 'review',
                placeID: state.id,
                placeName: state.name, 
                placeNumber: state.phone,
                placeAddress: state.address,
                placeRoadAddress: state.roadAdrees,
                placeY: state.placey,
                placeX: state.placex,
            });
        }
        setType(false);
        setText("");
    };

    useEffect(() => {
        let container = document.getElementById("map");
        let options = {
            center: new kakao.maps.LatLng(state.placey, state.placex),
            level: 6,
        };
        //map
        const map = new kakao.maps.Map(container, options);

        // 마커를 생성합니다
        const marker = new kakao.maps.Marker({
            //마커가 표시 될 지도
            map: map,
            //마커가 표시 될 위치
            position:  new kakao.maps.LatLng(state.placey, state.placex)
        });
        marker.setMap(map);

        var infowindow = new kakao.maps.InfoWindow({
            content: state.name, // 인포윈도우에 표시할 내용
        });
        
        infowindow.open(map, marker);
        
    }, [kakao.maps.InfoWindow, kakao.maps.LatLng, kakao.maps.Map, kakao.maps.Marker, kakao.maps.MarkerImage, kakao.maps.Point, kakao.maps.Size, mainPing, state.name, state.placex, state.placey, state.type]);

    const handleClickToggle = () => {
        setType(!type)
        setToggle((prev) => !prev);
    };
  
    const btnClassName = ["toggle-btn", toggle ? "toggle-btn-on" : "toggle-btn-off",].join(" ");

    return(
        <Container>
            <div className="placeHeaderContainer">
                <BackButton /> 
                <div className='placeHeader'>
                    <HiOutlinePencilSquare size="35px" className='searchIcon' />
                    <h4> 리뷰 / 질문을 작성(확인) 하세요. </h4>
                </div>
            </div>

            <Map id='map' 
                center={{ lat: state.placey, lng: state.placex }}
                level={3}
                className="mapContainer">
            </Map>      

            <div className="placeBody">
                <h4> {state.name} </h4>

                {currentUser ? <>
                    <div className="checkBoxContainer">
                        <h3> 질문/리뷰를 등록하세요. </h3>
                        <div className="checkBoxComponent">
                            <label className="toggle-container" aria-label="Toggle">
                                <input className="toggle-input"
                                    type="checkbox"
                                    checked={toggle}
                                    value={type} 
                                    onChange={() => setType(!type)}
                                    onClick={handleClickToggle}
                                    data-testid="toggle-input" />
                                <span className={btnClassName} />
                            </label>
                            {type === false ? <h6> 리뷰 </h6> : <h6> 질문 </h6>}
                            <button type="button" onClick={onSaveBtn}> ok </button>
                        </div>
                    </div>
                    <textarea type="text" 
                        name="text"
                        placeholder="내용을 입력해주세요" 
                        value={text} 
                        onChange={onChange}
                        className="placeInput"/>
                </> : <p>  로그인 후 남길 수 있습니다. </p> }
            </div>
            <div className="mapingComponent">
                <MainPing mainPing={mainPing} id={state.id}/>
            </div>
        </Container>
    )
};

const Container = styled.div`
    background-color: white;
    width: 50vw;
    height: 98vh;
    display: flex;
    flex-direction: column;
    border: solid 0.01rem rgba(0, 150, 138, 0.85);
    border-radius: 10px;
    @media screen and (max-width: 700px) {
        width: 90vw;
    }
    .placeHeaderContainer {
        display: flex;
        justify-content: space-between;
        padding: 10px;
        .haveBackBtn {
            color: rgba(0, 150, 138, 0.85);
        }
        .placeHeader {
            display: flex;
            align-items: center;
            .searchIcon {
                margin-right: 5px;
                color: rgba(0, 150, 138, 0.85);
            }
            h4 {
                font-size: 17px;
                color: rgba(0, 150, 138, 0.85);
            }
        }
    }
    .mapContainer {
        height: 30vh;
        max-height: 30vh;
        min-height: 30vh;
        border-radius: 5px;
        overflow: hidden;
        margin-left: 10px;
        margin-right: 10px;
    }
    .placeBody {
        display: flex;
        flex-direction: column;
        padding: 20px 20px 10px 20px;
        h4 {
            font-size: 20px;
            color: rgba(0, 150, 138, 0.85);
            margin-bottom: 5px;
        }
        .checkBoxContainer {
            display: flex;
            justify-content: space-between;    
            flex-direction: row;
            align-items: center;
            h3 {
                font-size: 15px;
                color: black;
                color: rgba(0, 150, 138, 0.85);
            }
            .checkBoxComponent {
                align-items: center;
                display: flex;
                // 체크박스 디자인 시작
                .toggle-container {
                    display: flex;
                    margin-right: 10px;
                }
                .toggle-btn {
                    box-sizing: initial;
                    display: inline-block;
                    outline: 0;
                    width: 2.5em;
                    height: 1.3rem;
                    position: relative;
                    cursor: pointer;
                    user-select: none;
                    background: #fbfbfb;
                    border-radius: 4em;
                    padding: 4px;
                    transition: all 0.4s ease;
                    border: 1px solid #e8eae9;
                }
                .toggle-input:focus + .toggle-btn::after,
                .toggle-btn:active::after {
                    box-sizing: initial;
                    box-shadow: 0 0 0 2px rgba(0, 0, 0, 0.1), 0 4px 0 rgba(0, 0, 0, 0.08),
                        inset 0px 0px 0px 3px #9c9c9c;
                }
                .toggle-btn::after {
                    left: 0;
                    position: relative;
                    display: block;
                    content: "";
                    width: 50%;
                    height: 100%;
                    border-radius: 4em;
                    background: #fbfbfb;
                    transition: all 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275),
                        padding 0.3s ease, margin 0.3s ease;
                    box-shadow: 0 0 0 2px rgba(0, 0, 0, 0.1), 0 4px 0 rgba(0, 0, 0, 0.08);
                }
                .toggle-btn.toggle-btn-on::after {
                    left: 50%;
                }
                .toggle-btn.toggle-btn-on {
                    background: #00968A;
                }
                .toggle-btn.toggle-btn-on:active {
                    box-shadow: none;
                }
                .toggle-btn.toggle-btn-on:active::after {
                    margin-left: -1.6em;
                }
                .toggle-btn:active::after {
                    padding-right: 1.6em;
                }
                .toggle-btn[disabled] {
                    opacity: 0.7;
                    cursor: auto;
                }
                .toggle-input {
                    border: 0;
                    clip: rect(0 0 0 0);
                    height: 1px;
                    margin: -1px;
                    overflow: hidden;
                    padding: 0;
                    position: absolute;
                    width: 1px;
                    white-space: nowrap;
                }
                // 체크박스 디자인 끝
                h6 {
                    margin-right: 10px;
                    font-size: 14px;
                    color: rgba(0, 150, 138, 0.85);
                    border-right: solid 1px black;
                    padding-right: 10px;
                }
                button {
                    width: 60px;
                    height: 30px;
                    border-radius: 50px;
                    border: none;
                    background-color: rgba(0, 150, 138, 0.85);
                    color: white;
                    font-size: 13px;
                    font-weight: bold;
                    margin-right: 3px;
                    cursor: pointer;
                    &:hover {
                        background-color: rgba(0, 150, 138);
                    }
                }
            }
        }
        .placeInput {
            height: 40px;
            max-height: 40px;
            min-height: 40px;
            border-radius: 10px;
            border: none;
            background-color: rgba(0, 150, 138, 0.3);
            color: rgba(0, 150, 138, 0.85);
            outline: none;
            padding: 10px;
            margin-right: 5px;
            margin-top: 5px;
            &::placeholder {
                color: rgba(0, 150, 138, 0.85);
            }
            &:focus {
                background-color: rgba(0, 150, 138, 0.3);
            }
        }
    }
    .mapingComponent {
        padding: 5px 20px 20px 20px;
        overflow-y: scroll;
        -ms-overflow-style: none; /* 인터넷 익스플로러 */
        scrollbar-width: none; /* 파이어폭스 */
        &::-webkit-scrollbar {
            display: none;
        }
    }
`;

export default PlacePage;