/* eslint-disable no-redeclare */
import React, { useCallback, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import MapComponent from '../components/MapComponent';
import styled from "styled-components";

// import MARKER from '../img/marker.png';
// import questionMarker from '../img/question_marker.png';

// MARKER <a href="https://www.flaticon.com/free-icons/marker" title="marker icons">Marker icons created by kmg design - Flaticon</a> 
// questionMarker <a href="https://www.flaticon.com/free-icons/maps-and-location" title="maps and location icons">Maps and location icons created by Iconic Panda - Flaticon</a> 

const ReviewQuestion = ({mainPing}) => {
    const { kakao } = window;
    const navigate = useNavigate();

    const [open, setOpen] = useState(false);
    const [select, setSelect] = useState([]);

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
                // content: data.Data.placeName, // 인포윈도우에 표시할 내용
                content: `
                <div>
                    <h3>${data.Data.placeName}</h3>
                    <p>${data.Data.placeNumber}</p>
                </div>
                `
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
                    // console.log(select);
                };
            };
        });
    }, [kakao.maps.InfoWindow, kakao.maps.LatLng, kakao.maps.Map, kakao.maps.Marker, kakao.maps.event, mainPing]);
    
    useEffect(() => {
        getMainPing()
    }, [getMainPing]);

    return (
        <Container>
            <div className='reviewQuestionMap'>
                <div className='reviewQuestionMapContainer'>
                    <MapComponent />
                </div>
                <div className='reviewQuestionListContainer'>
                    <div className='reviewQuestionListMap'>
                    <button className='mapAll' onClick={getMainPing}> 마커 전체보기 </button>
                        {mainPing.map((m, i) => {
                            return (
                                <div key={i}>
                                    <h3>{m.Data.placeName}</h3>
                                    <p>{m.Data.placeNumber}</p>
                                    <p>{m.Data.placeRoadAddress}</p>
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
                                </div>
                            ); 
                        })}
                    </div>
                </div>
            </div>
            <div className='selectPlace'>
                {open === true ? 
                <div className='selectPlaceContainer'>
                    <h4> {select.placeName} </h4> 
                    <p> {select.placeNumber} </p> 
                    <p> 주소: {select.placeAddress} </p> 
                    <p> 도로명 주소: {select.placeRoadAddress} </p> 
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
                            }); 
                        }}> 상세보기 </button>
                </div> : <h4> 마커를 클릭하세요. </h4>}
            </div>
        </Container>
    );
};

const Container = styled.div`
    display: flex;
    flex-direction: column;
    height: 100vh;
    width: 100%;
    .reviewQuestionMap {
        justify-content: space-between;
        display: flex;
        .reviewQuestionMapContainer {
            width: 63%;
        }
        .reviewQuestionListContainer {
            display: flex;
            flex-direction: column;
            width: 35%;
            height: 50vh;
            overflow-y: scroll;
            -ms-overflow-style: none; /* 인터넷 익스플로러 */
            scrollbar-width: none; /* 파이어폭스 */
            &::-webkit-scrollbar {
                display: none;
            }
            .reviewQuestionListMap {
                width: 100%;
                button {
                    width: 100%;
                    height: 25px;
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
                div {
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
                    h3 {
                        color: white;
                        font-size: 15px;
                        margin-top: 5px;
                        margin-bottom: 5px;
                    }
                    p {
                        color: white;
                        font-size: 12px;
                        margin-bottom: 5px;
                    }
                }
            }
        }
    }
    .selectPlace {
        display: flex;
        padding: 10px;
        margin-top: 10px;
        .selectPlaceContainer {
            display: flex;
            width: 100%;
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
            button {
                margin-top: 10px;
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
            h4 {
                color: white;
                font-size: 18px;
            }
            p {
                color: white;
                font-size: 12px;
                margin-top: 5px;
            }
        }
        h4 {
            color: white;
        }
    }
`;

export default ReviewQuestion;