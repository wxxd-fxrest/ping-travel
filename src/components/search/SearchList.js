import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import styled from "styled-components";
import { HiOutlineCursorArrowRays } from "react-icons/hi2";

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
            <div className="searchList">
                <h3> {places.place_name} </h3>
                <p> {places.address_name} </p>
                <p> {places.phone} </p>
                <p> {places.id} </p>
                <HiOutlineCursorArrowRays size="24px" className="clickMap"/>
                <p className="clickName" onClick={onClick}> {places.y}, {places.x} </p>

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
            </div>
        </Container>
    )
};

const Container = styled.div`
    display: flex;
    flex-direction: column;
    width: 100%;
    .searchList {
        display: flex;
        background-color: rgba(0, 150, 138, 0.3);
        border-radius: 10px;
        list-style: none;
        text-align: start;
        align-items: flex-start;
        justify-content: center;
        position: relative;
        flex-direction: column;
        margin-bottom: 10px;
        padding: 18px;
        h3 {
            width: 80%;
            color: rgba(0, 150, 138, 0.85);
            margin-bottom: 5px;
            font-size: 16px;
        }
        p {
            width: 80%;
            color: rgba(0, 150, 138, 0.85);
            margin-bottom: 5px;
            font-size: 13px;
        }
        .clickMap {
            position: absolute;
            cursor: pointer;
            top: 10px;
            right: 15px;
            color: rgba(0, 150, 138, 0.85);
        }
        .clickName {
            background-color: transparent;
            cursor: pointer;
            position: absolute;
            width: 50px;
            height: 40px;
            top: 3px;
            right: 0px;
            font-size: 1px;
            opacity: 0;
        }
        button {
            width: 100%;
            height: 30px;
            border-radius: 50px;
            border: none;
            background-color: rgba(0, 150, 138, 0.85);
            color: white;
            font-size: 10px;
            font-weight: bold;
            margin-top: 5px;
            cursor: pointer;
            &:hover {
                background-color: rgba(0, 150, 138);
            }
        }
    }
`;

export default SearchList;