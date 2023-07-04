import { signOut } from 'firebase/auth';
import React, { useContext, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import styled from "styled-components";
import { AuthContext } from '../AuthContext';
import MapComponent from '../components/MapComponent';
import { auth } from '../firebase';

let data = [
    {
        id : 11137036,
        placey : 37.45978574975834,
        placex : 126.9511239870991,
        name : '서울대학교',
        data : '서울대학교 DATA',
    },
    {
        id : 7813437,
        placey : 37.564332600526484,
        placex : 126.93893346118793,
        name : '연세대학교',
        data : '연세대학교 DATA',
    },
    {
        id: 11369827,
        placey: 37.589526761187834, 
        placex: 127.03231892661324,
        name: '고려대학교',
        data : '고려대학교 DATA',
    },
    {
        id: 8663561,
        placey: 37.550874837441, 
        placex: 126.925554591431,
        name: '홍익대학교',
        data : '홍익대학교 DATA',
    },
    {
        id: 11038502,
        placey: 37.5968011678013,
        placex: 127.05285401582,
        name: '경희대학교',
        data : '경희대학교 DATA',
    },
]; 

const Home = () => {
    const { kakao } = window;
    const navigate = useNavigate();
    const {currentUser} = useContext(AuthContext);
    let currentID ;
    const [place, setPlace] = useState([]);
    const [open, setOpen] = useState(false);
    const [select, setSelect] = useState([]);

    useEffect(() => {
        setPlace(data);
        let container = document.getElementById("map");
        let options = {
            center: new kakao.maps.LatLng(37.45978574975834, 126.9511239870991),
            level: 3,
        };
        //map
        const map = new kakao.maps.Map(container, options);

        place.forEach((data) => {
            // 마커를 생성합니다
            const marker = new kakao.maps.Marker({
                //마커가 표시 될 지도
                map: map,
                //마커가 표시 될 위치
                position: new kakao.maps.LatLng(data.placey, data.placex),
            });
            marker.setMap(map);

            var infowindow = new kakao.maps.InfoWindow({
                content: data.name, // 인포윈도우에 표시할 내용
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
                    setSelect(data)
                };
            };
        });
        // console.log(place);

    }, [kakao.maps.InfoWindow, kakao.maps.LatLng, kakao.maps.Map, kakao.maps.Marker, kakao.maps.event, place]);



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
            <button onClick={(e) => {
                    e.preventDefault();
                    currentID = currentUser.email.split('@')[0];
                    navigate(`/profile/${currentID}`)}}> 
                    프로필
            </button> 
            <MapComponent />
            {open === true ? 
                <div>
                    <h4> {select.name} </h4> 
                    <h4> {select.data} </h4> 
                    <button onClick={(e) => {
                            e.preventDefault();
                            navigate(`/place/${select.id}`, {
                                state: {
                                    name: select.name,
                                    id: select.id,
                                    placey: select.placey,
                                    placex: select.placex,
                                }
                            }) ; 
                        }}> 상세보기 </button>
                </div>: <h4> null </h4>}
        </Container>
    );
};

// searchList 에선 state를 전달해 사용하지만 
// home 에선 firebase내에 저장된 데이터를 받아와 사용할 것이기에 
// 추후 navigate(state)부분 수정해야 함

const Container = styled.div``;

export default Home;