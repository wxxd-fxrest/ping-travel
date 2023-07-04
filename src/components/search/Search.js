import React, { useEffect, useState } from 'react';
import { Map, MapMarker } from "react-kakao-maps-sdk";
import { useLocation, useNavigate } from 'react-router-dom';
import styled from "styled-components";
import MapComponent from '../MapComponent';
import SearchList from './SearchList';

const Search = () => {
    const navigate = useNavigate();
    const [keyword, setKeyword] = useState('');
    const [places, setPlaces] = useState([]);
    const { kakao } = window;

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
            <button onClick={() => navigate("/")}> back </button>
            <input type="text" value={keyword} onChange={(e) => setKeyword(e.target.value)} />
            <button onClick={handleSearch}> 검색 </button>
            <MapComponent />
            {/* <Map id='map' 
                center={{ lat: 37.566826, lng: 126.9786567 }}
                level={3}
                style={{ width: '100%', height: '400px' }}>
                {places.map((place, index) => (
                    <MapMarker key={index}
                        position={{ lat: place.y, lng: place.x }}/>
                ))}
            </Map> */}
            {/* {placeList()} */}

            {places.map((p, i) => (
                <SearchList key={i} places={p}/>
            ))}; 
            
    {/* <Container>
      <div id="map" style={{ width: '100%', height: '500px' }}></div>
    </Container> */}

        </Container>
    );
};

const Container = styled.div``;

export default Search;


    // x, y 좌표 가져와서 주소 받기
    // const { kakao } = window;
	// const [address, setAddress] = useState(null); // 현재 좌표의 주소를 저장할 상태

	// const getAddress = (lat, lng) => {
	// 	const geocoder = new kakao.maps.services.Geocoder(); // 좌표 -> 주소로 변환해주는 객체
	// 	const coord = new kakao.maps.LatLng(37.55655854365159, 126.90455950069239); // 주소로 변환할 좌표 입력
	// 	const callback = function (result, status) {
	// 		if (status === kakao.maps.services.Status.OK) {
	// 			setAddress(result[0].address);
	// 		}
	// 	};
	// 	geocoder.coord2Address(coord.getLng(), coord.getLat(), callback);
	// };
    
    // <Map center={{ lat: 37.55655854365159, lng: 126.90455950069239 }} style={{ width: '800px', height: '600px' }} level={3}>
    //     <MapMarker position={{ lat: 37.55655854365159, lng: 126.90455950069239 }} />
    //     <button onClick={getAddress}>현재 좌표의 주소 얻기</button>
    // </Map>

    // {address && (
    //     <div>
    //         현재 좌표의 주소는..
    //         <p>address_name: {address.address_name}</p>
    //         <p>region_1depth_name: {address.region_1depth_name}</p>
    //         <p>region_2depth_name: {address.region_2depth_name}</p>
    //         <p>region_3depth_name: {address.region_3depth_name}</p>
    //     </div>
    // )} 

    // ----
    
    // 마커에 mouseover 이벤트와 mouseout 이벤트를 등록합니다
    // 이벤트 리스너로는 클로저를 만들어 등록합니다
    // 클로저를 만들어 주지 않으면 마지막 마커에만 이벤트가 등록됩니다
    // kakao.maps.event.addListener(
    //     marker,
    //     "mouseover",
    //     makeOverListener(map, marker, infowindow)
    // );

    // kakao.maps.event.addListener(
    //     marker,
    //     "mouseout",
    //     makeOutListener(infowindow)
    // );
    
    // 인포윈도우를 표시하는 클로저를 만드는 함수입니다
    // function makeOverListener(map, marker, infowindow) {
    //     return function () {
    //         infowindow.open(map, marker);
    //     };
    // };
    
    //     // 인포윈도우를 닫는 클로저를 만드는 함수입니다
    //     function makeOutListener(infowindow) {
    //     return function () {
    //         infowindow.close();
    //     };
    // };