/* eslint-disable no-redeclare */
import { signOut } from 'firebase/auth';
import React, { useContext, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import styled from "styled-components";
import { AuthContext } from '../AuthContext';
import MapComponent from '../components/MapComponent';
import { auth } from '../firebase';
import MARKER from '../img/marker.png';
import questionMarker from '../img/question_marker.png';

// MARKER <a href="https://www.flaticon.com/free-icons/marker" title="marker icons">Marker icons created by kmg design - Flaticon</a> 
// questionMarker <a href="https://www.flaticon.com/free-icons/maps-and-location" title="maps and location icons">Maps and location icons created by Iconic Panda - Flaticon</a> 

// let data = [
//     {
//         id : 7813437,
//         placey : 37.564332600526484,
//         placex : 126.93893346118793,
//         name : '연세대학교',
//         data : '연세대학교 DATA',
//         type : 'question',
//     },
//     {
//         id: 11369827,
//         placey: 37.589526761187834, 
//         placex: 127.03231892661324,
//         name: '고려대학교',
//         data : '고려대학교 DATA',
//         type : 'review',
//     },
//     {
//         id: 8663561,
//         placey: 37.550874837441, 
//         placex: 126.925554591431,
//         name: '홍익대학교',
//         data : '홍익대학교 DATA',
//         type : 'review',
//     },
//     {
//         id: 11038502,
//         placey: 37.5968011678013,
//         placex: 127.05285401582,
//         name: '경희대학교',
//         data : '경희대학교 DATA',
//         type : 'review',
//     },
//     {
//         id : 11137036,
//         placey : 37.45978574975834,
//         placex : 126.9511239870991,
//         name : '서울대학교',
//         data : '서울대학교 DATA',
//         type : 'question',
//     }
// ]; 

const Home = ({mainPing}) => {
    const { kakao } = window;
    const navigate = useNavigate();
    const {currentUser} = useContext(AuthContext);

    const [open, setOpen] = useState(false);
    const [select, setSelect] = useState([]);
    let currentID ;

    // console.log(mainPing);
    useEffect(() => {
        let container = document.getElementById("map");
        let options = {
            center: new kakao.maps.LatLng(37.45978574975834, 126.9511239870991),
            level: 10,
        };

        //map
        const map = new kakao.maps.Map(container, options);


        mainPing.forEach((data) => {
            if(data.Data.type === 'question') {
                var imageSrc = MARKER, // 마커이미지의 주소입니다    
                    imageSize = new kakao.maps.Size(50, 50), // 마커이미지의 크기입니다
                    imageOption = {offset: new kakao.maps.Point(27, 69)}; // 마커이미지의 옵션입니다. 마커의 좌표와 일치시킬 이미지 안에서의 좌표를 설정합니다.
            } else if(data.Data.type === 'review') {
                var imageSrc = questionMarker, // 마커이미지의 주소입니다    
                    imageSize = new kakao.maps.Size(50, 50), // 마커이미지의 크기입니다
                    imageOption = {offset: new kakao.maps.Point(27, 69)}; // 마커이미지의 옵션입니다. 마커의 좌표와 일치시킬 이미지 안에서의 좌표를 설정합니다.
            }

            // 마커의 이미지정보를 가지고 있는 마커이미지를 생성합니다
            var markerImage = new kakao.maps.MarkerImage(imageSrc, imageSize, imageOption),
                markerPosition = new kakao.maps.LatLng(data.Data.placeY, data.Data.placeX); // 마커가 표시될 위치입니다
    
    
            // 마커를 생성합니다
            const marker = new kakao.maps.Marker({
                //마커가 표시 될 지도
                map: map,
                //마커가 표시 될 위치
                position: markerPosition,
                image: markerImage,
            });
            marker.setMap(map);

            var infowindow = new kakao.maps.InfoWindow({
                content: data.Data.placeName, // 인포윈도우에 표시할 내용
            });
            
            infowindow.open(map, marker);

            kakao.maps.event.addListener(
                marker,
                "click",
                makeOverListener(map, marker, infowindow)
            );

            function makeOverListener(map, marker, infowindow) {
                return function () {
                    setOpen(true);
                    setSelect(data.Data);
                    // console.log(select.placeName);
                };
            };
        });
        // console.log(place);

    }, [kakao.maps.InfoWindow, kakao.maps.LatLng, kakao.maps.Map, kakao.maps.Marker, kakao.maps.MarkerImage, kakao.maps.Point, kakao.maps.Size, kakao.maps.event, mainPing, select.Data]);



    return (
        <Container>
            <button onClick={(e) => {
                    e.preventDefault();
                    navigate('/search')}}> 
                검색 
            </button>
            {currentUser ? <>
                <button onClick={() => {
                    signOut(auth) 
                    navigate("/")
                    alert("로그아웃 되었습니다.")}}> 
                    로그아웃
                </button> 
            </> : <>
                <button onClick={(e) => {
                        e.preventDefault();
                        navigate('/auth')}}> 
                    로그인 / 회원가입 
                </button>
            </>}
            {currentUser &&
                <button onClick={(e) => {
                        e.preventDefault();
                        currentID = currentUser.email.split('@')[0];
                        navigate(`/profile/${currentID}`)}}> 
                        프로필
                </button>}
            <MapComponent />
            {open === true ? 
                <div>
                    <h4> {select.placeName} </h4> 
                    <h4> {select.review} </h4> 
                    <button onClick={(e) => {
                            e.preventDefault();
                            navigate(`/place/${select.id}`, {
                                state: {
                                    name: select.placeName,
                                    phone: select.placeNumber,
                                    id: select.placeID,
                                    placey: select.placeY,
                                    placex: select.placeX,
                                    address: select.placeAddress,
                                    roadAdrees: select.placeRoadAddress,
                                    type: select.type
                                }
                            }) ; 
                        }}> 상세보기 </button>
                </div>: <h4> null </h4>}
        </Container>
    );
};

const Container = styled.div``;

export default Home;