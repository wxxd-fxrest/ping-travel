import React, { useEffect, useRef, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { Map, MapMarker } from "react-kakao-maps-sdk";
import MapComponent from "../components/MapComponent";

const PlacePage = ({places}) => {
    const navigate = useNavigate();
    const { kakao } = window;
    const location = useLocation();
    const state = location.state;

    const pathname = location.pathname ; 
    const pathUID = (pathname.split('/')[2]);

    console.log("pathUID =>", pathUID);
    console.log("state: ", state);
    console.log(places);

    useEffect(() => {
        let container = document.getElementById("map");
        let options = {
            center: new kakao.maps.LatLng(state.placey, state.placex),
            level: 3,
        };
        //map
        const map = new kakao.maps.Map(container, options);
        const marker = new kakao.maps.Marker({
            //마커가 표시 될 지도
            map: map,
            //마커가 표시 될 위치
            position: new kakao.maps.LatLng(state.placey, state.placex),
        });
        marker.setMap(map);
    }, [kakao.maps.LatLng, kakao.maps.Map, kakao.maps.Marker, state.placex, state.placey]);

    return(
        <div>
            <button onClick={() => navigate("/search")}> back </button>
            <Map id='map' 
                center={{ lat: state.placey, lng: state.placex }}
                level={3}
                style={{ width: '100%', height: '400px' }}>
            </Map>
            <ul>
                <li>
                    <p> {state.name} </p>
                    <p> {state.phone} </p>
                    <p> {state.id} </p>
                    <p> {state.placey}, {state.placex} </p>
                </li>
            </ul> 
        </div>
    )
};

export default PlacePage;