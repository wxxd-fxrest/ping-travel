import React, { useState } from 'react';
import MapComponent from '../MapComponent';
import BackButton from '../modal/BackButton';
import SearchList from './SearchList';
import styled from "styled-components";
import { HiMiniMagnifyingGlass } from "react-icons/hi2";

const Search = () => {
    const { kakao } = window;
    
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
            <div className='searchHeaderContainer'>
                <BackButton /> 
                <div className='searchHeader'>
                    <HiMiniMagnifyingGlass size="35px" className='searchIcon' />
                    <h4> 검색할 장소의 키워드를 입력해주세요. </h4>
                </div>
            </div>

            <MapComponent />
            <div className='searchInputBox'>
                <input type="text" 
                    placeholder='검색어를 입력하세요.'
                    value={keyword} 
                    onChange={(e) => setKeyword(e.target.value)} />
                <button onClick={handleSearch}> 검색 </button>
            </div>
            <div className='searchPlaceList'>
                {places.map((p, i) => (
                    <SearchList key={i} places={p}/>
                ))}   
            </div>
        </Container>
    );
};

const Container = styled.div`
    background-color: grey;
    width: 60vw;
    height: 100vh;
    display: flex;
    flex-direction: column;
    @media screen and (max-width: 700px) {
        width: 100vw;
    }
    .searchHeaderContainer {
        display: flex;
        justify-content: space-between;
        padding: 10px;
        .haveBackBtn {
            color: black;
        }
        .searchHeader {
            display: flex;
            align-items: center;
            .searchIcon {
                margin-right: 5px;
            }
            h4 {
                font-size: 17px;
            }
        }
    }
    .mapComponent {
        height: 40vh;
        max-height: 40vh;
        min-height: 40vh;
        border-radius: 5px;
        overflow: hidden;
        margin-left: 10px;
        margin-right: 10px;
    }
    .searchInputBox {
        display: flex;
        justify-content: end;
        margin: 10px;
        input {
            width: 40%;
            height: 38px;
            margin-right: 5px;
            border-radius: 50px;
            border: none;
            background-color: rgba(255, 255, 255, 0.27);
            /* background-color: rgba(255, 255, 255); */
            padding-left: 30px;
            padding-right: 50px;
            color: rgba(255, 255, 255, 0.9);
            outline: none;
            &:hover {
                background-color: rgba(255, 255, 255, 0.4);
            }
            &::placeholder {
                color: rgba(255, 255, 255, 0.7);
            }
            &:focus {
                background-color: rgba(255, 255, 255, 0.4);
            }
        }
        button {
            width: 100px;
            height: 40px;
            border-radius: 50px;
            border: none;
            background-color: rgba(0, 150, 138, 0.85);
            color: white;
            font-size: 15px;
            font-weight: bold;
            cursor: pointer;
            &:hover {
                background-color: rgba(0, 150, 138);
            }
        }
    }
    .searchPlaceList {
        padding: 10px;
        overflow-y: scroll;
        -ms-overflow-style: none; /* 인터넷 익스플로러 */
        scrollbar-width: none; /* 파이어폭스 */
        &::-webkit-scrollbar {
            display: none;
        }
    }
`;

export default Search;