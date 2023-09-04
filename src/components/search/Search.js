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
    background-color: white;
    width: 50vw;
    height: 98vh;
    display: flex;
    flex-direction: column;
    border: solid 0.01rem rgb(250, 117, 65, 0.85);
    border-radius: 10px;
    @media screen and (max-width: 800px) {
        width: 80vw;
    }
    .searchHeaderContainer {
        display: flex;
        justify-content: space-between;
        padding: 10px;
        .haveBackBtn {
            color: rgb(250, 117, 65, 0.85);
        }
        .searchHeader {
            display: flex;
            align-items: center;
            .searchIcon {
                margin-right: 5px;
                color: rgb(250, 117, 65, 0.85);
            
            }
            h4 {
                font-size: 17px;
                color: rgb(250, 117, 65, 0.85);
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
        align-items: center;
        margin: 10px;
        input {
            width: 40%;
            height: 38px;
            margin-right: 5px;
            border-radius: 50px;
            border: none;
            background-color: rgb(250, 117, 65, 0.3);
            padding-left: 30px;
            padding-right: 50px;
            color: rgb(250, 117, 65, 0.85);
            outline: none;
            /* 그림자 효과 추가 */
            box-shadow: 0px 4px 6px rgba(0, 0, 0, 0.1), 0px 1px 3px rgba(0, 0, 0, 0.1);

            /* 입체적인 효과 추가 */
            transform: translateZ(5px);
            transition: transform 0.2s ease;
            &::placeholder {
                color: rgb(250, 117, 65, 0.85);
            }
            &:focus {
                background-color: rgb(250, 117, 65, 0.3);
            }
        }
        button {
            width: 80px;
            height: 38px;
            border-radius: 50px;
            border: none;
            color: white;
            font-size: 15px;
            font-weight: bold;
            cursor: pointer;
            background-color: rgba(250, 117, 65, 0.8);
            box-shadow: 0px 4px 6px rgba(0, 0, 0, 0.1), 0px 1px 3px rgba(0, 0, 0, 0.1);
            transition: transform 0.2s ease; /* 변환 효과 추가 */

            &:hover {
                /* 호버 시 약간의 변환 효과 추가 */
                transform: translateZ(5px);
                background-color: rgb(250, 117, 65);
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