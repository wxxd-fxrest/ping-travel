/* eslint-disable no-redeclare */
import React, { useCallback, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import MapComponent from '../components/MapComponent';
import styled from "styled-components";
import { HiOutlineXCircle } from "react-icons/hi2";
import { FaMapMarkerAlt } from "react-icons/fa";

const ReviewQuestion = ({mainPing}) => {
    const { kakao } = window;
    const navigate = useNavigate();

    const [open, setOpen] = useState(false);
    const [select, setSelect] = useState([]);

    const getMainPing = useCallback(async () => {
        let container = document.getElementById("map");
        let options = {
            center: new kakao.maps.LatLng(37.45978574975834, 126.9511239870991),
            level: 15,
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
                // content: `
                // <div>
                //     <h3>${data.Data.placeName}</h3>
                // </div>
                // `
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
                    <div className='selectPlace'>
                        {open === true ? 
                        <div className='selectPlaceContainer'>
                            <HiOutlineXCircle className='XIcon' onClick={() => setOpen(false)}/>
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
                        </div> : <div style={{display: 'flex', alignItems: 'center', justifyContent: 'center'}}>
                            <FaMapMarkerAlt color='white'/>
                            <h4> 마커를 클릭하세요. </h4>
                        </div>}
                    </div>
                </div>
                <div className='reviewQuestionListContainer'>
                    <div className={open === true ? 'openReviewQuestionListMap' : 'reviewQuestionListMap'}>
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
            
        </Container>
    );
};

const Container = styled.div`
    display: flex;
    flex-direction: column;
    height: 100vh;
    .reviewQuestionMap {
        justify-content: space-between;
        display: flex;
        margin: 10px 10px 0px 10px;
        @media screen and (max-width: 1200px) {
            display: flex;
            flex-direction: column;
            margin-right: 80px;
            margin-left: 80px;
            margin-top: 10px;
        }
        .reviewQuestionMapContainer {
            width: 100%;   
            margin-right: 10px;
            .mapComponent {
                @media screen and (max-width: 1200px) {
                    width: 100%;
                    height: 300px;
                }
            }
        }
        .reviewQuestionListContainer {
            display: flex;
            flex-direction: column;
            width: 60%;
            margin-right: 20px;
            height: 48vh;
            overflow-y: scroll;
            -ms-overflow-style: none; /* 인터넷 익스플로러 */
            scrollbar-width: none; /* 파이어폭스 */
            &::-webkit-scrollbar {
                display: none;
            }
            @media screen and (max-width: 1200px) {
                display: flex;
                flex-direction: column;
                width: 100%;
                /* margin-top: 10px; */
            }
            .reviewQuestionListMap {
                width: 100%;
                .mapAll {
                    width: 100%;
                    height: 30px;
                    border-radius: 50px;
                    border: none;
                    color: white;
                    font-size: 10px;
                    font-weight: bold;
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
                button {
                    width: 100%;
                    height: 25px;
                    border-radius: 50px;
                    border: none;
                    color: white;
                    font-size: 10px;
                    font-weight: bold;
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
                div {
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
                    box-shadow: 0px 4px 16px rgba(158, 158, 158, 0.25);
                    h3 {
                        color:  rgb(250, 117, 65);
                        font-weight: bold;
                        font-size: 15px;
                        margin-top: 5px;
                        margin-bottom: 5px;
                    }
                    p {
                        color:  rgba(250, 117, 65, 0.7);
                        font-size: 12px;
                        margin-bottom: 5px;
                    }
                }
            }
            .openReviewQuestionListMap {
                display: none;
            }
        }

    }
    .selectPlace {
        display: flex;
        padding: 10px;
        /* margin-top: 10px; */
        .selectPlaceContainer {
            display: flex;
            width: 100%;
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
            padding: 15px;
            .XIcon {
                position: absolute;
                right: 10px;
                top: 10px;
                height: 25px;
                width: 25px;
                cursor: pointer;
                color: rgba(250, 117, 65, 0.58);
                &:hover {
                    color: rgba(250, 117, 65, 0.95);
                }
            }
            h4 {
                color:  rgb(250, 117, 65);
                font-weight: bold;
                font-size: 17px;
            }
            p {
                color:  rgba(250, 117, 65, 0.7);
                font-size: 12px;
                margin-top: 5px;
            }
            button {
                margin-top: 10px;
                width: 100%;
                height: 30px;
                border-radius: 50px;
                border: none;
                color: white;
                font-size: 10px;
                font-weight: bold;
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
        h4 {
            color: white;
            margin-left: 10px;
            font-size: 14px;
        }
    }
`;

export default ReviewQuestion;