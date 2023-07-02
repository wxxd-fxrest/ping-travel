import React, { useEffect } from "react";
import { Map, MapMarker } from "react-kakao-maps-sdk";

const Search = ({places}) => {
    const { kakao } = window;
    
    const onClick = (e) => {
        console.log(e.target.innerHTML)
    }

    // console.log(places.y)
    return (
        <div>
            <ul>
                <li>
                    <h3 onClick={onClick}> {places.place_name} </h3>
                    <p> {places.address_name} </p>
                    <p> {places.phone} </p>
                    <p> {places.y}, {places.x} </p>
                </li>
            </ul>
        </div>
    )
};

export default Search;