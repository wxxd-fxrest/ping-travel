import React, { useCallback, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import styled from "styled-components";
import { HiMiniXMark, HiOutlineCursorArrowRays } from "react-icons/hi2";

const FirstTab = ({myPingID, profileUser}) => {
    const { kakao } = window;
    const navigate = useNavigate();

    const [open, setOpen] = useState(false);
    const [pingData, setPingData] = useState([]);
    const [open2, setOpen2] = useState(false);

    // console.log(pingData)

    const getPlaceAll = useCallback(() => {
        setOpen(false);
        setOpen2(false);

        let container = document.getElementById("map");
        let options = {
            center: new kakao.maps.LatLng(37.45978574975834, 126.9511239870991),
            level: 20,
        };
        //map
        const map = new kakao.maps.Map(container, options);

        myPingID.forEach((ping) => {
            // console.log(ping)

            // 마커를 생성합니다
            const marker = new kakao.maps.Marker({
                //마커가 표시 될 지도
                map: map,
                //마커가 표시 될 위치
                position: new kakao.maps.LatLng(ping.Data.placeY, ping.Data.placeX)
            });

            marker.setMap(map);

            var infowindow = new kakao.maps.InfoWindow({
                content: ping.Data.placeName, // 인포윈도우에 표시할 내용
            });
            
            kakao.maps.event.addListener(
                marker,
                "click",
                makeOverListener(map, marker, infowindow)
            );

            function makeOverListener(map, marker, infowindow) {
                return function () {
                    infowindow.open(map, marker);
                    setPingData(ping.Data);
                    // console.log(pingData)
                    setOpen2(true)
                };
            };
        });
    }, [kakao.maps.InfoWindow, kakao.maps.LatLng, kakao.maps.Map, kakao.maps.Marker, kakao.maps.event, myPingID]);

    useEffect(() => {
        getPlaceAll()
    }, [getPlaceAll]);

    const onClick = useCallback(async(e) => {
        setOpen(false);
        setOpen2(false);
        let all = (e.target.innerHTML);
        let placey = all.split(',')[0];
        let placex = all.split(',')[1];
        let placename = all.split(',')[3];

        let container = document.getElementById("map");
        let options = {
            center: new kakao.maps.LatLng(placey, placex),
            level: 4,
        };

        const map = new kakao.maps.Map(container, options);
        
        // 마커를 생성합니다
        const marker = new kakao.maps.Marker({
            //마커가 표시 될 지도
            map: map,
            //마커가 표시 될 위치
            position: new kakao.maps.LatLng(placey, placex),
            // image: markerImage,
        });
        marker.setMap(map);
    
        var infowindow = new kakao.maps.InfoWindow({
            content: placename, // 인포윈도우에 표시할 내용
        });
        
        infowindow.open(map, marker);

        kakao.maps.event.addListener(
            marker,
            "click",
            makeOverListener(map, marker, infowindow),
        );
        function makeOverListener(map, marker, infowindow) {
            return async function () {
                setOpen(true);
            };
        };

        let geocoder = new kakao.maps.services.Geocoder();
    
        let coord = new kakao.maps.LatLng(placey, placex);
        let callback = function(result, status) {
            if (status === kakao.maps.services.Status.OK) {
                setPingData(result);
                // console.log(pingData[0].road_address.building_name);
                // console.log(result)
            }
        }
        geocoder.coord2Address(coord.getLng(), coord.getLat(), callback);
    }, [kakao.maps.InfoWindow, kakao.maps.LatLng, kakao.maps.Map, kakao.maps.Marker, kakao.maps.event, kakao.maps.services.Geocoder, kakao.maps.services.Status.OK]);

    return (
        <Container>
            {open === true && <div className="firstTabContainer">
                {pingData[0].address.address_name && 
                    <div className="openContainer">
                        <h1 className="openName"> {pingData[0].address.address_name} </h1>
                        <HiMiniXMark size="22px" className="Xicon" onClick={() => setOpen(false)} />
                    </div>}
            </div>}

            {open2 === true && <div className="firstTabContainer">
                {pingData && <> 
                    <div className="openContainer">
                        <h1 className="openName"> {pingData.placeName} </h1>
                        <HiMiniXMark size="22px" className="Xicon" onClick={() => setOpen2(false)} />
                    </div>

                    <button onClick={(e) => {
                        e.preventDefault();
                        console.log(pingData)
                        navigate(`/place/${pingData.placeID}`, {
                            state: {
                                name: pingData.placeName,
                                phone: pingData.placeNumber,
                                id: pingData.placeID,
                                placey: pingData.placeY,
                                placex: pingData.placeX,
                                address: pingData.placeAddress,
                                roadAdrees: pingData.placeRoadAddress,
                            }
                        });
                    }}> 상세보기 </button>
                </>}
            </div>}

            <button className="placeAllBtn" onClick={getPlaceAll}> 전체보기 </button>

            {myPingID.map((m, i) => {
                return (
                    <div key={i} className="myPingIDContainer">
                        {m.Data.UID === profileUser.uid && <>
                            <h3>{m.Data.placeName}</h3>
                            <p>{m.Data.type}</p>
                            <h5>{m.Data.about}</h5>
                            <HiOutlineCursorArrowRays size="24px" className="clickMap"/>
                            <p className="clickBtn" onClick={onClick}> {m.Data.placeY}, {m.Data.placeX}, {m.Data.type}, {m.Data.placeName}, {m.Data.placeID}</p>
                            <button onClick={(e) => {
                                e.preventDefault();
                                console.log(m)
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
                                });
                            }}> 상세보기 </button>
                        </>}
                    </div>
                ); 
            })}
        </Container>
    )
};

