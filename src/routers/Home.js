/* eslint-disable no-redeclare */
import { signOut } from 'firebase/auth';
import { collection, doc, getDoc, getDocs, onSnapshot, query, where } from 'firebase/firestore';
import React, { useCallback, useContext, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import styled from "styled-components";
import { AuthContext } from '../AuthContext';
import FriendRequest from '../components/friend/FriendRequest';
import FriendSearchID from '../components/friend/FriendSearchID';
import MainPing from '../components/MainPing';
import MapComponent from '../components/MapComponent';
import { auth, db } from '../firebase';
import MARKER from '../img/marker.png';
import questionMarker from '../img/question_marker.png';

// MARKER <a href="https://www.flaticon.com/free-icons/marker" title="marker icons">Marker icons created by kmg design - Flaticon</a> 
// questionMarker <a href="https://www.flaticon.com/free-icons/maps-and-location" title="maps and location icons">Maps and location icons created by Iconic Panda - Flaticon</a> 

const Home = ({mainPing}) => {
    const { kakao } = window;
    const navigate = useNavigate();
    const {currentUser} = useContext(AuthContext);

    const [open, setOpen] = useState(false);
    const [select, setSelect] = useState([]);
    const [loginUserData, setLoginUserData] = useState([]);
    const [friendRequest, setFriendRequest] = useState([]);
    const [friendIDList, setFriendIDList] = useState([]);
    const [requestAlert, setRequestAlert] = useState(false);

    useEffect(() => {
        const getLoginUserData = async() => {
            const docRef = doc(db, "UserInfo", `${currentUser.uid}`);
            const docSnap = await getDoc(docRef);
            if (docSnap.exists()) {
                setLoginUserData(docSnap.data());
                setFriendRequest(docSnap.data().friendRequest);
                setFriendIDList(docSnap.data().friendID);
                // console.log(docSnap.data())
            } else {
                console.log("No such document!");
            }
        };
        getLoginUserData();
    }, [currentUser.uid, friendRequest]);

    const getMainPing = useCallback(async () => {
        let container = document.getElementById("map");
        let options = {
            center: new kakao.maps.LatLng(37.45978574975834, 126.9511239870991),
            level: 10,
        };

        //map
        const map = new kakao.maps.Map(container, options);

        mainPing.forEach((data) => {
            // 마커를 생성합니다
            const marker = new kakao.maps.Marker({
                //마커가 표시 될 지도
                map: map,
                //마커가 표시 될 위치
                position: new kakao.maps.LatLng(data.Data.placeY, data.Data.placeX),
            });
            marker.setMap(map);

            var infowindow = new kakao.maps.InfoWindow({
                content: data.Data.placeName, // 인포윈도우에 표시할 내용
            });
            
            kakao.maps.event.addListener(
                marker,
                "click",
                makeOverListener(map, marker, infowindow)
            );
            infowindow.open(map, marker);

            function makeOverListener(map, marker, infowindow) {
                return function () {
                    setOpen(true);
                    setSelect(data.Data);
                    console.log(select);
                };
            };
        });
    }, [kakao.maps.InfoWindow, kakao.maps.LatLng, kakao.maps.Map, kakao.maps.Marker, kakao.maps.event, mainPing, select])
    
    useEffect(() => {
        getMainPing()
    }, [getMainPing]);

    return (
        <Container>
            <h5 onClick={() => {
                setRequestAlert(!requestAlert)
                console.log(requestAlert)
            }}> 💡 </h5>
            {requestAlert === true && <>
                {friendRequest.map((f, i) => (
                    <FriendRequest key={i} friendRequest={f} loginUserData={loginUserData}/>
                ))}
            </>}
            <button onClick={(e) => {
                    e.preventDefault();
                    navigate('/search')}}> 
                검색 
            </button>
            <button onClick={() => {
                signOut(auth) 
                navigate("/")
                alert("로그아웃 되었습니다.")}}> 
                로그아웃
            </button> 
            <button onClick={(e) => {
                    e.preventDefault();
                    navigate(`/profile/${loginUserData.ID}`, {
                        state: {
                            friend: friendIDList,
                        }
                    })}}> 
                    프로필
            </button>
            <FriendSearchID loginUserData={loginUserData}/>
            <MapComponent />
            {open === true ? 
                <div>
                    <h4> {select.placeName} </h4> 
                    <MainPing mainPing={mainPing} id={select.placeID}/>
                    <button onClick={(e) => {
                            e.preventDefault();
                            navigate(`/place/${select.placeID}`, {
                                state: {
                                    name: select.placeName,
                                    phone: select.placeNumber,
                                    id: select.placeID,
                                    placey: select.placeY,
                                    placex: select.placeX,
                                    address: select.placeAddress,
                                    roadAdrees: select.placeRoadAddress,
                                }
                            }) ; 
                        }}> 상세보기 </button>
                </div> : <h4> null </h4>}
                {mainPing.map((m, i) => {
                    return (
                    <div key={i}>
                        <h3>{m.Data.placeName}</h3>
                        <button onClick={(e) => {
                            e.preventDefault();
                            navigate(`/place/${m.Data.placeID}`, {
                                state: {
                                    name: m.Data.placeName,
                                    phone: m.Data.placeNumber,
                                    id: m.Data.placeID,
                                    placey: m.Data.placeY,
                                    placex: m.Data.placeX,
                                    address: m.Data.placeAddress,
                                    roadAdrees: m.Data.placeRoadAddress,
                                }
                            }) ; 
                        }}> 상세보기 </button>
                    </div>); 
                })}
        </Container>
    );
};

const Container = styled.div``;

export default Home;