import React, { useCallback, useState } from "react";
import MapComponent from "../MapComponent";
import PlanSearchList from "./PlanSearchList";
import BackButton from "../modal/BackButton";
import styled from "styled-components";
import { HiMiniMagnifyingGlass } from "react-icons/hi2";

const PlanSearch = ({pathUID, pathDocID, state}) => {
    const { kakao } = window;

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
        <Container>
            <div className='searchHeaderContainer'>
                <BackButton /> 
                <div className='searchHeader'>
                    <HiMiniMagnifyingGlass size="35px" className='searchIcon' />
                    <h4> 여행을 계획할 장소의 키워드를 입력해주세요. </h4>
                </div>
            </div>

            <MapComponent />
                <div className='searchInputBox'>
                    <input type="text" 
                        value={keyword} 
                        placeholder='검색어를 입력하세요.'
                        onChange={(e) => setKeyword(e.target.value)} />
                    <button onClick={handleSearch}> 검색 </button>
                </div>
            <div className='searchPlaceList'>
                {places.map((p, i) => (
                    <PlanSearchList key={i} places={p} 
                        pathUID={pathUID} pathDocID={pathDocID} state={state} /* record */ />
                ))}
            </div>
        </Container>
    )
}; 

const Container = styled.div`
    background-color: white;
    width: 60vw;
    height: 98vh;
    display: flex;
    flex-direction: column;
    border: solid 0.01rem rgba(0, 150, 138, 0.85);
    border-radius: 10px;
    @media screen and (max-width: 700px) {
        width: 90vw;
    }
    .searchHeaderContainer {
        display: flex;
        justify-content: space-between;
        padding: 10px;
        .haveBackBtn {
            color: rgba(0, 150, 138, 0.85);
        }
        .searchHeader {
            display: flex;
            align-items: center;
            .searchIcon {
                margin-right: 5px;
                color: rgba(0, 150, 138, 0.85);
            }
            h4 {
                font-size: 17px;
                color: rgba(0, 150, 138, 0.85);
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
            background-color: rgba(0, 150, 138, 0.3);
            /* background-color: rgba(255, 255, 255); */
            padding-left: 30px;
            padding-right: 50px;
            color: rgba(0, 150, 138, 0.85);
            outline: none;
            &::placeholder {
                color: rgba(0, 150, 138, 0.85);
            }
            &:focus {
                background-color: rgba(0, 150, 138, 0.3);
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

export default PlanSearch;