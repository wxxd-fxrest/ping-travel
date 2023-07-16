import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import styled from "styled-components";

const SearchList = ({places}) => {
    const { kakao } = window;
    const navigate = useNavigate();

    const [select, setSelect] = useState(false);

    const onClick = (e) => {
        let all = (e.target.innerHTML);
        setSelect(!select);
        let placey = all.split(',')[0];
        let placex = all.split(',')[1];
        // console.log("placey => ", placey, "placex => ", placex);

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
    };

    // console.log(places)
    return (
        <Container>
            <ul>
                <li>
                    <h3> {places.place_name} </h3>
                    <p> {places.address_name} </p>
                    <p> {places.phone} </p>
                    <p> {places.id} </p>
                    <p onClick={onClick}> {places.y}, {places.x} </p>

                    {select === true && <>
                        <button onClick={(e) => {
                            e.preventDefault();
                            navigate(`/place/${places.id}`, {
                                state: {
                                    name: places.place_name,
                                    phone: places.phone,
                                    id: places.id,
                                    placey: places.y,
                                    placex: places.x,
                                    address: places.address_name,
                                    roadAdrees: places.road_address_name,
                                    type: "null"
                                }
                            }); 
                        }}> 상세보기 </button>
                    </>}

                </li>
            </ul>
        </Container>
    )
};

const Container = styled.div``;

export default SearchList;