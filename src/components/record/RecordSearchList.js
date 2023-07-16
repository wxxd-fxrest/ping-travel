/* eslint-disable react-hooks/exhaustive-deps */
import React, { useCallback, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import styled from "styled-components";

const RecordSearchList = ({places, state}) => {
    const { kakao } = window;
    const navigate = useNavigate();
    const location = useLocation();

    const pathname = location.pathname; 
    const addPathUID = (pathname.split('/')[2]);
    const addPathDocID = (pathname.split('/')[3]);

    const [select, setSelect] = useState(false);

    let placey;
    let placex;

    const onClick = useCallback((e) => {
        let all = e.target.innerHTML;
        placey = all.split(',')[0];
        placex = all.split(',')[1];
        setSelect(!select);

        let container = document.getElementById("map");
        let options = {
                center: new kakao.maps.LatLng(placey, placex),
                level: 3,
            };

        //map
        const map = new kakao.maps.Map(container, options);
        const marker = new kakao.maps.Marker({
            //마커가 표시 될 지도
            map: map,
            //마커가 표시 될 위치
            position: new kakao.maps.LatLng(placey, placex),
        });
        marker.setMap(map);

        let geocoder = new kakao.maps.services.Geocoder();
    
        let coord = new kakao.maps.LatLng(placey, placex);
        let callback = function(result, status) {
            if (status === kakao.maps.services.Status.OK) {
                // console.log(result);
                // navigate(`/place/${places.id}`) ; 
            }
        }
        geocoder.coord2Address(coord.getLng(), coord.getLat(), callback);
    }, [places, select]); 

    // console.log(places)

    return (
        <Container>
            <ul>        
                <li>
                    <h3> {places.place_name} </h3>
                    <p> {places.address_name} </p>
                    <p> {places.phone} </p>
                    <p> {places.id} </p>

                    <button value={[
                        places.id
                    ]} onClick={onClick}> {places.y}, {places.x}, {places.id}, {places.place_name} </button>

                    {select === true && <>
                        {state ? <>
                            <button onClick={(e) => {
                                e.preventDefault();
                                navigate(`/record/save/${places.id}`, {
                                    state: {
                                        state: state,
                                        addPathUID: addPathUID,
                                        addPathDocID: addPathDocID,
                                        name: places.place_name,
                                        phone: places.phone,
                                        id: places.id,
                                        placey: places.y,
                                        placex: places.x,
                                        address: places.address_name,
                                        roadAdrees: places.road_address_name,
                                    }
                                }); 
                            }}> 추가 기록하기 </button>
                        </> : <>
                            <button onClick={(e) => {
                                e.preventDefault();
                                navigate(`/record/save/${places.id}`, {
                                    state: {
                                        name: places.place_name,
                                        phone: places.phone,
                                        id: places.id,
                                        placey: places.y,
                                        placex: places.x,
                                        address: places.address_name,
                                        roadAdrees: places.road_address_name,
                                    }
                                }); 
                            }}> 기록하기 </button>
                        </>}
                    </>}
                </li>
            </ul>
        </Container>
    )
};

const Container = styled.div``;

export default RecordSearchList;