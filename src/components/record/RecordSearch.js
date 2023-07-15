import React, { useCallback, useState } from "react";
import { useNavigate } from "react-router-dom";
import MenuBar from "../../routers/MenuBar";
import MapComponent from "../MapComponent";
import RecordSearchList from "./RecordSearchList";

const RecordSearch = ({pathUID, pathDocID, state}) => {
    const { kakao } = window;
    const navigate = useNavigate();
    const [keyword, setKeyword] = useState('');
    const [places, setPlaces] = useState([]);

    const handleSearch = useCallback((e) => {
        e.preventDefault();
        if (!keyword.trim()) {
            alert('키워드를 입력해주세요!');
            return;
        }
    
        const ps = new window.kakao.maps.services.Places();
        
        ps.keywordSearch(keyword, (data, status) => {
            let container = document.getElementById("map");
            let options = {
                center: new kakao.maps.LatLng(37.45978574975834, 126.9511239870991),
                level: 10,
            };

            //map
            const map = new kakao.maps.Map(container, options);

            if (status === window.kakao.maps.services.Status.OK) {
                setPlaces(data);


                places.forEach((data) => {
                    // console.log(data)
                    // 마커를 생성합니다
                    const marker = new kakao.maps.Marker({
                        //마커가 표시 될 지도
                        map: map,
                        //마커가 표시 될 위치
                        position: new kakao.maps.LatLng(data.y, data.x),
                    });
                    marker.setMap(map);

                    var infowindow = new kakao.maps.InfoWindow({
                        content: data.place_name, // 인포윈도우에 표시할 내용
                    });
                    
                    kakao.maps.event.addListener(
                        marker,
                        "click",
                        makeOverListener(map, marker, infowindow)
                    );
                    infowindow.open(map, marker);

                    function makeOverListener(map, marker, infowindow) {
                        return function () {
                        };
                    };
                });

            } else if (status === window.kakao.maps.services.Status.ZERO_RESULT) {
                alert('검색 결과가 존재하지 않습니다.');
            } else if (status === window.kakao.maps.services.Status.ERROR) {
                alert('검색 결과 중 오류가 발생했습니다.');
            }
            // console.log(places);
        });
    }, [kakao.maps.InfoWindow, kakao.maps.LatLng, kakao.maps.Map, kakao.maps.Marker, kakao.maps.event, keyword, places]);

    return (
        <div>
            <button onClick={(e) => {
                e.preventDefault();
                navigate(-1);
            }}> 뒤로가기 </button>
            <input type="text" value={keyword} onChange={(e) => setKeyword(e.target.value)} />
            <button onClick={handleSearch}> 검색 </button>
            <MapComponent />
            {places.map((p, i) => (
                <RecordSearchList key={i} places={p} 
                    pathUID={pathUID} pathDocID={pathDocID} state={state}  /* record */ /> 
            ))}
        </div>
    )
}; 

export default RecordSearch;