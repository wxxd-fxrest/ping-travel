/* eslint-disable no-unused-vars */
import React, { useEffect, useState } from "react";
import { Map } from "react-kakao-maps-sdk";
import styled from "styled-components";


const MapComponent = () => {
    const { kakao } = window;
    const [map, setMap] = useState(null);

    useEffect(()=>{
        const container = document.getElementById('map');
        const options = { center: new kakao.maps.LatLng(33.450701, 126.570667)};
        const kakaoMap = new kakao.maps.Map(container, options);
        setMap(kakaoMap);
    },[kakao.maps.LatLng, kakao.maps.Map]);

    return (
        <Container>
            <Map id='map' 
                center={{ lat: 37.566826, lng: 126.9786567 }}
                level={15}
                className="mapComponent">
            </Map>
        </Container>
    ) ;
} ; 

const Container = styled.div`
    display: flex;
    .mapComponent {
        width: 100%;
        height: 400px;
        border-radius: 5px;
        overflow: hidden;
    }
`;

export default MapComponent;