const Container = styled.div`
    .firstTabContainer {
        flex-direction: column;
        background-color: white;
        border-radius: 10px;
        list-style: none;
        position: relative;
        margin-top: 5px;
        margin-bottom: 10px;
        padding: 13px;
        display: flex;
        .openContainer {
            /* background-color: aliceblue; */
            display: flex;
            flex-direction: row;
            justify-content: space-between;
            align-items: center;
            .openName {    
                font-size: 15px;
                color: rgb(250, 117, 65, 0.85); 
            }
            .Xicon {
                display: flex;
                cursor: pointer;
                color:rgba(250, 117, 65, 0.85);
                &:hover {
                    /* 호버 시 색상 변경 */
                    color: rgba(235, 93, 38);
                    
                    /* 호버 시 약간 크기를 키워 입체감을 높임 */
                    transform: scale(1.1);
                }
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
            margin-top: 10px;
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
    .placeAllBtn {
        width: 100%;
        height: 30px;
        border-radius: 50px;
        border: none;
        background-color: rgba(250, 117, 65, 0.85);
        color: white;
        font-size: 10px;
        font-weight: bold;
        margin-top: 5px;
        margin-bottom: 10px;
        cursor: pointer;
        /* 입체 효과를 위한 그림자 추가 */
        box-shadow: 0px 4px 6px rgba(0, 0, 0, 0.1), 0px 1px 3px rgba(0, 0, 0, 0.1);
        transition: transform 0.2s ease; /* 변환 효과 추가 */

        &:hover {
            transform: translateZ(5px);
            background-color: rgb(250, 117, 65);
        }
    }
    .myPingIDContainer {
        flex-direction: column;
        background-color: white;
        border-radius: 10px;
        list-style: none;
        position: relative;
        margin-top: 5px;
        margin-bottom: 10px;
        padding: 13px;
        display: flex;
        h3 {
            width: 80%;
            font-size: 13px;
            color:  rgba(250, 117, 65, 0.85);
            font-weight: bold;
        }
        p {
            width: 80%;
            font-size: 13px;
            color:  rgba(250, 117, 65, 0.85);
            margin: 5px 0px;
        }
        h5 {
            width: 80%;
            font-size: 13px;
            color:  rgba(250, 117, 65, 0.85);
        }
        .clickBtn {
            background-color: transparent;
            cursor: pointer;
            position: absolute;
            width: 50px;
            height: 40px;
            top: 0px;
            right: 0px;
            font-size: 1px;
            opacity: 0;
            z-index: 11;
        }
        .clickMap {
            position: absolute;
            cursor: pointer;
            top: 10px;
            right: 15px;
            color:rgba(250, 117, 65, 0.85);
            z-index: 10;
            &:hover {
                /* 호버 시 색상 변경 */
                color: rgba(235, 93, 38);
                
                /* 호버 시 약간 크기를 키워 입체감을 높임 */
                transform: scale(1.1);
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
            margin-top: 10px;
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
`;

export default FirstTab;