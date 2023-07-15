import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import styled from "styled-components";
import MapComponent from '../MapComponent';
import SearchList from './SearchList';

const Search = () => {
    const { kakao } = window;
    const navigate = useNavigate();
    const [keyword, setKeyword] = useState('');
    const [places, setPlaces] = useState([]);

    const handleSearch = (e) => {
        e.preventDefault();
        if (!keyword.trim()) {
            alert('키워드를 입력해주세요!');
            return;
        }
  
        const ps = new window.kakao.maps.services.Places();
        
        ps.keywordSearch(keyword, (data, status) => {
            if (status === window.kakao.maps.services.Status.OK) {
                setPlaces(data);

                let container = document.getElementById("map");
                let options = {
                    center: new kakao.maps.LatLng(37.624915253753194, 127.15122688059974),
                    level: 3,
                };
                //map
                const map = new kakao.maps.Map(container, options);

                places.forEach((el) => {
                    // 마커를 생성합니다
                    const marker = new kakao.maps.Marker({
                        //마커가 표시 될 지도
                        map: map,
                        //마커가 표시 될 위치
                        position: new kakao.maps.LatLng(el.y, el.x),
                    });
                    marker.setMap(map);

                    // 마커에 표시할 인포윈도우를 생성합니다
                    var infowindow = new kakao.maps.InfoWindow({
                        content: el.place_name, // 인포윈도우에 표시할 내용
                    });
                    // infowindow.open(map, marker);

                    kakao.maps.event.addListener(
                        marker,
                        "click",
                        makeOverListener(map, marker, infowindow)
                    );

                    // kakao.maps.event.addListener(
                    //     marker,
                    //     "mouseout",
                    //     makeOutListener(infowindow)
                    // );

                    function makeOverListener(map, marker, infowindow) {
                        return function () {
                            infowindow.open(map, marker);
                            console.log(el)
                        };
                    }
                });

            } else if (status === window.kakao.maps.services.Status.ZERO_RESULT) {
                alert('검색 결과가 존재하지 않습니다.');
            } else if (status === window.kakao.maps.services.Status.ERROR) {
                alert('검색 결과 중 오류가 발생했습니다.');
            }
            // console.log(places);
        });
    };
   
    return (
        <Container>
            <button onClick={(e) => {
                e.preventDefault();
                navigate(-1);
            }}> 뒤로가기 </button>
            <input type="text" value={keyword} onChange={(e) => setKeyword(e.target.value)} />
            <button onClick={handleSearch}> 검색 </button>
            <MapComponent />
            {places.map((p, i) => (
                <SearchList key={i} places={p}/>
            ))}
        </Container>
    );
};

const Container = styled.div``;

export default Search;